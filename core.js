(function () {
  'use strict';

  const DATA_VERSION = 3;
  const STORAGE_KEY = 'lc3_data';
  const STUDY_LANGS = [
    { id: 'ru', name: 'Русский', flag: '🇷🇺' },
    { id: 'en', name: 'English', flag: '🇬🇧' },
    { id: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { id: 'fr', name: 'Français', flag: '🇫🇷' },
    { id: 'es', name: 'Español', flag: '🇪🇸' },
    { id: 'it', name: 'Italiano', flag: '🇮🇹' },
    { id: 'pt', name: 'Português', flag: '🇵🇹' },
    { id: 'zh', name: '中文', flag: '🇨🇳' },
    { id: 'ja', name: '日本語', flag: '🇯🇵' },
    { id: 'ko', name: '한국어', flag: '🇰🇷' },
    { id: 'ar', name: 'العربية', flag: '🇸🇦' },
    { id: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { id: 'pl', name: 'Polski', flag: '🇵🇱' },
    { id: 'nl', name: 'Nederlands', flag: '🇳🇱' },
    { id: 'sv', name: 'Svenska', flag: '🇸🇪' }
  ];
  const DEFAULT_SETTINGS = {
    darkMode: true,
    accentColor: 'green',
    siteLang: 'ru',
    caseSensitive: false,
    diacriticsSensitive: true,
    fuzzy: false,
    autoHint: false,
    nativeLang: 'ru',
    targetLang: 'en',
    translationProvider: 'local',
    onboardingCompleted: false,
    myMemoryDate: '',
    myMemoryUsed: 0
  };
  const REVIEW_DAYS = [0, 1, 2, 4, 7, 16];

  function uid(prefix) {
    const id = globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function'
      ? globalThis.crypto.randomUUID()
      : `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
    return `${prefix}_${id}`;
  }

  function safeId(value, prefix) {
    return typeof value === 'string' && /^[A-Za-z0-9_-]{1,90}$/.test(value) ? value : uid(prefix);
  }

  function text(value, maxLength, fallback = '') {
    return typeof value === 'string' ? value.trim().slice(0, maxLength) : fallback;
  }

  function number(value, fallback = 0) {
    return Number.isFinite(value) && value >= 0 ? value : fallback;
  }

  function integer(value, fallback = 0) {
    return Math.floor(number(value, fallback));
  }

  function uniqueStrings(values, maxLength = 1000) {
    if (!Array.isArray(values)) return [];
    const seen = new Set();
    const result = [];
    for (const value of values) {
      const item = text(value, maxLength);
      const key = item.toLocaleLowerCase();
      if (item && !seen.has(key)) {
        seen.add(key);
        result.push(item);
      }
    }
    return result.slice(0, 30);
  }

  function createDefaultStats() {
    return {
      sessions: 0,
      totalCorrect: 0,
      totalAlmost: 0,
      totalWrong: 0,
      totalSkipped: 0,
      byGroup: {},
      sessions_log: []
    };
  }

  function createDefaultData(includeSample = false) {
    return {
      version: DATA_VERSION,
      groups: includeSample ? [createSampleGroup()] : [],
      stats: createDefaultStats(),
      settings: { ...DEFAULT_SETTINGS }
    };
  }

  function createSampleGroup() {
    const now = Date.now();
    const rows = [
      ['cat', 'кошка', '', 'The cat is sleeping.', 'существительное'],
      ['dog', 'собака', '', 'My dog likes to run.', 'существительное'],
      ['apple', 'яблоко', '', 'I eat an apple every day.', 'существительное'],
      ['house', 'дом', 'домик', 'This house is old.', 'существительное'],
      ['beautiful', 'красивый', 'прекрасный', 'What a beautiful day!', 'прилагательное'],
      ['to learn', 'учить', 'изучать', 'I want to learn English.', 'глагол'],
      ['school', 'школа', '', 'Our school is near the park.', 'существительное'],
      ['friend', 'друг', 'приятель', 'She is my best friend.', 'существительное']
    ];
    return {
      id: 'g_sample',
      name: 'Английский: первые слова',
      nativeLang: 'ru',
      targetLang: 'en',
      desc: 'Пример группы с вариантами перевода, примерами и грамматическими заметками',
      words: rows.map((row, index) => ({
        id: `sample_${index + 1}`,
        word: row[0],
        translate: row[1],
        acceptedAnswers: uniqueStrings([row[1], row[2]]),
        alternateWords: [],
        example: row[3],
        grammar: row[4],
        correct: 0,
        almost: 0,
        wrong: 0,
        skipped: 0,
        streak: 0,
        level: 0,
        due: now,
        lastSeen: 0,
        lastResult: ''
      })),
      createdAt: now,
      updatedAt: now
    };
  }

  function normalizeWord(raw) {
    if (!raw || typeof raw !== 'object') throw new Error('Invalid word');
    const word = text(raw.word, 1000);
    const translate = text(raw.translate, 1000);
    if (!word || !translate) throw new Error('Word and translation are required');
    return {
      id: safeId(raw.id, 'w'),
      word,
      translate,
      acceptedAnswers: uniqueStrings([translate, ...(Array.isArray(raw.acceptedAnswers) ? raw.acceptedAnswers : [])]),
      alternateWords: uniqueStrings(raw.alternateWords).filter(item => item.toLocaleLowerCase() !== word.toLocaleLowerCase()),
      example: text(raw.example, 5000),
      grammar: text(raw.grammar, 1000),
      correct: integer(raw.correct),
      almost: integer(raw.almost),
      wrong: integer(raw.wrong),
      skipped: integer(raw.skipped),
      streak: integer(raw.streak),
      level: Math.min(5, integer(raw.level)),
      due: number(raw.due),
      lastSeen: number(raw.lastSeen),
      lastResult: ['correct', 'almost', 'wrong', 'skipped', ''].includes(raw.lastResult) ? raw.lastResult : ''
    };
  }

  function normalizeGroup(raw) {
    if (!raw || typeof raw !== 'object') throw new Error('Invalid group');
    const name = text(raw.name, 200);
    if (!name || !Array.isArray(raw.words) || raw.words.length === 0 || raw.words.length > 5000) {
      throw new Error('Invalid group content');
    }
    const languageIds = new Set(STUDY_LANGS.map(lang => lang.id));
    const nativeLang = languageIds.has(raw.nativeLang) ? raw.nativeLang : 'ru';
    const targetLang = languageIds.has(raw.targetLang) ? raw.targetLang : 'en';
    const wordIds = new Set();
    const words = raw.words.map(item => {
      const word = normalizeWord(item);
      if (wordIds.has(word.id)) word.id = uid('w');
      wordIds.add(word.id);
      return word;
    });
    return {
      id: safeId(raw.id, 'g'),
      name,
      nativeLang,
      targetLang,
      desc: text(raw.desc, 2000),
      words,
      createdAt: number(raw.createdAt, Date.now()),
      updatedAt: number(raw.updatedAt, Date.now())
    };
  }

  function normalizeGroupStats(raw) {
    const source = raw && typeof raw === 'object' ? raw : {};
    return {
      sessions: integer(source.sessions),
      correct: integer(source.correct),
      almost: integer(source.almost),
      wrong: integer(source.wrong),
      skipped: integer(source.skipped)
    };
  }

  function normalizeSession(raw) {
    if (!raw || typeof raw !== 'object') throw new Error('Invalid session');
    return {
      groupId: safeId(raw.groupId, 'g'),
      groupName: text(raw.groupName, 200, 'Группа'),
      mode: text(raw.mode, 40, 'word-to-translate'),
      total: integer(raw.total),
      correct: integer(raw.correct),
      almost: integer(raw.almost),
      wrong: integer(raw.wrong),
      skipped: integer(raw.skipped),
      date: number(raw.date, Date.now())
    };
  }

  function normalizeAppData(raw) {
    if (!raw || typeof raw !== 'object' || !Array.isArray(raw.groups) || raw.groups.length > 500) {
      throw new Error('Invalid backup');
    }
    const groupIds = new Set();
    const groups = raw.groups.map(item => {
      const group = normalizeGroup(item);
      if (groupIds.has(group.id)) group.id = uid('g');
      groupIds.add(group.id);
      return group;
    });
    const sourceStats = raw.stats && typeof raw.stats === 'object' ? raw.stats : {};
    const stats = createDefaultStats();
    stats.sessions = integer(sourceStats.sessions);
    stats.totalCorrect = integer(sourceStats.totalCorrect);
    stats.totalAlmost = integer(sourceStats.totalAlmost);
    stats.totalWrong = integer(sourceStats.totalWrong);
    stats.totalSkipped = integer(sourceStats.totalSkipped);
    if (sourceStats.byGroup && typeof sourceStats.byGroup === 'object' && !Array.isArray(sourceStats.byGroup)) {
      for (const [id, value] of Object.entries(sourceStats.byGroup)) {
        if (/^[A-Za-z0-9_-]{1,90}$/.test(id)) stats.byGroup[id] = normalizeGroupStats(value);
      }
    }
    if (Array.isArray(sourceStats.sessions_log)) {
      stats.sessions_log = sourceStats.sessions_log.slice(0, 50).map(normalizeSession);
    }
    const sourceSettings = raw.settings && typeof raw.settings === 'object' ? raw.settings : {};
    const settings = { ...DEFAULT_SETTINGS };
    for (const key of ['darkMode', 'caseSensitive', 'diacriticsSensitive', 'fuzzy', 'autoHint', 'onboardingCompleted']) {
      if (typeof sourceSettings[key] === 'boolean') settings[key] = sourceSettings[key];
    }
    const languageIds = new Set(STUDY_LANGS.map(lang => lang.id));
    if (languageIds.has(sourceSettings.nativeLang)) settings.nativeLang = sourceSettings.nativeLang;
    if (languageIds.has(sourceSettings.targetLang)) settings.targetLang = sourceSettings.targetLang;
    if (['ru', 'en', 'de', 'fr', 'es'].includes(sourceSettings.siteLang)) settings.siteLang = sourceSettings.siteLang;
    if (['green', 'blue', 'amber', 'coral'].includes(sourceSettings.accentColor)) settings.accentColor = sourceSettings.accentColor;
    if (['local', 'mymemory', 'manual'].includes(sourceSettings.translationProvider)) settings.translationProvider = sourceSettings.translationProvider;
    if (typeof sourceSettings.myMemoryDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(sourceSettings.myMemoryDate)) settings.myMemoryDate = sourceSettings.myMemoryDate;
    settings.myMemoryUsed = Math.min(5000, integer(sourceSettings.myMemoryUsed));
    return { version: DATA_VERSION, groups, stats, settings };
  }

  const MYMEMORY_DAILY_LIMIT = 5000;

  function localDay(timestamp = Date.now()) {
    const date = new Date(timestamp);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
  }

  function getMyMemoryUsage(settings, timestamp = Date.now()) {
    const today = localDay(timestamp);
    const used = settings.myMemoryDate === today ? Math.min(MYMEMORY_DAILY_LIMIT, integer(settings.myMemoryUsed)) : 0;
    return { date: today, used, remaining: MYMEMORY_DAILY_LIMIT - used, limit: MYMEMORY_DAILY_LIMIT };
  }

  function recordMyMemoryUsage(settings, value, quotaFinished = false, timestamp = Date.now()) {
    const usage = getMyMemoryUsage(settings, timestamp);
    settings.myMemoryDate = usage.date;
    settings.myMemoryUsed = quotaFinished ? usage.limit : Math.min(usage.limit, usage.used + [...String(value)].length);
    return getMyMemoryUsage(settings, timestamp);
  }

  function getLang(id) {
    return STUDY_LANGS.find(lang => lang.id === id) || { id, name: '?', flag: '🌐' };
  }

  function parseBulkLine(line) {
    const value = String(line || '').replace(/^\uFEFF/, '').trim();
    if (!value) return null;
    const separators = [' - ', ' : ', '\t', ' — ', '='];
    const separator = separators.find(item => value.includes(item));
    if (separator) {
      const index = value.indexOf(separator);
      const word = value.slice(0, index).trim();
      const translate = value.slice(index + separator.length).trim();
      if (word && translate) return { word, translate, hasTranslate: true };
      if (word) return { word, translate: '', hasTranslate: false };
    }
    return { word: value, translate: '', hasTranslate: false };
  }

  function parseBulk(value) {
    return String(value || '').split(/\r?\n/).map(parseBulkLine).filter(Boolean);
  }

  function normalizeAnswer(value, settings = DEFAULT_SETTINGS) {
    let result = String(value || '').normalize('NFKC').trim().replace(/\s+/g, ' ');
    if (settings.diacriticsSensitive === false) {
      result = result.normalize('NFKD').replace(/\p{M}/gu, '');
    }
    if (!settings.caseSensitive) result = result.toLocaleLowerCase();
    return result;
  }

  function levenshtein(a, b) {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    let previous = Array.from({ length: b.length + 1 }, (_, index) => index);
    for (let i = 1; i <= a.length; i++) {
      const current = [i];
      for (let j = 1; j <= b.length; j++) {
        current[j] = a[i - 1] === b[j - 1]
          ? previous[j - 1]
          : 1 + Math.min(previous[j], current[j - 1], previous[j - 1]);
      }
      previous = current;
    }
    return previous[b.length];
  }

  function evaluateAnswer(userAnswer, acceptedAnswers, settings = DEFAULT_SETTINGS, strict = false) {
    const answer = normalizeAnswer(userAnswer, settings);
    if (!answer) return 'empty';
    const normalized = uniqueStrings(acceptedAnswers, 1000).map(item => normalizeAnswer(item, settings)).filter(Boolean);
    if (normalized.includes(answer)) return 'correct';
    if (!strict && settings.fuzzy && normalized.some(item => levenshtein(answer, item) === 1)) return 'almost';
    return 'wrong';
  }

  function shuffle(values, random = Math.random) {
    const result = [...values];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function buildCards(words, mode = 'word-to-translate', order = 'sequential', now = Date.now()) {
    let source = [...words];
    if (order === 'random') source = shuffle(source);
    if (order === 'due') {
      source = source
        .map((word, index) => ({ word, index }))
        .sort((a, b) => number(a.word.due) - number(b.word.due) || integer(a.word.level) - integer(b.word.level) || a.index - b.index)
        .map(item => item.word);
    }
    return source.map(word => {
      const reverse = mode === 'translate-to-word' || mode === 'dictation';
      return {
        front: reverse ? word.translate : word.word,
        back: reverse ? word.word : word.translate,
        expected: reverse ? word.word : word.translate,
        accepted: reverse ? uniqueStrings([word.word, ...word.alternateWords]) : uniqueStrings(word.acceptedAnswers.length ? word.acceptedAnswers : [word.translate]),
        original: word,
        requeued: false
      };
    });
  }

  function buildTestOptions(cards, currentIndex, random = Math.random) {
    const correct = cards[currentIndex].expected;
    const distractors = [];
    const seen = new Set([correct.toLocaleLowerCase()]);
    for (const card of shuffle(cards, random)) {
      const key = card.expected.toLocaleLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        distractors.push(card.expected);
      }
    }
    return shuffle([correct, ...distractors.slice(0, 3)], random);
  }

  function calculateAccuracy(stats) {
    const source = stats || {};
    const total = integer(source.correct) + integer(source.almost) + integer(source.wrong) + integer(source.skipped);
    return total ? Math.round(integer(source.correct) / total * 100) : 0;
  }

  function getGroupLearning(group, now = Date.now()) {
    return {
      learned: group.words.filter(word => word.level >= 3).length,
      due: group.words.filter(word => number(word.due) <= now).length,
      difficult: group.words.filter(word => word.lastResult === 'wrong' || word.lastResult === 'almost' || word.wrong > word.correct).length
    };
  }

  function updateWordProgress(word, result, now = Date.now()) {
    if (!['correct', 'almost', 'wrong', 'skipped'].includes(result)) return word;
    word[result] = integer(word[result]) + 1;
    word.lastSeen = now;
    word.lastResult = result;
    word.due = now;
    if (result === 'correct') {
      word.streak = integer(word.streak) + 1;
      word.level = Math.min(5, integer(word.level) + 1);
      word.due = now + REVIEW_DAYS[word.level] * 86400000;
    } else if (result === 'almost') {
      word.streak = 0;
      word.level = Math.max(0, integer(word.level) - 1);
    } else if (result === 'wrong') {
      word.streak = 0;
      word.level = 0;
    } else {
      word.streak = 0;
    }
    return word;
  }

  function encodeBase64(value) {
    const bytes = new TextEncoder().encode(value);
    let binary = '';
    for (let index = 0; index < bytes.length; index += 8192) {
      binary += String.fromCharCode(...bytes.subarray(index, index + 8192));
    }
    return btoa(binary);
  }

  function decodeBase64(value) {
    const binary = atob(value);
    const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }

  function serializeGroup(group) {
    const normalized = normalizeGroup(group);
    const content = {
      name: normalized.name,
      nativeLang: normalized.nativeLang,
      targetLang: normalized.targetLang,
      desc: normalized.desc,
      words: normalized.words.map(word => ({
        word: word.word,
        translate: word.translate,
        acceptedAnswers: word.acceptedAnswers,
        alternateWords: word.alternateWords,
        example: word.example,
        grammar: word.grammar
      }))
    };
    return encodeBase64(JSON.stringify({ version: 1, group: content }));
  }

  function deserializeGroup(code) {
    const value = String(code || '').trim();
    if (!value || value.length > 5000000) throw new Error('Invalid share code');
    let parsed;
    try {
      parsed = JSON.parse(decodeBase64(value));
    } catch (modernError) {
      try {
        parsed = JSON.parse(decodeURIComponent(escape(atob(value))));
      } catch (legacyError) {
        throw new Error('Invalid share code');
      }
    }
    return normalizeGroup(parsed && parsed.group ? parsed.group : parsed);
  }

  globalThis.LinguaCore = {
    DATA_VERSION,
    STORAGE_KEY,
    STUDY_LANGS,
    DEFAULT_SETTINGS,
    REVIEW_DAYS,
    uid,
    createDefaultStats,
    createDefaultData,
    createSampleGroup,
    normalizeWord,
    normalizeGroup,
    normalizeAppData,
    MYMEMORY_DAILY_LIMIT,
    localDay,
    getMyMemoryUsage,
    recordMyMemoryUsage,
    getLang,
    parseBulkLine,
    parseBulk,
    normalizeAnswer,
    levenshtein,
    evaluateAnswer,
    shuffle,
    buildCards,
    buildTestOptions,
    calculateAccuracy,
    getGroupLearning,
    updateWordProgress,
    serializeGroup,
    deserializeGroup,
    uniqueStrings
  };
})();
