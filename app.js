(function () {
  'use strict';

  const C = globalThis.LinguaCore;
  const $ = id => document.getElementById(id);
  const SITE_LANGS = ['ru', 'en', 'de', 'fr', 'es'];
  const SITE_LANG_NAMES = { ru: 'Русский', en: 'English', de: 'Deutsch', fr: 'Français', es: 'Español' };
  const TM = globalThis.LinguaTranslationModels;
  const translator = globalThis.LinguaTranslator;
  const T = {
    navGroups: ['📚 Группы', '📚 Groups', '📚 Gruppen', '📚 Groupes', '📚 Grupos'],
    navStats: ['📊 Статистика', '📊 Statistics', '📊 Statistik', '📊 Statistiques', '📊 Estadísticas'],
    groupsTitle: ['Мои группы', 'My Groups', 'Meine Gruppen', 'Mes groupes', 'Mis grupos'],
    groupsSubtitle: ['Управляйте наборами слов', 'Manage your word sets', 'Wortgruppen verwalten', 'Gérez vos ensembles de mots', 'Gestiona tus conjuntos de palabras'],
    import: ['Импорт', 'Import', 'Importieren', 'Importer', 'Importar'],
    create: ['Создать', 'Create', 'Erstellen', 'Créer', 'Crear'],
    statsTitle: ['📊 Статистика', '📊 Statistics', '📊 Statistik', '📊 Statistiques', '📊 Estadísticas'],
    statsSubtitle: ['Ваш прогресс в изучении слов', 'Your word learning progress', 'Dein Lernfortschritt', 'Votre progression', 'Tu progreso'],
    sessions: ['Сессий', 'Sessions', 'Sitzungen', 'Sessions', 'Sesiones'],
    correct: ['Правильных', 'Correct', 'Richtig', 'Correct', 'Correctas'],
    almost: ['Почти верно', 'Almost', 'Fast richtig', 'Presque', 'Casi'],
    accuracy: ['Точность', 'Accuracy', 'Genauigkeit', 'Précision', 'Precisión'],
    due: ['К повторению', 'Due for review', 'Zu wiederholen', 'À réviser', 'Para repasar'],
    byGroup: ['По группам', 'By group', 'Nach Gruppe', 'Par groupe', 'Por grupo'],
    recent: ['Последние сессии', 'Recent sessions', 'Letzte Sitzungen', 'Sessions récentes', 'Sesiones recientes'],
    back: ['Назад', 'Back', 'Zurück', 'Retour', 'Atrás'],
    hint: ['Подсказка', 'Hint', 'Hinweis', 'Indice', 'Pista'],
    skip: ['Пропустить', 'Skip', 'Überspringen', 'Passer', 'Saltar'],
    dunno: ['Не знаю', "Don't know", 'Weiß nicht', 'Je ne sais pas', 'No sé'],
    know: ['Знаю!', 'I know!', 'Weiß ich!', 'Je sais !', '¡Sé!'],
    flip: ['Нажмите, чтобы перевернуть', 'Tap to flip', 'Zum Umdrehen tippen', 'Appuyez pour retourner', 'Toca para voltear'],
    mistakes: ['Ошибки', 'Mistakes', 'Fehler', 'Erreurs', 'Errores'],
    skipped: ['Пропущено', 'Skipped', 'Übersprungen', 'Passé', 'Omitido'],
    repeatMistakes: ['Повторить ошибки', 'Review mistakes', 'Fehler wiederholen', 'Revoir les erreurs', 'Repasar errores'],
    again: ['Ещё раз', 'Again', 'Nochmal', 'Rejouer', 'Otra vez'],
    studyMode: ['Режим изучения', 'Study mode', 'Lernmodus', 'Mode d’apprentissage', 'Modo de estudio'],
    wordTranslate: ['Слово → Перевод', 'Word → Translation', 'Wort → Übersetzung', 'Mot → Traduction', 'Palabra → Traducción'],
    wordTranslateDesc: ['Видите слово — пишете перевод', 'See the word and type the translation', 'Wort sehen — Übersetzung schreiben', 'Voyez le mot — écrivez la traduction', 'Ves la palabra y escribes la traducción'],
    translateWord: ['Перевод → Слово', 'Translation → Word', 'Übersetzung → Wort', 'Traduction → Mot', 'Traducción → Palabra'],
    translateWordDesc: ['Видите перевод — пишете слово', 'See the translation and type the word', 'Übersetzung sehen — Wort schreiben', 'Voyez la traduction — écrivez le mot', 'Ves la traducción y escribes la palabra'],
    dictation: ['Диктант', 'Dictation', 'Diktat', 'Dictée', 'Dictado'],
    dictationDesc: ['Точное написание без поблажек', 'Exact spelling, no typo allowance', 'Exakte Schreibweise ohne Tippfehler', 'Orthographe exacte, sans tolérance', 'Ortografía exacta, sin tolerancia'],
    flashcards: ['Флеш-карточки', 'Flashcards', 'Karteikarten', 'Flashcards', 'Tarjetas'],
    flashcardsDesc: ['Листайте и оценивайте себя', 'Flip through and rate yourself', 'Blättern und bewerten', 'Parcourez et évaluez-vous', 'Pasa y valórate'],
    test: ['Тест', 'Test', 'Test', 'Test', 'Test'],
    testDesc: ['Выбор правильного варианта (до 4)', 'Choose the correct answer (up to 4)', 'Richtige Antwort wählen (bis zu 4)', 'Choisissez la bonne réponse (jusqu’à 4)', 'Elige la respuesta correcta (hasta 4)'],
    order: ['Порядок карточек', 'Card order', 'Kartenreihenfolge', 'Ordre des cartes', 'Orden de tarjetas'],
    sequential: ['📋 По порядку', '📋 Sequential', '📋 Nacheinander', '📋 Dans l’ordre', '📋 En orden'],
    random: ['🔀 Случайно', '🔀 Random', '🔀 Zufällig', '🔀 Aléatoire', '🔀 Aleatorio'],
    dueFirst: ['📅 Сначала к повторению', '📅 Due first', '📅 Wiederholung zuerst', '📅 Révision d’abord', '📅 Repaso primero'],
    dueOnly: ['Только слова, которые пора повторить', 'Only words due for review', 'Nur fällige Wörter', 'Uniquement les mots à réviser', 'Solo palabras para repasar'],
    cancel: ['Отмена', 'Cancel', 'Abbrechen', 'Annuler', 'Cancelar'],
    start: ['▶ Начать', '▶ Start', '▶ Starten', '▶ Commencer', '▶ Empezar'],
    groupName: ['Название группы', 'Group name', 'Gruppenname', 'Nom du groupe', 'Nombre del grupo'],
    native: ['Родной язык', 'Native language', 'Muttersprache', 'Langue maternelle', 'Idioma nativo'],
    target: ['Изучаемый язык', 'Learning language', 'Lernsprache', 'Langue apprise', 'Idioma aprendido'],
    description: ['Описание (необязательно)', 'Description (optional)', 'Beschreibung (optional)', 'Description (facultatif)', 'Descripción (opcional)'],
    wordsTranslations: ['Слова и переводы', 'Words and translations', 'Wörter und Übersetzungen', 'Mots et traductions', 'Palabras y traducciones'],
    oneByOne: ['По одному', 'One by one', 'Einzeln', 'Un par un', 'Una por una'],
    bulk: ['Списком', 'Bulk', 'Als Liste', 'En liste', 'En lista'],
    addWord: ['Добавить слово', 'Add word', 'Wort hinzufügen', 'Ajouter un mot', 'Añadir palabra'],
    translateAll: ['Перевести всё', 'Translate all', 'Alle übersetzen', 'Tout traduire', 'Traducir todo'],
    save: ['💾 Сохранить', '💾 Save', '💾 Speichern', '💾 Enregistrer', '💾 Guardar'],
    share: ['Поделиться', 'Share', 'Teilen', 'Partager', 'Compartir'],
    shareTitle: ['Поделиться группой', 'Share group', 'Gruppe teilen', 'Partager le groupe', 'Compartir grupo'],
    shareDesc: ['Скопируйте код и отправьте другому пользователю', 'Copy the code and send it to another user', 'Code kopieren und senden', 'Copiez le code et envoyez-le', 'Copia el código y envíalo'],
    close: ['Закрыть', 'Close', 'Schließen', 'Fermer', 'Cerrar'],
    copy: ['📋 Копировать', '📋 Copy', '📋 Kopieren', '📋 Copier', '📋 Copiar'],
    importTitle: ['Импорт группы', 'Import group', 'Gruppe importieren', 'Importer un groupe', 'Importar grupo'],
    importDesc: ['Вставьте код группы, полученный от другого пользователя', 'Paste a group code from another user', 'Gruppencode einfügen', 'Collez le code reçu', 'Pega el código recibido'],
    importCode: ['Код группы', 'Group code', 'Gruppencode', 'Code du groupe', 'Código del grupo'],
    importAction: ['Импортировать', 'Import', 'Importieren', 'Importer', 'Importar'],
    settings: ['⚙️ Настройки', '⚙️ Settings', '⚙️ Einstellungen', '⚙️ Paramètres', '⚙️ Ajustes'],
    appearance: ['Внешний вид', 'Appearance', 'Erscheinungsbild', 'Apparence', 'Apariencia'],
    dark: ['Тёмная тема', 'Dark theme', 'Dunkles Theme', 'Thème sombre', 'Tema oscuro'],
    darkDesc: ['Переключение между тёмной и светлой темой', 'Switch between dark and light themes', 'Zwischen dunkel und hell wechseln', 'Changer de thème', 'Cambiar de tema'],
    siteLanguage: ['Язык интерфейса', 'Interface language', 'Oberflächensprache', 'Langue de l’interface', 'Idioma de interfaz'],
    defaultLanguages: ['Языки по умолчанию', 'Default languages', 'Standardsprachen', 'Langues par défaut', 'Idiomas predeterminados'],
    defaultLanguagesDesc: ['Используются при создании новых групп', 'Used when creating new groups', 'Für neue Gruppen verwendet', 'Pour les nouveaux groupes', 'Para nuevos grupos'],
    learning: ['Обучение', 'Study', 'Lernen', 'Apprentissage', 'Estudio'],
    case: ['Учитывать регистр', 'Case sensitive', 'Groß-/Kleinschreibung', 'Sensible à la casse', 'Distinguir mayúsculas'],
    caseDesc: ['Различать заглавные и строчные буквы', 'Distinguish uppercase and lowercase', 'Groß- und Kleinbuchstaben unterscheiden', 'Distinguer majuscules et minuscules', 'Distinguir mayúsculas y minúsculas'],
    diacritics: ['Учитывать диакритику', 'Diacritics sensitive', 'Diakritik beachten', 'Sensible aux diacritiques', 'Distinguir diacríticos'],
    diacriticsDesc: ['Различать é и e, ñ и n, ü и u', 'Distinguish é/e, ñ/n and ü/u', 'é/e, ñ/n und ü/u unterscheiden', 'Distinguer é/e, ñ/n et ü/u', 'Distinguir é/e, ñ/n y ü/u'],
    fuzzy: ['Показывать «почти верно»', 'Show “almost correct”', '„Fast richtig“ anzeigen', 'Afficher « presque correct »', 'Mostrar «casi correcto»'],
    fuzzyDesc: ['Отмечать одну опечатку отдельно, не засчитывая полностью правильный ответ', 'Mark one typo separately instead of counting a fully correct answer', 'Einen Tippfehler separat markieren', 'Signaler une faute sans compter une réponse correcte', 'Marcar una errata por separado'],
    autoHint: ['Показывать подсказку сразу', 'Show hint immediately', 'Hinweis sofort anzeigen', 'Afficher l’indice immédiatement', 'Mostrar pista inmediatamente'],
    autoHintDesc: ['Автоматически показывать первые буквы слова', 'Automatically reveal the first letters', 'Erste Buchstaben automatisch zeigen', 'Révéler automatiquement les premières lettres', 'Revelar las primeras letras'],
    data: ['Данные', 'Data', 'Daten', 'Données', 'Datos'],
    backup: ['Резервная копия', 'Backup', 'Sicherung', 'Sauvegarde', 'Copia de seguridad'],
    backupDesc: ['Скачать все данные в JSON', 'Download all data as JSON', 'Alle Daten als JSON laden', 'Télécharger les données en JSON', 'Descargar datos en JSON'],
    download: ['💾 Скачать', '💾 Download', '💾 Herunterladen', '💾 Télécharger', '💾 Descargar'],
    restore: ['Восстановить данные', 'Restore data', 'Daten wiederherstellen', 'Restaurer les données', 'Restaurar datos'],
    restoreDesc: ['После проверки файла текущие данные будут заменены', 'After validation, current data will be replaced', 'Nach Prüfung werden aktuelle Daten ersetzt', 'Après validation, les données seront remplacées', 'Tras validar, se sustituirán los datos'],
    upload: ['📤 Загрузить', '📤 Upload', '📤 Hochladen', '📤 Charger', '📤 Subir'],
    deleteAll: ['Удалить все данные', 'Delete all data', 'Alle Daten löschen', 'Supprimer toutes les données', 'Eliminar todos los datos'],
    deleteAllDesc: ['Безвозвратно удалит группы, статистику и настройки', 'Permanently deletes groups, statistics and settings', 'Löscht Gruppen, Statistik und Einstellungen', 'Supprime groupes, statistiques et paramètres', 'Elimina grupos, estadísticas y ajustes'],
    delete: ['🗑 Удалить', '🗑 Delete', '🗑 Löschen', '🗑 Supprimer', '🗑 Eliminar'],
    privacy: ['Локальный перевод не отправляет текст на сервер. MyMemory отправляет текст только при явном использовании этого режима. Группы и статистика хранятся в вашем браузере.', 'Local translation does not send text to a server. MyMemory sends text only when you explicitly use it. Groups and statistics stay in your browser.', 'Lokale Übersetzung sendet keinen Text. MyMemory sendet Text nur nach ausdrücklicher Auswahl. Gruppen und Statistik bleiben im Browser.', 'La traduction locale n’envoie pas de texte. MyMemory envoie du texte uniquement si vous le choisissez. Groupes et statistiques restent dans le navigateur.', 'La traducción local no envía texto. MyMemory solo envía texto si lo eliges explícitamente. Grupos y estadísticas permanecen en tu navegador.'],
    footer: ['LinguaCards v3.0 · Данные хранятся в вашем браузере', 'LinguaCards v3.0 · Data stored in your browser', 'LinguaCards v3.0 · Daten im Browser gespeichert', 'LinguaCards v3.0 · Données stockées dans votre navigateur', 'LinguaCards v3.0 · Datos guardados en tu navegador'],
    confirm: ['Подтверждение', 'Confirmation', 'Bestätigung', 'Confirmation', 'Confirmación'],
    confirmAction: ['Подтвердить', 'Confirm', 'Bestätigen', 'Confirmer', 'Confirmar'],
    study: ['▶ Учить', '▶ Study', '▶ Lernen', '▶ Apprendre', '▶ Estudiar'],
    edit: ['✏ Ред.', '✏ Edit', '✏ Bearb.', '✏ Modifier', '✏ Editar'],
    words: ['слов', 'words', 'Wörter', 'mots', 'palabras'],
    learned: ['выучено', 'learned', 'gelernt', 'appris', 'aprendidas'],
    difficult: ['сложных', 'difficult', 'schwierig', 'difficiles', 'difíciles'],
    noGroups: ['Групп пока нет', 'No groups yet', 'Noch keine Gruppen', 'Pas encore de groupes', 'Sin grupos'],
    noGroupsDesc: ['Создайте первую группу или добавьте пример', 'Create your first group or add the sample', 'Erste Gruppe erstellen oder Beispiel hinzufügen', 'Créez un groupe ou ajoutez l’exemple', 'Crea un grupo o añade el ejemplo'],
    addSample: ['Добавить пример', 'Add sample', 'Beispiel hinzufügen', 'Ajouter l’exemple', 'Añadir ejemplo'],
    noStats: ['Нет данных', 'No data', 'Keine Daten', 'Pas de données', 'Sin datos'],
    word: ['Слово', 'Word', 'Wort', 'Mot', 'Palabra'],
    translation: ['Перевод', 'Translation', 'Übersetzung', 'Traduction', 'Traducción'],
    wrongWords: ['Слова с ошибками:', 'Words with mistakes:', 'Wörter mit Fehlern:', 'Mots avec erreurs :', 'Palabras con errores:'],
    excellent: ['Отличный результат!', 'Excellent result!', 'Ausgezeichnet!', 'Excellent !', '¡Excelente!'],
    good: ['Хорошая работа!', 'Good job!', 'Gut gemacht!', 'Bien !', '¡Bien!'],
    ok: ['Неплохо! Продолжайте!', 'Not bad! Keep going!', 'Nicht schlecht! Weiter!', 'Pas mal ! Continuez !', '¡Nada mal! ¡Continúa!'],
    low: ['Продолжайте стараться!', 'Keep trying!', 'Weiter üben!', 'Continuez !', '¡Sigue intentándolo!'],
    deletedGroup: ['Удалённая группа', 'Deleted group', 'Gelöschte Gruppe', 'Groupe supprimé', 'Grupo eliminado'],
    testShort: ['В тесте {count} уникальных варианта(ов)', 'The test has {count} unique option(s)', 'Der Test hat {count} eindeutige Optionen', 'Le test contient {count} options uniques', 'El test tiene {count} opciones únicas'],
    noName: ['Введите название группы', 'Enter a group name', 'Gruppenname eingeben', 'Entrez un nom de groupe', 'Ingresa un nombre'],
    noWords: ['Добавьте хотя бы одно слово с переводом', 'Add at least one word with a translation', 'Mindestens ein Wort mit Übersetzung hinzufügen', 'Ajoutez au moins un mot et sa traduction', 'Añade al menos una palabra con traducción'],
    sameLang: ['Выберите разные языки', 'Choose two different languages', 'Verschiedene Sprachen wählen', 'Choisissez deux langues différentes', 'Elige idiomas diferentes'],
    created: ['Группа создана!', 'Group created!', 'Gruppe erstellt!', 'Groupe créé !', '¡Grupo creado!'],
    saved: ['Группа обновлена!', 'Group updated!', 'Gruppe aktualisiert!', 'Groupe mis à jour !', '¡Grupo actualizado!'],
    deleted: ['Группа удалена', 'Group deleted', 'Gruppe gelöscht', 'Groupe supprimé', 'Grupo eliminado'],
    deleteGroupTitle: ['Удалить группу?', 'Delete group?', 'Gruppe löschen?', 'Supprimer le groupe ?', '¿Eliminar grupo?'],
    deleteGroupText: ['Группа и её слова будут удалены безвозвратно.', 'The group and its words will be permanently deleted.', 'Gruppe und Wörter werden dauerhaft gelöscht.', 'Le groupe et ses mots seront supprimés.', 'El grupo y sus palabras se eliminarán.'],
    deleteAllTitle: ['Удалить ВСЕ данные?', 'Delete ALL data?', 'ALLE Daten löschen?', 'Supprimer TOUT ?', '¿Eliminar TODO?'],
    deleteAllText: ['Все группы, статистика и настройки будут удалены. Сначала рекомендуется скачать копию.', 'All groups, statistics and settings will be deleted. Download a backup first.', 'Alle Gruppen, Statistiken und Einstellungen werden gelöscht.', 'Toutes les données seront supprimées. Faites une sauvegarde.', 'Se eliminarán todos los datos. Descarga una copia primero.'],
    allDeleted: ['Все данные удалены', 'All data deleted', 'Alle Daten gelöscht', 'Toutes les données supprimées', 'Todos los datos eliminados'],
    imported: ['Группа «{name}» импортирована', 'Group “{name}” imported', 'Gruppe „{name}“ importiert', 'Groupe « {name} » importé', 'Grupo «{name}» importado'],
    badImport: ['Неверный или повреждённый код группы', 'Invalid or damaged group code', 'Ungültiger Gruppencode', 'Code de groupe invalide', 'Código de grupo inválido'],
    copied: ['Скопировано!', 'Copied!', 'Kopiert!', 'Copié !', '¡Copiado!'],
    copyFailed: ['Не удалось скопировать. Выделите код вручную.', 'Copy failed. Select the code manually.', 'Kopieren fehlgeschlagen. Code manuell auswählen.', 'Échec de la copie. Sélectionnez le code manuellement.', 'No se pudo copiar. Selecciona el código manualmente.'],
    backupDone: ['Резервная копия скачана', 'Backup downloaded', 'Sicherung heruntergeladen', 'Sauvegarde téléchargée', 'Copia descargada'],
    restoreTitleConfirm: ['Заменить текущие данные?', 'Replace current data?', 'Aktuelle Daten ersetzen?', 'Remplacer les données actuelles ?', '¿Sustituir los datos actuales?'],
    restoreTextConfirm: ['Файл проверен. Текущие группы и статистика будут заменены содержимым копии.', 'The file is valid. Current groups and statistics will be replaced.', 'Datei geprüft. Aktuelle Daten werden ersetzt.', 'Le fichier est valide. Les données actuelles seront remplacées.', 'El archivo es válido. Se sustituirán los datos actuales.'],
    restored: ['Данные восстановлены', 'Data restored', 'Daten wiederhergestellt', 'Données restaurées', 'Datos restaurados'],
    restoreFailed: ['Не удалось восстановить: неверный или повреждённый файл', 'Restore failed: invalid or damaged file', 'Wiederherstellung fehlgeschlagen: ungültige Datei', 'Échec : fichier invalide ou endommagé', 'Error: archivo inválido o dañado'],
    storageError: ['Не удалось сохранить данные в браузере. Скачайте резервную копию.', 'Could not save browser data. Download a backup.', 'Browserdaten konnten nicht gespeichert werden.', 'Impossible d’enregistrer. Téléchargez une sauvegarde.', 'No se pudieron guardar los datos. Descarga una copia.'],
    loadError: ['Старые данные не удалось прочитать. Они сохранены для восстановления; создана новая коллекция.', 'Old data could not be read. A recovery copy was kept and a new collection was created.', 'Alte Daten konnten nicht gelesen werden. Eine Wiederherstellungskopie wurde behalten.', 'Anciennes données illisibles. Une copie de récupération a été conservée.', 'No se pudieron leer los datos antiguos. Se conservó una copia.'],
    noWord: ['Введите слово', 'Enter a word', 'Wort eingeben', 'Entrez un mot', 'Ingresa una palabra'],
    translateError: ['Ошибка перевода. Проверьте соединение или введите перевод вручную.', 'Translation failed. Check your connection or enter it manually.', 'Übersetzungsfehler. Verbindung prüfen oder manuell eingeben.', 'Échec de la traduction. Vérifiez la connexion ou saisissez-la manuellement.', 'Error de traducción. Comprueba la conexión o escribe la traducción.'],
    allTranslated: ['Все слова переведены', 'All words translated', 'Alle Wörter übersetzt', 'Tous les mots sont traduits', 'Todas las palabras traducidas'],
    withoutTranslation: ['без перевода', 'without translation', 'ohne Übersetzung', 'sans traduction', 'sin traducción'],
    translating: ['переводится…', 'translating…', 'wird übersetzt…', 'traduction…', 'traduciendo…'],
    translationRunning: ['Дождитесь завершения перевода', 'Wait for translation to finish', 'Warten Sie auf die Übersetzung', 'Attendez la fin de la traduction', 'Espera a que termine la traducción'],
    noDue: ['Сейчас нет слов к повторению', 'No words are due for review', 'Keine Wörter zu wiederholen', 'Aucun mot à réviser', 'No hay palabras para repasar'],
    testNeedsWords: ['Для теста нужны минимум два разных перевода', 'The test needs at least two different translations', 'Der Test braucht mindestens zwei Übersetzungen', 'Le test nécessite au moins deux traductions', 'El test necesita al menos dos traducciones'],
    details: ['Варианты, пример и грамматика', 'Variants, example and grammar', 'Varianten, Beispiel und Grammatik', 'Variantes, exemple et grammaire', 'Variantes, ejemplo y gramática'],
    otherTranslations: ['Другие допустимые переводы (через ;)', 'Other accepted translations (separated by ;)', 'Weitere Übersetzungen (mit ;)', 'Autres traductions acceptées (séparées par ;)', 'Otras traducciones (separadas por ;)'],
    otherWords: ['Другие допустимые слова (через ;)', 'Other accepted words (separated by ;)', 'Weitere gültige Wörter (mit ;)', 'Autres mots acceptés (séparées par ;)', 'Otras palabras (separadas por ;)'],
    example: ['Пример предложения', 'Example sentence', 'Beispielsatz', 'Phrase d’exemple', 'Frase de ejemplo'],
    grammar: ['Артикль или грамматическая заметка', 'Article or grammar note', 'Artikel oder Grammatiknotiz', 'Article ou note grammaticale', 'Artículo o nota gramatical'],
    translate: ['Перевести', 'Translate', 'Übersetzen', 'Traduire', 'Traducir'],
    remove: ['Удалить слово', 'Remove word', 'Wort entfernen', 'Supprimer le mot', 'Eliminar palabra'],
    answerPlaceholder: ['Введите ответ…', 'Type your answer…', 'Antwort eingeben…', 'Saisissez votre réponse…', 'Escribe tu respuesta…'],
    almostFeedback: ['Почти верно! Правильно: {answer}', 'Almost! Correct answer: {answer}', 'Fast richtig! Richtig: {answer}', 'Presque ! Bonne réponse : {answer}', '¡Casi! Respuesta correcta: {answer}'],
    sessionAttempts: ['{correct} из {total} попыток', '{correct} out of {total} attempts', '{correct} von {total} Versuchen', '{correct} sur {total} essais', '{correct} de {total} intentos'],
    languageChanged: ['Язык интерфейса изменён', 'Interface language changed', 'Sprache geändert', 'Langue modifiée', 'Idioma cambiado']
  };
  const I18N_IDS = {
    navGroups: 'navGroups', navStats: 'navStats', groupsTitle: 'groupsTitle', groupsSubtitle: 'groupsSubtitle', importBtnText: 'import', createGroupBtnText: 'create', statsTitle: 'statsTitle', statsSubtitle: 'statsSubtitle', stSessionsLabel: 'sessions', stCorrectLabel: 'correct', stAlmostLabel: 'almost', stAccLabel: 'accuracy', stDueLabel: 'due', groupStatsTitle: 'byGroup', recentStatsTitle: 'recent', backBtnText: 'back', hintBtnText: 'hint', skipBtnText: 'skip', fcTapHint: 'flip', fcDunnoText: 'dunno', fcKnowText: 'know', resCorrectLabel: 'correct', resAlmostLabel: 'almost', resWrongLabel: 'mistakes', resSkipLabel: 'skipped', resultsBackText: 'back', repeatMistakesText: 'repeatMistakes', restartStudyText: 'again', studyModeLabel: 'studyMode', modeWordTitle: 'wordTranslate', modeWordDesc: 'wordTranslateDesc', modeTranslateTitle: 'translateWord', modeTranslateDesc: 'translateWordDesc', modeDictationTitle: 'dictation', modeDictationDesc: 'dictationDesc', modeFlashTitle: 'flashcards', modeFlashDesc: 'flashcardsDesc', modeTestTitle: 'test', modeTestDesc: 'testDesc', studyOrderLabel: 'order', orderSeqLabel: 'sequential', orderRndLabel: 'random', orderDueLabel: 'dueFirst', studyDueOnlyText: 'dueOnly', studyCancelBtn: 'cancel', startStudyBtn: 'start', groupNameLabel: 'groupName', groupNativeLabel: 'native', groupTargetLabel: 'target', groupDescLabel: 'description', groupWordsLabel: 'wordsTranslations', tabOneText: 'oneByOne', tabBulkText: 'bulk', addWordText: 'addWord', translateAllText: 'translateAll', groupCancelBtn: 'cancel', saveGroupBtn: 'save', shareModalTitle: 'shareTitle', shareDescription: 'shareDesc', shareCloseBtn: 'close', copyShareBtn: 'copy', importModalTitle: 'importTitle', importDescription: 'importDesc', importCodeLabel: 'importCode', importCancelBtn: 'cancel', importSubmitBtn: 'importAction', settingsModalTitle: 'settings', appearanceTitle: 'appearance', darkThemeTitle: 'dark', darkThemeDesc: 'darkDesc', siteLangTitle: 'siteLanguage', defaultLangsTitle: 'defaultLanguages', defaultLangsDesc: 'defaultLanguagesDesc', defaultNativeLabel: 'native', defaultTargetLabel: 'target', learningSettingsTitle: 'learning', caseSettingTitle: 'case', caseSettingDesc: 'caseDesc', diacriticsSettingTitle: 'diacritics', diacriticsSettingDesc: 'diacriticsDesc', fuzzySettingTitle: 'fuzzy', fuzzySettingDesc: 'fuzzyDesc', autoHintSettingTitle: 'autoHint', autoHintSettingDesc: 'autoHintDesc', dataSettingsTitle: 'data', backupTitle: 'backup', backupDesc: 'backupDesc', backupBtn: 'download', restoreTitle: 'restore', restoreDesc: 'restoreDesc', restoreLabelText: 'upload', deleteAllTitle: 'deleteAll', deleteAllDesc: 'deleteAllDesc', deleteAllBtn: 'delete', translationPrivacy: 'privacy', footerText: 'footer', confirmTitle: 'confirm', confirmCancelBtn: 'cancel', confirmOkBtn: 'confirmAction'
  };

  let appData = C.createDefaultData();
  let bulkParsed = [];
  let currentStudyGroupId = null;
  let pendingRestore = null;
  let bulkAbort = null;
  let onboardingProvider = 'local';
  let modelOperation = false;
  let storageWarningShown = false;
  let loadWarning = false;
  let confirmAction = null;
  const modalFocus = new WeakMap();
  let SS = emptySession();

  function t(key, values = {}) {
    const phrases = T[key];
    let result = phrases ? phrases[SITE_LANGS.indexOf(appData.settings.siteLang)] || phrases[1] || phrases[0] : key;
    for (const [name, value] of Object.entries(values)) result = result.replaceAll(`{${name}}`, String(value));
    return result;
  }
  function esc(value) { return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
  function emptySession() { return { token: 0, timer: null, group: null, mode: 'word-to-translate', order: 'sequential', sourceWords: [], cards: [], idx: 0, correct: 0, almost: 0, wrong: 0, skipped: 0, answered: false, hintLevel: 0, fcFlipped: false, wrongWords: [], mistakeWords: [], currentOptions: [] }; }

  function loadData() {
    try {
      const saved = localStorage.getItem(C.STORAGE_KEY);
      if (saved) {
        try {
          appData = C.normalizeAppData(JSON.parse(saved));
          localStorage.setItem(C.STORAGE_KEY, JSON.stringify(appData));
        } catch (error) {
          try { localStorage.setItem(`${C.STORAGE_KEY}_recovery`, saved); } catch (recoveryError) {}
          appData = C.createDefaultData();
          loadWarning = true;
        }
      }
    } catch (error) { appData = C.createDefaultData(); loadWarning = true; }
  }
  function saveData() {
    try { localStorage.setItem(C.STORAGE_KEY, JSON.stringify(appData)); return true; }
    catch (error) {
      if (!storageWarningShown) { storageWarningShown = true; showToast(t('storageError'), 'error', 7000); }
      return false;
    }
  }
  function applyI18n() {
    document.documentElement.lang = appData.settings.siteLang;
    for (const [id, key] of Object.entries(I18N_IDS)) { const element = $(id); if (element) element.textContent = t(key); }
    $('answerInput').placeholder = t('answerPlaceholder');
    $('themeBtn').setAttribute('aria-label', t('dark'));
    $('themeBtn').title = t('dark');
    updateWordRowLabels();
    renderSiteLangGrid();
  }
  function applySettings() {
    document.body.className = appData.settings.darkMode ? 'dark' : 'light';
    document.querySelector('meta[name="theme-color"]').content = appData.settings.darkMode ? '#1c1c2e' : '#e8e8f4';
    $('themeBtn').textContent = appData.settings.darkMode ? '🌙' : '☀️';
    for (const [id, key] of [['darkToggle', 'darkMode'], ['caseToggle', 'caseSensitive'], ['diacriticsToggle', 'diacriticsSensitive'], ['fuzzyToggle', 'fuzzy'], ['autoHintToggle', 'autoHint']]) $(id).checked = appData.settings[key];
    $('translationProvider').value = appData.settings.translationProvider;
    populateLangSelects();
    applyI18n();
    renderTranslationSettings();
  }
  function saveSettings() {
    const previousKey = `${appData.settings.nativeLang}-${appData.settings.targetLang}-${appData.settings.translationProvider}`;
    appData.settings.darkMode = $('darkToggle').checked;
    appData.settings.caseSensitive = $('caseToggle').checked;
    appData.settings.diacriticsSensitive = $('diacriticsToggle').checked;
    appData.settings.fuzzy = $('fuzzyToggle').checked;
    appData.settings.autoHint = $('autoHintToggle').checked;
    appData.settings.nativeLang = $('nativeLangSel').value;
    appData.settings.targetLang = $('targetLangSel').value;
    appData.settings.translationProvider = $('translationProvider').value;
    appData.settings.onboardingCompleted = true;
    const nextKey = `${appData.settings.nativeLang}-${appData.settings.targetLang}-${appData.settings.translationProvider}`;
    if (previousKey !== nextKey) translator.cancelLocal();
    applySettings(); saveData(); renderGroups();
  }
  function populateLangSelects() {
    const options = C.STUDY_LANGS.map(lang => `<option value="${lang.id}">${lang.flag} ${esc(lang.name)}</option>`).join('');
    for (const id of ['nativeLangSel', 'targetLangSel', 'gNativeLang', 'gTargetLang', 'onbNativeLang', 'onbTargetLang']) {
      const select = $(id); const previous = select.value; select.innerHTML = options; if (previous) select.value = previous;
    }
    for (const [id, value] of [['nativeLangSel', appData.settings.nativeLang], ['targetLangSel', appData.settings.targetLang], ['onbNativeLang', appData.settings.nativeLang], ['onbTargetLang', appData.settings.targetLang]]) $(id).value = value;
  }
  function updateMyMemoryQuota() {
    const usage = C.getMyMemoryUsage(appData.settings);
    $('myMemoryQuotaText').textContent = `Локальная оценка остатка: ${usage.remaining} из ${usage.limit} символов`;
    $('myMemoryQuotaBar').max = usage.limit;
    $('myMemoryQuotaBar').value = usage.remaining;
    return usage;
  }
  function renderTranslationSettings() {
    const provider = appData.settings.translationProvider;
    $('localProviderSettings').hidden = provider !== 'local';
    $('myMemoryProviderSettings').hidden = provider !== 'mymemory';
    updateMyMemoryQuota();
    updateGroupTranslationNote();
    if (provider !== 'local' || modelOperation) return;
    const route = TM.getRoute(appData.settings.nativeLang, appData.settings.targetLang);
    $('preloadModelBtn').disabled = !route.length;
    if (!route.length) {
      $('localModelStatus').textContent = 'Для этой пары нет проверенного локального маршрута. Можно использовать ручной ввод или явно выбрать MyMemory.';
      return;
    }
    const size = TM.getRouteSize(route);
    const state = translator.getLocalState();
    if (state.status === 'ready') $('localModelStatus').textContent = `Загружена модель ${state.modelId}. Ускорение: ${state.device}. В памяти остаётся только последняя использованная модель.`;
    else $('localModelStatus').textContent = `Примерный размер скачивания: ${size} МБ${route.length > 1 ? ' для двух моделей через английский' : ''}. Модель будет скачана по кнопке или при первом переводе.`;
  }
  function updateGroupTranslationNote() {
    const note = $('groupTranslationNote');
    if (!note) return;
    const source = $('gTargetLang').value || appData.settings.targetLang;
    const target = $('gNativeLang').value || appData.settings.nativeLang;
    const provider = appData.settings.translationProvider;
    if (provider === 'manual') note.textContent = 'Автоматический перевод отключён. Слова и переводы можно вводить вручную.';
    else if (provider === 'mymemory') {
      const usage = C.getMyMemoryUsage(appData.settings);
      note.textContent = `MyMemory: текст отправляется на сторонний сервер, качество может быть низким. Локальная оценка остатка: ${usage.remaining} символов.`;
    } else {
      const route = TM.getRoute(source, target);
      note.textContent = route.length ? `Локальный перевод: ${TM.getRouteSize(route)} МБ скачивания${route.length > 1 ? ', две модели через английский' : ''}. Текст не отправляется на сервер.` : 'Для этой пары локальная модель не настроена. Доступен ручной ввод; MyMemory включается отдельно в настройках.';
    }
    $('bulkTranslateBtn').disabled = provider === 'manual' || Boolean(bulkAbort);
  }
  function setOnboardingProvider(provider) {
    onboardingProvider = provider;
    document.querySelectorAll('[data-onb-provider]').forEach(button => {
      const selected = button.dataset.onbProvider === provider;
      button.classList.toggle('selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    updateOnboardingInfo();
  }
  function updateOnboardingInfo() {
    const source = $('onbTargetLang').value, target = $('onbNativeLang').value;
    const same = source === target;
    let supported = true;
    if (same) $('onbModelInfo').textContent = 'Выберите разные языки.';
    else if (onboardingProvider === 'local') {
      const route = TM.getRoute(source, target);
      supported = route.length > 0;
      $('onbModelInfo').textContent = route.length ? `Примерный размер: ${TM.getRouteSize(route)} МБ${route.length > 1 ? ' для двух моделей через английский' : ''}. Загрузка начнётся после нажатия кнопки.` : 'Для этой пары нет проверенной локальной модели. Выберите MyMemory или ручной ввод.';
    } else if (onboardingProvider === 'mymemory') $('onbModelInfo').textContent = 'Текст будет отправляться в MyMemory. Анонимный лимит — 5000 символов в день; качество может быть низким. Точный остаток сервер не сообщает.';
    else $('onbModelInfo').textContent = 'Автоматический перевод будет отключён. Его можно включить позже в настройках.';
    $('onbSaveBtn').disabled = same || !supported || Boolean(modelOperation);
    $('onbSaveBtn').textContent = onboardingProvider === 'local' && supported ? 'Сохранить и скачать модель' : 'Сохранить настройки';
    $('onbProgress').hidden = true;
  }
  function openOnboarding() {
    $('onbNativeLang').value = appData.settings.nativeLang;
    $('onbTargetLang').value = appData.settings.targetLang;
    setOnboardingProvider(appData.settings.translationProvider || 'local');
    openModal('onboardingModal');
  }
  function paintModelProgress(ui, event) {
    const info = ui === 'onb' ? $('onbModelInfo') : $('localModelStatus');
    const wrap = ui === 'onb' ? $('onbProgress') : $('localModelProgress');
    const bar = ui === 'onb' ? $('onbProgressBar') : $('localModelProgressBar');
    wrap.hidden = false;
    const modelText = event.modelCount > 1 ? `Модель ${event.modelIndex + 1}/${event.modelCount}. ` : '';
    if (event.type === 'progress') {
      const progress = event.progress;
      const percent = Number.isFinite(progress.progress) ? Math.round(progress.progress) : null;
      info.textContent = `${modelText}Загрузка ${progress.file || 'файлов'}${percent === null ? '' : `: ${percent}%`}`;
      if (percent !== null) bar.style.width = `${percent}%`;
    } else if (event.status === 'initializing') info.textContent = `${modelText}Инициализация ${event.device === 'webgpu' ? 'WebGPU' : 'WASM'}…`;
    else if (event.status === 'ready') { info.textContent = `${modelText}Модель готова (${event.device}).`; bar.style.width = '100%'; }
    else if (event.status === 'translating') info.textContent = `${modelText}Выполняется перевод…`;
  }
  async function downloadModels(source, target, ui) {
    if (modelOperation) return false;
    if (!TM.getRoute(source, target).length) return false;
    modelOperation = true;
    let succeeded = false;
    try {
      await translator.preloadLocal(source, target, event => paintModelProgress(ui, event));
      succeeded = true;
      return true;
    } catch (error) {
      const info = ui === 'onb' ? $('onbModelInfo') : $('localModelStatus');
      info.textContent = `Не удалось подготовить модель: ${error.message}. Можно повторить попытку или выбрать ручной ввод.`;
      return false;
    } finally {
      modelOperation = false;
      if (!$('settingsModal').hidden) {
        if (succeeded) renderTranslationSettings();
        else $('preloadModelBtn').disabled = false;
      }
      if (!$('onboardingModal').hidden) $('onbSaveBtn').disabled = false;
    }
  }
  async function completeOnboarding() {
    const nativeLang = $('onbNativeLang').value, targetLang = $('onbTargetLang').value;
    if (nativeLang === targetLang) return;
    appData.settings.nativeLang = nativeLang;
    appData.settings.targetLang = targetLang;
    appData.settings.translationProvider = onboardingProvider;
    appData.settings.onboardingCompleted = true;
    saveData(); applySettings();
    if (onboardingProvider === 'local') {
      const ok = await downloadModels(targetLang, nativeLang, 'onb');
      if (!ok) return;
    }
    closeModal('onboardingModal');
  }
  function skipOnboarding() {
    if (modelOperation) translator.cancelLocal();
    appData.settings.translationProvider = 'manual';
    appData.settings.onboardingCompleted = true;
    saveData(); applySettings(); closeModal('onboardingModal');
  }
  async function preloadSettingsModel() {
    await downloadModels(appData.settings.targetLang, appData.settings.nativeLang, 'settings');
  }
  async function clearDownloadedModels() {
    await translator.clearLocalModels();
    $('localModelProgress').hidden = true;
    $('localModelProgressBar').style.width = '0';
    renderTranslationSettings();
    showToast('Скачанные модели удалены. Группы и статистика сохранены.', 'info');
  }
  function renderSiteLangGrid() {
    const grid = $('siteLangGrid'); grid.replaceChildren();
    for (const lang of SITE_LANGS) {
      const button = document.createElement('button'); button.type = 'button'; button.className = `lang-site-opt${appData.settings.siteLang === lang ? ' active' : ''}`;
      button.textContent = SITE_LANG_NAMES[lang]; button.dataset.lang = lang; button.setAttribute('aria-pressed', String(appData.settings.siteLang === lang)); grid.appendChild(button);
    }
  }
  function showPage(id) {
    document.querySelectorAll('.page').forEach(page => page.classList.toggle('active', page.id === `page-${id}`));
    document.querySelectorAll('.nav-btn').forEach(button => {
      const active = button.dataset.page === id; button.classList.toggle('active', active);
      if (active) button.setAttribute('aria-current', 'page'); else button.removeAttribute('aria-current');
    });
    if (id === 'groups') renderGroups(); if (id === 'stats') renderStats();
  }
  function openModal(id) {
    const modal = $(id); modalFocus.set(modal, document.activeElement); modal.hidden = false; syncModalState();
    requestAnimationFrame(() => { const target = modal.querySelector('input:not([type="hidden"]):not([type="radio"]):not([type="checkbox"]), textarea, button, [tabindex="-1"]'); if (target) target.focus(); });
  }
  function closeModal(id) {
    const modal = $(id); if (modal.hidden) return;
    if (id === 'groupModal' && bulkAbort) { bulkAbort.abort(); translator.cancelLocal(); bulkAbort = null; $('saveGroupBtn').disabled = false; $('bulkTranslateBtn').disabled = false; }
    modal.hidden = true; syncModalState();
    const previous = modalFocus.get(modal); if (previous && previous.isConnected && !previous.closest('[hidden]')) previous.focus();
  }
  function syncModalState() {
    const open = [...document.querySelectorAll('.modal-overlay')].filter(modal => !modal.hidden); const top = open[open.length - 1]; const studyOpen = !$('studyFullscreen').hidden;
    $('app').inert = open.length > 0 || studyOpen; $('studyFullscreen').inert = open.length > 0;
    document.querySelectorAll('.modal-overlay').forEach(modal => { modal.inert = Boolean(top && modal !== top); });
    document.body.style.overflow = open.length > 0 || studyOpen ? 'hidden' : '';
  }
  function showConfirm(title, message, action) { $('confirmTitle').textContent = title; $('confirmText').textContent = message; confirmAction = action; openModal('confirmModal'); }
  function showToast(message, type = 'info', duration = 3500) {
    const toast = document.createElement('div'); toast.className = `toast ${type}`; toast.setAttribute('role', type === 'error' ? 'alert' : 'status');
    const icon = document.createElement('span'); icon.textContent = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' }[type] || 'ℹ️';
    const text = document.createElement('span'); text.textContent = String(message); toast.append(icon, text); $('toastWrap').appendChild(toast);
    setTimeout(() => { toast.style.animation = 'toastOut .25s ease forwards'; setTimeout(() => toast.remove(), 250); }, duration);
  }

  function groupStats(id) { return appData.stats.byGroup[id] || { sessions: 0, correct: 0, almost: 0, wrong: 0, skipped: 0 }; }
  function accuracyColor(value) { return value >= 70 ? 'var(--success)' : value >= 40 ? 'var(--warning)' : 'var(--danger)'; }

  function renderGroups() {
    const grid = $('groupsGrid');
    if (!appData.groups.length) {
      grid.innerHTML = `<div class="glass empty-state"><div class="es-icon">📭</div><h2>${esc(t('noGroups'))}</h2><p>${esc(t('noGroupsDesc'))}</p><div class="empty-actions"><button type="button" class="btn btn-primary" data-action="create">➕ ${esc(t('create'))}</button><button type="button" class="btn btn-ghost" data-action="sample">🌍 ${esc(t('addSample'))}</button></div></div>`;
      return;
    }
    const now = Date.now();
    grid.innerHTML = appData.groups.map(group => {
      const native = C.getLang(group.nativeLang), target = C.getLang(group.targetLang);
      const preview = group.words.slice(0, 5).map(word => `<span class="word-chip" dir="auto">${esc(word.word)}</span>`).join('');
      const more = group.words.length > 5 ? `<span class="word-chip">+${group.words.length - 5}</span>` : '';
      const accuracy = C.calculateAccuracy(groupStats(group.id));
      const learning = C.getGroupLearning(group, now);
      return `<article class="glass group-card"><div class="group-card-header"><div class="group-card-heading"><h2 class="group-title">${esc(group.name)}</h2><div class="group-meta">${target.flag} ${esc(target.name)} → ${native.flag} ${esc(native.name)} · ${group.words.length} ${esc(t('words'))}</div>${group.desc ? `<div class="group-desc">${esc(group.desc)}</div>` : ''}</div><span class="badge badge-success" title="${esc(t('accuracy'))}">${accuracy}%</span></div><div class="word-chips">${preview}${more}</div><div class="learning-meta"><span><strong>${learning.learned}/${group.words.length}</strong> ${esc(t('learned'))}</span><span><strong>${learning.due}</strong> ${esc(t('due').toLocaleLowerCase())}</span><span><strong>${learning.difficult}</strong> ${esc(t('difficult'))}</span></div><div class="group-actions"><button type="button" class="btn btn-primary btn-sm" data-action="study" data-id="${group.id}">${esc(t('study'))}</button><button type="button" class="btn btn-ghost btn-sm" data-action="edit" data-id="${group.id}">${esc(t('edit'))}</button><button type="button" class="btn btn-ghost btn-sm" data-action="share" data-id="${group.id}">🔗 ${esc(t('share'))}</button><button type="button" class="btn btn-danger btn-sm" data-action="delete" data-id="${group.id}" aria-label="${esc(t('delete'))}: ${esc(group.name)}">🗑</button></div></article>`;
    }).join('');
  }
  function addSampleGroup() {
    const sample = C.createSampleGroup(); if (appData.groups.some(group => group.id === sample.id)) sample.id = C.uid('g');
    appData.groups.push(sample); saveData(); renderGroups();
  }
  function switchWordTab(tab) {
    const one = tab === 'one-by-one';
    for (const [button, active] of [[$('tab-one'), one], [$('tab-bulk'), !one]]) { button.classList.toggle('active', active); button.setAttribute('aria-selected', String(active)); button.tabIndex = active ? 0 : -1; }
    $('tab-content-one-by-one').classList.toggle('active', one); $('tab-content-one-by-one').hidden = !one;
    $('tab-content-bulk').classList.toggle('active', !one); $('tab-content-bulk').hidden = one;
  }
  function openCreateModal() {
    $('groupModalTitle').textContent = t('create'); $('groupForm').reset(); $('editGroupId').value = ''; $('wordsEditor').replaceChildren(); $('bulkInput').value = ''; bulkParsed = []; renderBulkPreview();
    populateLangSelects(); $('gNativeLang').value = appData.settings.nativeLang; $('gTargetLang').value = appData.settings.targetLang; switchWordTab('one-by-one'); addWordRow(); updateGroupTranslationNote(); openModal('groupModal'); setTimeout(() => $('gName').focus(), 50);
  }
  function editGroup(id) {
    const group = appData.groups.find(item => item.id === id); if (!group) return;
    $('groupModalTitle').textContent = t('edit'); $('groupForm').reset(); $('editGroupId').value = id; $('gName').value = group.name; $('gDesc').value = group.desc; $('wordsEditor').replaceChildren(); $('bulkInput').value = ''; bulkParsed = []; renderBulkPreview();
    populateLangSelects(); $('gNativeLang').value = group.nativeLang; $('gTargetLang').value = group.targetLang; switchWordTab('one-by-one'); group.words.forEach(word => addWordRow(word)); updateGroupTranslationNote(); openModal('groupModal');
  }
  function deleteGroup(id) {
    const group = appData.groups.find(item => item.id === id); if (!group) return;
    showConfirm(t('deleteGroupTitle'), `${t('deleteGroupText')} «${group.name}»`, () => { appData.groups = appData.groups.filter(item => item.id !== id); delete appData.stats.byGroup[id]; saveData(); renderGroups(); showToast(t('deleted'), 'info'); });
  }
  function addWordRow(word = null) {
    const source = word || { id: C.uid('w'), word: '', translate: '', acceptedAnswers: [], alternateWords: [], example: '', grammar: '', correct: 0, almost: 0, wrong: 0, skipped: 0, streak: 0, level: 0, due: 0, lastSeen: 0, lastResult: '' };
    const row = document.createElement('div'); row.className = 'word-row'; row._word = source;
    row.innerHTML = `<div class="word-row-main"><div class="word-field"><label class="word-label-w"></label><input class="word-input-w" type="text" maxlength="1000" autocomplete="off" dir="auto"></div><div class="lang-sep" aria-hidden="true">→</div><div class="word-field"><label class="word-label-t"></label><input class="word-input-t" type="text" maxlength="1000" autocomplete="off" dir="auto"></div><div class="word-row-actions"><button type="button" class="icon-btn translate-btn" data-row-action="translate" title="${esc(t('translate'))}" aria-label="${esc(t('translate'))}">🔄</button><button type="button" class="remove-word-btn" data-row-action="remove" title="${esc(t('remove'))}" aria-label="${esc(t('remove'))}">✕</button></div></div><details class="word-details"><summary>${esc(t('details'))}</summary><div class="word-details-grid"><div><label>${esc(t('otherTranslations'))}<input class="word-accepted" type="text" maxlength="5000"></label></div><div><label>${esc(t('otherWords'))}<input class="word-alternate" type="text" maxlength="5000"></label></div><div class="wide"><label>${esc(t('example'))}<textarea class="word-example" rows="2" maxlength="5000" dir="auto"></textarea></label></div><div class="wide"><label>${esc(t('grammar'))}<input class="word-grammar" type="text" maxlength="1000"></label></div></div></details>`;
    row.querySelector('.word-input-w').value = source.word || ''; row.querySelector('.word-input-t').value = source.translate || '';
    row.querySelector('.word-accepted').value = (source.acceptedAnswers || []).filter(item => item !== source.translate).join('; ');
    row.querySelector('.word-alternate').value = (source.alternateWords || []).join('; '); row.querySelector('.word-example').value = source.example || ''; row.querySelector('.word-grammar').value = source.grammar || '';
    $('wordsEditor').appendChild(row); updateWordRowLabels();
    row.querySelector('[data-row-action="translate"]').disabled = appData.settings.translationProvider === 'manual';
    if (!word) row.querySelector('.word-input-w').focus();
  }
  function updateWordRowLabels() {
    const native = C.getLang($('gNativeLang').value || appData.settings.nativeLang), target = C.getLang($('gTargetLang').value || appData.settings.targetLang);
    document.querySelectorAll('#wordsEditor .word-row').forEach(row => {
      row.querySelector('.word-label-w').textContent = `${target.flag} ${target.name}`; row.querySelector('.word-label-t').textContent = `${native.flag} ${native.name}`;
      row.querySelector('.word-input-w').setAttribute('aria-label', `${t('word')}: ${target.name}`); row.querySelector('.word-input-t').setAttribute('aria-label', `${t('translation')}: ${native.name}`);
    });
  }
  function splitAliases(value) { return C.uniqueStrings(String(value || '').split(/[;\n]/), 1000); }
  function readEditorWords() {
    const words = [], seen = new Set();
    document.querySelectorAll('#wordsEditor .word-row').forEach(row => {
      const source = row._word || {}, translate = row.querySelector('.word-input-t').value.trim();
      try {
        const word = C.normalizeWord({ ...source, id: source.id, word: row.querySelector('.word-input-w').value, translate, acceptedAnswers: [translate, ...splitAliases(row.querySelector('.word-accepted').value)], alternateWords: splitAliases(row.querySelector('.word-alternate').value), example: row.querySelector('.word-example').value, grammar: row.querySelector('.word-grammar').value });
        const key = word.word.toLocaleLowerCase(); if (!seen.has(key)) { seen.add(key); words.push(word); }
      } catch (error) {}
    });
    return words;
  }
  function readBulkWords(existingWords, seen) {
    const result = [];
    for (const item of bulkParsed) {
      if (!item.word || !item.translate) continue;
      const key = item.word.toLocaleLowerCase(); if (seen.has(key)) continue;
      const old = existingWords.find(word => word.word.toLocaleLowerCase() === key);
      try { const word = C.normalizeWord({ ...old, ...item, id: old ? old.id : undefined }); seen.add(key); result.push(word); } catch (error) {}
    }
    return result;
  }
  function saveGroup(event) {
    event.preventDefault();
    if (bulkAbort) { showToast(t('translationRunning'), 'warning'); return; }
    const name = $('gName').value.trim();
    if (!name) { showToast(t('noName'), 'error'); $('gName').focus(); return; }
    const nativeLang = $('gNativeLang').value, targetLang = $('gTargetLang').value;
    if (nativeLang === targetLang) { showToast(t('sameLang'), 'error'); return; }
    const editId = $('editGroupId').value, oldGroup = appData.groups.find(group => group.id === editId), editorWords = readEditorWords();
    const seen = new Set(editorWords.map(word => word.word.toLocaleLowerCase())), words = [...editorWords, ...readBulkWords(oldGroup ? oldGroup.words : [], seen)];
    if (!words.length) { showToast(t('noWords'), 'error'); return; }
    const now = Date.now();
    if (oldGroup) { Object.assign(oldGroup, { name, nativeLang, targetLang, desc: $('gDesc').value.trim(), words, updatedAt: now }); showToast(t('saved'), 'success'); }
    else { appData.groups.push({ id: C.uid('g'), name, nativeLang, targetLang, desc: $('gDesc').value.trim(), words, createdAt: now, updatedAt: now }); showToast(t('created'), 'success'); }
    saveData(); closeModal('groupModal'); renderGroups();
  }
  function onBulkInput() { bulkParsed = C.parseBulk($('bulkInput').value); renderBulkPreview(); }
  function renderBulkPreview() {
    const preview = $('bulkPreview'), noTranslation = bulkParsed.filter(item => !item.hasTranslate).length;
    $('bulkStatus').textContent = bulkParsed.length ? noTranslation ? `⚠️ ${noTranslation} ${t('withoutTranslation')}` : `✅ ${t('allTranslated')}` : '';
    if (!bulkParsed.length) { preview.replaceChildren(); return; }
    preview.innerHTML = `<div class="bulk-preview-title">${bulkParsed.length} ${esc(t('words'))}</div><div class="bulk-preview-list">${bulkParsed.map((item, index) => `<div class="bulk-preview-item ${item.hasTranslate ? 'has-translate' : 'no-translate'}" id="bpi-${index}"><span class="bpi-word" dir="auto">${esc(item.word)}</span><span aria-hidden="true">→</span><span class="bpi-translate ${item.hasTranslate ? 'done' : 'pending'}" id="bpi-tr-${index}" dir="auto">${item.hasTranslate ? esc(item.translate) : esc(t('withoutTranslation'))}</span></div>`).join('')}</div>`;
  }
  function showTranslationError(error) {
    if (error.name === 'AbortError') return;
    if (error.code === 'UNSUPPORTED_LOCAL_PAIR') showToast('Для этой пары нет локальной модели. Выберите MyMemory в настройках или введите перевод вручную.', 'error', 6000);
    else if (error.code === 'MYMEMORY_LIMIT' || error.code === 'MYMEMORY_LIMIT_LOCAL') showToast('Дневной лимит MyMemory исчерпан по данным сервера или локальной оценке. Доступен ручной ввод.', 'error', 6000);
    else if (error.code === 'MANUAL_TRANSLATION') showToast('Автоматический перевод отключён в настройках.', 'warning');
    else showToast(error.message || t('translateError'), 'error', 6000);
  }
  async function translateTexts(texts, sourceLang, targetLang, callbacks = {}, signal) {
    const provider = appData.settings.translationProvider;
    if (provider === 'manual') {
      const error = new Error('Автоматический перевод отключён');
      error.code = 'MANUAL_TRANSLATION';
      throw error;
    }
    if (provider === 'local') return translator.translateLocalBatch(texts, sourceLang, targetLang, callbacks);
    const results = [];
    for (let index = 0; index < texts.length; index++) {
      if (signal?.aborted) throw new DOMException('Операция отменена', 'AbortError');
      const value = texts[index];
      const usage = C.getMyMemoryUsage(appData.settings);
      if ([...value].length > usage.remaining) {
        const error = new Error('Локальная оценка лимита MyMemory исчерпана');
        error.code = 'MYMEMORY_LIMIT_LOCAL';
        throw error;
      }
      C.recordMyMemoryUsage(appData.settings, value);
      saveData(); updateMyMemoryQuota();
      try {
        const result = await translator.translateMyMemory(value, sourceLang, targetLang, { signal });
        results.push(result.text);
        if (callbacks.onItem) callbacks.onItem(index, result.text);
        if (callbacks.onProgress) callbacks.onProgress({ index, total: texts.length, done: index + 1, modelIndex: 0, modelCount: 1 });
      } catch (error) {
        if (error.code === 'MYMEMORY_LIMIT') {
          C.recordMyMemoryUsage(appData.settings, value, true);
          saveData(); updateMyMemoryQuota();
        }
        throw error;
      }
    }
    return results;
  }
  async function autoTranslateRow(button) {
    const row = button.closest('.word-row'), word = row.querySelector('.word-input-w').value.trim();
    if (!word) { showToast(t('noWord'), 'error'); return; }
    if (bulkAbort) { showToast(t('translationRunning'), 'warning'); return; }
    const controller = new AbortController(); bulkAbort = controller;
    button.disabled = true; button.textContent = '⏳'; $('saveGroupBtn').disabled = true; $('bulkTranslateBtn').disabled = true;
    try {
      const result = await translateTexts([word], $('gTargetLang').value, $('gNativeLang').value, {
        onModelProgress: event => { button.title = event.progress?.file ? `Загрузка ${event.progress.file}` : 'Подготовка локальной модели…'; }
      }, controller.signal);
      row.querySelector('.word-input-t').value = result[0].slice(0, 1000);
    } catch (error) { showTranslationError(error); }
    finally {
      if (bulkAbort === controller) bulkAbort = null;
      button.disabled = appData.settings.translationProvider === 'manual';
      button.textContent = '🔄'; button.title = t('translate'); $('saveGroupBtn').disabled = false;
      updateGroupTranslationNote();
    }
  }
  async function translateAllBulk() {
    const missing = bulkParsed.filter(item => !item.hasTranslate);
    if (!missing.length) { showToast(t('allTranslated'), 'info'); return; }
    if (bulkAbort) { showToast(t('translationRunning'), 'warning'); return; }
    const controller = new AbortController(); bulkAbort = controller;
    $('bulkTranslateBtn').disabled = true; $('saveGroupBtn').disabled = true; $('translateProgress').hidden = false; $('translateBar').style.width = '0%';
    missing.forEach(item => {
      const index = bulkParsed.indexOf(item), row = $(`bpi-${index}`), translation = $(`bpi-tr-${index}`);
      if (row) row.className = 'bulk-preview-item translating';
      if (translation) { translation.className = 'bpi-translate loading'; translation.textContent = t('translating'); }
    });
    try {
      await translateTexts(missing.map(item => item.word), $('gTargetLang').value, $('gNativeLang').value, {
        onModelProgress: event => {
          if (event.type === 'progress') {
            const progress = event.progress, percent = Number.isFinite(progress.progress) ? Math.round(progress.progress) : null;
            $('bulkStatus').textContent = `Скачивание модели ${event.modelIndex + 1}/${event.modelCount}: ${progress.file || ''}${percent === null ? '' : ` ${percent}%`}`;
          } else if (event.status === 'initializing') $('bulkStatus').textContent = `Инициализация ${event.device}…`;
        },
        onItem: (index, value) => {
          const item = missing[index], originalIndex = bulkParsed.indexOf(item);
          item.translate = value; item.hasTranslate = true;
          const row = $(`bpi-${originalIndex}`), translation = $(`bpi-tr-${originalIndex}`);
          if (row) row.className = 'bulk-preview-item has-translate';
          if (translation) { translation.className = 'bpi-translate done'; translation.textContent = value; }
        },
        onProgress: event => {
          const percent = Math.round(((event.modelIndex || 0) + event.done / event.total) / (event.modelCount || 1) * 100);
          $('translateBar').style.width = `${percent}%`;
          $('bulkStatus').textContent = `Переведено ${event.done} из ${event.total}${event.modelCount > 1 ? `, модель ${event.modelIndex + 1}/${event.modelCount}` : ''}`;
        }
      }, controller.signal);
      if (appData.settings.translationProvider === 'mymemory') showToast('Перевод MyMemory получен. Проверьте качество перед сохранением.', 'warning', 5000);
    } catch (error) { showTranslationError(error); }
    finally {
      if (bulkAbort === controller) bulkAbort = null;
      $('saveGroupBtn').disabled = false; $('translateProgress').hidden = true;
      updateGroupTranslationNote(); renderBulkPreview();
    }
  }
  function shareGroup(id) {
    const group = appData.groups.find(item => item.id === id); if (!group) return;
    try { $('shareCode').textContent = C.serializeGroup(group); openModal('shareModal'); } catch (error) { showToast(t('copyFailed'), 'error'); }
  }
  async function copyShareCode() {
    const value = $('shareCode').textContent;
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(value);
      else {
        const textarea = document.createElement('textarea'); textarea.value = value; textarea.style.position = 'fixed'; textarea.style.opacity = '0'; document.body.appendChild(textarea); textarea.select();
        const copied = document.execCommand('copy'); textarea.remove(); if (!copied) throw new Error('Copy failed');
      }
      showToast(t('copied'), 'success');
    } catch (error) {
      const selection = window.getSelection(), range = document.createRange(); range.selectNodeContents($('shareCode')); selection.removeAllRanges(); selection.addRange(range); showToast(t('copyFailed'), 'warning');
    }
  }
  function importGroup(event) {
    event.preventDefault();
    try {
      const group = C.deserializeGroup($('importCode').value); if (appData.groups.some(item => item.id === group.id)) group.id = C.uid('g');
      group.createdAt = Date.now(); group.updatedAt = Date.now(); appData.groups.push(group); saveData(); closeModal('importModal'); renderGroups(); showToast(t('imported', { name: group.name }), 'success');
    } catch (error) { showToast(t('badImport'), 'error'); $('importCode').focus(); }
  }
  function backupData() {
    try {
      const payload = { ...appData, version: C.DATA_VERSION, exportedAt: new Date().toISOString() }, blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }), url = URL.createObjectURL(blob), link = document.createElement('a');
      link.href = url; link.download = `linguacards_${new Date().toISOString().split('T')[0]}.json`; document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); showToast(t('backupDone'), 'success');
    } catch (error) { showToast(t('storageError'), 'error'); }
  }
  async function restoreData(event) {
    const file = event.target.files[0]; event.target.value = ''; if (!file) return;
    if (file.size > 10000000) { showToast(t('restoreFailed'), 'error'); return; }
    try {
      const restored = C.normalizeAppData(JSON.parse(await file.text())); pendingRestore = restored;
      showConfirm(t('restoreTitleConfirm'), t('restoreTextConfirm'), () => { appData = pendingRestore; pendingRestore = null; saveData(); applySettings(); renderGroups(); renderStats(); showToast(t('restored'), 'success'); });
    } catch (error) { pendingRestore = null; showToast(t('restoreFailed'), 'error'); }
  }
  function confirmDeleteAll() {
    showConfirm(t('deleteAllTitle'), t('deleteAllText'), () => { localStorage.removeItem(C.STORAGE_KEY); appData = C.createDefaultData(false); saveData(); applySettings(); renderGroups(); renderStats(); showToast(t('allDeleted'), 'info'); });
  }

  function openStudyModal(groupId) {
    const group = appData.groups.find(item => item.id === groupId); if (!group) return;
    currentStudyGroupId = groupId; $('studyModalGroupName').textContent = group.name; selectMode('word-to-translate'); $('studyDueOnly').checked = false; openModal('studyModal');
  }
  function selectMode(mode) {
    document.querySelectorAll('.mode-card').forEach(button => { const selected = button.dataset.mode === mode; button.classList.toggle('selected', selected); button.setAttribute('aria-pressed', String(selected)); });
  }
  function selectedMode() { return document.querySelector('.mode-card.selected')?.dataset.mode || 'word-to-translate'; }
  function startStudy() {
    const group = appData.groups.find(item => item.id === currentStudyGroupId); if (!group) return;
    const mode = selectedMode(), order = document.querySelector('[name="cardOrder"]:checked')?.value || 'sequential', now = Date.now();
    const sourceWords = $('studyDueOnly').checked ? group.words.filter(word => word.due <= now) : [...group.words];
    if (!sourceWords.length) { showToast(t('noDue'), 'warning'); return; }
    if (mode === 'test' && new Set(sourceWords.map(word => word.translate.toLocaleLowerCase())).size < 2) { showToast(t('testNeedsWords'), 'error'); return; }
    closeModal('studyModal'); beginStudy(group, mode, order, sourceWords);
  }
  function beginStudy(group, mode, order, sourceWords) {
    clearTimeout(SS.timer); const token = (SS.token || 0) + 1;
    SS = { ...emptySession(), token, group, mode, order, sourceWords: [...sourceWords], cards: C.buildCards(sourceWords, mode, order) };
    $('studyGroupName').textContent = group.name; $('studyFullscreen').hidden = false; setStudyPanels(); syncModalState(); showCard();
  }
  function setStudyPanels(results = false) {
    $('studyResults').hidden = !results; $('writeMode').hidden = results || SS.mode === 'flashcard' || SS.mode === 'test'; $('fcMode').hidden = results || SS.mode !== 'flashcard'; $('testMode').hidden = results || SS.mode !== 'test';
  }
  function exitStudy() {
    clearTimeout(SS.timer); const token = (SS.token || 0) + 1; SS = emptySession(); SS.token = token; $('studyFullscreen').hidden = true; syncModalState(); renderGroups(); if ($('page-stats').classList.contains('active')) renderStats();
  }
  function cardExtra(card, back = false) {
    if (back) return [card.original.grammar, card.original.example].filter(Boolean).join('\n');
    const reverse = SS.mode === 'translate-to-word' || SS.mode === 'dictation'; return reverse ? '' : card.original.grammar;
  }
  function setCardText(frontId, backId, card) {
    for (const [id, value] of [[frontId, card.front], [backId, card.back]]) { const element = $(id); element.textContent = value; element.dir = 'auto'; }
  }
  function showCard() {
    if (!SS.group) return;
    if (SS.idx >= SS.cards.length) { endStudy(); return; }
    SS.answered = false;
    const card = SS.cards[SS.idx], percent = SS.cards.length ? SS.idx / SS.cards.length * 100 : 0;
    $('progressFill').style.width = `${percent}%`; $('studyProgress').setAttribute('aria-valuenow', String(Math.round(percent))); $('progressText').textContent = `${SS.idx + 1}/${SS.cards.length}`;
    const reverse = SS.mode === 'translate-to-word' || SS.mode === 'dictation', wordLabel = reverse ? t('translation') : t('word'), translationLabel = reverse ? t('word') : t('translation');
    if (SS.mode === 'flashcard') {
      $('flashcardFC').classList.remove('flipped'); SS.fcFlipped = false; $('fcFrontLabel').textContent = wordLabel; $('fcBackLabel').textContent = translationLabel; setCardText('fcFrontWord', 'fcBackWord', card);
      $('fcFrontExtra').textContent = cardExtra(card); $('fcBackExtra').textContent = cardExtra(card, true); setFlashcardControls(false);
    } else if (SS.mode === 'test') renderTestCard(card);
    else {
      $('flashcard').classList.remove('flipped'); $('cardFrontLabel').textContent = wordLabel; $('cardBackLabel').textContent = translationLabel; setCardText('cardFrontWord', 'cardBackWord', card);
      $('cardFrontExtra').textContent = cardExtra(card); $('cardBackExtra').textContent = cardExtra(card, true); $('answerInput').value = ''; $('answerFeedback').className = ''; $('answerFeedback').textContent = '';
      SS.hintLevel = appData.settings.autoHint ? 1 : 0; renderHint(); setWriteControls(false);
      setTimeout(() => { if (SS.group && !SS.answered && !$('writeMode').hidden) $('answerInput').focus(); }, 60);
    }
  }
  function setWriteControls(disabled) { $('answerInput').disabled = disabled; $('checkAnswerBtn').disabled = disabled; $('hintBtn').disabled = disabled; $('skipBtn').disabled = disabled; }
  function setFlashcardControls(disabled) { $('fcDunnoBtn').disabled = disabled; $('fcKnowBtn').disabled = disabled; $('fcSkipBtn').disabled = disabled; }
  function handleAnswerKey(event) { if (event.key === 'Enter') { event.preventDefault(); checkAnswer(); } }
  function checkAnswer() {
    if (!SS.group || SS.answered || SS.mode === 'flashcard' || SS.mode === 'test') return;
    const card = SS.cards[SS.idx], user = $('answerInput').value, result = C.evaluateAnswer(user, card.accepted, appData.settings, SS.mode === 'dictation');
    if (result === 'empty') return;
    SS.answered = true; setWriteControls(true); recordResult(result, user.trim());
    const feedback = $('answerFeedback'); feedback.className = result;
    if (result === 'correct') feedback.textContent = `✓ ${card.expected}`;
    if (result === 'almost') feedback.textContent = `△ ${t('almostFeedback', { answer: card.expected })}`;
    if (result === 'wrong') feedback.textContent = `✗ ${card.expected}`;
    if (result !== 'correct') $('flashcard').classList.add('flipped'); scheduleNext(result === 'correct' ? 750 : 1700);
  }
  function recordResult(result, given = '') {
    const card = SS.cards[SS.idx]; if (!card) return;
    SS[result]++; C.updateWordProgress(card.original, result);
    if (result === 'wrong' || result === 'almost') { SS.wrongWords.push({ question: card.front, correct: card.expected, given, original: card.original }); if (!card.requeued) SS.cards.push({ ...card, requeued: true }); }
    saveData();
  }
  function scheduleNext(delay) {
    clearTimeout(SS.timer); const token = SS.token;
    SS.timer = setTimeout(() => { if (SS.token === token && SS.group && !$('studyFullscreen').hidden) nextCard(); }, delay);
  }
  function nextCard() { if (!SS.group) return; clearTimeout(SS.timer); SS.timer = null; SS.idx++; SS.answered = false; showCard(); }
  function skipCard() {
    if (!SS.group || SS.answered || !SS.cards[SS.idx]) return;
    SS.answered = true; if (SS.mode === 'flashcard') setFlashcardControls(true); else setWriteControls(true); recordResult('skipped'); nextCard();
  }
  function showHint() {
    if (!SS.group || SS.answered) return;
    const card = SS.cards[SS.idx]; if (!card) return; SS.hintLevel = Math.min(SS.hintLevel + 2, card.expected.length); renderHint();
  }
  function renderHint() {
    const strip = $('hintStrip'); strip.replaceChildren(); const card = SS.cards[SS.idx]; if (!card || !SS.hintLevel || SS.mode === 'test' || SS.mode === 'flashcard') return;
    [...card.expected].forEach((char, index) => {
      const letter = document.createElement('span'); letter.className = `hint-letter${char === ' ' ? ' space-letter' : index < SS.hintLevel ? ' revealed' : ''}`;
      letter.textContent = char === ' ' ? '' : index < SS.hintLevel ? char : '·'; strip.appendChild(letter);
    });
  }
  function flipFC() {
    if (!SS.group || SS.mode !== 'flashcard' || SS.answered) return;
    SS.fcFlipped = !SS.fcFlipped; $('flashcardFC').classList.toggle('flipped', SS.fcFlipped); $('flashcardFC').setAttribute('aria-label', SS.fcFlipped ? $('fcBackWord').textContent : $('fcFrontWord').textContent);
  }
  function rateFC(knew) {
    if (!SS.group || SS.mode !== 'flashcard' || SS.answered) return;
    SS.answered = true; setFlashcardControls(true); recordResult(knew ? 'correct' : 'wrong'); nextCard();
  }
  function renderTestCard(card) {
    SS.currentOptions = C.buildTestOptions(SS.cards, SS.idx);
    const question = document.createElement('div'); question.className = 'test-question';
    const word = document.createElement('div'); word.className = 'test-q-word'; word.textContent = card.front; word.dir = 'auto'; question.appendChild(word);
    if (card.original.grammar) { const extra = document.createElement('div'); extra.className = 'test-q-extra'; extra.textContent = card.original.grammar; question.appendChild(extra); }
    const options = document.createElement('div'); options.className = 'test-options';
    SS.currentOptions.forEach((option, index) => {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'test-option'; button.dataset.optionIndex = String(index); button.textContent = option; button.dir = 'auto'; options.appendChild(button);
    });
    question.appendChild(options); const container = $('testQuestion'); container.replaceChildren(question);
    if (SS.currentOptions.length < 4) { const note = document.createElement('p'); note.className = 'test-note'; note.textContent = t('testShort', { count: SS.currentOptions.length }); container.appendChild(note); }
  }
  function checkTestAnswer(index) {
    if (!SS.group || SS.mode !== 'test' || SS.answered) return;
    const card = SS.cards[SS.idx], chosen = SS.currentOptions[index]; if (typeof chosen !== 'string') return;
    SS.answered = true; const correct = chosen === card.expected;
    document.querySelectorAll('#testQuestion .test-option').forEach(button => {
      button.disabled = true; const option = SS.currentOptions[Number(button.dataset.optionIndex)];
      if (option === card.expected) button.classList.add('correct-ans'); else if (Number(button.dataset.optionIndex) === index) button.classList.add('wrong-ans');
    });
    recordResult(correct ? 'correct' : 'wrong', chosen); scheduleNext(900);
  }
  function endStudy() {
    if (!SS.group) return;
    clearTimeout(SS.timer); SS.answered = true; const groupId = SS.group.id;
    const stats = appData.stats.byGroup[groupId] || { sessions: 0, correct: 0, almost: 0, wrong: 0, skipped: 0 };
    stats.sessions++; stats.correct += SS.correct; stats.almost += SS.almost; stats.wrong += SS.wrong; stats.skipped += SS.skipped; appData.stats.byGroup[groupId] = stats;
    appData.stats.sessions++; appData.stats.totalCorrect += SS.correct; appData.stats.totalAlmost += SS.almost; appData.stats.totalWrong += SS.wrong; appData.stats.totalSkipped += SS.skipped;
    const total = SS.correct + SS.almost + SS.wrong + SS.skipped;
    appData.stats.sessions_log.unshift({ groupId, groupName: SS.group.name, mode: SS.mode, total, correct: SS.correct, almost: SS.almost, wrong: SS.wrong, skipped: SS.skipped, date: Date.now() });
    appData.stats.sessions_log = appData.stats.sessions_log.slice(0, 50);
    const uniqueMistakes = new Map(); for (const item of SS.wrongWords) uniqueMistakes.set(item.original.id, item.original); SS.mistakeWords = [...uniqueMistakes.values()]; saveData(); setStudyPanels(true);
    $('progressFill').style.width = '100%'; $('studyProgress').setAttribute('aria-valuenow', '100'); const percent = C.calculateAccuracy(SS);
    $('resultsScore').textContent = `${SS.correct}/${total}`; $('resultsScore').setAttribute('aria-label', t('sessionAttempts', { correct: SS.correct, total })); $('resultsPct').textContent = `${percent}%`;
    $('resCorrect').textContent = SS.correct; $('resAlmost').textContent = SS.almost; $('resWrong').textContent = SS.wrong; $('resSkip').textContent = SS.skipped;
    let emoji = '😅', title = t('low');
    if (percent >= 90) { emoji = '🏆'; title = t('excellent'); } else if (percent >= 70) { emoji = '🎉'; title = t('good'); } else if (percent >= 50) { emoji = '💪'; title = t('ok'); }
    $('resultsEmoji').textContent = emoji; $('resultsTitle').textContent = title;
    const wrongList = $('wrongListWrap'); wrongList.replaceChildren();
    if (SS.wrongWords.length) {
      const heading = document.createElement('div'); heading.className = 'wrong-list-title'; heading.textContent = t('wrongWords'); wrongList.appendChild(heading);
      SS.wrongWords.slice(0, 12).forEach(item => { const row = document.createElement('div'); row.className = 'wrong-item'; row.textContent = `${item.question} → ${item.correct}${item.given ? ` (${item.given})` : ''}`; wrongList.appendChild(row); });
    }
    $('repeatMistakesBtn').hidden = !SS.mistakeWords.length; $('restartStudyBtn').focus();
  }
  function restartStudy() { if (!SS.group) return; beginStudy(SS.group, SS.mode, SS.order, SS.sourceWords); }
  function repeatMistakes() {
    if (!SS.group || !SS.mistakeWords.length) return;
    let mode = SS.mode;
    if (mode === 'test' && new Set(SS.mistakeWords.map(word => word.translate.toLocaleLowerCase())).size < 2) mode = 'word-to-translate';
    beginStudy(SS.group, mode, SS.order, SS.mistakeWords);
  }
  function renderStats() {
    const stats = appData.stats;
    $('stSessions').textContent = stats.sessions; $('stCorrect').textContent = stats.totalCorrect; $('stAlmost').textContent = stats.totalAlmost;
    $('stAcc').textContent = `${C.calculateAccuracy({ correct: stats.totalCorrect, almost: stats.totalAlmost, wrong: stats.totalWrong, skipped: stats.totalSkipped })}%`;
    $('stDue').textContent = appData.groups.reduce((sum, group) => sum + C.getGroupLearning(group).due, 0);
    const groupWrap = $('groupStatsWrap'), groupIds = Object.keys(stats.byGroup);
    if (!groupIds.length) groupWrap.innerHTML = `<p class="empty-note">${esc(t('noStats'))}</p>`;
    else groupWrap.innerHTML = groupIds.map(id => {
      const group = appData.groups.find(item => item.id === id), value = groupStats(id), accuracy = C.calculateAccuracy(value), color = accuracyColor(accuracy), learning = group ? C.getGroupLearning(group) : null;
      return `<div class="stat-bar-wrap"><div class="stat-bar-label"><span>${esc(group ? group.name : t('deletedGroup'))}</span><span style="color:${color}">${accuracy}% · ${value.sessions} ${esc(t('sessions').toLocaleLowerCase())}</span></div><div class="stat-bar-track"><div class="stat-bar-fill" style="width:${accuracy}%;background:${color}"></div></div>${learning ? `<div class="stat-learning">${learning.learned}/${group.words.length} ${esc(t('learned'))} · ${learning.due} ${esc(t('due').toLocaleLowerCase())} · ${learning.difficult} ${esc(t('difficult'))}</div>` : ''}</div>`;
    }).join('');
    const recentWrap = $('recentSessionsWrap');
    if (!stats.sessions_log.length) { recentWrap.innerHTML = `<p class="empty-note">${esc(t('noStats'))}</p>`; return; }
    const icons = { flashcard: '🃏', 'word-to-translate': '🔤', 'translate-to-word': '🔄', dictation: '✍️', test: '📝' };
    recentWrap.innerHTML = `<div class="recent-list">${stats.sessions_log.slice(0, 10).map(session => {
      const percent = C.calculateAccuracy(session), color = accuracyColor(percent);
      return `<div class="glass-sm recent-session"><span class="recent-icon">${icons[session.mode] || '✏️'}</span><div class="recent-main"><div class="recent-title">${esc(session.groupName)}</div><div class="recent-date">${esc(new Date(session.date).toLocaleDateString(appData.settings.siteLang))}</div></div><div class="recent-result"><div class="recent-pct" style="color:${color}">${percent}%</div><div class="recent-count">${session.correct}/${session.total}</div></div></div>`;
    }).join('')}</div>`;
  }
  function trapFocus(event, modal) {
    const focusable = [...modal.querySelectorAll('button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), summary, [tabindex]:not([tabindex="-1"])')].filter(element => element.getClientRects().length && !element.closest('[inert]'));
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
  function bindEvents() {
    document.querySelectorAll('.nav-btn').forEach(button => button.addEventListener('click', () => showPage(button.dataset.page)));
    $('themeBtn').addEventListener('click', () => { appData.settings.darkMode = !appData.settings.darkMode; applySettings(); saveData(); });
    $('settingsBtn').addEventListener('click', () => { applySettings(); openModal('settingsModal'); });
    $('createGroupBtn').addEventListener('click', openCreateModal);
    $('importBtn').addEventListener('click', () => { $('importForm').reset(); openModal('importModal'); });
    $('groupForm').addEventListener('submit', saveGroup); $('importForm').addEventListener('submit', importGroup); $('addWordBtn').addEventListener('click', () => addWordRow());
    $('tab-one').addEventListener('click', () => switchWordTab('one-by-one')); $('tab-bulk').addEventListener('click', () => switchWordTab('bulk'));
    document.querySelector('.tab-switcher').addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); const bulk = $('tab-bulk').getAttribute('aria-selected') === 'true'; switchWordTab(bulk ? 'one-by-one' : 'bulk'); $(bulk ? 'tab-one' : 'tab-bulk').focus(); }
    });
    for (const id of ['gNativeLang', 'gTargetLang']) $(id).addEventListener('change', () => { updateWordRowLabels(); updateGroupTranslationNote(); });
    $('wordsEditor').addEventListener('click', event => {
      const button = event.target.closest('[data-row-action]'); if (!button) return;
      if (button.dataset.rowAction === 'remove') button.closest('.word-row').remove(); if (button.dataset.rowAction === 'translate') autoTranslateRow(button);
    });
    $('bulkInput').addEventListener('input', onBulkInput); $('bulkTranslateBtn').addEventListener('click', translateAllBulk); $('copyShareBtn').addEventListener('click', copyShareCode);
    $('backupBtn').addEventListener('click', backupData); $('restoreInput').addEventListener('change', restoreData); $('deleteAllBtn').addEventListener('click', confirmDeleteAll);
    for (const id of ['darkToggle', 'caseToggle', 'diacriticsToggle', 'fuzzyToggle', 'autoHintToggle', 'nativeLangSel', 'targetLangSel', 'translationProvider']) $(id).addEventListener('change', saveSettings);
    for (const id of ['onbNativeLang', 'onbTargetLang']) $(id).addEventListener('change', updateOnboardingInfo);
    document.querySelectorAll('[data-onb-provider]').forEach(button => button.addEventListener('click', () => setOnboardingProvider(button.dataset.onbProvider)));
    $('onbSaveBtn').addEventListener('click', completeOnboarding);
    $('onbSkipBtn').addEventListener('click', skipOnboarding);
    $('preloadModelBtn').addEventListener('click', preloadSettingsModel);
    $('clearModelsBtn').addEventListener('click', clearDownloadedModels);
    $('siteLangGrid').addEventListener('click', event => {
      const button = event.target.closest('[data-lang]'); if (!button) return;
      appData.settings.siteLang = button.dataset.lang; saveData(); applyI18n(); renderGroups(); if ($('page-stats').classList.contains('active')) renderStats(); showToast(t('languageChanged'), 'success');
    });
    $('groupsGrid').addEventListener('click', event => {
      const button = event.target.closest('[data-action]'); if (!button) return;
      const { action, id } = button.dataset;
      if (action === 'create') openCreateModal(); if (action === 'sample') addSampleGroup(); if (action === 'study') openStudyModal(id); if (action === 'edit') editGroup(id); if (action === 'share') shareGroup(id); if (action === 'delete') deleteGroup(id);
    });
    document.querySelectorAll('.mode-card').forEach(button => button.addEventListener('click', () => selectMode(button.dataset.mode)));
    $('startStudyBtn').addEventListener('click', startStudy); $('exitStudyBtn').addEventListener('click', exitStudy); $('resultsBackBtn').addEventListener('click', exitStudy); $('restartStudyBtn').addEventListener('click', restartStudy); $('repeatMistakesBtn').addEventListener('click', repeatMistakes);
    $('answerInput').addEventListener('keydown', handleAnswerKey); $('checkAnswerBtn').addEventListener('click', checkAnswer); $('hintBtn').addEventListener('click', showHint); $('skipBtn').addEventListener('click', skipCard); $('fcSkipBtn').addEventListener('click', skipCard);
    $('fcDunnoBtn').addEventListener('click', () => rateFC(false)); $('fcKnowBtn').addEventListener('click', () => rateFC(true)); $('flashcardFC').addEventListener('click', flipFC);
    $('flashcardFC').addEventListener('keydown', event => { if (event.key === ' ' || event.key === 'Enter') { event.preventDefault(); flipFC(); } });
    $('testQuestion').addEventListener('click', event => { const button = event.target.closest('[data-option-index]'); if (button) checkTestAnswer(Number(button.dataset.optionIndex)); });
    document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => closeModal(button.dataset.close)));
    document.querySelectorAll('.modal-overlay').forEach(modal => modal.addEventListener('click', event => { if (event.target === modal && modal.id !== 'onboardingModal') closeModal(modal.id); }));
    $('confirmOkBtn').addEventListener('click', () => { const action = confirmAction; confirmAction = null; closeModal('confirmModal'); if (action) action(); });
    document.addEventListener('keydown', event => {
      const openModals = [...document.querySelectorAll('.modal-overlay')].filter(modal => !modal.hidden), top = openModals[openModals.length - 1];
      if (top) { if (event.key === 'Escape') { event.preventDefault(); if (top.id !== 'onboardingModal') closeModal(top.id); } else if (event.key === 'Tab') trapFocus(event, top); return; }
      if (!$('studyFullscreen').hidden) {
        if (event.key === 'Escape') { event.preventDefault(); exitStudy(); }
        else if (SS.mode === 'flashcard' && !event.repeat && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) { if (event.key === 'ArrowRight') rateFC(true); if (event.key === 'ArrowLeft') rateFC(false); }
      }
    });
  }
  loadData(); bindEvents(); applySettings(); showPage('groups');
  if (!appData.settings.onboardingCompleted) setTimeout(openOnboarding, 100);
  if (loadWarning) setTimeout(() => showToast(t('loadError'), 'warning', 8000), 100);
})();
