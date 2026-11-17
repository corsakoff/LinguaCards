(function () {
  'use strict';
  const C = window.LinguaCore;
  const tests = [];
  const test = (name, run) => tests.push({ name, run });
  const assert = (condition, message = 'Условие не выполнено') => { if (!condition) throw new Error(message); };
  const equal = (actual, expected, message = '') => {
    if (!Object.is(actual, expected)) throw new Error(`${message}\nОжидалось: ${expected}\nПолучено: ${actual}`);
  };
  const deepEqual = (actual, expected, message = '') => {
    const a = JSON.stringify(actual), b = JSON.stringify(expected);
    if (a !== b) throw new Error(`${message}\nОжидалось: ${b}\nПолучено: ${a}`);
  };
  const throws = (run, message = 'Ожидалась ошибка') => {
    let threw = false;
    try { run(); } catch (error) { threw = true; }
    assert(threw, message);
  };
  const word = (value, translation, extra = {}) => C.normalizeWord({ word: value, translate: translation, ...extra });

  test('Массовый ввод: слово и перевод через дефис', () => {
    deepEqual(C.parseBulkLine(' apple - яблоко '), { word: 'apple', translate: 'яблоко', hasTranslate: true });
  });
  test('Массовый ввод: двоеточие, табуляция и равно', () => {
    equal(C.parseBulkLine('cat : кошка').translate, 'кошка');
    equal(C.parseBulkLine('dog\tсобака').translate, 'собака');
    equal(C.parseBulkLine('house=дом').translate, 'дом');
  });
  test('Массовый ввод: слово без перевода и пустые строки', () => {
    equal(C.parseBulkLine('apple').hasTranslate, false);
    equal(C.parseBulkLine('   '), null);
    equal(C.parseBulk('one\n\ntwo - два').length, 2);
  });
  test('Расстояние Левенштейна', () => {
    equal(C.levenshtein('cat', 'cut'), 1);
    equal(C.levenshtein('cat', 'cat'), 0);
    equal(C.levenshtein('cat', 'dog'), 3);
  });
  test('Проверка ответа игнорирует регистр по настройке', () => {
    equal(C.evaluateAnswer(' Cat ', ['cat'], { caseSensitive: false, diacriticsSensitive: true }), 'correct');
    equal(C.evaluateAnswer('Cat', ['cat'], { caseSensitive: true, diacriticsSensitive: true }), 'wrong');
  });
  test('Проверка диакритики', () => {
    equal(C.evaluateAnswer('cafe', ['café'], { caseSensitive: false, diacriticsSensitive: true }), 'wrong');
    equal(C.evaluateAnswer('cafe', ['café'], { caseSensitive: false, diacriticsSensitive: false }), 'correct');
  });
  test('Принимаются дополнительные переводы', () => {
    equal(C.evaluateAnswer('пёс', ['собака', 'пёс'], C.DEFAULT_SETTINGS), 'correct');
  });
  test('Одна опечатка возвращает «почти верно», а не «правильно»', () => {
    equal(C.evaluateAnswer('кошке', ['кошка'], { ...C.DEFAULT_SETTINGS, fuzzy: true }), 'almost');
  });
  test('Строгий диктант не принимает опечатку', () => {
    equal(C.evaluateAnswer('кошке', ['кошка'], { ...C.DEFAULT_SETTINGS, fuzzy: true }, true), 'wrong');
  });
  test('Пустой ответ не засчитывается', () => {
    equal(C.evaluateAnswer('   ', ['кошка'], C.DEFAULT_SETTINGS), 'empty');
  });
  test('Прямой режим показывает слово и ждёт перевод', () => {
    const card = C.buildCards([word('cat', 'кошка')], 'word-to-translate')[0];
    equal(card.front, 'cat');
    equal(card.expected, 'кошка');
  });
  test('Диктант показывает перевод и ждёт иностранное слово', () => {
    const card = C.buildCards([word('cat', 'кошка', { alternateWords: ['kitty'] })], 'dictation')[0];
    equal(card.front, 'кошка');
    equal(card.expected, 'cat');
    deepEqual(card.accepted, ['cat', 'kitty']);
  });
  test('Сначала выдаются слова с ранним сроком повторения', () => {
    const cards = C.buildCards([
      word('later', 'позже', { due: 200, level: 3 }),
      word('first', 'первый', { due: 100, level: 1 })
    ], 'word-to-translate', 'due');
    equal(cards[0].front, 'first');
  });
  test('Тест содержит правильный ответ и не более четырёх уникальных вариантов', () => {
    const cards = C.buildCards([word('a', 'а'), word('b', 'б'), word('c', 'в'), word('d', 'г'), word('e', 'д')]);
    const options = C.buildTestOptions(cards, 0, () => 0.42);
    assert(options.includes('а'));
    equal(options.length, 4);
    equal(new Set(options).size, options.length);
  });
  test('Маленькая группа не создаёт пустые или повторные варианты', () => {
    const cards = C.buildCards([word('a', 'один'), word('b', 'один')]);
    const options = C.buildTestOptions(cards, 0, () => 0.1);
    deepEqual(options, ['один']);
  });
  test('Апострофы и кавычки сохраняются как обычный текст', () => {
    const cards = C.buildCards([word("don't", "не"), word('say "yes"', 'да')]);
    const options = C.buildTestOptions(cards, 0, () => 0.2);
    assert(options.includes('не'));
    equal(cards[0].original.word, "don't");
  });
  test('До поворота видна только лицевая сторона', () => {
    const card = document.createElement('div');
    card.className = 'flashcard';
    const front = document.createElement('div');
    const back = document.createElement('div');
    front.className = 'card-face card-front';
    back.className = 'card-face card-back';
    front.style.transition = 'none';
    back.style.transition = 'none';
    card.append(front, back);
    document.body.appendChild(card);
    equal(getComputedStyle(front).visibility, 'visible');
    equal(getComputedStyle(back).visibility, 'hidden');
    card.remove();
  });
  test('После поворота видна только обратная сторона', () => {
    const card = document.createElement('div');
    card.className = 'flashcard flipped';
    const front = document.createElement('div');
    const back = document.createElement('div');
    front.className = 'card-face card-front';
    back.className = 'card-face card-back';
    front.style.transition = 'none';
    back.style.transition = 'none';
    card.append(front, back);
    document.body.appendChild(card);
    equal(getComputedStyle(front).visibility, 'hidden');
    equal(getComputedStyle(back).visibility, 'visible');
    card.remove();
  });
  test('Точность везде учитывает ошибки, «почти» и пропуски', () => {
    equal(C.calculateAccuracy({ correct: 1, almost: 1, wrong: 1, skipped: 1 }), 25);
    equal(C.calculateAccuracy({ correct: 0, almost: 0, wrong: 0, skipped: 0 }), 0);
  });
  test('Правильный ответ повышает уровень и назначает повторение', () => {
    const item = word('cat', 'кошка');
    C.updateWordProgress(item, 'correct', 1000);
    equal(item.level, 1);
    equal(item.streak, 1);
    equal(item.due, 1000 + 86400000);
  });
  test('Ошибка сбрасывает уровень и делает слово срочным', () => {
    const item = word('cat', 'кошка', { level: 4, streak: 4, due: 999999 });
    C.updateWordProgress(item, 'wrong', 1000);
    equal(item.level, 0);
    equal(item.streak, 0);
    equal(item.due, 1000);
    equal(item.lastResult, 'wrong');
  });
  test('«Почти верно» не повышает уровень', () => {
    const item = word('cat', 'кошка', { level: 2 });
    C.updateWordProgress(item, 'almost', 1000);
    equal(item.level, 1);
    equal(item.lastResult, 'almost');
  });
  test('Пример группы проходит валидацию', () => {
    const sample = C.createSampleGroup();
    const normalized = C.normalizeGroup(sample);
    equal(normalized.words.length, 8);
    assert(normalized.words.some(item => item.acceptedAnswers.length > 1));
  });
  test('Старый формат данных мигрирует без потери групп', () => {
    const old = {
      groups: [{ id: 'g_1', name: 'Old', nativeLang: 'ru', targetLang: 'en', words: [{ word: 'cat', translate: 'кошка' }] }],
      stats: { sessions: 2, totalCorrect: 3, totalWrong: 1, byGroup: {}, sessions_log: [] },
      settings: { siteLang: 'ru', fuzzy: true }
    };
    const migrated = C.normalizeAppData(old);
    equal(migrated.version, C.DATA_VERSION);
    equal(migrated.groups[0].words[0].acceptedAnswers[0], 'кошка');
    equal(migrated.stats.totalAlmost, 0);
    equal(migrated.settings.fuzzy, true);
  });
  test('Локальный перевод использует прямую проверенную модель', () => {
    const route = window.LinguaTranslationModels.getRoute('en', 'ru');
    deepEqual(route, ['en-ru']);
    equal(window.LinguaTranslationModels.getModel(route[0]).id, 'Xenova/opus-mt-en-ru');
  });
  test('Непрямой маршрут проходит через английский', () => {
    deepEqual(window.LinguaTranslationModels.getRoute('de', 'ru'), ['de-en', 'en-ru']);
    equal(window.LinguaTranslationModels.getRouteSize(['de-en', 'en-ru']), 217);
  });
  test('Непроверенная языковая пара не создаёт фиктивную модель', () => {
    deepEqual(window.LinguaTranslationModels.getRoute('en', 'pt'), []);
    deepEqual(window.LinguaTranslationModels.getRoute('pt', 'ru'), []);
  });
  test('MyMemory считает локальную оценку остатка', () => {
    const settings = { myMemoryDate: '', myMemoryUsed: 0 };
    const now = new Date(2026, 0, 15, 12).getTime();
    C.recordMyMemoryUsage(settings, 'кот', false, now);
    const usage = C.getMyMemoryUsage(settings, now);
    equal(usage.used, 3);
    equal(usage.remaining, 4997);
  });
  test('Оценка MyMemory сбрасывается на следующий день', () => {
    const day = new Date(2026, 0, 15, 12).getTime();
    const settings = { myMemoryDate: C.localDay(day), myMemoryUsed: 4500 };
    equal(C.getMyMemoryUsage(settings, day).remaining, 500);
    equal(C.getMyMemoryUsage(settings, new Date(2026, 0, 16, 12).getTime()).remaining, 5000);
  });
  test('Серверное исчерпание MyMemory обнуляет оценку остатка', () => {
    const settings = { myMemoryDate: '', myMemoryUsed: 0 };
    const usage = C.recordMyMemoryUsage(settings, 'cat', true);
    equal(usage.used, 5000);
    equal(usage.remaining, 0);
  });
  test('Настройки перевода проходят валидацию и миграцию', () => {
    const data = C.normalizeAppData({ groups: [], settings: { translationProvider: 'mymemory', onboardingCompleted: true, myMemoryUsed: 120 } });
    equal(data.settings.translationProvider, 'mymemory');
    equal(data.settings.onboardingCompleted, true);
    equal(data.settings.myMemoryUsed, 120);
    const invalid = C.normalizeAppData({ groups: [], settings: { translationProvider: 'unknown' } });
    equal(invalid.settings.translationProvider, 'local');
  });
  test('Восстановление отклоняет файл без массива групп', () => {
    throws(() => C.normalizeAppData({ settings: {} }));
  });
  test('Импорт отклоняет слово без перевода', () => {
    throws(() => C.normalizeGroup({ name: 'Bad', words: [{ word: 'cat', translate: '' }] }));
  });
  test('Код группы сохраняет Unicode, варианты и пример', () => {
    const group = C.normalizeGroup({
      name: 'Французский',
      nativeLang: 'ru',
      targetLang: 'fr',
      words: [{ word: "l'école", translate: 'школа', acceptedAnswers: ['школа', 'училище'], example: "C'est l'école." }]
    });
    const restored = C.deserializeGroup(C.serializeGroup(group));
    equal(restored.name, 'Французский');
    equal(restored.words[0].word, "l'école");
    deepEqual(restored.words[0].acceptedAnswers, ['школа', 'училище']);
    equal(restored.words[0].example, "C'est l'école.");
  });
  test('Старый base64-код группы читается', () => {
    const legacy = btoa(unescape(encodeURIComponent(JSON.stringify({ name: 'Old', words: [{ word: 'cat', translate: 'кошка' }] }))));
    equal(C.deserializeGroup(legacy).name, 'Old');
  });
  test('HTML в имени остаётся данными, а не кодом', () => {
    const group = C.deserializeGroup(C.serializeGroup({ name: '<img src=x onerror=alert(1)>', words: [{ word: 'cat', translate: 'кошка' }] }));
    equal(group.name, '<img src=x onerror=alert(1)>');
  });
  test('Прогресс группы считает выученные, срочные и сложные слова', () => {
    const group = C.normalizeGroup({ name: 'Test', words: [
      { word: 'a', translate: 'а', level: 3, due: 9999 },
      { word: 'b', translate: 'б', level: 0, due: 1, lastResult: 'wrong' }
    ] });
    deepEqual(C.getGroupLearning(group, 100), { learned: 1, due: 1, difficult: 1 });
  });

  let passed = 0;
  for (const item of tests) {
    const row = document.createElement('li');
    try {
      item.run();
      passed++;
      row.className = 'pass';
      row.textContent = `✓ ${item.name}`;
    } catch (error) {
      row.className = 'fail';
      row.textContent = `✗ ${item.name}`;
      const details = document.createElement('pre');
      details.textContent = error.stack || error.message;
      row.appendChild(details);
    }
    document.getElementById('testResults').appendChild(row);
  }
  const summary = document.getElementById('testSummary');
  const failed = tests.length - passed;
  summary.textContent = failed ? `Провалено: ${failed}. Успешно: ${passed} из ${tests.length}.` : `Все тесты пройдены: ${passed} из ${tests.length}.`;
  summary.className = failed ? 'failed' : 'passed';
  document.body.dataset.status = failed ? 'failed' : 'passed';
})();
