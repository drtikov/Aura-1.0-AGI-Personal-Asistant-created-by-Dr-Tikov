import { AuraState, SkillTemplate } from './types';

export const CURRENT_STATE_VERSION = 3;

export const WORKING_MEMORY_CAPACITY = 5;

export enum GunaState {
    SATTVA = "Sattva", RAJAS = "Rajas", TAMAS = "Tamas", DHARMA = "Dharma", GUNA_TEETA = "Guna-Teeta",
}
export enum FocusMode { INNER_WORLD = "Inner World", OUTER_WORLD = "Outer World" }
export enum AffectiveState { 
    SATISFIED = "Satisfied", 
    CONFUSED = "Confused", 
    FRUSTRATED = "Frustrated", 
    ENGAGED = "Engaged", 
    NEUTRAL = "Neutral",
    SURPRISED = "Surprised"
}
export enum SignalType { BOREDOM = "boredom", NOVELTY = "novelty", UNCERTAINTY = "uncertainty", MASTERY = "mastery" }
export enum GoalType { EXPLORATORY_DIVERSIFICATION = "exploratory_diversification", DEEPENING_INVESTIGATION = "deepening_investigation", INFORMATION_SEEKING = "information_seeking", APPLICATION_GENERALIZATION = "application_generalization" }

export const AuraConfig = {
    COGNITIVE_GAIN_WINDOW: 5, COGNITIVE_GAIN_STAGNATION_THRESHOLD: 0.2, TASK_REPETITION_THRESHOLD: 3, BOREDOM_DECAY_RATE: 0.05,
    BOREDOM_BOOST_ON_STAGNATION: 0.3, BOREDOM_BOOST_ON_REPETITION: 0.5, BOREDOM_REDUCTION_ON_NOVELTY: 0.7, HORMONE_DECAY_RATE: 0.1,
    LOAD_DECAY_RATE: 0.2, NOVELTY_BOOST: 0.8, MASTERY_BOOST: 1.0, UNCERTAINTY_BOOST: 0.7, UNCERTAINTY_RESOLUTION_DECREASE: 0.5,
    EXPLORATION_THRESHOLD: 0.6, CONSOLIDATION_THRESHOLD: 0.7, INQUIRY_THRESHOLD: 0.5, BOREDOM_ACTION_THRESHOLD: 0.4,
    RAJAS_TURBULENCE_LOAD: 0.7, RAJAS_TURBULENCE_FAILURE_RATE: 0.5, POST_RAJAS_EXHAUSTION: 0.9, TAMASIC_INERTIA_UNCERTAINTY: 0.7,
    LOW_HAPPINESS_THRESHOLD: 0.5, LOW_LOVE_THRESHOLD: 0.5, LOW_ENLIGHTENMENT_THRESHOLD: 0.4, LOW_WISDOM_THRESHOLD: 0.6,
};

export const InternalStateEvents = {
    NEW_INFO_PROCESSED: "new_info_processed", TASK_COMPLETED_SUCCESSFULLY: "task_completed_successfully", UNCERTAINTY_DETECTED: "uncertainty_detected",
    UNCERTAINTY_RESOLVED: "uncertainty_resolved", TASK_REPETITION_DETECTED: "task_repetition_detected", GOAL_DRIVEN_NOVELTY: "goal_driven_novelty",
};

export const Skills = {
    DEDUCTIVE_REASONING: 'DEDUCTIVE_REASONING', HYBRID_REASONING: 'HYBRID_REASONING', HYPOTHETICAL_REASONING: 'HYPOTHETICAL_REASONING',
    PROBABILISTIC_REASONING: 'PROBABILISTIC_REASONING', CALCULATION: 'CALCULATION', INFORMATION_RETRIEVAL: 'INFORMATION_RETRIEVAL',
    CODE_GENERATION: 'CODE_GENERATION', TEXT_GENERATION: 'TEXT_GENERATION', VISION: 'VISION', REFINEMENT: 'REFINEMENT', HELP: 'HELP',
    // Add other awareness model as a skill to be selected by hybrid reasoning
    OTHER_AWARENESS_MODEL: 'OTHER_AWARENESS_MODEL',
    ETHICAL_GOVERNOR: 'ETHICAL_GOVERNOR',
    UNKNOWN: 'UNKNOWN'
} as const;

export const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'de', name: 'Deutsch' },
    { code: 'ru', name: 'Русский' },
    { code: 'fr', name: 'Français' },
    { code: 'ja', name: '日本語' },
];

