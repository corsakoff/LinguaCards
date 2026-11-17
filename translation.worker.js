import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.2';

env.allowLocalModels = false;
env.useBrowserCache = true;

let translator = null;
let activeModel = null;
let activeDevice = null;
let queue = Promise.resolve();

async function disposeTranslator() {
  if (translator) {
    try { await translator.dispose(); } catch (error) {}
  }
  translator = null;
  activeModel = null;
  activeDevice = null;
}

async function loadModel(modelId, requestId) {
  if (translator && activeModel === modelId) return activeDevice;
  await disposeTranslator();
  const progress_callback = progress => self.postMessage({ type: 'progress', requestId, modelId, progress });
  const devices = navigator.gpu ? ['webgpu', 'wasm'] : ['wasm'];
  let lastError;
  for (const device of devices) {
    try {
      self.postMessage({ type: 'status', requestId, modelId, status: 'initializing', device });
      translator = await pipeline('translation', modelId, { device, dtype: 'q8', progress_callback });
      activeModel = modelId;
      activeDevice = device;
      self.postMessage({ type: 'status', requestId, modelId, status: 'ready', device });
      return device;
    } catch (error) {
      lastError = error;
      await disposeTranslator();
    }
  }
  throw lastError || new Error('Не удалось загрузить модель');
}

async function handle(message) {
  const { type, requestId } = message;
  if (type === 'dispose') {
    await disposeTranslator();
    self.postMessage({ type: 'disposed', requestId });
    return;
  }
  if (type === 'load') {
    const device = await loadModel(message.modelId, requestId);
    self.postMessage({ type: 'loaded', requestId, modelId: message.modelId, device });
    return;
  }
  if (type === 'translate') {
    await loadModel(message.modelId, requestId);
    self.postMessage({ type: 'status', requestId, modelId: message.modelId, status: 'translating', device: activeDevice });
    const output = await translator(message.text, { max_new_tokens: 128 });
    const translatedText = output?.[0]?.translation_text;
    if (typeof translatedText !== 'string' || !translatedText.trim()) throw new Error('Модель вернула пустой перевод');
    self.postMessage({ type: 'translated', requestId, text: translatedText.trim(), device: activeDevice });
  }
}

self.onmessage = event => {
  const message = event.data;
  queue = queue.then(() => handle(message)).catch(error => {
    self.postMessage({ type: 'error', requestId: message.requestId, message: error.message || String(error) });
  });
};
