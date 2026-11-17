(function () {
  'use strict';

  const sizes = {
    'ru-en': 111, 'de-en': 106, 'fr-en': 107, 'es-en': 113, 'it-en': 129,
    'zh-en': 113, 'ja-en': 109, 'ko-en': 113, 'ar-en': 111, 'tr-en': 110,
    'pl-en': 111, 'nl-en': 115, 'sv-en': 104, 'en-ru': 111, 'en-de': 106,
    'en-fr': 107, 'en-es': 113, 'en-it': 129, 'en-zh': 113, 'en-ar': 111,
    'en-nl': 115, 'en-sv': 104
  };
  const models = Object.fromEntries(Object.entries(sizes).map(([pair, sizeMB]) => [pair, {
    id: `Xenova/opus-mt-${pair}`,
    sizeMB
  }]));
  const myMemoryLanguages = { pt: 'pt-PT', zh: 'zh-CN' };

  function getRoute(sourceLang, targetLang) {
    if (!sourceLang || !targetLang || sourceLang === targetLang) return [];
    const direct = `${sourceLang}-${targetLang}`;
    if (models[direct]) return [direct];
    if (sourceLang !== 'en' && targetLang !== 'en') {
      const incoming = `${sourceLang}-en`;
      const outgoing = `en-${targetLang}`;
      if (models[incoming] && models[outgoing]) return [incoming, outgoing];
    }
    return [];
  }

  function getModel(pair) {
    return models[pair] || null;
  }

  function getRouteSize(route) {
    return route.reduce((total, pair) => total + (models[pair]?.sizeMB || 0), 0);
  }

  function getMyMemoryLanguage(lang) {
    return myMemoryLanguages[lang] || lang;
  }

  globalThis.LinguaTranslationModels = { models, getRoute, getModel, getRouteSize, getMyMemoryLanguage };
})();