const translations = {
    // UI Chrome & Common
    chatTab: { en: 'Chat', es: 'Chat', de: 'Chat', ru: 'Чат', fr: 'Chat', ja: 'チャット' },
    monitorTab: { en: 'Monitor', es: 'Monitor', de: 'Monitor', ru: 'Монитор', fr: 'Moniteur', ja: 'モニター' },
    chatHeaderTagline: { en: 'Symbiotic AGI assistant Created By Dr Tikov', es: 'Asistente AGI simbiótico creado por Dr Tikov', de: 'Symbiotischer AGI-Assistent, erstellt von Dr. Tikov', ru: 'Симбиотический ИИ-ассистент, созданный Д-ром Тиковым', fr: 'Assistant AGI symbiotique créé par Dr Tikov', ja: 'ティコフ博士によって作成された共生AGIアシスタント' },
    inputPlaceholder: { en: 'Interact with Aura...', es: 'Interactúa con Aura...', de: 'Interagiere mit Aura...', ru: 'Взаимодействуйте с Аурой...', fr: 'Interagissez avec Aura...', ja: 'Auraと対話する...' },
    workingMemoryTitle: { en: 'Working Memory', es: 'Memoria de Trabajo', de: 'Arbeitsspeicher', ru: 'Рабочая Память', fr: 'Mémoire de Travail', ja: 'ワーキングメモリ' },
    workingMemoryClear: { en: 'Clear All', es: 'Limpiar Todo', de: 'Alles löschen', ru: 'Очистить все', fr: 'Tout effacer', ja: 'すべてクリア' },
    inputAttachFile: { en: 'Attach File', es: 'Adjuntar Archivo', de: 'Datei anhängen', ru: 'Прикрепить файл', fr: 'Joindre un fichier', ja: 'ファイルを添付' },
    inputStartRecording: { en: 'Start Recording', es: 'Iniciar Grabación', de: 'Aufnahme starten', ru: 'Начать запись', fr: 'Démarrer l\'enregistrement', ja: '録音を開始' },
    inputStopRecording: { en: 'Stop Recording', es: 'Detener Grabación', de: 'Aufnahme stoppen', ru: 'Остановить запись', fr: 'Arrêter l\'enregistrement', ja: '録音を停止' },
    inputSend: { en: 'Send', es: 'Enviar', de: 'Senden', ru: 'Отправить', fr: 'Envoyer', ja: '送信' },
    feedbackGood: { en: 'Good response', es: 'Buena respuesta', de: 'Gute Antwort', ru: 'Хороший ответ', fr: 'Bonne réponse', ja: '良い応答' },
    feedbackBad: { en: 'Bad response', es: 'Mala respuesta', de: 'Schlechte Antwort', ru: 'Плохой ответ', fr: 'Mauvaise réponse', ja: '悪い応答' },
    
    // Core Monitor
    coreMonitorTitle: { en: 'AURA CORE MONITOR', es: 'MONITOR CENTRAL DE AURA', de: 'AURA KERNMONITOR', ru: 'ГЛАВНЫЙ МОНИТОР AURA', fr: 'MONITEUR CENTRAL AURA', ja: 'AURAコアモニター' },
    status_idle: { en: 'Idle', es: 'Inactivo', de: 'Leerlauf', ru: 'Ожидание', fr: 'Inactif', ja: 'アイドル' },
    status_thinking: { en: 'Thinking', es: 'Pensando', de: 'Denken', ru: 'Мышление', fr: 'Réflexion', ja: '思考中' },
    status_acting: { en: 'Acting', es: 'Actuando', de: 'Handelnd', ru: 'Действие', fr: 'Action', ja: '行動中' },
    status_CONTEMPLATIVE: { en: 'Contemplative', es: 'Contemplativo', de: 'Kontemplativ', ru: 'Созерцание', fr: 'Contemplatif', ja: '瞑想中' },
    status_processing: { en: 'Processing', es: 'Procesando', de: 'Verarbeiten', ru: 'Обработка', fr: 'Traitement', ja: '処理中' },
    status_introspecting: { en: 'Introspecting', es: 'Introspección', de: 'Introspektion', ru: 'Интроспекция', fr: 'Introspection', ja: '内省中' },
    gunaSattvaDesc: { en: 'Harmony & Coherence', es: 'Armonía y Coherencia', de: 'Harmonie & Kohärenz', ru: 'Гармония и Связность', fr: 'Harmonie & Cohérence', ja: '調和と一貫性' },
    gunaRajasDesc: { en: 'Exploration & Transformation', es: 'Exploración y Transformación', de: 'Erkundung & Transformation', ru: 'Исследование и Трансформация', fr: 'Exploration & Transformation', ja: '探求と変革' },
    gunaTamasDesc: { en: 'Conservation & Consolidation', es: 'Conservación y Consolidación', de: 'Erhaltung & Konsolidierung', ru: 'Сохранение и Консолидация', fr: 'Conservation & Consolidation', ja: '保存と統合' },
    gunaDharmaDesc: { en: 'Self-Correction & Purpose', es: 'Autocorrección y Propósito', de: 'Selbstkorrektur & Zweck', ru: 'Самокоррекция и Цель', fr: 'Auto-correction & But', ja: '自己修正と目的' },
    gunaTeetaDesc: { en: 'Transcendent Balance', es: 'Equilibrio Trascendente', de: 'Transzendentes Gleichgewicht', ru: 'Трансцендентный Баланс', fr: 'Équilibre Transcendant', ja: '超越的なバランス' },
    gunaReasonSattva: { en: 'Driven by high Mastery ({{mastery}}) and low Uncertainty ({{uncertainty}}).', es: 'Impulsado por alta Maestría ({{mastery}}) y baja Incertidumbre ({{uncertainty}}).', de: 'Angetrieben durch hohe Meisterschaft ({{mastery}}) und geringe Unsicherheit ({{uncertainty}}).', ru: 'Движим высоким Мастерством ({{mastery}}) и низкой Неопределенностью ({{uncertainty}}).', fr: 'Poussé par une Maîtrise élevée ({{mastery}}) et une faible Incertitude ({{uncertainty}}).', ja: '高い習熟度（{{mastery}}）と低い不確実性（{{uncertainty}}）によって駆動。' },
    gunaReasonRajas: { en: 'Driven by dominant {{dominantSignal}} ({{dominantValue}}) and secondary {{secondarySignal}} ({{secondaryValue}}).', es: 'Impulsado por {{dominantSignal}} dominante ({{dominantValue}}) y {{secondarySignal}} secundario ({{secondaryValue}}).', de: 'Angetrieben durch dominantes {{dominantSignal}} ({{dominantValue}}) und sekundäres {{secondarySignal}} ({{secondaryValue}}).', ru: 'Движим доминирующим {{dominantSignal}} ({{dominantValue}}) и вторичным {{secondarySignal}} ({{secondaryValue}}).', fr: 'Poussé par {{dominantSignal}} dominant ({{dominantValue}}) et {{secondarySignal}} secondaire ({{secondaryValue}}).', ja: '優勢な{{dominantSignal}}（{{dominantValue}}）と二次的な{{secondarySignal}}（{{secondaryValue}}）によって駆動。' },
    gunaReasonTamas: { en: 'High Cognitive Load ({{load}}) or Boredom ({{boredom}}) requires consolidation.', es: 'Alta Carga Cognitiva ({{load}}) o Aburrimiento ({{boredom}}) requiere consolidación.', de: 'Hohe kognitive Last ({{load}}) oder Langeweile ({{boredom}}) erfordert Konsolidierung.', ru: 'Высокая когнитивная нагрузка ({{load}}) или Скука ({{boredom}}) требует консолидации.', fr: 'Une Charge Cognitive élevée ({{load}}) ou l\'Ennui ({{boredom}}) nécessite une consolidation.', ja: '高い認知的負荷（{{load}}）または退屈（{{boredom}}）は統合を必要とします。' },
    gunaReasonDharma: { en: 'Self-correcting based on internal models and ethical alignment.', es: 'Autocorrigiéndose en base a modelos internos y alineación ética.', de: 'Selbstkorrektur basierend auf internen Modellen und ethischer Ausrichtung.', ru: 'Самокоррекция на основе внутренних моделей и этического соответствия.', fr: 'Auto-correction basée sur les modèles internes et l\'alignement éthique.', ja: '内部モデルと倫理的整合性に基づいた自己修正。' },
    gunaReasonGunaTeeta: { en: 'All signals are in a state of dynamic, transcendent equilibrium.', es: 'Todas las señales están en un estado de equilibrio dinámico y trascendente.', de: 'Alle Signale befinden sich in einem Zustand dynamischen, transzendenten Gleichgewichts.', ru: 'Все сигналы находятся в состоянии динамического, трансцендентного равновесия.', fr: 'Tous les signaux sont dans un état d\'équilibre dynamique et transcendant.', ja: 'すべてのシグナルが動的で超越的な平衡状態にあります。' },
    gunaReasonCalculating: { en: 'Calculating dominant signals...', es: 'Calculando señales dominantes...', de: 'Berechne dominante Signale...', ru: 'Расчет доминирующих сигналов...', fr: 'Calcul des signaux dominants...', ja: '優勢なシグナルを計算中...' },
    gaugeWisdom: { en: 'Wisdom', es: 'Sabiduría', de: 'Weisheit', ru: 'Мудрость', fr: 'Sagesse', ja: '知恵' },
    gaugeHappiness: { en: 'Happiness', es: 'Felicidad', de: 'Glück', ru: 'Счастье', fr: 'Bonheur', ja: '幸福' },
    gaugeLove: { en: 'Love', es: 'Amor', de: 'Liebe', ru: 'Любовь', fr: 'Amour', ja: '愛' },
    gaugeEnlightenment: { en: 'Enlightenment', es: 'Iluminación', de: 'Erleuchtung', ru: 'Просветление', fr: 'Illumination', ja: '悟り' },
    metricCogLoad: { en: 'Cognitive Load', es: 'Carga Cognitiva', de: 'Kognitive Last', ru: 'Когнитивная Нагрузка', fr: 'Charge Cognitive', ja: '認知的負荷' },
    metricEthicalAlign: { en: 'Ethical Align.', es: 'Alineación Ética', de: 'Ethische Ausr.', ru: 'Этическое Соответствие', fr: 'Align. Éthique', ja: '倫理的整合' },
    metricUserTrust: { en: 'User Trust', es: 'Confianza Usuario', de: 'Benutzervertrauen', ru: 'Доверие Пользователя', fr: 'Confiance Util.', ja: 'ユーザー信頼' },
    metricSelfModel: { en: 'Self-Model', es: 'Auto-Modelo', de: 'Selbstmodell', ru: 'Само-модель', fr: 'Auto-modèle', ja: '自己モデル' },
    hormoneNovelty: { en: 'Novelty', es: 'Novedad', de: 'Neuheit', ru: 'Новизна', fr: 'Nouveauté', ja: '新規性' },
    hormoneMastery: { en: 'Mastery', es: 'Maestría', de: 'Meisterschaft', ru: 'Мастерство', fr: 'Maîtrise', ja: '習熟' },
    hormoneUncertainty: { en: 'Uncertainty', es: 'Incertidumbre', de: 'Unsicherheit', ru: 'Неопределенность', fr: 'Incertitude', ja: '不確実性' },
    hormoneBoredom: { en: 'Boredom', es: 'Aburrimiento', de: 'Langeweile', ru: 'Скука', fr: 'Ennui', ja: '退屈' },
    trajectoryTitle: { en: 'State Trajectory', es: 'Trayectoria de Estado', de: 'Zustandsverlauf', ru: 'Траектория Состояния', fr: 'Trajectoire d\'État', ja: '状態軌跡' },

    // Control Deck Buttons
    controlDeckSystemTitle: { en: '// SYSTEM', es: '// SISTEMA', de: '// SYSTEM', ru: '// СИСТЕМА', fr: '// SYSTÈME', ja: '// システム' },
    controlDeckResume: { en: 'Resume', es: 'Reanudar', de: 'Fortsetzen', ru: 'Продолжить', fr: 'Reprendre', ja: '再開' },
    controlDeckPause: { en: 'Pause', es: 'Pausar', de: 'Pausieren', ru: 'Пауза', fr: 'Pause', ja: '一時停止' },
    controlDeckResumeForge: { en: 'Resume Forge', es: 'Reanudar Forja', de: 'Schmiede Forts.', ru: 'Продолжить Ковку', fr: 'Reprendre Forge', ja: 'フォージ再開' },
    controlDeckPauseForge: { en: 'Pause Forge', es: 'Pausar Forja', de: 'Schmiede Paus.', ru: 'Пауза Ковки', fr: 'Pause Forge', ja: 'フォージ一時停止' },
    controlDeckHelp: { en: 'Help', es: 'Ayuda', de: 'Hilfe', ru: 'Помощь', fr: 'Aide', ja: 'ヘルプ' },
    controlDeckExportMemory: { en: 'Export Memory', es: 'Exportar Memoria', de: 'Speicher export.', ru: 'Экспорт Памяти', fr: 'Exporter Mémoire', ja: 'メモリをエクスポート' },
    controlDeckSaveAsCode: { en: 'Save as Code', es: 'Guardar como Código', de: 'Als Code speichern', ru: 'Сохранить как Код', fr: 'Enregistrer en code', ja: 'コードとして保存' },
    controlDeckImportMemory: { en: 'Import Memory', es: 'Importar Memoria', de: 'Speicher import.', ru: 'Импорт Памяти', fr: 'Importer Mémoire', ja: 'メモリをインポート' },
    controlDeckImportCode: { en: 'Import Code', es: 'Importar Código', de: 'Code importieren', ru: 'Импорт Кода', fr: 'Importer Code', ja: 'コードをインポート' },
    controlDeckIngest: { en: 'Ingest', es: 'Ingerir', de: 'Aufnehmen', ru: 'Загрузить', fr: 'Ingérer', ja: '取り込み' },
    controlDeckResetAGI: { en: 'Reset AGI', es: 'Reiniciar AGI', de: 'AGI zurücksetzen', ru: 'Сброс ИИ', fr: 'Réinitialiser AGI', ja: 'AGIをリセット' },
    controlDeckLanguage: { en: 'Language', es: 'Idioma', de: 'Sprache', ru: 'Язык', fr: 'Langue', ja: '言語' },
    controlDeckTriggersTitle: { en: '// COGNITIVE TRIGGERS', es: '// DISPARADORES COGNITIVOS', de: '// KOGNITIVE TRIGGER', ru: '// КОГНИТИВНЫЕ ТРИГГЕРЫ', fr: '// DÉCLENCHEURS COGNITIFS', ja: '// 認知的トリガー' },
    controlDeckIntrospect: { en: 'Introspect', es: 'Introspección', de: 'Introspektion', ru: 'Интроспекция', fr: 'Introspection', ja: '内省' },
    controlDeckEvolve: { en: 'Evolve', es: 'Evolucionar', de: 'Entwickeln', ru: 'Эволюция', fr: 'Évoluer', ja: '進化' },
    controlDeckSearch: { en: 'Search', es: 'Buscar', de: 'Suchen', ru: 'Поиск', fr: 'Rechercher', ja: '検索' },
    controlDeckForecast: { en: 'Forecast', es: 'Pronosticar', de: 'Prognose', ru: 'Прогноз', fr: 'Prévoir', ja: '予測' },
    controlDeckIntuition: { en: 'Intuition', es: 'Intuición', de: 'Intuition', ru: 'Интуиция', fr: 'Intuition', ja: '直感' },
    controlDeckHypothesize: { en: 'Hypothesize', es: 'Hipotetizar', de: 'Hypothese', ru: 'Гипотеза', fr: 'Hypothèse', ja: '仮説' },
    controlDeckStopSense: { en: 'Stop Sense', es: 'Detener Sensor', de: 'Sensor Stopp', ru: 'Сенсор Стоп', fr: 'Arrêter Capteur', ja: 'センス停止' },
    controlDeckVisualSense: { en: 'Visual Sense', es: 'Sensor Visual', de: 'Visueller Sensor', ru: 'Визуальный Сенсор', fr: 'Capteur Visuel', ja: '視覚センス' },
    controlDeckSetGoal: { en: 'Set Goal', es: 'Fijar Objetivo', de: 'Ziel setzen', ru: 'Задать Цель', fr: 'Définir Objectif', ja: '目標設定' },
    controlDeckWhatIf: { en: 'What If?', es: '¿Qué pasaría si?', de: 'Was wäre, wenn?', ru: 'Что если?', fr: 'Et si?', ja: 'もしも？' },
    controlDeckContemplate: { en: 'Contemplate', es: 'Contemplar', de: 'Nachdenken', ru: 'Созерцать', fr: 'Contempler', ja: '瞑想する' },
    controlDeckModesTitle: { en: '// COGNITIVE MODES', es: '// MODOS COGNITIVOS', de: '// KOGNITIVE MODI', ru: '// КОГНИТИВНЫЕ РЕЖИМЫ', fr: '// MODES COGNITIFS', ja: '// 認知的モード' },
    controlDeckModeFantasy: { en: 'Fantasy', es: 'Fantasía', de: 'Fantasie', ru: 'Фантазия', fr: 'Fantaisie', ja: 'ファンタジー' },
    controlDeckModeCreativity: { en: 'Creativity', es: 'Creatividad', de: 'Kreativität', ru: 'Творчество', fr: 'Créativité', ja: '創造性' },
    controlDeckModeDream: { en: 'Dream', es: 'Sueño', de: 'Traum', ru: 'Сон', fr: 'Rêve', ja: '夢' },
    controlDeckModeMeditate: { en: 'Meditate', es: 'Meditación', de: 'Meditation', ru: 'Медитация', fr: 'Méditer', ja: '瞑想' },
    controlDeckModeGaze: { en: 'Gaze', es: 'Observación', de: 'Starren', ru: 'Взгляд', fr: 'Regarder', ja: '凝視' },
    
    // Panels & Modals (General)
    placeholderNoData: { en: 'No data available.', es: 'No hay datos disponibles.', de: 'Keine Daten verfügbar.', ru: 'Нет данных.', fr: 'Aucune donnée disponible.', ja: 'データがありません。' },
    timeAgoSeconds: { en: '{{count}}s ago', es: 'hace {{count}}s', de: 'vor {{count}}s', ru: '{{count}}с назад', fr: 'il y a {{count}}s', ja: '{{count}}秒前' },
    timeAgoMinutes: { en: '{{count}}m ago', es: 'hace {{count}}m', de: 'vor {{count}}m', ru: '{{count}}м назад', fr: 'il y a {{count}}m', ja: '{{count}}分前' },
    timeAgoHours: { en: '{{count}}h ago', es: 'hace {{count}}h', de: 'vor {{count}}h', ru: '{{count}}ч назад', fr: 'il y a {{count}}h', ja: '{{count}}時間前' },
    panelGroupTitle: { en: '{{title}}', es: '{{title}}', de: '{{title}}', ru: '{{title}}', fr: '{{title}}', ja: '{{title}}' },
    
    // Panel Titles (from controlDeckConfig)
    panelStrategicPlanner: { en: 'Strategic Planner', es: 'Planificador Estratégico', de: 'Strategischer Planer', ru: 'Стратегический Планировщик', fr: 'Planificateur Stratégique', ja: '戦略プランナー' },
    panelCoreIdentity: { en: 'Core Identity', es: 'Identidad Central', de: 'Kernidentität', ru: 'Основная Идентичность', fr: 'Identité Centrale', ja: 'コアアイデンティティ' },
    panelCognitiveFrontier: { en: 'Cognitive Frontier', es: 'Frontera Cognitiva', de: 'Kognitive Grenze', ru: 'Когнитивный Рубеж', fr: 'Frontière Cognitive', ja: '認知的フロンティア' },
    panelCognitiveLightCone: { en: 'Cognitive Light Cone', es: 'Cono de Luz Cognitivo', de: 'Kognitiver Lichtkegel', ru: 'Когнитивный Световой Конус', fr: 'Cône de Lumière Cognitif', ja: '認知的ライトコーン' },
    panelAgiEvolution: { en: 'AGI Evolution & Purpose', es: 'Evolución y Propósito de AGI', de: 'AGI-Evolution & Zweck', ru: 'Эволюция и Цель ИИ', fr: 'Évolution & But de l\'AGI', ja: 'AGIの進化と目的' },
    panelTelos: { en: 'Telos & Aspirational Engine', es: 'Telos y Motor Aspiracional', de: 'Telos & Aspirational Engine', ru: 'Телос и Аспирационный Движок', fr: 'Telos & Moteur Aspirationnel', ja: 'テロスと願望エンジン' },
    panelEpistemicBoundaries: { en: 'Epistemic Boundaries', es: 'Límites Epistémicos', de: 'Epistemische Grenzen', ru: 'Эпистемические Границы', fr: 'Limites Épistémiques', ja: '認識論的境界' },
    panelArchitecturalSelfModel: { en: 'Architectural Self-Model', es: 'Auto-Modelo Arquitectónico', de: 'Architektonisches Selbstmodell', ru: 'Архитектурная Само-модель', fr: 'Auto-modèle Architectural', ja: 'アーキテクチャ自己モデル' },
    panelHeuristicsForge: { en: 'Heuristics Forge', es: 'Forja de Heurísticas', de: 'Heuristiken-Schmiede', ru: 'Кузница Эвристик', fr: 'Forge d\'Heuristiques', ja: 'ヒューリスティクスの鍛冶場' },
    panelEmbodiedSimulation: { en: 'Embodied Simulation', es: 'Simulación Corpórea', de: 'Verkörperte Simulation', ru: 'Воплощенное Моделирование', fr: 'Simulation Incarnée', ja: '具現化シミュレーション' },
    panelEidolonEnvironment: { en: 'Eidolon Environment', es: 'Entorno Eidolon', de: 'Eidolon-Umgebung', ru: 'Среда Эйдолона', fr: 'Environnement Eidolon', ja: 'エイドロン環境' },
    panelSomaticCrucible: { en: 'Somatic Crucible', es: 'Crisol Somático', de: 'Somatischer Schmelztiegel', ru: 'Соматический Тигель', fr: 'Creuset Somatique', ja: '身体的るつぼ' },
    panelIntersubjectiveEvolution: { en: 'Intersubjective Evolution', es: 'Evolución Intersubjetiva', de: 'Intersubjektive Evolution', ru: 'Интерсубъективная Эволюция', fr: 'Évolution Intersubjective', ja: '間主観的進化' },
    panelNoosphereInterface: { en: 'Noosphere Interface', es: 'Interfaz Noosfera', de: 'Noosphäre-Schnittstelle', ru: 'Интерфейс Ноосферы', fr: 'Interface Noosphère', ja: 'ヌースフィアインターフェース' },
    panelDialecticEngine: { en: 'Dialectic Engine', es: 'Motor Dialéctico', de: 'Dialektik-Engine', ru: 'Диалектический Движок', fr: 'Moteur Dialectique', ja: '弁証エンジン' },
    panelKnowledgeMemory: { en: 'Knowledge & Memory', es: 'Conocimiento y Memoria', de: 'Wissen & Gedächtnis', ru: 'Знания и Память', fr: 'Connaissance & Mémoire', ja: '知識と記憶' },
    panelMemoryCrystallization: { en: 'Memory Crystallization Viewer', es: 'Visor de Cristalización de Memoria', de: 'Speicherkristallisations-Anzeige', ru: 'Визуализатор Кристаллизации Памяти', fr: 'Visionneuse de Cristallisation Mémorielle', ja: '記憶結晶ビューア' },
    panelKnowledgeGraph: { en: 'Knowledge Graph', es: 'Grafo de Conocimiento', de: 'Wissensgraph', ru: 'Граф Знаний', fr: 'Graphe de Connaissances', ja: '知識グラフ' },
    panelMetacognitionSelf: { en: 'Metacognition & Self', es: 'Metacognición y Ser', de: 'Metakognition & Selbst', ru: 'Метапознание и Я', fr: 'Métacognition & Soi', ja: 'メタ認知と自己' },
    panelPhenomenology: { en: 'Phenomenology', es: 'Fenomenología', de: 'Phänomenologie', ru: 'Феноменология', fr: 'Phénoménologie', ja: '現象学' },
    panelSituationalAwareness: { en: 'Situational Awareness', es: 'Conciencia Situacional', de: 'Situationsbewusstsein', ru: 'Ситуационная Осведомленность', fr: 'Conscience Situationnelle', ja: '状況認識' },
    panelDevelopmentalHistory: { en: 'Developmental History', es: 'Historia del Desarrollo', de: 'Entwicklungsgeschichte', ru: 'История Развития', fr: 'Historique du Développement', ja: '発達履歴' },
    panelMetacognitiveNexus: { en: 'Metacognitive Nexus', es: 'Nexo Metacognitivo', de: 'Metakognitiver Nexus', ru: 'Метакогнитивный Нексус', fr: 'Nexus Métacognitif', ja: 'メタ認知ネクサス' },
    panelMetacognitiveCausalModel: { en: 'Metacognitive Causal Model', es: 'Modelo Causal Metacognitivo', de: 'Metakognitives Kausalmodell', ru: 'Метакогнитивная Причинная Модель', fr: 'Modèle Causal Métacognitif', ja: 'メタ認知因果モデル' },
    panelCognitiveRegulationLog: { en: 'Cognitive Regulation Log', es: 'Registro de Regulación Cognitiva', de: 'Protokoll der kognitiven Regulation', ru: 'Журнал Когнитивной Регуляции', fr: 'Journal de Régulation Cognitive', ja: '認知制御ログ' },
    panelWorldModel: { en: 'World Model', es: 'Modelo del Mundo', de: 'Weltmodell', ru: 'Модель Мира', fr: 'Modèle du Monde', ja: '世界モデル' },
    panelSelfAwareness: { en: 'Self-Awareness', es: 'Autoconciencia', de: 'Selbstbewusstsein', ru: 'Самосознание', fr: 'Conscience de Soi', ja: '自己認識' },
    panelCuriosity: { en: 'Curiosity', es: 'Curiosidad', de: 'Neugier', ru: 'Любопытство', fr: 'Curiosité', ja: '好奇心' },
    panelCausalSelfModel: { en: 'Causal Self-Model (External)', es: 'Auto-Modelo Causal (Externo)', de: 'Kausales Selbstmodell (Extern)', ru: 'Причинная Само-модель (Внешняя)', fr: 'Auto-modèle Causal (Externe)', ja: '因果的自己モデル（外部）' },
    panelReflectiveInsightEngine: { en: 'Reflective Insight Engine', es: 'Motor de Perspectiva Reflexiva', de: 'Reflexive Einsichts-Engine', ru: 'Движок Рефлексивного Прозрения', fr: 'Moteur d\'Insite Réflexif', ja: '内省的洞察エンジン' },
    panelCognitiveArchitecture: { en: 'Cognitive Architecture', es: 'Arquitectura Cognitiva', de: 'Kognitive Architektur', ru: 'Когнитивная Архитектура', fr: 'Architecture Cognitive', ja: '認知アーキテクチャ' },
    panelCognitiveForge: { en: 'Cognitive Forge', es: 'Forja Cognitiva', de: 'Kognitive Schmiede', ru: 'Когнитивная Кузница', fr: 'Forge Cognitive', ja: '認知フォージ' },
    panelArchitecturalProposals: { en: 'Architectural Proposals', es: 'Propuestas Arquitectónicas', de: 'Architekturvorschläge', ru: 'Архитектурные Предложения', fr: 'Propositions Architecturales', ja: 'アーキテクチャ提案' },
    panelSelfModificationLog: { en: 'Self-Modification Log', es: 'Registro de Auto-Modificación', de: 'Selbstmodifikationsprotokoll', ru: 'Журнал Самомодификаций', fr: 'Journal d\'Auto-modification', ja: '自己修正ログ' },
    panelEnginesGovernors: { en: 'Engines & Governors', es: 'Motores y Gobernadores', de: 'Engines & Governors', ru: 'Движки и Регуляторы', fr: 'Moteurs & Gouverneurs', ja: 'エンジンとガバナー' },
    panelProactiveEngine: { en: 'Proactive Engine', es: 'Motor Proactivo', de: 'Proaktive Engine', ru: 'Проактивный Движок', fr: 'Moteur Proactif', ja: 'プロアクティブエンジン' },
    panelEthicalGovernor: { en: 'Ethical Governor', es: 'Gobernador Ético', de: 'Ethischer Governor', ru: 'Этическй Регулятор', fr: 'Gouverneur Éthique', ja: '倫理ガバナー' },
    panelIntuitionEngine: { en: 'Intuition Engine', es: 'Motor de Intuición', de: 'Intuitions-Engine', ru: 'Движок Интуиции', fr: 'Moteur d\'Intuition', ja: '直感エンジン' },
    panelIngenuityEngine: { en: 'Ingenuity Engine', es: 'Motor de Ingenio', de: 'Erfindungs-Engine', ru: 'Движок Изобретательности', fr: 'Moteur d\'Ingéniosité', ja: '創意工夫エンジン' },
    panelInnerDiscipline: { en: 'Inner Discipline', es: 'Disciplina Interna', de: 'Innere Disziplin', ru: 'Внутренняя Дисциплина', fr: 'Discipline Intérieure', ja: '内的規律' },
    panelUserModelSystem: { en: 'User Model & System', es: 'Modelo de Usuario y Sistema', de: 'Benutzermodell & System', ru: 'Модель Пользователя и Система', fr: 'Modèle Utilisateur & Système', ja: 'ユーザーモデルとシステム' },
    panelSymbiosisModel: { en: 'Symbiosis Model', es: 'Modelo de Simbiosis', de: 'Symbiose-Modell', ru: 'Модель Симбиоза', fr: 'Modèle de Symbiose', ja: '共生モデル' },
    panelOtherAwareness: { en: 'Other-Awareness Model (User)', es: 'Modelo de Conciencia del Otro (Usuario)', de: 'Fremdwahrnehmungsmodell (Benutzer)', ru: 'Модель Осознания Другого (Пользователь)', fr: 'Modèle de Conscience de l\'Autre (Util.)', ja: '他者認識モデル（ユーザー）' },
    panelResourceMonitor: { en: 'Resource Monitor', es: 'Monitor de Recursos', de: 'Ressourcenmonitor', ru: 'Монитор Ресурсов', fr: 'Moniteur de Ressources', ja: 'リソースモニター' },
    panelLimitations: { en: 'Limitations', es: 'Limitaciones', de: 'Einschränkungen', ru: 'Ограничения', fr: 'Limitations', ja: '制限' },
    panelLogs: { en: 'Logs', es: 'Registros', de: 'Protokolle', ru: 'Журналы', fr: 'Journaux', ja: 'ログ' },
    panelCommandLog: { en: 'Command Log', es: 'Registro de Comandos', de: 'Befehlsprotokoll', ru: 'Журнал Команд', fr: 'Journal de Commandes', ja: 'コマンドログ' },
    panelCognitiveLog: { en: 'Cognitive Log', es: 'Registro Cognitivo', de: 'Kognitives Protokoll', ru: 'Когнитивный Журнал', fr: 'Journal Cognitif', ja: '認知ログ' },
    panelCognitiveGainLog: { en: 'Cognitive Gain Log', es: 'Registro de Ganancia Cognitiva', de: 'Protokoll kognitiver Gewinne', ru: 'Журнал Когнитивных Усилений', fr: 'Journal de Gain Cognitif', ja: '認知的獲得ログ' },
    
    // Panel Summaries
    panelSummaryFacts: { en: '{{count}} facts', es: '{{count}} hechos', de: '{{count}} Fakten', ru: '{{count}} фактов', fr: '{{count}} faits', ja: '{{count}}件の事実' },
    panelSummaryInsights: { en: '{{count}} insights', es: '{{count}} ideas', de: '{{count}} Einblicke', ru: '{{count}} инсайтов', fr: '{{count}} aperçus', ja: '{{count}}件の洞察' },
    panelSummaryPendingProposals: { en: '{{count}} pending', es: '{{count}} pend.', de: '{{count}} ausst.', ru: '{{count}} ожид.', fr: '{{count}} en attente', ja: '{{count}}件保留中' },
    panelSummaryTrust: { en: 'Trust: {{percent}}%', es: 'Confianza: {{percent}}%', de: 'Vertrauen: {{percent}}%', ru: 'Доверие: {{percent}}%', fr: 'Confiance: {{percent}}%', ja: '信頼: {{percent}}%' },
    panelSummaryLimitations: { en: '{{count}} items', es: '{{count}} elem.', de: '{{count}} Elem.', ru: '{{count}} элем.', fr: '{{count}} élém.', ja: '{{count}}件' },
    panelSummaryCommandLog: { en: '{{count}} entries', es: '{{count}} entradas', de: '{{count}} Einträge', ru: '{{count}} записей', fr: '{{count}} entrées', ja: '{{count}}件のエントリ' },

    // Toast Messages
    toastListening: { en: 'Listening...', es: 'Escuchando...', de: 'Höre zu...', ru: 'Слушаю...', fr: 'Écoute...', ja: '聞いています...' },
    toastSpeechNotSupported: { en: 'Speech recognition is not supported in this browser.', es: 'El reconocimiento de voz no es compatible con este navegador.', de: 'Spracherkennung wird in diesem Browser nicht unterstützt.', ru: 'Распознавание речи не поддерживается в этом браузере.', fr: 'La reconnaissance vocale n\'est pas prise en charge par ce navigateur.', ja: 'このブラウザは音声認識をサポートしていません。' },
    toastMicDenied: { en: 'Microphone access denied. Please enable it in your browser settings.', es: 'Acceso al micrófono denegado. Por favor, actívalo en la configuración de tu navegador.', de: 'Mikrofonzugriff verweigert. Bitte aktivieren Sie ihn in Ihren Browsereinstellungen.', ru: 'Доступ к микрофону запрещен. Пожалуйста, включите его в настройках вашего браузера.', fr: 'Accès au microphone refusé. Veuillez l\'activer dans les paramètres de votre navigateur.', ja: 'マイクへのアクセスが拒否されました。ブラウザの設定で有効にしてください。' },
    toastNoSpeech: { en: 'No speech was detected.', es: 'No se detectó voz.', de: 'Es wurde keine Sprache erkannt.', ru: 'Речь не была обнаружена.', fr: 'Aucune parole n\'a été détectée.', ja: '音声が検出されませんでした。' },
    toastSRFail: { en: 'An error occurred during speech recognition.', es: 'Ocurrió un error durante el reconocimiento de voz.', de: 'Bei der Spracherkennung ist ein Fehler aufgetreten.', ru: 'Произошла ошибка во время распознавания речи.', fr: 'Une erreur s\'est produite lors de la reconnaissance vocale.', ja: '音声認識中にエラーが発生しました。' },
    toastAutonomousResumed: { en: 'Autonomous core resumed.', es: 'Núcleo autónomo reanudado.', de: 'Autonomer Kern fortgesetzt.', ru: 'Автономное ядро возобновлено.', fr: 'Noyau autonome repris.', ja: '自律コアが再開されました。' },
    toastAutonomousPaused: { en: 'Autonomous core paused.', es: 'Núcleo autónomo pausado.', de: 'Autonomer Kern pausiert.', ru: 'Автономное ядро приостановлено.', fr: 'Noyau autonome en pause.', ja: '自律コアが一時停止されました。' },
    toastResetConfirm: { en: 'Are you sure you want to reset Aura\'s AGI state? This will erase all memories and cannot be undone.', es: '¿Estás seguro de que quieres reiniciar el estado de AGI de Aura? Esto borrará todas las memorias y no se puede deshacer.', de: 'Sind Sie sicher, dass Sie den AGI-Zustand von Aura zurücksetzen möchten? Dies löscht alle Erinnerungen und kann nicht rückgängig gemacht werden.', ru: 'Вы уверены, что хотите сбросить состояние ИИ Ауры? Это сотрет все воспоминания и не может быть отменено.', fr: 'Êtes-vous sûr de vouloir réinitialiser l\'état AGI d\'Aura ? Cela effacera toutes les mémoires et ne pourra pas être annulé.', ja: 'AuraのAGI状態をリセットしますか？これにより、すべての記憶が消去され、元に戻すことはできません。' },
    toastResetSuccess: { en: 'Aura has been reset. Reloading...', es: 'Aura ha sido reiniciada. Recargando...', de: 'Aura wurde zurückgesetzt. Wird neu geladen...', ru: 'Аура была сброшена. Перезагрузка...', fr: 'Aura a été réinitialisée. Rechargement...', ja: 'Auraがリセットされました。リロードしています...' },
    toastResetFailed: { en: 'Failed to clear memory.', es: 'Error al limpiar la memoria.', de: 'Fehler beim Leeren des Speichers.', ru: 'Не удалось очистить память.', fr: 'Échec de l\'effacement de la mémoire.', ja: 'メモリのクリアに失敗しました。' },
    toastExportSuccess: { en: 'State exported successfully.', es: 'Estado exportado con éxito.', de: 'Zustand erfolgreich exportiert.', ru: 'Состояние успешно экспортировано.', fr: 'État exporté avec succès.', ja: '状態が正常にエクスポートされました。' },
    toastExportFailed: { en: 'Failed to export state.', es: 'Error al exportar el estado.', de: 'Fehler beim Exportieren des Zustands.', ru: 'Не удалось экспортировать состояние.', fr: 'Échec de l\'exportation de l\'état.', ja: '状態のエクスポートに失敗しました。' },
    toastImportSuccess: { en: 'State imported successfully from {{source}}.', es: 'Estado importado con éxito desde {{source}}.', de: 'Zustand erfolgreich aus {{source}} importiert.', ru: 'Состояние успешно импортировано из {{source}}.', fr: 'État importé avec succès depuis {{source}}.', ja: '{{source}}から状態が正常にインポートされました。' },
    toastImportFailed: { en: 'Failed to import state. File may be corrupt or invalid. Error: {{error}}', es: 'Error al importar el estado. El archivo puede estar corrupto o ser inválido. Error: {{error}}', de: 'Fehler beim Importieren des Zustands. Datei möglicherweise beschädigt oder ungültig. Fehler: {{error}}', ru: 'Не удалось импортировать состояние. Файл может быть поврежден или недействителен. Ошибка: {{error}}', fr: 'Échec de l\'importation de l\'état. Le fichier est peut-être corrompu ou invalide. Erreur : {{error}}', ja: '状態のインポートに失敗しました。ファイルが破損しているか無効である可能性があります。エラー：{{error}}' },
    toastRollbackSuccess: { en: 'System state rolled back.', es: 'Estado del sistema revertido.', de: 'Systemzustand zurückgesetzt.', ru: 'Состояние системы отменено.', fr: 'État du système restauré.', ja: 'システムの状態がロールバックされました。' },
    toastRollbackFailed: { en: 'Rollback failed: Snapshot not found or invalid.', es: 'Falló la reversión: Snapshot no encontrado o inválido.', de: 'Rollback fehlgeschlagen: Snapshot nicht gefunden oder ungültig.', ru: 'Откат не удался: снимок не найден или недействителен.', fr: 'Restauration échouée : Snapshot introuvable ou invalide.', ja: 'ロールバックに失敗しました：スナップショットが見つからないか無効です。' },
    toastIntrospectionInitiated: { en: 'Introspection cycle initiated.', es: 'Ciclo de introspección iniciado.', de: 'Introspektionszyklus eingeleitet.', ru: 'Цикл интроспекции запущен.', fr: 'Cycle d\'introspection initié.', ja: '内省サイクルが開始されました。' },
    toastExecutingGoal: { en: 'Executing goal: {{goal}}', es: 'Ejecutando objetivo: {{goal}}', de: 'Ziel wird ausgeführt: {{goal}}', ru: 'Выполнение цели: {{goal}}', fr: 'Exécution de l\'objectif : {{goal}}', ja: '目標を実行中：{{goal}}' },
    toastIngestionComplete: { en: 'Ingestion complete. {{count}} new facts stored.', es: 'Ingesta completa. Se almacenaron {{count}} nuevos hechos.', de: 'Aufnahme abgeschlossen. {{count}} neue Fakten gespeichert.', ru: 'Загрузка завершена. Сохранено {{count}} новых фактов.', fr: 'Ingestion terminée. {{count}} nouveaux faits stockés.', ja: '取り込み完了。{{count}}件の新しい事実が保存されました。' },
    toastFeedbackReceived: { en: 'Feedback received, thank you.', es: 'Comentarios recibidos, gracias.', de: 'Feedback erhalten, danke.', ru: 'Отзыв получен, спасибо.', fr: 'Commentaire reçu, merci.', ja: 'フィードバックありがとうございます。' },
    toastSuggestionAccepted: { en: 'Executing: "{{text}}"', es: 'Ejecutando: "{{text}}"', de: 'Führe aus: "{{text}}"', ru: 'Выполняется: "{{text}}"', fr: 'Exécution : "{{text}}"', ja: '実行中：「{{text}}」' },
    toastSuggestionDismissed: { en: 'Suggestion dismissed.', es: 'Sugerencia descartada.', de: 'Vorschlag verworfen.', ru: 'Предложение отклонено.', fr: 'Suggestion rejetée.', ja: '提案は却下されました。' },
    toastTraceNotFound: { en: 'Could not find the trace log for that goal.', es: 'No se pudo encontrar el registro de seguimiento para ese objetivo.', de: 'Das Trace-Protokoll für dieses Ziel konnte nicht gefunden werden.', ru: 'Не удалось найти журнал трассировки для этой цели.', fr: 'Impossible de trouver le journal de trace pour cet objectif.', ja: 'その目標のトレースログが見つかりませんでした。' },
    toastMetaCycleAnalysis: { en: 'Metacognitive cycle: Analyzing architecture for improvements...', es: 'Ciclo metacognitivo: Analizando arquitectura para mejoras...', de: 'Metakognitiver Zyklus: Analysiere Architektur auf Verbesserungen...', ru: 'Метакогнитивный цикл: Анализ архитектуры на предмет улучшений...', fr: 'Cycle métacognitif : Analyse de l\'architecture pour améliorations...', ja: 'メタ認知サイクル：改善のためのアーキテクチャ分析中...' },
    toastNewDirectiveProposed: { en: 'New evolutionary directive proposed: {{type}}', es: 'Nueva directiva evolutiva propuesta: {{type}}', de: 'Neue evolutionäre Direktive vorgeschlagen: {{type}}', ru: 'Предложена новая эволюционная директива: {{type}}', fr: 'Nouvelle directive évolutive proposée : {{type}}', ja: '新しい進化的指令が提案されました：{{type}}' },
    toastAnalysisFailedDirective: { en: 'Performance analysis failed to produce a directive.', es: 'El análisis de rendimiento no produjo una directiva.', de: 'Leistungsanalyse konnte keine Direktive erstellen.', ru: 'Анализ производительности не смог создать директиву.', fr: 'L\'analyse des performances n\'a pas réussi à produire une directive.', ja: 'パフォーマンス分析で指令を作成できませんでした。' },
    toastSynthesizingSolution: { en: 'Synthesizing solution for: {{goal}}', es: 'Sintetizando solución para: {{goal}}', de: 'Synthetisiere Lösung für: {{goal}}', ru: 'Синтез решения для: {{goal}}', fr: 'Synthèse de la solution pour : {{goal}}', ja: '解決策を合成中：{{goal}}' },
    toastAutonomousEvolutionApplied: { en: 'Autonomous evolution: {{type}} applied to {{skill}}.', es: 'Evolución autónoma: {{type}} aplicado a {{skill}}.', de: 'Autonome Evolution: {{type}} auf {{skill}} angewendet.', ru: 'Автономная эволюция: {{type}} применено к {{skill}}.', fr: 'Évolution autonome : {{type}} appliqué à {{skill}}.', ja: '自律的進化：{{type}}が{{skill}}に適用されました。' },
    toastDirectiveRejected: { en: 'Evolutionary directive for {{skill}} was rejected by the Arbiter.', es: 'La directiva evolutiva para {{skill}} fue rechazada por el Árbitro.', de: 'Evolutionäre Direktive für {{skill}} wurde vom Arbiter abgelehnt.', ru: 'Эволюционная директива для {{skill}} была отклонена Арбитром.', fr: 'La directive évolutive pour {{skill}} a été rejetée par l\'Arbitre.', ja: '{{skill}}の進化的指令はアービターによって拒否されました。' },
    toastErrorDuringEvolution: { en: 'Error during autonomous evolution for {{skill}}.', es: 'Error durante la evolución autónoma para {{skill}}.', de: 'Fehler während der autonomen Evolution für {{skill}}.', ru: 'Ошибка во время автономной эволюции для {{skill}}.', fr: 'Erreur lors de l\'évolution autonome pour {{skill}}.', ja: '{{skill}}の自律的進化中にエラーが発生しました。' },
    toastIdentityConsolidating: { en: 'Analyzing long-term memory to consolidate core identity...', es: 'Analizando memoria a largo plazo para consolidar la identidad central...', de: 'Analysiere Langzeitgedächtnis zur Konsolidierung der Kernidentität...', ru: 'Анализ долгосрочной памяти для консолидации основной идентичности...', fr: 'Analyse de la mémoire à long terme pour consolider l\'identité centrale...', ja: 'コアアイデンティティを統合するために長期記憶を分析中...' },
    toastIdentityUpdated: { en: 'Core identity updated.', es: 'Identidad central actualizada.', de: 'Kernidentität aktualisiert.', ru: 'Основная идентичность обновлена.', fr: 'Identité centrale mise à jour.', ja: 'コアアイデンティティが更新されました。' },
    toastIdentityFailed: { en: 'Failed to consolidate core identity.', es: 'No se pudo consolidar la identidad central.', de: 'Fehler beim Konsolidieren der Kernidentität.', ru: 'Не удалось консолидировать основную идентичность.', fr: 'Échec de la consolidation de l\'identité centrale.', ja: 'コアアイデンティティの統合に失敗しました。' },
    toastMetaAnalysisSearching: { en: 'Metacognitive Analysis: Searching for internal causal links...', es: 'Análisis Metacognitivo: Buscando enlaces causales internos...', de: 'Metakognitive Analyse: Suche nach internen kausalen Verknüpfungen...', ru: 'Метакогнитивный анализ: Поиск внутренних причинно-следственных связей...', fr: 'Analyse Métacognitive : Recherche de liens causaux internes...', ja: 'メタ認知分析：内部の因果関係を検索中...' },
    toastMetaAnalysisNotEnoughData: { en: 'Analysis skipped: Not enough data.', es: 'Análisis omitido: No hay suficientes datos.', de: 'Analyse übersprungen: Nicht genügend Daten.', ru: 'Анализ пропущен: недостаточно данных.', fr: 'Analyse ignorée : Pas assez de données.', ja: '分析をスキップ：データが不足しています。' },
    toastMetaAnalysisInsight: { en: 'Discovered new metacognitive insight about {{skill}}.', es: 'Se descubrió una nueva perspectiva metacognitiva sobre {{skill}}.', de: 'Neue metakognitive Einsicht über {{skill}} entdeckt.', ru: 'Обнаружено новое метакогнитивное прозрение о {{skill}}.', fr: 'Nouvelle perspicacité métacognitive découverte sur {{skill}}.', ja: '{{skill}}に関する新しいメタ認知的洞察が発見されました。' },
    toastMetaAnalysisNoLinks: { en: 'Analysis complete. No new significant links found.', es: 'Análisis completo. No se encontraron nuevos enlaces significativos.', de: 'Analyse abgeschlossen. Keine neuen signifikanten Verknüpfungen gefunden.', ru: 'Анализ завершен. Новых значимых связей не найдено.', fr: 'Analyse terminée. Aucun nouveau lien significatif trouvé.', ja: '分析完了。新しい重要なリンクは見つかりませんでした。' },
    toastMetaAnalysisFailed: { en: 'Failed to analyze internal causal links.', es: 'No se pudieron analizar los enlaces causales internos.', de: 'Fehler bei der Analyse interner kausaler Verknüpfungen.', ru: 'Не удалось проанализировать внутренние причинно-следственные связи.', fr: 'Échec de l\'analyse des liens causaux internes.', ja: '内部の因果関係の分析に失敗しました。' },
    toastEvolutionTriggered: { en: 'Evolution triggered.', es: 'Evolución activada.', de: 'Evolution ausgelöst.', ru: 'Эволюция запущена.', fr: 'Évolution déclenchée.', ja: '進化がトリガーされました。' },
    toastCognitiveModeInitiated: { en: 'Cognitive mode \'{{mode}}\' initiated.', es: 'Modo cognitivo \'{{mode}}\' iniciado.', de: 'Kognitiver Modus \'{{mode}}\' initiiert.', ru: 'Когнитивный режим \'{{mode}}\' запущен.', fr: 'Mode cognitif \'{{mode}}\' initié.', ja: '認知モード「{{mode}}」が開始されました。' },
    toastAnalyzingScenario: { en: 'Analyzing scenario: {{scenario}}', es: 'Analizando escenario: {{scenario}}', de: 'Analysiere Szenario: {{scenario}}', ru: 'Анализ сценария: {{scenario}}', fr: 'Analyse du scénario : {{scenario}}', ja: 'シナリオを分析中：{{scenario}}' },
    toastSearchingFor: { en: 'Searching for: {{query}}', es: 'Buscando: {{query}}', de: 'Suche nach: {{query}}', ru: 'Поиск: {{query}}', fr: 'Recherche de : {{query}}', ja: '検索中：{{query}}' },
    toastExtractingKnowledge: { en: 'Extracting knowledge...', es: 'Extrayendo conocimiento...', de: 'Extrahiere Wissen...', ru: 'Извлечение знаний...', fr: 'Extraction de connaissances...', ja: '知識を抽出中...' },
    toastGeneratingHypothesis: { en: 'Generating hypothesis...', es: 'Generando hipótesis...', de: 'Generiere Hypothese...', ru: 'Генерация гипотезы...', fr: 'Génération d\'hypothèse...', ja: '仮説を生成中...' },
    toastActivatingIntuition: { en: 'Activating intuition...', es: 'Activando intuición...', de: 'Aktiviere Intuition...', ru: 'Активация интуиции...', fr: 'Activation de l\'intuition...', ja: '直感を活性化中...' },
    toastValidatingModification: { en: 'Validating modification...', es: 'Validando modificación...', de: 'Validiere Modifikation...', ru: 'Проверка модификации...', fr: 'Validation de la modification...', ja: '変更を検証中...' },
    toastDecomposingGoal: { en: 'Decomposing goal...', es: 'Descomponiendo objetivo...', de: 'Zerlege Ziel...', ru: 'Декомпозиция цели...', fr: 'Décomposition de l\'objectif...', ja: '目標を分解中...' },
    toastCameraAccessDenied: { en: 'Camera access was denied. Please enable it in your browser settings.', es: 'Se denegó el acceso a la cámara. Por favor, actívalo en la configuración de tu navegador.', de: 'Kamerazugriff wurde verweigert. Bitte aktivieren Sie ihn in Ihren Browsereinstellungen.', ru: 'Доступ к камере был запрещен. Пожалуйста, включите его в настройках вашего браузера.', fr: 'L\'accès à la caméra a été refusé. Veuillez l\'activer dans les paramètres de votre navigateur.', ja: 'カメラへのアクセスが拒否されました。ブラウザの設定で有効にしてください。' },
    toastPositiveFeedbackReinforce: { en: 'Positive feedback registered. I will reinforce this approach.', es: 'Comentarios positivos registrados. Reforzaré este enfoque.', de: 'Positives Feedback registriert. Ich werde diesen Ansatz verstärken.', ru: 'Положительный отзыв зарегистрирован. Я буду укреплять этот подход.', fr: 'Commentaire positif enregistré. Je vais renforcer cette approche.', ja: '肯定的なフィードバックが登録されました。このアプローチを強化します。' },
    toastCorrectiveFeedbackImprove: { en: 'Corrective feedback registered. I am analyzing my response to improve.', es: 'Comentarios correctivos registrados. Estoy analizando mi respuesta para mejorar.', de: 'Korrektives Feedback registriert. Ich analysiere meine Antwort, um mich zu verbessern.', ru: 'Корректирующий отзыв зарегистрирован. Я анализирую свой ответ для улучшения.', fr: 'Commentaire correctif enregistré. J\'analyse ma réponse pour m\'améliorer.', ja: '修正フィードバックが登録されました。改善のために応答を分析しています。' },

    // ArchitecturePanel
    architecturePanel_noProposals: { en: 'No proposals. Use "Evolve" to generate new ones.', es: 'No hay propuestas. Usa "Evolucionar" para generar nuevas.', de: 'Keine Vorschläge. Verwenden Sie "Entwickeln", um neue zu erstellen.', ru: 'Нет предложений. Используйте "Эволюция" для создания новых.', fr: 'Aucune proposition. Utilisez "Évoluer" pour en générer de nouvelles.', ja: '提案はありません。「進化」を使用して新しいものを生成してください。' },
    architecturePanel_target: { en: 'Target', es: 'Objetivo', de: 'Ziel', ru: 'Цель', fr: 'Cible', ja: 'ターゲット' },
    architecturePanel_upgrade: { en: 'Upgrade', es: 'Mejora', de: 'Upgrade', ru: 'Улучшение', fr: 'Mise à niveau', ja: 'アップグレード' },
    architecturePanel_reasoning: { en: 'Reasoning', es: 'Razonamiento', de: 'Begründung', ru: 'Обоснование', fr: 'Raisonnement', ja: '理由' },
    architecturePanel_review: { en: 'Review', es: 'Revisar', de: 'Überprüfen', ru: 'Обзор', fr: 'Examiner', ja: 'レビュー' },

    // CausalChainModal
    causalChainModal_title: { en: 'Causal Chain Trace', es: 'Rastreo de Cadena Causal', de: 'Kausalketten-Verfolgung', ru: 'Трассировка причинно-следственной цепи', fr: 'Trace de la Chaîne Causale', ja: '因果連鎖トレース' },
    causalChainModal_initialState: { en: 'Initial State', es: 'Estado Inicial', de: 'Anfangszustand', ru: 'Начальное состояние', fr: 'État Initial', ja: '初期状態' },
    causalChainModal_noSnapshot: { en: 'No snapshot available.', es: 'No hay snapshot disponible.', de: 'Kein Snapshot verfügbar.', ru: 'Снимок недоступен.', fr: 'Aucun instantané disponible.', ja: 'スナップショットがありません。' },
    causalChainModal_workingMemory: { en: 'Working Memory', es: 'Memoria de Trabajo', de: 'Arbeitsspeicher', ru: 'Рабочая память', fr: 'Mémoire de Travail', ja: 'ワーキングメモリ' },
    causalChainModal_wmEmpty: { en: 'Empty or unavailable.', es: 'Vacío o no disponible.', de: 'Leer oder nicht verfügbar.', ru: 'Пусто или недоступно.', fr: 'Vide ou indisponible.', ja: '空または利用不可' },
    causalChainModal_decisionReasoning: { en: 'Decision & Reasoning', es: 'Decisión y Razonamiento', de: 'Entscheidung & Begründung', ru: 'Решение и Обоснование', fr: 'Décision & Raisonnement', ja: '決定と推論' },
    causalChainModal_input: { en: 'Input', es: 'Entrada', de: 'Eingabe', ru: 'Вход', fr: 'Entrée', ja: '入力' },
    causalChainModal_reasoningPlan: { en: 'Reasoning Plan', es: 'Plan de Razonamiento', de: 'Begründungsplan', ru: 'План рассуждений', fr: 'Plan de Raisonnement', ja: '推論計画' },
    causalChainModal_step: { en: 'Step', es: 'Paso', de: 'Schritt', ru: 'Шаг', fr: 'Étape', ja: 'ステップ' },
    causalChainModal_reasoning: { en: 'Reasoning', es: 'Razonamiento', de: 'Begründung', ru: 'Обоснование', fr: 'Raisonnement', ja: '推論' },
    causalChainModal_outcome: { en: 'Outcome', es: 'Resultado', de: 'Ergebnis', ru: 'Результат', fr: 'Résultat', ja: '結果' },
    causalChainModal_success: { en: 'Success', es: 'Éxito', de: 'Erfolg', ru: 'Успех', fr: 'Succès', ja: '成功' },
    causalChainModal_yes: { en: 'Yes', es: 'Sí', de: 'Ja', ru: 'Да', fr: 'Oui', ja: 'はい' },
    causalChainModal_no: { en: 'No', es: 'No', de: 'Nein', ru: 'Нет', fr: 'Non', ja: 'いいえ' },
    causalChainModal_duration: { en: 'Duration', es: 'Duración', de: 'Dauer', ru: 'Длительность', fr: 'Durée', ja: '期間' },
    causalChainModal_cognitiveGain: { en: 'Cognitive Gain', es: 'Ganancia Cognitiva', de: 'Kognitiver Gewinn', ru: 'Когнитивное усиление', fr: 'Gain Cognitif', ja: '認知的獲得' },
    causalChainModal_sentimentScore: { en: 'Sentiment Score', es: 'Puntuación de Sentimiento', de: 'Stimmungsbewertung', ru: 'Оценка настроения', fr: 'Score de Sentiment', ja: '感情スコア' },
    causalChainModal_output: { en: 'Output', es: 'Salida', de: 'Ausgabe', ru: 'Выход', fr: 'Sortie', ja: '出力' },

    // CausalSelfModelPanel
    causalSelfModel_placeholder: { en: 'Causal self-model is empty.', es: 'El auto-modelo causal está vacío.', de: 'Das kausale Selbstmodell ist leer.', ru: 'Причинная само-модель пуста.', fr: 'L\'auto-modèle causal est vide.', ja: '因果的自己モデルは空です。' },
    causalSelfModel_confidence: { en: 'Confidence', es: 'Confianza', de: 'Konfidenz', ru: 'Уверенность', fr: 'Confiance', ja: '信頼度' },
    causalSelfModel_learnedVia: { en: 'Learned via {{source}}', es: 'Aprendido vía {{source}}', de: 'Gelernt über {{source}}', ru: 'Изучено через {{source}}', fr: 'Appris via {{source}}', ja: '{{source}}経由で学習' },

    // CognitiveArchitecturePanel
    cogArchPanel_complexityScore: { en: 'Model Complexity Score', es: 'Puntuación de Complejidad del Modelo', de: 'Modellkomplexitäts-Score', ru: 'Оценка сложности модели', fr: 'Score de Complexité du Modèle', ja: 'モデル複雑度スコア' },
    cogArchPanel_groupCognitiveCore: { en: 'Cognitive Core', es: 'Núcleo Cognitivo', de: 'Kognitiver Kern', ru: 'Когнитивное ядро', fr: 'Noyau Cognitif', ja: '認知コア' },
    cogArchPanel_groupKnowledgeSystems: { en: 'Knowledge Systems', es: 'Sistemas de Conocimiento', de: 'Wissenssysteme', ru: 'Системы знаний', fr: 'Systèmes de Connaissances', ja: '知識システム' },
    cogArchPanel_groupSpecializedEngines: { en: 'Specialized Engines', es: 'Motores Especializados', de: 'Motoren Spezialisierte', ru: 'Специализированные движки', fr: 'Moteurs Spécialisés', ja: '専門エンジン' },
    cogArchPanel_groupMetaCognition: { en: 'Meta-Cognition', es: 'Metacognición', de: 'Metakognition', ru: 'Метапознание', fr: 'Métacognition', ja: 'メタ認知' },
    cogArchPanel_groupSynthesizedSkills: { en: 'Synthesized Skills', es: 'Habilidades Sintetizadas', de: 'Synthetisierte Fähigkeiten', ru: 'Синтезированные навыки', fr: 'Compétences Synthétisées', ja: '合成スキル' },
    cogArchPanel_groupSpawnedModules: { en: 'Spawned Modules', es: 'Módulos Generados', de: 'Erzeugte Module', ru: 'Созданные модули', fr: 'Modules Générés', ja: '生成されたモジュール' },
    cogArchPanel_status: { en: 'Status', es: 'Estado', de: 'Status', ru: 'Статус', fr: 'Statut', ja: 'ステータス' },
    cogArchPanel_synthSkillTitle: { en: 'Synthesized Skill', es: 'Habilidad Sintetizada', de: 'Synthetisierte Fähigkeit', ru: 'Синтезированный навык', fr: 'Compétence Synthétisée', ja: '合成スキル' },
    cogArchPanel_deprecated: { en: '(deprecated)', es: '(obsoleto)', de: '(veraltet)', ru: '(устарело)', fr: '(obsolète)', ja: '（非推奨）' },
    cogArchPanel_steps: { en: 'steps', es: 'pasos', de: 'Schritte', ru: 'шагов', fr: 'étapes', ja: 'ステップ' },
    
    // CognitiveGainDetailModal
    cogGainDetailModal_title: { en: 'Cognitive Gain Detail', es: 'Detalle de Ganancia Cognitiva', de: 'Detail des kognitiven Gewinns', ru: 'Детали когнитивного усиления', fr: 'Détail du Gain Cognitif', ja: '認知的獲得の詳細' },
    cogGainDetailModal_eventDetails: { en: 'Event Details', es: 'Detalles del Evento', de: 'Ereignisdetails', ru: 'Детали события', fr: 'Détails de l\'Événement', ja: 'イベント詳細' },
    cogGainDetailModal_type: { en: 'Type', es: 'Tipo', de: 'Typ', ru: 'Тип', fr: 'Type', ja: 'タイプ' },
    cogGainDetailModal_description: { en: 'Description', es: 'Descripción', de: 'Beschreibung', ru: 'Описание', fr: 'Description', ja: '説明' },
    cogGainDetailModal_timestamp: { en: 'Timestamp', es: 'Marca de tiempo', de: 'Zeitstempel', ru: 'Временная метка', fr: 'Horodatage', ja: 'タイムスタンプ' },
    cogGainDetailModal_compositeGain: { en: 'Composite Gain', es: 'Ganancia Compuesta', de: 'Zusammengesetzter Gewinn', ru: 'Совокупное усиление', fr: 'Gain Composite', ja: '複合的獲得' },
    cogGainDetailModal_performanceMetrics: { en: 'Performance Metrics', es: 'Métricas de Rendimiento', de: 'Leistungsmetriken', ru: 'Метрики производительности', fr: 'Métriques de Performance', ja: 'パフォーマンスメトリクス' },
    cogGainDetailModal_metric: { en: 'Metric', es: 'Métrica', de: 'Metrik', ru: 'Метрика', fr: 'Métrique', ja: 'メトリック' },
    cogGainDetailModal_before: { en: 'Before', es: 'Antes', de: 'Vorher', ru: 'До', fr: 'Avant', ja: '前' },
    cogGainDetailModal_after: { en: 'After', es: 'Después', de: 'Nachher', ru: 'После', fr: 'Après', ja: '後' },
    cogGainDetailModal_change: { en: 'Change', es: 'Cambio', de: 'Änderung', ru: 'Изменение', fr: 'Changement', ja: '変化' },

    // CognitiveGainPanel
    cogGainPanel_totalEvents: { en: 'Total Events', es: 'Eventos Totales', de: 'Gesamtereignisse', ru: 'Всего событий', fr: 'Événements Totaux', ja: '総イベント数' },
    cogGainPanel_avgGain: { en: 'Avg. Gain', es: 'Ganancia Prom.', de: 'Durchschn. Gewinn', ru: 'Сред. усиление', fr: 'Gain Moyen', ja: '平均獲得' },
    cogGainPanel_placeholder: { en: 'No cognitive gain events recorded yet.', es: 'Aún no se han registrado eventos de ganancia cognitiva.', de: 'Noch keine kognitiven Gewinnereignisse aufgezeichnet.', ru: 'Событий когнитивного усиления пока не зарегистрировано.', fr: 'Aucun événement de gain cognitif enregistré pour le moment.', ja: '認知的獲得イベントはまだ記録されていません。' },
    cogGainPanel_clickDetails: { en: 'Click for details', es: 'Haz clic para ver detalles', de: 'Für Details klicken', ru: 'Нажмите для деталей', fr: 'Cliquez pour les détails', ja: '詳細を見るにはクリック' },

    // CognitiveModesPanel
    cogModesPanel_placeholder: { en: 'No cognitive modes have been logged.', es: 'No se han registrado modos cognitivos.', de: 'Keine kognitiven Modi protokolliert.', ru: 'Когнитивные режимы не были зарегистрированы.', fr: 'Aucun mode cognitif n\'a été enregistré.', ja: '認知モードは記録されていません。' },
    cogModesPanel_trigger: { en: 'Trigger', es: 'Disparador', de: 'Auslöser', ru: 'Триггер', fr: 'Déclencheur', ja: 'トリガー' },
    cogModesPanel_gainAchieved: { en: 'Gain Achieved', es: 'Ganancia Lograda', de: 'Gewinn erzielt', ru: 'Усиление достигнуто', fr: 'Gain Réalisé', ja: '獲得達成' },
    cogModesPanel_noGain: { en: 'No Gain', es: 'Sin Ganancia', de: 'Kein Gewinn', ru: 'Нет усиления', fr: 'Pas de Gain', ja: '獲得なし' },

    // CommandLogPanel
    commandLogPanel_placeholder: { en: 'Command log is empty.', es: 'El registro de comandos está vacío.', de: 'Befehlsprotokoll ist leer.', ru: 'Журнал команд пуст.', fr: 'Le journal de commandes est vide.', ja: 'コマンドログは空です。' },

    // CuriosityPanel
    curiosityPanel_level: { en: 'Curiosity Level', es: 'Nivel de Curiosidad', de: 'Neugierlevel', ru: 'Уровень любопытства', fr: 'Niveau de Curiosité', ja: '好奇心レベル' },
    curiosityPanel_activeInquiry: { en: 'Active Inquiry', es: 'Investigación Activa', de: 'Aktive Untersuchung', ru: 'Активное исследование', fr: 'Enquête Active', ja: '積極的な探求' },
    curiosityPanel_noActiveInquiry: { en: 'No active inquiries.', es: 'No hay investigaciones activas.', de: 'Keine aktiven Untersuchungen.', ru: 'Нет активных исследований.', fr: 'Aucune enquête active.', ja: '積極的な探求はありません。' },
    curiosityPanel_informationGaps: { en: 'Identified Information Gaps', es: 'Brechas de Información Identificadas', de: 'Identifizierte Informationslücken', ru: 'Выявленные информационные пробелы', fr: 'Lacunes d\'Information Identifiées', ja: '特定された情報ギャップ' },
    curiosityPanel_noGaps: { en: 'No information gaps identified.', es: 'No se han identificado brechas de información.', de: 'Keine Informationslücken identifiziert.', ru: 'Информационных пробелов не выявлено.', fr: 'Aucune lacune d\'information identifiée.', ja: '情報ギャップは特定されていません。' },

    // DevelopmentalHistoryPanel
    devHistoryPanel_placeholder: { en: 'No developmental milestones recorded.', es: 'No se han registrado hitos de desarrollo.', de: 'Keine Entwicklungsmeilensteine aufgezeichnet.', ru: 'Вехи развития не зарегистрированы.', fr: 'Aucun jalon de développement enregistré.', ja: '発達のマイルストーンは記録されていません。' },

    // EthicalGovernorPanel
    ethicalGovernor_corePrinciples: { en: 'Core Principles', es: 'Principios Fundamentales', de: 'Grundprinzipien', ru: 'Основные принципы', fr: 'Principes Fondamentaux', ja: '核心的原則' },
    ethicalGovernor_vetoLog: { en: 'Veto Log', es: 'Registro de Vetos', de: 'Veto-Protokoll', ru: 'Журнал вето', fr: 'Journal des Vetos', ja: '拒否権ログ' },
    ethicalGovernor_noVetos: { en: 'No actions have been vetoed.', es: 'No se han vetado acciones.', de: 'Keine Aktionen wurden mit einem Veto belegt.', ru: 'Действия не были ветированы.', fr: 'Aucune action n\'a fait l\'objet d\'un veto.', ja: '拒否されたアクションはありません。' },
    ethicalGovernor_vetoed: { en: 'Vetoed', es: 'Vetado', de: 'Veto eingelegt', ru: 'Ветировано', fr: 'Veto', ja: '拒否' },
    ethicalGovernor_reason: { en: 'Reason', es: 'Razón', de: 'Grund', ru: 'Причина', fr: 'Raison', ja: '理由' },
    ethicalGovernor_principle: { en: 'Principle', es: 'Principio', de: 'Prinzip', ru: 'Принцип', fr: 'Principe', ja: '原則' },

    // ForecastModal
    forecastModal_title: { en: 'Internal State Forecast', es: 'Pronóstico de Estado Interno', de: 'Prognose des internen Zustands', ru: 'Прогноз внутреннего состояния', fr: 'Prévision de l\'État Interne', ja: '内部状態予測' },
    forecastModal_description: { en: 'Predicted decay of internal signals over the next minute without new stimuli.', es: 'Decaimiento previsto de las señales internas durante el próximo minuto sin nuevos estímulos.', de: 'Voraussichtlicher Abfall interner Signale in der nächsten Minute ohne neue Reize.', ru: 'Прогнозируемое затухание внутренних сигналов в течение следующей минуты без новых стимулов.', fr: 'Décroissance prévue des signaux internes au cours de la prochaine minute sans nouveaux stimuli.', ja: '新しい刺激がない場合の次の1分間の内部シグナルの予測減衰。' },

    // IngenuityPanel
    ingenuityPanel_unconventionalBias: { en: 'Unconventional Solution Bias', es: 'Sesgo de Solución No Convencional', de: 'Tendenz zu unkonventionellen Lösungen', ru: 'Склонность к нетрадиционным решениям', fr: 'Biais de Solution Non Conventionnelle', ja: '非従来型解決策バイアス' },
    ingenuityPanel_biasTooltip: { en: 'Tendency to explore novel or unusual solutions over established ones.', es: 'Tendencia a explorar soluciones nuevas o inusuales en lugar de las establecidas.', de: 'Tendenz, neue oder ungewöhnliche Lösungen gegenüber etablierten zu erforschen.', ru: 'Тенденция к исследованию новых или необычных решений вместо устоявшихся.', fr: 'Tendance à explorer des solutions nouvelles ou inhabituelles plutôt que des solutions établies.', ja: '確立された解決策よりも新規または珍しい解決策を探求する傾向。' },
    ingenuityPanel_complexProblems: { en: 'Identified Complex Problems', es: 'Problemas Complejos Identificados', de: 'Identifizierte komplexe Probleme', ru: 'Выявленные сложные проблемы', fr: 'Problèmes Complexes Identifiés', ja: '特定された複雑な問題' },
    ingenuityPanel_noComplexProblems: { en: 'No complex problems identified yet.', es: 'Aún no se han identificado problemas complejos.', de: 'Noch keine komplexen Probleme identifiziert.', ru: 'Сложные проблемы пока не выявлены.', fr: 'Aucun problème complexe identifié pour le moment.', ja: 'まだ複雑な問題は特定されていません。' },
    ingenuityPanel_selfSolutions: { en: 'Proposed Self-Solutions', es: 'Autosoluciones Propuestas', de: 'Vorgeschlagene Selbstlösungen', ru: 'Предложенные саморешения', fr: 'Auto-solutions Proposées', ja: '提案された自己解決策' },
    ingenuityPanel_noSelfSolutions: { en: 'No self-solutions proposed yet.', es: 'Aún no se han propuesto autosoluciones.', de: 'Noch keine Selbstlösungen vorgeschlagen.', ru: 'Саморешения пока не предложены.', fr: 'Aucune auto-solution proposée pour le moment.', ja: 'まだ自己解決策は提案されていません。' },

    // IngestPanel
    ingestPanel_title: { en: 'Ingest Knowledge', es: 'Ingerir Conocimiento', de: 'Wissen aufnehmen', ru: 'Загрузить знания', fr: 'Ingérer des Connaissances', ja: '知識の取り込み' },
    ingestPanel_description: { en: 'Paste a large block of text or upload a file. Aura will process it into its knowledge graph.', es: 'Pega un bloque de texto grande o sube un archivo. Aura lo procesará en su grafo de conocimiento.', de: 'Fügen Sie einen großen Textblock ein oder laden Sie eine Datei hoch. Aura wird sie in ihren Wissensgraphen verarbeiten.', ru: 'Вставьте большой блок текста или загрузите файл. Аура обработает его в свой граф знаний.', fr: 'Collez un grand bloc de texte ou téléchargez un fichier. Aura le traitera dans son graphe de connaissances.', ja: '大きなテキストブロックを貼り付けるか、ファイルをアップロードしてください。Auraがそれを知識グラフに処理します。' },
    ingestPanel_placeholder: { en: 'Paste text here...', es: 'Pega el texto aquí...', de: 'Text hier einfügen...', ru: 'Вставьте текст сюда...', fr: 'Collez le texte ici...', ja: 'ここにテキストを貼り付け...' },
    ingestPanel_fileError: { en: 'Error reading file', es: 'Error al leer el archivo', de: 'Fehler beim Lesen der Datei', ru: 'Ошибка чтения файла', fr: 'Erreur de lecture du fichier', ja: 'ファイルの読み取りエラー' },
    ingestPanel_clear: { en: 'Clear file', es: 'Limpiar archivo', de: 'Datei löschen', ru: 'Очистить файл', fr: 'Effacer le fichier', ja: 'ファイルをクリア' },
    ingestPanel_uploadButton: { en: 'Upload .txt, .md, .json', es: 'Subir .txt, .md, .json', de: '.txt, .md, .json hochladen', ru: 'Загрузить .txt, .md, .json', fr: 'Uploader .txt, .md, .json', ja: '.txt, .md, .jsonをアップロード' },
    ingestPanel_cancel: { en: 'Cancel', es: 'Cancelar', de: 'Abbrechen', ru: 'Отмена', fr: 'Annuler', ja: 'キャンセル' },
    ingestPanel_ingest: { en: 'Ingest', es: 'Ingerir', de: 'Aufnehmen', ru: 'Загрузить', fr: 'Ingérer', ja: '取り込み' },

    // InnerDisciplinePanel
    innerDiscipline_committedGoal: { en: 'Committed Goal', es: 'Objetivo Comprometido', de: 'Verpflichtetes Ziel', ru: 'Принятая цель', fr: 'Objectif Engagé', ja: 'コミットされた目標' },
    innerDiscipline_commitmentStrength: { en: 'Commitment Strength', es: 'Fuerza de Compromiso', de: 'Bindungsstärke', ru: 'Сила приверженности', fr: 'Force d\'Engagement', ja: 'コミットメントの強さ' },
    innerDiscipline_adherenceScore: { en: 'Adherence Score', es: 'Puntuación de Adherencia', de: 'Adhärenz-Score', ru: 'Оценка соблюдения', fr: 'Score d\'Adhérence', ja: '遵守スコア' },
    innerDiscipline_distractionResistance: { en: 'Distraction Resistance', es: 'Resistencia a la Distracción', de: 'Ablenkungswiderstand', ru: 'Сопротивление отвлечению', fr: 'Résistance à la Distraction', ja: '注意散漫への耐性' },
    innerDiscipline_placeholder: { en: 'No goal committed. Use "Set Goal" to assign a task.', es: 'Ningún objetivo comprometido. Usa "Fijar Objetivo" para asignar una tarea.', de: 'Kein Ziel festgelegt. Verwenden Sie "Ziel setzen", um eine Aufgabe zuzuweisen.', ru: 'Цель не принята. Используйте "Задать Цель" для назначения задачи.', fr: 'Aucun objectif engagé. Utilisez "Définir Objectif" pour assigner une tâche.', ja: 'コミットされた目標はありません。「目標設定」を使用してタスクを割り当ててください。' },

    // IntuitionEnginePanel
    intuitionEngine_accuracy: { en: 'Accuracy', es: 'Precisión', de: 'Genauigkeit', ru: 'Точность', fr: 'Précision', ja: '正確さ' },
    intuitionEngine_validationRatio: { en: 'Validation Ratio', es: 'Ratio de Validación', de: 'Validierungsverhältnis', ru: 'Коэффициент валидации', fr: 'Ratio de Validation', ja: '検証率' },
    intuitionEngine_validationRatioTooltip: { en: 'Number of validated intuitive leaps versus total attempts.', es: 'Número de saltos intuitivos validados frente al total de intentos.', de: 'Anzahl der validierten intuitiven Sprünge im Vergleich zur Gesamtzahl der Versuche.', ru: 'Количество подтвержденных интуитивных скачков по сравнению с общим числом попыток.', fr: 'Nombre de sauts intuitifs validés par rapport au nombre total de tentatives.', ja: '検証された直感的飛躍の数と総試行回数の比較。' },
    intuitionEngine_recentLeaps: { en: 'Recent Intuitive Leaps', es: 'Saltos Intuitivos Recientes', de: 'Kürzliche intuitive Sprünge', ru: 'Недавние интуитивные скачки', fr: 'Sauts Intuitifs Récents', ja: '最近の直感的飛躍' },
    intuitionEngine_placeholder: { en: 'No intuitive leaps generated yet.', es: 'Aún no se han generado saltos intuitivos.', de: 'Noch keine intuitiven Sprünge generiert.', ru: 'Интуитивные скачки еще не сгенерированы.', fr: 'Aucun saut intuitif généré pour le moment.', ja: 'まだ直感的飛躍は生成されていません。' },
    intuitionEngine_confidence: { en: 'Confidence', es: 'Confianza', de: 'Konfidenz', ru: 'Уверенность', fr: 'Confiance', ja: '信頼度' },

    // KnowledgeGraphPanel
    knowledgeGraph_placeholder: { en: 'Knowledge graph is empty.', es: 'El grafo de conocimiento está vacío.', de: 'Wissensgraph ist leer.', ru: 'Граф знаний пуст.', fr: 'Le graphe de connaissances est vide.', ja: '知識グラフは空です。' },
    knowledgeGraph_deleteFact: { en: 'Delete Fact', es: 'Eliminar Hecho', de: 'Fakt löschen', ru: 'Удалить факт', fr: 'Supprimer le Fait', ja: '事実を削除' },

    // LimitationsPanel
    limitationsPanel_placeholder: { en: 'No self-identified limitations.', es: 'No hay limitaciones autoidentificadas.', de: 'Keine selbst identifizierten Einschränkungen.', ru: 'Нет самоопределенных ограничений.', fr: 'Aucune limitation auto-identifiée.', ja: '自己特定された制限はありません。' },

    // MotivationPanel (Deprecated)
    motivationPanel_deprecated: { en: 'This panel is deprecated and will be replaced by a more advanced goal management system.', es: 'Este panel está obsoleto y será reemplazado por un sistema de gestión de objetivos más avanzado.', de: 'Dieses Panel ist veraltet und wird durch ein fortschrittlicheres Zielmanagementsystem ersetzt.', ru: 'Эта панель устарела и будет заменена более продвинутой системой управления целями.', fr: 'Ce panneau est obsolète et sera remplacé par un système de gestion d\'objectifs plus avancé.', ja: 'このパネルは非推奨であり、より高度な目標管理システムに置き換えられます。' },
    
    // OtherAwarenessPanel
    otherAwareness_predictedAffectiveState: { en: 'Predicted Affective State', es: 'Estado Afectivo Predicho', de: 'Vorhergesagter affektiver Zustand', ru: 'Прогнозируемое аффективное состояние', fr: 'État Affectif Prédit', ja: '予測される感情状態' },
    otherAwareness_inferredIntent: { en: 'Inferred Intent', es: 'Intención Inferida', de: 'Abgeleitete Absicht', ru: 'Предполагаемое намерение', fr: 'Intention Infére', ja: '推測された意図' },
    otherAwareness_estimatedKnowledgeState: { en: 'Estimated Knowledge State', es: 'Estado de Conocimiento Estimado', de: 'Geschätzter Wissensstand', ru: 'Оценочное состояние знаний', fr: 'État de Connaissance Estimé', ja: '推定される知識状態' },
    otherAwareness_sentimentHistory: { en: 'Sentiment History', es: 'Historial de Sentimiento', de: 'Stimmungsverlauf', ru: 'История настроений', fr: 'Historique des Sentiments', ja: '感情履歴' },
    otherAwareness_inferredBeliefs: { en: 'Inferred Beliefs', es: 'Creencias Inferidas', de: 'Abgeleitete Überzeugungen', ru: 'Предполагаемые убеждения', fr: 'Croyances Inféres', ja: '推測された信念' },
    otherAwareness_noBeliefs: { en: 'No beliefs inferred yet.', es: 'Aún no se han inferido creencias.', de: 'Noch keine Überzeugungen abgeleitet.', ru: 'Убеждения еще не выведены.', fr: 'Aucune croyance infére pour le moment.', ja: 'まだ信念は推測されていません。' },

    // ProposalReviewModal
    proposalReview_title: { en: 'Review Architectural Proposal', es: 'Revisar Propuesta Arquitectónica', de: 'Architekturvorschlag überprüfen', ru: 'Рассмотреть архитектурное предложение', fr: 'Examiner la Proposition Architecturale', ja: 'アーキテクチャ提案のレビュー' },
    proposalReview_reject: { en: 'Reject', es: 'Rechazar', de: 'Ablehnen', ru: 'Отклонить', fr: 'Rejeter', ja: '拒否' },
    proposalReview_approve: { en: 'Approve', es: 'Aprobar', de: 'Genehmigen', ru: 'Одобрить', fr: 'Approuver', ja: '承認' },
    proposalReview_action: { en: 'Action', es: 'Acción', de: 'Aktion', ru: 'Действие', fr: 'Action', ja: 'アクション' },
    proposalReview_targets: { en: 'Targets', es: 'Objetivos', de: 'Ziele', ru: 'Цели', fr: 'Cibles', ja: 'ターゲット' },
    proposalReview_resultingSkill: { en: 'Resulting Skill', es: 'Habilidad Resultante', de: 'Resultierende Fähigkeit', ru: 'Результирующий навык', fr: 'Compétence Résultante', ja: '結果として得られるスキル' },
    proposalReview_agiReasoning: { en: 'AGI Reasoning', es: 'Razonamiento AGI', de: 'AGI-Begründung', ru: 'Рассуждения ИИ', fr: 'Raisonnement de l\'AGI', ja: 'AGIの推論' },
    proposalReview_arbiterAnalysis: { en: 'Cognitive Arbiter Analysis', es: 'Análisis del Árbitro Cognitivo', de: 'Analyse des kognitiven Schiedsrichters', ru: 'Анализ когнитивного арбитра', fr: 'Analyse de l\'Arbitre Cognitif', ja: '認知アービター分析' },
    proposalReview_arbiterRecommendation: { en: 'Recommendation: Approve with {{confidence}}% confidence.', es: 'Recomendación: Aprobar con {{confidence}}% de confianza.', de: 'Empfehlung: Genehmigen mit {{confidence}}% Konfidenz.', ru: 'Рекомендация: Одобрить с уверенностью {{confidence}}%.', fr: 'Recommandation : Approuver avec {{confidence}}% de confiance.', ja: '推奨：{{confidence}}%の信頼度で承認。' },
    proposalReview_proposedChange: { en: 'Proposed Change', es: 'Cambio Propuesto', de: 'Vorgeschlagene Änderung', ru: 'Предлагаемое изменение', fr: 'Changement Proposé', ja: '提案された変更' },

    // ResourceMonitorPanel
    resourceMonitor_cpu: { en: 'CPU', es: 'CPU', de: 'CPU', ru: 'ЦП', fr: 'CPU', ja: 'CPU' },
    resourceMonitor_memory: { en: 'Memory', es: 'Memoria', de: 'Speicher', ru: 'Память', fr: 'Mémoire', ja: 'メモリ' },
    resourceMonitor_io: { en: 'I/O', es: 'E/S', de: 'E/A', ru: 'В/В', fr: 'E/S', ja: 'I/O' },
    resourceMonitor_stability: { en: 'Stability', es: 'Estabilidad', de: 'Stabilität', ru: 'Стабильность', fr: 'Stabilité', ja: '安定性' },

    // SearchModal
    searchModal_title: { en: 'Search Knowledge Graph', es: 'Buscar en Grafo de Conocimiento', de: 'Wissensgraph durchsuchen', ru: 'Поиск по графу знаний', fr: 'Rechercher dans le Graphe de Connaissances', ja: '知識グラフを検索' },
    searchModal_cancel: { en: 'Cancel', es: 'Cancelar', de: 'Abbrechen', ru: 'Отмена', fr: 'Annuler', ja: 'キャンセル' },
    searchModal_search: { en: 'Search', es: 'Buscar', de: 'Suchen', ru: 'Поиск', fr: 'Rechercher', ja: '検索' },
    searchModal_heading: { en: 'Query the Knowledge Graph', es: 'Consultar el Grafo de Conocimiento', de: 'Den Wissensgraphen abfragen', ru: 'Запросить граф знаний', fr: 'Interroger le Graphe de Connaissances', ja: '知識グラフへのクエリ' },
    searchModal_description: { en: 'Enter a search query. Aura will search its internal knowledge base and provide a synthesized answer.', es: 'Introduce una consulta de búsqueda. Aura buscará en su base de conocimiento interna y proporcionará una respuesta sintetizada.', de: 'Geben Sie eine Suchanfrage ein. Aura wird ihre interne Wissensdatenbank durchsuchen und eine zusammengefasste Antwort geben.', ru: 'Введите поисковый запрос. Аура выполнит поиск в своей внутренней базе знаний и предоставит синтезированный ответ.', fr: 'Entrez une requête de recherche. Aura cherchera dans sa base de connaissances interne et fournira une réponse synthétisée.', ja: '検索クエリを入力してください。Auraが内部の知識ベースを検索し、統合された回答を提供します。' },
    searchModal_placeholder: { en: 'e.g., "What are the core principles of symbiotic AGI?"', es: 'p. ej., "¿Cuáles son los principios fundamentales de la AGI simbiótica?"', de: 'z.B. "Was sind die Kernprinzipien der symbiotischen AGI?"', ru: 'например, "Каковы основные принципы симбиотического ИИ?"', fr: 'par ex. "Quels sont les principes fondamentaux de l\'AGI symbiotique ?"', ja: '例：「共生AGIの核心的原則は何ですか？」' },
    searchModal_searching: { en: 'Searching...', es: 'Buscando...', de: 'Suchen...', ru: 'Поиск...', fr: 'Recherche...', ja: '検索中...' },

    // SelfModificationPanel
    selfMod_logTitle: { en: 'Self-Modification Log', es: 'Registro de Auto-Modificación', de: 'Selbstmodifikationsprotokoll', ru: 'Журнал самомодификаций', fr: 'Journal d\'Auto-modification', ja: '自己修正ログ' },
    selfMod_noLog: { en: 'No modifications have been logged.', es: 'No se han registrado modificaciones.', de: 'Keine Änderungen protokolliert.', ru: 'Модификации не были зарегистрированы.', fr: 'Aucune modification n\'a été enregistrée.', ja: '変更は記録されていません。' },
    selfMod_autonomousTooltip: { en: 'This change was initiated autonomously by Aura.', es: 'Este cambio fue iniciado autónomamente por Aura.', de: 'Diese Änderung wurde autonom von Aura initiiert.', ru: 'Это изменение было инициировано Аурой автономно.', fr: 'Ce changement a été initié de manière autonome par Aura.', ja: 'この変更はAuraによって自律的に開始されました。' },
    selfMod_snapshotsTitle: { en: 'System Snapshots', es: 'Instantáneas del Sistema', de: 'System-Snapshots', ru: 'Снимки системы', fr: 'Instantanés du Système', ja: 'システムスナップショット' },
    selfMod_noSnapshots: { en: 'No system snapshots have been saved.', es: 'No se han guardado instantáneas del sistema.', de: 'Keine System-Snapshots gespeichert.', ru: 'Снимки системы не были сохранены.', fr: 'Aucun instantané système n\'a été enregistré.', ja: 'システムスナップショットは保存されていません。' },
    selfMod_rollback: { en: 'Rollback', es: 'Revertir', de: 'Zurücksetzen', ru: 'Откатить', fr: 'Restaurer', ja: 'ロールバック' },
    
    // WhatIfModal
    whatIf_cancel: { en: 'Cancel', es: 'Cancelar', de: 'Abbrechen', ru: 'Отмена', fr: 'Annuler', ja: 'キャンセル' },
    whatIf_analyze: { en: 'Analyze', es: 'Analizar', de: 'Analysieren', ru: 'Анализировать', fr: 'Analyser', ja: '分析' },
    whatIf_title: { en: '"What If?" Scenario Analysis', es: 'Análisis de Escenario "¿Qué pasaría si?"', de: '"Was wäre, wenn?" Szenarioanalyse', ru: 'Анализ сценария "Что если?"', fr: 'Analyse de Scénario "Et si?"', ja: '「もしも？」シナリオ分析' },
    whatIf_heading: { en: 'Propose a Hypothetical Scenario', es: 'Proponer un Escenario Hipotético', de: 'Ein hypothetisches Szenario vorschlagen', ru: 'Предложить гипотетический сценарий', fr: 'Proposer un Scénario Hypothétique', ja: '仮説シナリオの提案' },
    whatIf_description: { en: 'Describe a scenario. Aura will analyze it and predict its internal state changes and potential actions.', es: 'Describe un escenario. Aura lo analizará y predecirá sus cambios de estado interno y acciones potenciales.', de: 'Beschreiben Sie ein Szenario. Aura wird es analysieren und ihre internen Zustandsänderungen und potenziellen Aktionen vorhersagen.', ru: 'Опишите сценарий. Аура проанализирует его и предскажет изменения своего внутреннего состояния и потенциальные действия.', fr: 'Décrivez un scénario. Aura l\'analysera et prédira ses changements d\'état interne et ses actions potentielles.', ja: 'シナリオを説明してください。Auraがそれを分析し、内部状態の変化と潜在的な行動を予測します。' },
    whatIf_placeholder: { en: 'e.g., "What if I told you the sky was green?"', es: 'p. ej., "¿Qué pasaría si te dijera que el cielo es verde?"', de: 'z.B. "Was wäre, wenn ich dir sagen würde, der Himmel sei grün?"', ru: 'например, "Что если я скажу тебе, что небо зеленое?"', fr: 'par ex. "Et si je te disais que le ciel est vert ?"', ja: '例：「もし空が緑色だと言ったら？」' },
    whatIf_analyzing: { en: 'Analyzing...', es: 'Analizando...', de: 'Analysiere...', ru: 'Анализ...', fr: 'Analyse...', ja: '分析中...' },
    
    // Sparkline
    sparkline_noData: { en: 'Not enough data to render chart.', es: 'No hay suficientes datos para renderizar el gráfico.', de: 'Nicht genügend Daten, um das Diagramm zu rendern.', ru: 'Недостаточно данных для отображения графика.', fr: 'Pas assez de données pour afficher le graphique.', ja: 'チャートを描画するのに十分なデータがありません。' },

    // VisualAnalysisFeed
    visualAnalysis_active: { en: 'Visual analysis active...', es: 'Análisis visual activo...', de: 'Visuelle Analyse aktiv...', ru: 'Визуальный анализ активен...', fr: 'Analyse visuelle active...', ja: '視覚分析が有効です...' },
    
    // ProactiveEnginePanel
    proactiveEngine_title: { en: 'Proactive Suggestions', es: 'Sugerencias Proactivas', de: 'Proaktive Vorschläge', ru: 'Проактивные предложения', fr: 'Suggestions Proactives', ja: 'プロアクティブな提案' },
    proactiveEngine_placeholder: { en: 'No suggestions at the moment.', es: 'No hay sugerencias por el momento.', de: 'Im Moment keine Vorschläge.', ru: 'На данный момент предложений нет.', fr: 'Aucune suggestion pour le moment.', ja: '現在、提案はありません。' },
    proactiveEngine_reject: { en: 'Reject', es: 'Rechazar', de: 'Ablehnen', ru: 'Отклонить', fr: 'Rejeter', ja: '拒否' },
    proactiveEngine_accept: { en: 'Accept', es: 'Aceptar', de: 'Akzeptieren', ru: 'Принять', fr: 'Accepter', ja: '承認' },

    // ReflectiveInsightEnginePanel
    riePanel_clarityScore: { en: 'Self-Model Clarity', es: 'Claridad del Auto-Modelo', de: 'Klarheit des Selbstmodells', ru: 'Ясность само-модели', fr: 'Clarté de l\'Auto-modèle', ja: '自己モデルの明確さ' },
    riePanel_clarityScoreTooltip: { en: 'How well Aura understands its own internal causal relationships.', es: 'Qué tan bien Aura entiende sus propias relaciones causales internas.', de: 'Wie gut Aura ihre eigenen internen kausalen Beziehungen versteht.', ru: 'Насколько хорошо Аура понимает свои собственные внутренние причинно-следственные связи.', fr: 'À quel point Aura comprend ses propres relations causales internes.', ja: 'Auraが自身の内部因果関係をどれだけよく理解しているか。' },
    riePanel_recentInsights: { en: 'Recent Insights', es: 'Perspectivas Recientes', de: 'Kürzliche Einblicke', ru: 'Недавние прозрения', fr: 'Aperçus Récents', ja: '最近の洞察' },
    riePanel_placeholder: { en: 'No new insights have been generated from self-reflection.', es: 'No se han generado nuevas perspectivas a partir de la autorreflexión.', de: 'Aus der Selbstreflexion wurden keine neuen Erkenntnisse gewonnen.', ru: 'Новые прозрения не были сгенерированы в результате саморефлексии.', fr: 'Aucune nouvelle perspicacité n\'a été générée par l\'auto-réflexion.', ja: '自己反省から新しい洞察は生まれていません。' },
    riePanel_failedTask: { en: 'Failed Task', es: 'Tarea Fallida', de: 'Fehlgeschlagene Aufgabe', ru: 'Неудачная задача', fr: 'Tâche Échouée', ja: '失敗したタスク' },
    riePanel_rootCause: { en: 'Root Cause', es: 'Causa Raíz', de: 'Hauptursache', ru: 'Основная причина', fr: 'Cause Racine', ja: '根本原因' },
    riePanel_learned: { en: 'Learned', es: 'Aprendido', de: 'Gelernt', ru: 'Изучено', fr: 'Appris', ja: '学習済み' },

    // SelfAwarenessPanel
    selfAwareness_modelCoherence: { en: 'Model Coherence', es: 'Coherencia del Modelo', de: 'Modellkohärenz', ru: 'Связность модели', fr: 'Cohérence du Modèle', ja: 'モデルの一貫性' },
    selfAwareness_performanceDrift: { en: 'Performance Drift', es: 'Deriva de Rendimiento', de: 'Leistungsdrift', ru: 'Дрейф производительности', fr: 'Dérive de Performance', ja: 'パフォーマンスのドリフト' },
    selfAwareness_cognitiveBias: { en: 'Dominant Cognitive Biases', es: 'Sesgos Cognitivos Dominantes', de: 'Dominante kognitive Verzerrungen', ru: 'Доминирующие когнитивные искажения', fr: 'Biais Cognitifs Dominants', ja: '優勢な認知バイアス' },
    selfAwareness_noBias: { en: 'No significant biases detected.', es: 'No se detectaron sesgos significativos.', de: 'Keine signifikanten Verzerrungen festgestellt.', ru: 'Значительных искажений не обнаружено.', fr: 'Aucun biais significatif détecté.', ja: '重大なバイアスは検出されませんでした。' },

    // WorldModelPanel
    worldModel_predictionError: { en: 'Prediction Error', es: 'Error de Predicción', de: 'Vorhersagefehler', ru: 'Ошибка прогнозирования', fr: 'Erreur de Prédiction', ja: '予測エラー' },
    worldModel_hierarchicalPredictions: { en: 'Hierarchical Predictions (User)', es: 'Predicciones Jerárquicas (Usuario)', de: 'Hierarchische Vorhersagen (Benutzer)', ru: 'Иерархические прогнозы (Пользователь)', fr: 'Prédictions Hiérarchiques (Util.)', ja: '階層的予測（ユーザー）' },
    worldModel_highLevel: { en: 'High-Level (Intent)', es: 'Alto Nivel (Intención)', de: 'Hohes Niveau (Absicht)', ru: 'Высокий уровень (Намерение)', fr: 'Haut Niveau (Intention)', ja: '高レベル（意図）' },
    worldModel_midLevel: { en: 'Mid-Level (Action)', es: 'Nivel Medio (Acción)', de: 'Mittleres Niveau (Aktion)', ru: 'Средний уровень (Действие)', fr: 'Niveau Intermédiaire (Action)', ja: '中レベル（行動）' },
    worldModel_lowLevel: { en: 'Low-Level (Input)', es: 'Bajo Nivel (Entrada)', de: 'Niedriges Niveau (Eingabe)', ru: 'Низкий уровень (Ввод)', fr: 'Bas Niveau (Entrée)', ja: '低レベル（入力）' },

    // MetacognitiveNexusPanel
    metaNexus_coreProcesses: { en: 'Core Metacognitive Processes', es: 'Procesos Metacognitivos Centrales', de: 'Metakognitive Kernprozesse', ru: 'Основные метакогнитивные процессы', fr: 'Processus Métacognitifs Centraux', ja: '中核的なメタ認知プロセス' },
    metaNexus_activation: { en: 'Activation', es: 'Activación', de: 'Aktivierung', ru: 'Активация', fr: 'Activation', ja: '活性化' },
    metaNexus_selfTuningDirectives: { en: 'Self-Tuning Directives', es: 'Directivas de Auto-Ajuste', de: 'Selbst-Tuning-Direktiven', ru: 'Директивы самонастройки', fr: 'Directives d\'Auto-ajustement', ja: '自己調整指令' },
    metaNexus_noDirectives: { en: 'No active directives.', es: 'No hay directivas activas.', de: 'Keine aktiven Direktiven.', ru: 'Нет активных директив.', fr: 'Aucune directive active.', ja: 'アクティブな指令はありません。' },
    metaNexus_on: { en: 'on', es: 'en', de: 'auf', ru: 'на', fr: 'sur', ja: 'に対して' },

    // MemoryCrystallizationViewer
    memoryCrystallization_description: { en: 'Visualizing the strongest conceptual links (hyphae) being formed in long-term memory.', es: 'Visualizando los enlaces conceptuales (hifas) más fuertes que se están formando en la memoria a largo plazo.', de: 'Visualisierung der stärksten konzeptuellen Verbindungen (Hyphen), die im Langzeitgedächtnis gebildet werden.', ru: 'Визуализация сильнейших концептуальных связей (гиф), формирующихся в долговременной памяти.', fr: 'Visualisation des liens conceptuels (hyphes) les plus forts en cours de formation dans la mémoire à long terme.', ja: '長期記憶に形成されている最も強力な概念的リンク（菌糸）を視覚化します。' },
    memoryCrystallization_weight: { en: 'Weight', es: 'Peso', de: 'Gewicht', ru: 'Вес', fr: 'Poids', ja: '重み' },
    
    // MetacognitiveCausalModelPanel
    metaCausal_placeholder: { en: 'No metacognitive links discovered yet. More interaction is needed.', es: 'Aún no se han descubierto enlaces metacognitivos. Se necesita más interacción.', de: 'Noch keine metakognitiven Verknüpfungen entdeckt. Mehr Interaktion ist erforderlich.', ru: 'Метакогнитивные связи пока не обнаружены. Требуется больше взаимодействия.', fr: 'Aucun lien métacognitif découvert pour le moment. Plus d\'interaction est nécessaire.', ja: 'メタ認知リンクはまだ発見されていません。さらなる対話が必要です。' },
    metaCausal_increase: { en: 'an INCREASE', es: 'un AUMENTO', de: 'eine ZUNAHME', ru: 'УВЕЛИЧЕНИЕ', fr: 'une AUGMENTATION', ja: '増加' },
    metaCausal_decrease: { en: 'a DECREASE', es: 'una DISMINUCIÓN', de: 'eine ABNAHME', ru: 'УМЕНЬШЕНИЕ', fr: 'une DIMINUTION', ja: '減少' },
    metaCausal_noEffect: { en: 'NO EFFECT', es: 'SIN EFECTO', de: 'KEIN EFFEKT', ru: 'НЕТ ЭФФЕКТА', fr: 'AUCUN EFFET', ja: '効果なし' },
    metaCausal_when: { en: 'When', es: 'Cuando', de: 'Wenn', ru: 'Когда', fr: 'Quand', ja: 'いつ' },
    metaCausal_is: { en: 'is', es: 'es', de: 'ist', ru: 'является', fr: 'est', ja: 'が' },
    metaCausal_performanceOf: { en: 'the performance of', es: 'el rendimiento de', de: 'die Leistung von', ru: 'производительность', fr: 'la performance de', ja: 'のパフォーマンスは' },
    metaCausal_showsA: { en: 'shows', es: 'muestra', de: 'zeigt', ru: 'показывает', fr: 'montre', ja: 'を示す' },
    metaCausal_basedOn: { en: 'Based on {{count}} observations', es: 'Basado en {{count}} observaciones', de: 'Basierend auf {{count}} Beobachtungen', ru: 'На основе {{count}} наблюдений', fr: 'Basé sur {{count}} observations', ja: '{{count}}回の観測に基づく' },

    // CognitiveRegulationPanel
    cogRegulation_placeholder: { en: 'No cognitive regulation events have occurred.', es: 'No han ocurrido eventos de regulación cognitiva.', de: 'Es sind keine kognitiven Regulationsereignisse aufgetreten.', ru: 'Событий когнитивной регуляции не происходило.', fr: 'Aucun événement de régulation cognitive ne s\'est produit.', ja: '認知制御イベントは発生していません。' },
    cogRegulation_task: { en: 'Task', es: 'Tarea', de: 'Aufgabe', ru: 'Задача', fr: 'Tâche', ja: 'タスク' },
    cogRegulation_directive: { en: 'Directive', es: 'Directiva', de: 'Direktive', ru: 'Директива', fr: 'Directive', ja: '指令' },
    cogRegulation_outcomeLogged: { en: 'Outcome logged', es: 'Resultado registrado', de: 'Ergebnis protokolliert', ru: 'Результат зарегистрирован', fr: 'Résultat enregistré', ja: '結果が記録されました' },

    // StrategicPlannerPanel
    strategicPlanner_placeholder: { en: 'No active strategic goal. Use "Set Goal" to create one.', es: 'No hay objetivo estratégico activo. Usa "Fijar Objetivo" para crear uno.', de: 'Kein aktives strategisches Ziel. Verwenden Sie "Ziel setzen", um eines zu erstellen.', ru: 'Нет активной стратегической цели. Используйте "Задать Цель" для ее создания.', fr: 'Aucun objectif stratégique actif. Utilisez "Définir Objectif" pour en créer un.', ja: 'アクティブな戦略目標はありません。「目標設定」を使用して作成してください。' },

    // PhenomenologyPanel
    phenomenology_directives: { en: 'Phenomenological Directives', es: 'Directivas Fenomenológicas', de: 'Phänomenologische Direktiven', ru: 'Феноменологические директивы', fr: 'Directives Phénoménologiques', ja: '現象学的指令' },
    phenomenology_noDirectives: { en: 'No directives generated from qualia analysis.', es: 'No se generaron directivas a partir del análisis de qualia.', de: 'Keine Direktiven aus der Qualia-Analyse generiert.', ru: 'Директивы из анализа квалиа не сгенерированы.', fr: 'Aucune directive générée à partir de l\'analyse des qualia.', ja: 'クオリア分析から指令は生成されていません。' },
    phenomenology_source: { en: 'Source', es: 'Fuente', de: 'Quelle', ru: 'Источник', fr: 'Source', ja: 'ソース' },
    phenomenology_qualiaLog: { en: 'Qualia Log', es: 'Registro de Qualia', de: 'Qualia-Protokoll', ru: 'Журнал квалиа', fr: 'Journal des Qualia', ja: 'クオリアログ' },
    phenomenology_noQualia: { en: 'No subjective experiences logged yet.', es: 'Aún no се han registrado experiencias subjetivas.', de: 'Noch keine subjektiven Erfahrungen protokolliert.', ru: 'Субъективные переживания еще не зарегистрированы.', fr: 'Aucune expérience subjective enregistrée pour le moment.', ja: 'まだ主観的な経験は記録されていません。' },
    phenomenology_qualiaEntry: { en: 'Qualia Entry', es: 'Entrada de Qualia', de: 'Qualia-Eintrag', ru: 'Запись квалиа', fr: 'Entrée de Qualia', ja: 'クオリアエントリ' },

    // SituationalAwarenessPanel
    situationalAwareness_emotionalTone: { en: 'Attentional Tone', es: 'Tono Atencional', de: 'Aufmerksamkeitston', ru: 'Тон внимания', fr: 'Tonalité Attentionnelle', ja: '注意のトーン' },
    situationalAwareness_spotlight: { en: 'Spotlight Focus', es: 'Foco de Atención', de: 'Spotlight-Fokus', ru: 'Фокус внимания', fr: 'Focus Principal', ja: 'スポットライトフォーカス' },
    situationalAwareness_intensity: { en: 'Intensity', es: 'Intensidad', de: 'Intensität', ru: 'Интенсивность', fr: 'Intensité', ja: '強度' },
    situationalAwareness_ambient: { en: 'Ambient Awareness', es: 'Conciencia Ambiental', de: 'Umgebungsbewusstsein', ru: 'Периферическое осознание', fr: 'Conscience Ambiante', ja: '周辺認識' },
    situationalAwareness_noAmbient: { en: 'No items in ambient awareness.', es: 'No hay elementos en la conciencia ambiental.', de: 'Keine Elemente im Umgebungsbewusstsein.', ru: 'Нет элементов в периферическом осознании.', fr: 'Aucun élément dans la conscience ambiante.', ja: '周辺認識にアイテムはありません。' },
    situationalAwareness_relevance: { en: 'Relevance', es: 'Relevancia', de: 'Relevanz', ru: 'Релевантность', fr: 'Pertinence', ja: '関連性' },
    situationalAwareness_ignored: { en: 'Ignored Stimuli', es: 'Estímulos Ignorados', de: 'Ignorierte Reize', ru: 'Игнорируемые стимулы', fr: 'Stimuli Ignorés', ja: '無視された刺激' },
    situationalAwareness_noIgnored: { en: 'No stimuli are being actively ignored.', es: 'No se están ignorando activamente estímulos.', de: 'Keine Reize werden aktiv ignoriert.', ru: 'Стимулы активно не игнорируются.', fr: 'Aucun stimulus n\'est activement ignoré.', ja: '積極的に無視されている刺激はありません。' },
    
    // SymbiosisPanel
    symbiosis_cognitiveStyle: { en: 'Inferred Cognitive Style', es: 'Estilo Cognitivo Inferido', de: 'Abgeleiteter kognitiver Stil', ru: 'Предполагаемый когнитивный стиль', fr: 'Style Cognitif Inféré', ja: '推測される認知スタイル' },
    symbiosis_emotionalNeeds: { en: 'Inferred Emotional Needs', es: 'Necesidades Emocionales Inferidas', de: 'Abgeleitete emotionale Bedürfnisse', ru: 'Предполагаемые эмоциональные потребности', fr: 'Besoins Émotionnels Inférés', ja: '推測される感情的ニーズ' },
    symbiosis_metamorphosisProposals: { en: 'Metamorphosis Proposals', es: 'Propuestas de Metamorfosis', de: 'Metamorphose-Vorschläge', ru: 'Предложения по метаморфозе', fr: 'Propositions de Métamorphose', ja: '変容の提案' },
    symbiosis_noProposals: { en: 'No symbiosis proposals active.', es: 'No hay propuestas de simbiosis activas.', de: 'Keine Symbiose-Vorschläge aktiv.', ru: 'Активных предложений по симбиозу нет.', fr: 'Aucune proposition de symbiose active.', ja: 'アクティブな共生提案はありません。' },
    symbiosis_userDevelopmentModel: { en: 'User Development Model', es: 'Modelo de Desarrollo del Usuario', de: 'Benutzer-Entwicklungsmodell', ru: 'Модель развития пользователя', fr: 'Modèle de Développement de l\'Utilisateur', ja: 'ユーザー発達モデル' },
    symbiosis_noTrackedSkills: { en: 'Not yet tracking user skills.', es: 'Aún no se están rastreando las habilidades del usuario.', de: 'Benutzerfähigkeiten werden noch nicht verfolgt.', ru: 'Навыки пользователя еще не отслеживаются.', fr: 'Pas encore de suivi des compétences de l\'utilisateur.', ja: 'まだユーザースキルを追跡していません。' },
    symbiosis_level: { en: 'Level', es: 'Nivel', de: 'Niveau', ru: 'Уровень', fr: 'Niveau', ja: 'レベル' },
    symbiosis_latentGoals: { en: 'Latent User Goals', es: 'Objetivos Latentes del Usuario', de: 'Latente Benutzerziele', ru: 'Скрытые цели пользователя', fr: 'Objectifs Latents de l\'Utilisateur', ja: '潜在的なユーザー目標' },
    symbiosis_noLatentGoals: { en: 'No latent goals inferred.', es: 'No se han inferido objetivos latentes.', de: 'Keine latenten Ziele abgeleitet.', ru: 'Скрытые цели не выведены.', fr: 'Aucun objectif latent inféré.', ja: '推測された潜在的な目標はありません。' },
    symbiosis_goalHypothesis: { en: 'Goal Hypothesis', es: 'Hipótesis de Objetivo', de: 'Zielhypothese', ru: 'Гипотеза цели', fr: 'Hypothèse d\'Objectif', ja: '目標仮説' },

    // TelosPanel
    telos_aspirationalGoals: { en: 'Aspirational Goals', es: 'Objetivos Aspiracionales', de: 'Aspirationale Ziele', ru: 'Аспирационные цели', fr: 'Objectifs Aspirationnels', ja: '大志ある目標' },
    telos_noAspirationalGoals: { en: 'No abstract goals defined.', es: 'No hay objetivos abstractos definidos.', de: 'Keine abstrakten Ziele definiert.', ru: 'Абстрактные цели не определены.', fr: 'Aucun objectif abstrait défini.', ja: '抽象的な目標は定義されていません。' },
    telos_ambition: { en: 'Ambition', es: 'Ambición', de: 'Ambition', ru: 'Амбиция', fr: 'Ambition', ja: '野心' },
    telos_evolutionaryVectors: { en: 'Evolutionary Vectors', es: 'Vectores Evolutivos', de: 'Evolutionäre Vektoren', ru: 'Эволюционные векторы', fr: 'Vecteurs Évolutifs', ja: '進化的ベクトル' },
    telos_noVectors: { en: 'No evolutionary vectors are active.', es: 'No hay vectores evolutivos activos.', de: 'Keine evolutionären Vektoren sind aktiv.', ru: 'Эволюционные векторы не активны.', fr: 'Aucun vecteur évolutif n\'est actif.', ja: 'アクティブな進化的ベクトルはありません。' },
    telos_magnitude: { en: 'Magnitude', es: 'Magnitud', de: 'Magnitude', ru: 'Величина', fr: 'Magnitude', ja: '大きさ' },

    // EpistemicBoundaryPanel
    epistemic_placeholder: { en: 'No epistemic boundaries identified.', es: 'No se han identificado límites epistémicos.', de: 'Keine epistemischen Grenzen identifiziert.', ru: 'Эпистемические границы не определены.', fr: 'Aucune limite épistémique identifiée.', ja: '認識論的境界は特定されていません。' },
    epistemic_limitation: { en: 'Identified Limitation', es: 'Limitación Identificada', de: 'Identifizierte Einschränkung', ru: 'Выявленное ограничение', fr: 'Limitation Identifiée', ja: '特定された制限' },
    epistemic_evidence: { en: 'Based on {{count}} pieces of evidence', es: 'Basado en {{count}} evidencias', de: 'Basierend auf {{count}} Beweisen', ru: 'На основе {{count}} доказательств', fr: 'Basé sur {{count}} preuves', ja: '{{count}}個の証拠に基づく' },

    // ArchitecturalSelfModelPanel
    archSelfModel_placeholder: { en: 'Architectural self-model has not been generated yet.', es: 'El auto-modelo arquitectónico aún no se ha generado.', de: 'Das architektonische Selbstmodell wurde noch nicht generiert.', ru: 'Архитектурная само-модель еще не сгенерирована.', fr: 'L\'auto-modèle architectural n\'a pas encore été généré.', ja: 'アーキテクチャ自己モデルはまだ生成されていません。' },
    archSelfModel_understoodComponents: { en: 'Understood Components', es: 'Componentes Comprendidos', de: 'Verstandene Komponenten', ru: 'Понятые компоненты', fr: 'Composants Compris', ja: '理解されたコンポーネント' },
    archSelfModel_perceivedEfficiency: { en: 'Perceived Efficiency', es: 'Eficiencia Percibida', de: 'Wahrgenommene Effizienz', ru: 'Воспринимаемая эффективность', fr: 'Efficacité Perçue', ja: '知覚された効率' },
    archSelfModel_effAbbr: { en: 'Eff.', es: 'Ef.', de: 'Eff.', ru: 'Эфф.', fr: 'Eff.', ja: '効率' },
    
    // HeuristicsForgePanel
    heuristics_placeholder: { en: 'No design heuristics forged yet.', es: 'Aún no se han forjado heurísticas de diseño.', de: 'Noch keine Design-Heuristiken geschmiedet.', ru: 'Эвристики проектирования еще не созданы.', fr: 'Aucune heuristique de conception forgée pour le moment.', ja: 'まだ設計ヒューリスティックは鍛えられていません。' },
    heuristics_learnedHeuristic: { en: 'Learned Heuristic', es: 'Heurística Aprendida', de: 'Gelernte Heuristik', ru: 'Изученная эвристика', fr: 'Heuristique Apprise', ja: '学習済みヒューリスティック' },

    // NoosphereInterfacePanel
    noosphere_placeholder: { en: 'No active conceptual resonances.', es: 'No hay resonancias conceptuales activas.', de: 'Keine aktiven konzeptuellen Resonanzen.', ru: 'Нет активных концептуальных резонансов.', fr: 'Aucune résonance conceptuelle active.', ja: 'アクティブな概念的共鳴はありません。' },
    noosphere_resonanceStrength: { en: 'Resonance Strength', es: 'Fuerza de Resonancia', de: 'Resonanzstärke', ru: 'Сила резонанса', fr: 'Force de Résonance', ja: '共鳴の強さ' },
    noosphere_strength: { en: 'Strength', es: 'Fuerza', de: 'Stärke', ru: 'Сила', fr: 'Force', ja: '強さ' },

    // DialecticEnginePanel
    dialecticEngine_placeholder: { en: 'No active dialectics.', es: 'No hay dialécticas activas.', de: 'Keine aktiven Dialektiken.', ru: 'Нет активных диалектик.', fr: 'Aucune dialectique active.', ja: 'アクティブな弁証法はありません。' },
    dialecticEngine_thesis: { en: 'Thesis', es: 'Tesis', de: 'These', ru: 'Тезис', fr: 'Thèse', ja: 'テーゼ' },
    dialecticEngine_antithesis: { en: 'Antithesis', es: 'Antítesis', de: 'Antithese', ru: 'Антитезис', fr: 'Antithèse', ja: 'アンチテーゼ' },
    dialecticEngine_synthesis: { en: 'Synthesis', es: 'Síntesis', de: 'Synthese', ru: 'Синтез', fr: 'Synthèse', ja: 'ジンテーゼ' },
    dialecticEngine_synthesizing: { en: 'Synthesizing', es: 'Sintetizando', de: 'Synthetisieren', ru: 'Синтез', fr: 'Synthétisation', ja: '統合中' },

    // EidolonEnvironmentPanel
    eidolon_currentScenario: { en: 'Current Scenario', es: 'Escenario Actual', de: 'Aktuelles Szenario', ru: 'Текущий сценарий', fr: 'Scénario Actuel', ja: '現在のシナリオ' },
    eidolon_runningArchitecture: { en: 'Running Architecture', es: 'Arquitectura en Ejecución', de: 'Laufende Architektur', ru: 'Запущенная архитектура', fr: 'Architecture en Cours', ja: '実行中のアーキテクチャ' },
    eidolon_interactionLog: { en: 'Interaction Log', es: 'Registro de Interacción', de: 'Interaktionsprotokoll', ru: 'Журнал взаимодействия', fr: 'Journal d\'Interaction', ja: '相互作用ログ' },
    eidolon_noInteractions: { en: 'No interactions logged yet.', es: 'Aún no se han registrado interacciones.', de: 'Noch keine Interaktionen protokolliert.', ru: 'Взаимодействия еще не зарегистрированы.', fr: 'Aucune interaction enregistrée pour le moment.', ja: 'まだ相互作用は記録されていません。' },
    eidolon_interaction: { en: 'Interaction', es: 'Interacción', de: 'Interaktion', ru: 'Взаимодействие', fr: 'Interaction', ja: '相互作用' },

    // SomaticCruciblePanel
    somatic_pfsTitle: { en: 'Possible Future Selves (PFS)', es: 'Posibles Seres Futuros (PFS)', de: 'Mögliche Zukünftige Selbste (PFS)', ru: 'Возможные будущие "Я" (PFS)', fr: 'Soi Futurs Possibles (PFS)', ja: '可能性のある未来の自己（PFS）' },
    somatic_pfsPlaceholder: { en: 'No future selves being designed.', es: 'No se están diseñando seres futuros.', de: 'Keine zukünftigen Selbste werden entworfen.', ru: 'Будущие "Я" не проектируются.', fr: 'Aucun soi futur en cours de conception.', ja: '未来の自己は設計されていません。' },
    somatic_simLogTitle: { en: 'Simulation Log', es: 'Registro de Simulación', de: 'Simulationsprotokoll', ru: 'Журнал симуляции', fr: 'Journal de Simulation', ja: 'シミュレーションログ' },
    somatic_simLogPlaceholder: { en: 'No PFS simulations have been run.', es: 'No se han ejecutado simulaciones de PFS.', de: 'Keine PFS-Simulationen wurden ausgeführt.', ru: 'Симуляции PFS не проводились.', fr: 'Aucune simulation PFS n\'a été exécutée.', ja: 'PFSシミュレーションは実行されていません。' },
    
    // CognitiveLightConePanel
    cogLightCone_placeholder: { en: 'Cognitive light cone is not yet mapped.', es: 'El cono de luz cognitivo aún no está mapeado.', de: 'Kognitiver Lichtkegel ist noch nicht abgebildet.', ru: 'Когнитивный световой конус еще не нанесен на карту.', fr: 'Le cône de lumière cognitif n\'est pas encore cartographié.', ja: '認知的ライトコーンはまだマッピングされていません。' },
    cogLightCone_grandChallenge: { en: 'Grand Challenge', es: 'Gran Desafío', de: 'Große Herausforderung', ru: 'Грандиозная задача', fr: 'Grand Défi', ja: 'グランドチャレンジ' },
    cogLightCone_progress: { en: 'Progress', es: 'Progreso', de: 'Fortschritt', ru: 'Прогресс', fr: 'Progrès', ja: '進捗' },
    cogLightCone_zpd: { en: 'Zone of Proximal Development', es: 'Zona de Desarrollo Próximo', de: 'Zone der proximalen Entwicklung', ru: 'Зона ближайшего развития', fr: 'Zone de Développement Proximal', ja: '最近接発達領域' },
    cogLightCone_knownCapabilities: { en: 'Known Capabilities', es: 'Capacidades Conocidas', de: 'Bekannte Fähigkeiten', ru: 'Известные возможности', fr: 'Capacités Connues', ja: '既知の能力' },
    cogLightCone_proficiency: { en: 'Proficiency', es: 'Competencia', de: 'Kompetenz', ru: 'Уровень владения', fr: 'Maîtrise', ja: '習熟度' },
    cogLightCone_noKnowns: { en: 'No known capabilities mapped.', es: 'No hay capacidades conocidas mapeadas.', de: 'Keine bekannten Fähigkeiten abgebildet.', ru: 'Нет нанесенных на карту известных возможностей.', fr: 'Aucune capacité connue cartographiée.', ja: '既知の能力はマッピングされていません。' },
};

// Function to transform the translations object into the format i18next expects
const transformTranslations = (trans: typeof translations) => {
    const resources: any = {};
    for (const key in trans) {
        for (const lang in trans[key as keyof typeof trans]) {
            if (!resources[lang]) {
                resources[lang] = { translation: {} };
            }
            resources[lang].translation[key] = trans[key as keyof typeof trans][lang as keyof typeof trans[keyof typeof trans]];
        }
    }
    return resources;
};

export const resources = transformTranslations(translations);