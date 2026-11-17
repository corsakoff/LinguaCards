(function () {
  'use strict';

  const registry = globalThis.LinguaTranslationModels;
  let worker = null;
  let requestCounter = 0;
  let localState = { status: 'idle', modelId: null, device: null };
  const pending = new Map();

  function abortError() {
    return new DOMException('Операция отменена', 'AbortError');
  }

  function rejectPending(error) {
    for (const item of pending.values()) item.reject(error);
    pending.clear();
  }

  function ensureWorker() {
    if (worker) return worker;
    worker = new Worker('translation.worker.js?v=4.3.2', { type: 'module' });
    worker.onmessage = event => {
      const message = event.data;
      const item = pending.get(message.requestId);
      if (message.type === 'progress' || message.type === 'status') {
        localState = { ...localState, status: message.status || 'downloading', modelId: message.modelId, device: message.device || localState.device };
        if (item?.onProgress) item.onProgress(message);
        return;
      }
      if (message.type === 'loaded') {
        localState = { status: 'ready', modelId: message.modelId, device: message.device };
        pending.delete(message.requestId);
        item?.resolve(message);
      } else if (message.type === 'translated') {
        pending.delete(message.requestId);
        item?.resolve(message);
      } else if (message.type === 'disposed') {
        pending.delete(message.requestId);
        localState = { status: 'idle', modelId: null, device: null };
        item?.resolve(message);
      } else if (message.type === 'error') {
        pending.delete(message.requestId);
        localState = { ...localState, status: 'error' };
        item?.reject(new Error(message.message));
      }
    };
    worker.onerror = event => {
      localState = { ...localState, status: 'error' };
      rejectPending(new Error(event.message || 'Не удалось запустить локальный переводчик'));
      worker?.terminate();
      worker = null;
    };
    return worker;
  }

  function request(type, payload = {}, onProgress) {
    const requestId = ++requestCounter;
    return new Promise((resolve, reject) => {
      pending.set(requestId, { resolve, reject, onProgress });
      try {
        ensureWorker().postMessage({ type, requestId, ...payload });
      } catch (error) {
        pending.delete(requestId);
        reject(error);
      }
    });
  }

  function requireRoute(sourceLang, targetLang) {
    const route = registry.getRoute(sourceLang, targetLang);
    if (!route.length) {
      const error = new Error('Для этой языковой пары нет проверенной локальной модели');
      error.code = 'UNSUPPORTED_LOCAL_PAIR';
      throw error;
    }
    return route;
  }

  async function preloadLocal(sourceLang, targetLang, onProgress) {
    const route = requireRoute(sourceLang, targetLang);
    const devices = [];
    for (let index = 0; index < route.length; index++) {
      const pair = route[index];
      const model = registry.getModel(pair);
      const result = await request('load', { modelId: model.id }, progress => {
        if (onProgress) onProgress({ ...progress, pair, modelIndex: index, modelCount: route.length });
      });
      devices.push(result.device);
    }
    return { route, devices };
  }

  async function translateLocalBatch(texts, sourceLang, targetLang, callbacks = {}) {
    const route = requireRoute(sourceLang, targetLang);
    let values = texts.map(text => String(text).trim());
    for (let modelIndex = 0; modelIndex < route.length; modelIndex++) {
      const pair = route[modelIndex];
      const model = registry.getModel(pair);
      await request('load', { modelId: model.id }, progress => {
        if (callbacks.onModelProgress) callbacks.onModelProgress({ ...progress, pair, modelIndex, modelCount: route.length });
      });
      const translated = [];
      for (let index = 0; index < values.length; index++) {
        const result = await request('translate', { modelId: model.id, text: values[index] });
        translated.push(result.text);
        if (modelIndex === route.length - 1 && callbacks.onItem) callbacks.onItem(index, result.text);
        if (callbacks.onProgress) callbacks.onProgress({ pair, modelIndex, modelCount: route.length, index, total: values.length, done: index + 1 });
      }
      values = translated;
    }
    return values;
  }

  function cancelLocal() {
    if (worker) worker.terminate();
    worker = null;
    localState = { status: 'idle', modelId: null, device: null };
    rejectPending(abortError());
  }

  async function clearLocalModels() {
    cancelLocal();
    if ('caches' in globalThis) await caches.delete('transformers-cache');
  }

  async function translateMyMemory(text, sourceLang, targetLang, options = {}) {
    const value = String(text).trim();
    if (!value) throw new Error('Пустой текст');
    if (new TextEncoder().encode(value).length > 500) {
      const error = new Error('MyMemory принимает не более 500 байт текста за один запрос');
      error.code = 'MYMEMORY_TOO_LONG';
      throw error;
    }
    const params = new URLSearchParams({
      q: value,
      langpair: `${registry.getMyMemoryLanguage(sourceLang)}|${registry.getMyMemoryLanguage(targetLang)}`,
      mt: '1'
    });
    const controller = new AbortController();
    const abort = () => controller.abort();
    if (options.signal) options.signal.addEventListener('abort', abort, { once: true });
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(`https://api.mymemory.translated.net/get?${params}`, { signal: controller.signal });
      if (!response.ok) throw new Error(`MyMemory: HTTP ${response.status}`);
      const data = await response.json();
      if (data.quotaFinished || Number(data.responseStatus) === 429) {
        const error = new Error('Дневной лимит MyMemory исчерпан');
        error.code = 'MYMEMORY_LIMIT';
        throw error;
      }
      if (Number(data.responseStatus) !== 200 || typeof data.responseData?.translatedText !== 'string' || !data.responseData.translatedText.trim()) {
        throw new Error(data.responseDetails || 'MyMemory не вернул перевод');
      }
      const textarea = document.createElement('textarea');
      textarea.innerHTML = data.responseData.translatedText;
      return { text: textarea.value.trim(), quotaFinished: Boolean(data.quotaFinished) };
    } finally {
      clearTimeout(timeout);
      if (options.signal) options.signal.removeEventListener('abort', abort);
    }
  }

  globalThis.LinguaTranslator = {
    preloadLocal,
    translateLocalBatch,
    translateMyMemory,
    cancelLocal,
    clearLocalModels,
    getLocalState: () => ({ ...localState })
  };
})();
