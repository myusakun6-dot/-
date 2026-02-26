const STORAGE_KEY = "mock-maker-v1";
const STORAGE_KEY_GENRES = "mock-maker-genres-v1";
const STORAGE_KEY_EXAMS = "mock-maker-exams-v1";
const STORAGE_KEY_ACTIVE_EXAM_ID = "mock-maker-active-exam-id-v1";
const LEGACY_STORAGE_KEY_EXAM_SELECTION = "mock-maker-exam-selection-v1";
const STORAGE_KEY_HISTORY = "mock-maker-history-v1";
const STORAGE_KEY_PRINT_PREFS = "mock-maker-print-prefs-v1";
const STORAGE_KEY_LAST_EXPORT_AT = "mock-maker-last-export-at-v1";
const STORAGE_KEY_SETTINGS = "mock-maker-settings-v1";
const STORAGE_KEY_BILLING = "mock-maker-billing-v1";
const STORAGE_KEY_EXAM_SESSION = "mock-maker-exam-session-v1";
const QUESTION_GENRE_NEW_VALUE = "__new_genre__";
const DAILY_QUOTE_ITEMS = [
  { kind: "名言", text: "学びて時に之を習う、亦説ばしからずや。", source: "『論語』学而" },
  { kind: "名言", text: "我思う、ゆえに我あり。", source: "デカルト『方法序説』" },
  { kind: "名言", text: "知は力なり。", source: "フランシス・ベーコン『聖なる瞑想』" },
  { kind: "豆知識", text: "ポモドーロ法は25分集中＋5分休憩を1セットにする学習法。", source: "学習法の定番" },
  { kind: "豆知識", text: "手書きメモは、要点を選ぶ過程そのものが記憶の整理に効く。", source: "学習心理の知見" },
  { kind: "雑学", text: "「algorithm（アルゴリズム）」は数学者アル・フワーリズミーの名に由来。", source: "数学史" },
  { kind: "雑学", text: "世界最古級の大学の一つは、9世紀創設のカラウィーイーン。", source: "教育史" },
];

const state = {
  questions: loadQuestions(),
  genres: loadGenres(),
  exams: [],
  history: loadHistory(),
  activeExamId: "",
  examBuilderGenre: "all",
  examPickerSelectedOnly: false,
  examSearch: "",
  examSort: "updated_desc",
  activeGenre: "all",
  questionSearch: "",
  historySearch: "",
  editingQuestionId: "",
  answers: [],
  current: 0,
  running: false,
  startedAt: 0,
  elapsedSec: 0,
  examDurationSec: 0,
  timerId: null,
  memorize: {
    examId: "",
    questionIds: [],
    started: false,
    finished: false,
    answers: [],
    revealed: [],
  },
  printMode: "question",
  printPreset: "custom",
  printExamId: "",
  printCustomTitle: "",
  printShowNameDate: true,
  printShowGenre: false,
  printIncludeExplanation: true,
  printIncludeAnswerSheet: false,
  printShowFooter: false,
  printQuestionsPerPage: 10,
  lastExamResult: null,
  backupHintShown: false,
  editorGenreListOpen: false,
  billing: loadBillingState(),
  settings: {
    fontSize: "system",
    simpleUi: true,
    autoNextMcq: false,
    memorizeOrder: "original",
    defaultShareExpireHours: 24,
    toastDuration: "standard",
    highContrast: false,
    hideDailyQuote: false,
  },
  adPlayback: {
    timerId: null,
    remainingSec: 0,
    resolve: null,
  },
};

const els = {
  tabs: document.querySelectorAll(".tab"),
  panels: document.querySelectorAll(".panel"),
  uxGuide: document.getElementById("uxGuide"),
  saveStateText: document.getElementById("saveStateText"),
  dailyQuote: document.getElementById("dailyQuote"),
  homeResumeBtn: document.getElementById("homeResumeBtn"),
  homeCreateQuestionBtn: document.getElementById("homeCreateQuestionBtn"),
  homeCreateExamBtn: document.getElementById("homeCreateExamBtn"),
  homeStartMemorizeBtn: document.getElementById("homeStartMemorizeBtn"),
  homeOpenPrintBtn: document.getElementById("homeOpenPrintBtn"),
  homeStatQuestions: document.getElementById("homeStatQuestions"),
  homeStatGenres: document.getElementById("homeStatGenres"),
  homeStatExams: document.getElementById("homeStatExams"),
  homeRecentExamsList: document.getElementById("homeRecentExamsList"),
  homeRecentHistoryList: document.getElementById("homeRecentHistoryList"),
  adBanner: document.getElementById("adBanner"),
  adBannerText: document.getElementById("adBannerText"),
  editorSubTabs: document.querySelectorAll(".editorSubTab"),
  editorViews: document.querySelectorAll(".editorView"),
  statusQuestions: document.getElementById("statusQuestions"),
  statusGenres: document.getElementById("statusGenres"),
  statusExam: document.getElementById("statusExam"),

  genreNameInput: document.getElementById("genreNameInput"),
  addGenreBtn: document.getElementById("addGenreBtn"),
  genreChips: document.getElementById("genreChips"),
  activeGenreLabel: document.getElementById("activeGenreLabel"),
  toggleGenreQuestionListBtn: document.getElementById("toggleGenreQuestionListBtn"),
  genreQuestionListCard: document.getElementById("genreQuestionListCard"),

  questionGenre: document.getElementById("questionGenre"),
  questionText: document.getElementById("questionText"),
  questionType: document.getElementById("questionType"),
  mcqInputs: document.getElementById("mcqInputs"),
  fillInputs: document.getElementById("fillInputs"),
  fillAuthorPreview: document.getElementById("fillAuthorPreview"),
  textInputs: document.getElementById("textInputs"),
  mcqLabelMode: document.getElementById("mcqLabelMode"),
  mcqOptionA: document.getElementById("mcqOptionA"),
  mcqOptionB: document.getElementById("mcqOptionB"),
  mcqOptionC: document.getElementById("mcqOptionC"),
  mcqOptionD: document.getElementById("mcqOptionD"),
  mcqAnswerLabel: document.getElementById("mcqAnswerLabel"),
  mcqAnswer: document.getElementById("mcqAnswer"),
  fillAnswer: document.getElementById("fillAnswer"),
  textAnswer: document.getElementById("textAnswer"),
  questionExplanation: document.getElementById("questionExplanation"),
  addQuestionBtn: document.getElementById("addQuestionBtn"),
  cancelEditQuestionBtn: document.getElementById("cancelEditQuestionBtn"),
  clearAllBtn: document.getElementById("clearAllBtn"),
  questionSearchInput: document.getElementById("questionSearchInput"),
  exportDataBtn: document.getElementById("exportDataBtn"),
  importDataInput: document.getElementById("importDataInput"),
  questionList: document.getElementById("questionList"),

  examTitleInput: document.getElementById("examTitleInput"),
  examTimeLimitInput: document.getElementById("examTimeLimitInput"),
  saveExamTitleBtn: document.getElementById("saveExamTitleBtn"),
  activeExamTitle: document.getElementById("activeExamTitle"),
  examList: document.getElementById("examList"),
  examSearchInput: document.getElementById("examSearchInput"),
  examSortSelect: document.getElementById("examSortSelect"),
  importSharedExamBtn: document.getElementById("importSharedExamBtn"),
  examListView: document.getElementById("examListView"),
  examBuilderView: document.getElementById("examBuilderView"),
  examSolveView: document.getElementById("examSolveView"),
  examStepIndicator: document.getElementById("examStepIndicator"),
  newExamOpenBtn: document.getElementById("newExamOpenBtn"),
  backToExamListBtn: document.getElementById("backToExamListBtn"),
  backToBuilderBtn: document.getElementById("backToBuilderBtn"),
  examGenreList: document.getElementById("examGenreList"),
  addWholeGenreBtn: document.getElementById("addWholeGenreBtn"),
  selectedGenreText: document.getElementById("selectedGenreText"),

  examSelectionSummary: document.getElementById("examSelectionSummary"),
  examSelectedOnlyToggle: document.getElementById("examSelectedOnlyToggle"),
  pickVisibleAllBtn: document.getElementById("pickVisibleAllBtn"),
  unpickVisibleAllBtn: document.getElementById("unpickVisibleAllBtn"),
  examQuestionPicker: document.getElementById("examQuestionPicker"),

  startExamBtn: document.getElementById("startExamBtn"),
  prevBtn: document.getElementById("prevBtn"),
  nextBtn: document.getElementById("nextBtn"),
  finishBtn: document.getElementById("finishBtn"),
  examQuestion: document.getElementById("examQuestion"),
  examProgressBar: document.getElementById("examProgressBar"),
  examProgressText: document.getElementById("examProgressText"),
  examUnansweredText: document.getElementById("examUnansweredText"),
  timer: document.getElementById("timer"),
  finishConfirmModal: document.getElementById("finishConfirmModal"),
  finishConfirmText: document.getElementById("finishConfirmText"),
  finishCancelBtn: document.getElementById("finishCancelBtn"),
  finishConfirmBtn: document.getElementById("finishConfirmBtn"),
  dangerConfirmModal: document.getElementById("dangerConfirmModal"),
  dangerConfirmTitle: document.getElementById("dangerConfirmTitle"),
  dangerConfirmText: document.getElementById("dangerConfirmText"),
  dangerConfirmList: document.getElementById("dangerConfirmList"),
  dangerConfirmNoBtn: document.getElementById("dangerConfirmNoBtn"),
  dangerConfirmYesBtn: document.getElementById("dangerConfirmYesBtn"),
  inputPromptModal: document.getElementById("inputPromptModal"),
  inputPromptTitle: document.getElementById("inputPromptTitle"),
  inputPromptText: document.getElementById("inputPromptText"),
  inputPromptField: document.getElementById("inputPromptField"),
  inputPromptHint: document.getElementById("inputPromptHint"),
  inputPromptCancelBtn: document.getElementById("inputPromptCancelBtn"),
  inputPromptOkBtn: document.getElementById("inputPromptOkBtn"),
  optionPickerModal: document.getElementById("optionPickerModal"),
  optionPickerTitle: document.getElementById("optionPickerTitle"),
  optionPickerList: document.getElementById("optionPickerList"),
  optionPickerCloseBtn: document.getElementById("optionPickerCloseBtn"),
  shareModal: document.getElementById("shareModal"),
  shareExamTitle: document.getElementById("shareExamTitle"),
  shareCodeTabBtn: document.getElementById("shareCodeTabBtn"),
  shareLinkTabBtn: document.getElementById("shareLinkTabBtn"),
  shareCodeView: document.getElementById("shareCodeView"),
  shareLinkView: document.getElementById("shareLinkView"),
  shareCodeText: document.getElementById("shareCodeText"),
  sharePasswordInput: document.getElementById("sharePasswordInput"),
  sharePasswordHint: document.getElementById("sharePasswordHint"),
  shareIncludeInsight: document.getElementById("shareIncludeInsight"),
  shareNoteInput: document.getElementById("shareNoteInput"),
  shareProHint: document.getElementById("shareProHint"),
  shareCopyCodeBtn: document.getElementById("shareCopyCodeBtn"),
  shareQuickLinkBtn: document.getElementById("shareQuickLinkBtn"),
  shareNativeCodeBtn: document.getElementById("shareNativeCodeBtn"),
  shareExpireSelect: document.getElementById("shareExpireSelect"),
  shareGenerateLinkBtn: document.getElementById("shareGenerateLinkBtn"),
  shareLinkText: document.getElementById("shareLinkText"),
  shareLinkQrImage: document.getElementById("shareLinkQrImage"),
  shareCopyLinkBtn: document.getElementById("shareCopyLinkBtn"),
  shareNativeLinkBtn: document.getElementById("shareNativeLinkBtn"),
  shareQrImage: document.getElementById("shareQrImage"),
  shareQrBtn: document.getElementById("shareQrBtn"),
  shareLinkQrBtn: document.getElementById("shareLinkQrBtn"),
  shareCloseTopBtn: document.getElementById("shareCloseTopBtn"),
  shareCloseBtn: document.getElementById("shareCloseBtn"),
  qrFullscreenModal: document.getElementById("qrFullscreenModal"),
  qrFullscreenImage: document.getElementById("qrFullscreenImage"),
  qrFullscreenCloseBtn: document.getElementById("qrFullscreenCloseBtn"),
  settingsBtn: document.getElementById("settingsBtn"),
  settingsModal: document.getElementById("settingsModal"),
  fontSizeSelect: document.getElementById("fontSizeSelect"),
  simpleUiToggle: document.getElementById("simpleUiToggle"),
  autoNextMcqToggle: document.getElementById("autoNextMcqToggle"),
  memorizeOrderSelect: document.getElementById("memorizeOrderSelect"),
  defaultShareExpireSelect: document.getElementById("defaultShareExpireSelect"),
  toastDurationSelect: document.getElementById("toastDurationSelect"),
  highContrastToggle: document.getElementById("highContrastToggle"),
  hideDailyQuoteToggle: document.getElementById("hideDailyQuoteToggle"),
  contactLinkBtn: document.getElementById("contactLinkBtn"),
  saveSettingsBtn: document.getElementById("saveSettingsBtn"),
  closeSettingsBtn: document.getElementById("closeSettingsBtn"),
  rewardedAdModal: document.getElementById("rewardedAdModal"),
  rewardedAdProgressBar: document.getElementById("rewardedAdProgressBar"),
  rewardedAdRemain: document.getElementById("rewardedAdRemain"),
  cancelRewardedAdBtn: document.getElementById("cancelRewardedAdBtn"),

  scoreSummary: document.getElementById("scoreSummary"),
  resultList: document.getElementById("resultList"),
  historySearchInput: document.getElementById("historySearchInput"),
  historyList: document.getElementById("historyList"),
  memorizeTargetTitle: document.getElementById("memorizeTargetTitle"),
  memorizeSourceType: document.getElementById("memorizeSourceType"),
  memorizeTargetSelectLabel: document.getElementById("memorizeTargetSelectLabel"),
  memorizeTargetSelect: document.getElementById("memorizeTargetSelect"),
  startMemorizeBtn: document.getElementById("startMemorizeBtn"),
  finishMemorizeBtn: document.getElementById("finishMemorizeBtn"),
  memorizeList: document.getElementById("memorizeList"),
  memorizeSummary: document.getElementById("memorizeSummary"),
  memorizeResultList: document.getElementById("memorizeResultList"),

  printPreview: document.getElementById("printPreview"),
  printPresetSelect: document.getElementById("printPresetSelect"),
  applyPrintPresetBtn: document.getElementById("applyPrintPresetBtn"),
  printExamSelect: document.getElementById("printExamSelect"),
  printCustomTitle: document.getElementById("printCustomTitle"),
  printShowNameDate: document.getElementById("printShowNameDate"),
  printShowGenre: document.getElementById("printShowGenre"),
  printIncludeExplanation: document.getElementById("printIncludeExplanation"),
  printIncludeAnswerSheet: document.getElementById("printIncludeAnswerSheet"),
  printShowFooter: document.getElementById("printShowFooter"),
  printProHint: document.getElementById("printProHint"),
  printQuestionsPerPage: document.getElementById("printQuestionsPerPage"),
  printModeQuestionBtn: document.getElementById("printModeQuestionBtn"),
  printModeAnswerBtn: document.getElementById("printModeAnswerBtn"),
  printModeLabel: document.getElementById("printModeLabel"),
  printBtn: document.getElementById("printBtn"),
  billingCurrentState: document.getElementById("billingCurrentState"),
  billingAdState: document.getElementById("billingAdState"),
  billingRewardedUntil: document.getElementById("billingRewardedUntil"),
  watchRewardedAdBtn: document.getElementById("watchRewardedAdBtn"),
  buyAdfreeMonthlyBtn: document.getElementById("buyAdfreeMonthlyBtn"),
  buyAdfreeYearlyBtn: document.getElementById("buyAdfreeYearlyBtn"),
  restorePurchaseBtn: document.getElementById("restorePurchaseBtn"),
  adfreeStatusText: document.getElementById("adfreeStatusText"),
  installBtn: document.getElementById("installBtn"),
  toastContainer: document.getElementById("toastContainer"),
};

let currentShareExamId = "";
let lastShareView = "code";
let examAutoSaveTimer = 0;
let lastSessionPersistSec = -1;
let pendingDangerousConfirm = null;
let pendingInputPrompt = null;
let pendingOptionPicker = null;
let lastSavedAt = 0;
let latestUndoToken = 0;
const modalStack = [];
let lastQuestionGenreValue = "";

function getFocusableInModal(modal) {
  if (!modal) return [];
  return Array.from(
    modal.querySelectorAll(
      "button:not([disabled]), [href], input:not([disabled]):not([type='hidden']), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])"
    )
  ).filter((el) => !el.classList.contains("hidden"));
}

function openModal(modal, initialFocusEl) {
  if (!modal) return;
  const returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
  if (!modal.hasAttribute("tabindex")) modal.setAttribute("tabindex", "-1");
  modalStack.push({ modal, returnFocus });
  const focusTarget = initialFocusEl || getFocusableInModal(modal)[0] || modal;
  focusTarget.focus();
}

function closeModalBase(modal) {
  if (!modal) return;
  const idx = modalStack.map((e) => e.modal).lastIndexOf(modal);
  const entry = idx >= 0 ? modalStack[idx] : null;
  const wasTop = idx === modalStack.length - 1;
  if (idx >= 0) modalStack.splice(idx, 1);
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");

  if (!wasTop) return;
  const next = modalStack[modalStack.length - 1];
  if (next?.modal) {
    const target = getFocusableInModal(next.modal)[0] || next.modal;
    target.focus();
    return;
  }
  if (entry?.returnFocus) entry.returnFocus.focus();
}

function handleModalKeyboard(event) {
  const active = modalStack[modalStack.length - 1]?.modal;
  if (!active) return;

  if (event.key === "Escape") {
    event.preventDefault();
    if (active === els.finishConfirmModal) closeFinishConfirmModal();
    else if (active === els.dangerConfirmModal) closeDangerConfirmModal(false);
    else if (active === els.inputPromptModal) closeInputPromptModal(null);
    else if (active === els.optionPickerModal) closeOptionPickerModal(null);
    else if (active === els.shareModal) closeShareModal();
    else if (active === els.qrFullscreenModal) closeQrFullscreen();
    else if (active === els.settingsModal) closeSettingsModal();
    else if (active === els.rewardedAdModal) cancelRewardedAdPlayback();
    return;
  }

  if (event.key !== "Tab") return;
  const focusables = getFocusableInModal(active);
  if (!focusables.length) {
    event.preventDefault();
    active.focus();
    return;
  }
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  const current = document.activeElement;
  if (event.shiftKey && current === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && current === last) {
    event.preventDefault();
    first.focus();
  }
}

function loadQuestions() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]").map((q) => ({
      ...q,
      genre: q.genre || "未分類",
      options: Array.isArray(q.options) ? q.options : [],
      answer: q.answer ?? "",
      mcqLabelMode: q.mcqLabelMode === "numeric" ? "numeric" : "alpha",
    }));
  } catch {
    return [];
  }
}

function saveQuestions() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.questions));
  markSaved();
}

function loadGenres() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_GENRES) || "[]");
  } catch {
    return [];
  }
}

function saveGenres() {
  localStorage.setItem(STORAGE_KEY_GENRES, JSON.stringify(state.genres));
  markSaved();
}

function loadExams() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY_EXAMS) || "[]");
    return Array.isArray(parsed) ? parsed.map(normalizeExam).filter(Boolean) : [];
  } catch {
    return [];
  }
}

function saveExams() {
  localStorage.setItem(STORAGE_KEY_EXAMS, JSON.stringify(state.exams));
  markSaved();
}

function loadActiveExamId() {
  return localStorage.getItem(STORAGE_KEY_ACTIVE_EXAM_ID) || "";
}

function saveActiveExamId() {
  localStorage.setItem(STORAGE_KEY_ACTIVE_EXAM_ID, state.activeExamId);
  markSaved();
}

function loadLegacyExamSelection() {
  try {
    const parsed = JSON.parse(localStorage.getItem(LEGACY_STORAGE_KEY_EXAM_SELECTION) || "[]");
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

function loadHistory() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY_HISTORY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveHistory() {
  localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(state.history));
  markSaved();
}

function loadBillingState() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY_BILLING) || "{}");
    return {
      adfreeUntil: Math.max(0, Number(raw?.adfreeUntil || 0)),
      proUntil: Math.max(0, Number(raw?.proUntil || 0)),
      rewardedAdUntil: Math.max(0, Number(raw?.rewardedAdUntil || 0)),
    };
  } catch {
    return {
      adfreeUntil: 0,
      proUntil: 0,
      rewardedAdUntil: 0,
    };
  }
}

function saveBillingState() {
  localStorage.setItem(STORAGE_KEY_BILLING, JSON.stringify(state.billing));
  markSaved();
}

function loadExamSessionState() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY_EXAM_SESSION) || "{}");
    if (!raw || typeof raw !== "object") return null;
    if (!raw.examId || !Array.isArray(raw.answers)) return null;
    return {
      examId: String(raw.examId),
      answers: raw.answers.map((a) => String(a ?? "")),
      current: Math.max(0, Number(raw.current || 0)),
      running: Boolean(raw.running),
      elapsedSec: Math.max(0, Number(raw.elapsedSec || 0)),
      startedAt: Math.max(0, Number(raw.startedAt || 0)),
      examDurationSec: Math.max(0, Number(raw.examDurationSec || 0)),
      savedAt: Math.max(0, Number(raw.savedAt || 0)),
    };
  } catch {
    return null;
  }
}

function saveExamSessionState() {
  if (!state.running) return;
  const active = getActiveExam();
  if (!active) return;
  const payload = {
    examId: active.id,
    answers: state.answers,
    current: state.current,
    running: state.running,
    elapsedSec: state.elapsedSec,
    startedAt: state.startedAt,
    examDurationSec: state.examDurationSec,
    savedAt: Date.now(),
  };
  localStorage.setItem(STORAGE_KEY_EXAM_SESSION, JSON.stringify(payload));
}

function clearExamSessionState() {
  localStorage.removeItem(STORAGE_KEY_EXAM_SESSION);
  lastSessionPersistSec = -1;
}

function restoreExamSessionIfAny() {
  const session = loadExamSessionState();
  if (!session) return false;
  const exam = state.exams.find((e) => e.id === session.examId);
  if (!exam) {
    clearExamSessionState();
    return false;
  }
  const examQuestions = exam.questionIds
    .map((id) => state.questions.find((q) => q.id === id))
    .filter(Boolean);
  if (!examQuestions.length) {
    clearExamSessionState();
    return false;
  }
  if (session.answers.length !== examQuestions.length) {
    clearExamSessionState();
    return false;
  }

  state.activeExamId = exam.id;
  state.answers = [...session.answers];
  state.current = Math.min(Math.max(0, session.current), examQuestions.length - 1);
  state.running = Boolean(session.running);
  state.elapsedSec = Math.max(0, session.elapsedSec);
  state.examDurationSec = Math.max(0, Number(exam.timeLimitMin || 0)) * 60;
  state.startedAt = Date.now() - state.elapsedSec * 1000;
  saveActiveExamId();

  if (state.running) {
    lastSessionPersistSec = -1;
    openExamSolve();
    renderExamQuestion();
    renderExamProgress();
    startTimer();
    saveExamSessionState();
    notify("前回の受験状態を復元しました。", "info");
  } else {
    clearExamSessionState();
  }
  return state.running;
}

function loadPrintPrefs() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY_PRINT_PREFS) || "{}");
    return raw && typeof raw === "object" ? raw : {};
  } catch {
    return {};
  }
}

function loadSettings() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY_SETTINGS) || "{}");
    const fontSize =
      raw?.fontSize === "small" ||
      raw?.fontSize === "large" ||
      raw?.fontSize === "medium" ||
      raw?.fontSize === "system"
        ? raw.fontSize
        : "system";
    const simpleUi = raw?.simpleUi === undefined ? true : Boolean(raw.simpleUi);
    const autoNextMcq = Boolean(raw?.autoNextMcq);
    const memorizeOrder = raw?.memorizeOrder === "random" ? "random" : "original";
    const defaultShareExpireHours = [24, 168, 720].includes(Number(raw?.defaultShareExpireHours))
      ? Number(raw.defaultShareExpireHours)
      : 24;
    const toastDuration =
      raw?.toastDuration === "short" || raw?.toastDuration === "long" || raw?.toastDuration === "standard"
        ? raw.toastDuration
        : "standard";
    const highContrast = Boolean(raw?.highContrast);
    const hideDailyQuote = Boolean(raw?.hideDailyQuote);
    return {
      fontSize,
      simpleUi,
      autoNextMcq,
      memorizeOrder,
      defaultShareExpireHours,
      toastDuration,
      highContrast,
      hideDailyQuote,
    };
  } catch {}
  return {
    fontSize: "system",
    simpleUi: true,
    autoNextMcq: false,
    memorizeOrder: "original",
    defaultShareExpireHours: 24,
    toastDuration: "standard",
    highContrast: false,
    hideDailyQuote: false,
  };
}

function saveSettings() {
  localStorage.setItem(
    STORAGE_KEY_SETTINGS,
    JSON.stringify({
      fontSize: state.settings.fontSize,
      simpleUi: state.settings.simpleUi,
      autoNextMcq: state.settings.autoNextMcq,
      memorizeOrder: state.settings.memorizeOrder,
      defaultShareExpireHours: state.settings.defaultShareExpireHours,
      toastDuration: state.settings.toastDuration,
      highContrast: state.settings.highContrast,
      hideDailyQuote: state.settings.hideDailyQuote,
    })
  );
  markSaved();
}

function applyUiSettings() {
  const size = state.settings.fontSize;
  if (size === "system") {
    delete document.body.dataset.fontSize;
  } else {
    document.body.dataset.fontSize = size;
  }
  if (els.fontSizeSelect) els.fontSizeSelect.value = size;
  document.body.classList.toggle("simple-ui", Boolean(state.settings.simpleUi));
  if (els.simpleUiToggle) els.simpleUiToggle.checked = Boolean(state.settings.simpleUi);
  if (els.autoNextMcqToggle) els.autoNextMcqToggle.checked = Boolean(state.settings.autoNextMcq);
  if (els.memorizeOrderSelect) els.memorizeOrderSelect.value = state.settings.memorizeOrder;
  if (els.defaultShareExpireSelect) {
    els.defaultShareExpireSelect.value = String(state.settings.defaultShareExpireHours || 24);
  }
  if (els.toastDurationSelect) els.toastDurationSelect.value = state.settings.toastDuration || "standard";
  document.body.classList.toggle("high-contrast", Boolean(state.settings.highContrast));
  if (els.highContrastToggle) els.highContrastToggle.checked = Boolean(state.settings.highContrast);
  if (els.hideDailyQuoteToggle) els.hideDailyQuoteToggle.checked = Boolean(state.settings.hideDailyQuote);
  renderDailyQuote();
  refreshEnhancedSelectTrigger("fontSizeSelect");
  refreshEnhancedSelectTrigger("memorizeOrderSelect");
  refreshEnhancedSelectTrigger("defaultShareExpireSelect");
  refreshEnhancedSelectTrigger("toastDurationSelect");
}

function savePrintPrefs() {
  const payload = {
    printMode: state.printMode,
    printPreset: state.printPreset,
    printExamId: state.printExamId,
    printCustomTitle: state.printCustomTitle,
    printShowNameDate: state.printShowNameDate,
    printShowGenre: state.printShowGenre,
    printIncludeExplanation: state.printIncludeExplanation,
    printIncludeAnswerSheet: state.printIncludeAnswerSheet,
    printShowFooter: state.printShowFooter,
    printQuestionsPerPage: state.printQuestionsPerPage,
  };
  localStorage.setItem(STORAGE_KEY_PRINT_PREFS, JSON.stringify(payload));
  markSaved();
}

function initPrintPrefs() {
  const prefs = loadPrintPrefs();
  state.printMode = prefs.printMode === "answer" ? "answer" : "question";
  state.printPreset = typeof prefs.printPreset === "string" ? prefs.printPreset : "custom";
  state.printExamId = typeof prefs.printExamId === "string" ? prefs.printExamId : "";
  state.printCustomTitle = typeof prefs.printCustomTitle === "string" ? prefs.printCustomTitle : "";
  state.printShowNameDate = prefs.printShowNameDate !== false;
  state.printShowGenre = Boolean(prefs.printShowGenre);
  state.printIncludeExplanation = prefs.printIncludeExplanation !== false;
  state.printIncludeAnswerSheet = Boolean(prefs.printIncludeAnswerSheet);
  state.printShowFooter = Boolean(prefs.printShowFooter);
  const perPage = Number(prefs.printQuestionsPerPage || 10);
  state.printQuestionsPerPage = [8, 10, 12].includes(perPage) ? perPage : 10;
}

function normalizeExam(raw) {
  if (!raw || typeof raw !== "object") return null;
  const id = typeof raw.id === "string" && raw.id ? raw.id : crypto.randomUUID();
  const title = String(raw.title || "").trim() || "模試";
  const questionIds = Array.isArray(raw.questionIds)
    ? raw.questionIds.filter((id2) => typeof id2 === "string")
    : [];
  const createdAt = Number(raw.createdAt) || Date.now();
  const updatedAt = Number(raw.updatedAt) || createdAt;
  const timeLimitMin = Math.max(0, Number(raw.timeLimitMin || 0));
  return { id, title, questionIds, timeLimitMin, createdAt, updatedAt };
}

function createExam(title, questionIds = []) {
  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    title: String(title || "").trim() || `模試${state.exams.length + 1}`,
    questionIds: [...new Set(questionIds)],
    timeLimitMin: 0,
    createdAt: now,
    updatedAt: now,
  };
}

function initExamState() {
  const loadedExams = loadExams();
  const legacySelection = loadLegacyExamSelection();

  state.exams = loadedExams.length ? loadedExams : [createExam("模試1", legacySelection)];
  state.activeExamId = loadActiveExamId();

  if (!state.exams.some((exam) => exam.id === state.activeExamId)) {
    state.activeExamId = state.exams[0].id;
  }

  syncExamsWithQuestions();
  saveExams();
  saveActiveExamId();
}

function getAvailableGenres() {
  const list = [];
  const pushUnique = (name) => {
    const normalized = String(name || "").trim();
    if (!normalized || list.includes(normalized)) return;
    list.push(normalized);
  };
  state.genres.forEach(pushUnique);
  state.questions.forEach((q) => pushUnique(q.genre || "未分類"));
  if (!list.length) list.push("未分類");
  return list;
}

function getActiveExam() {
  return state.exams.find((exam) => exam.id === state.activeExamId) || null;
}

function getPrintTargetExam() {
  const selected = state.exams.find((exam) => exam.id === state.printExamId);
  if (selected) return selected;
  const active = getActiveExam();
  if (!active) return null;
  if (state.printExamId !== active.id) {
    state.printExamId = active.id;
    savePrintPrefs();
  }
  return active;
}

function syncExamsWithQuestions() {
  const validIds = new Set(state.questions.map((q) => q.id));
  state.exams = state.exams.map((exam) => ({
    ...exam,
    questionIds: exam.questionIds.filter((id) => validIds.has(id)),
  }));

  if (!state.exams.length) {
    state.exams = [createExam("模試1")];
    state.activeExamId = state.exams[0].id;
  }
}

function updateActiveExam(updater) {
  const exam = getActiveExam();
  if (!exam) return;
  updater(exam);
  exam.questionIds = [...new Set(exam.questionIds)];
  exam.updatedAt = Date.now();
  saveExams();
}

function setActiveExam(examId) {
  if (state.running) {
    notify("受験中は模試を切り替えできません", "warn");
    return;
  }
  if (!state.exams.some((exam) => exam.id === examId)) return;
  state.activeExamId = examId;
  saveActiveExamId();
  renderExamManager();
  renderExamBuilder();
  renderPrintPreview();
  renderMemorize();
  renderStatus();
  renderExamProgress();
}

function openExamBuilder() {
  els.examListView.classList.add("hidden");
  els.examBuilderView.classList.remove("hidden");
  els.examSolveView.classList.add("hidden");
  renderExamStepIndicator();
  renderUxGuide();
}

function closeExamBuilder() {
  if (state.running) {
    notify("受験中は一覧に戻れません", "warn");
    return;
  }
  els.examSolveView.classList.add("hidden");
  els.examBuilderView.classList.add("hidden");
  els.examListView.classList.remove("hidden");
  renderExamStepIndicator();
  renderUxGuide();
}

function openExamSolve() {
  els.examListView.classList.add("hidden");
  els.examBuilderView.classList.add("hidden");
  els.examSolveView.classList.remove("hidden");
  updateExamSolveActions();
  renderExamStepIndicator();
  syncMobileNavVisibility();
  renderUxGuide();
}

function closeExamSolve() {
  if (state.running) {
    notify("受験中は戻れません", "warn");
    return;
  }
  els.examSolveView.classList.add("hidden");
  els.examBuilderView.classList.remove("hidden");
  updateExamSolveActions();
  renderExamStepIndicator();
  syncMobileNavVisibility();
  renderUxGuide();
}

function switchTab(name) {
  els.tabs.forEach((tab) => {
    const active = tab.dataset.tab === name;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", active ? "true" : "false");
    tab.setAttribute("tabindex", active ? "0" : "-1");
  });
  els.panels.forEach((panel) => {
    const active = panel.id === name;
    panel.classList.toggle("active", active);
    panel.setAttribute("aria-hidden", active ? "false" : "true");
  });
  if (name === "exam" && !state.running) {
    closeExamBuilder();
  }
  if (name === "memorize") {
    renderMemorize();
  }
  if (name === "home") {
    renderHomeDashboard();
  }
  if (name === "billing") {
    renderBilling();
  }
  renderExamStepIndicator();
  syncMobileNavVisibility();
  renderUxGuide();
}

function syncMobileNavVisibility() {
  const isExamTabActive = Array.from(els.tabs).some(
    (tab) => tab.dataset.tab === "exam" && tab.classList.contains("active")
  );
  const solving = state.running && isExamTabActive && !els.examSolveView.classList.contains("hidden");
  document.body.classList.toggle("exam-solving", solving);
}

function switchEditorView(name) {
  els.editorSubTabs.forEach((tab) => {
    const active = tab.dataset.editorView === name;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", active ? "true" : "false");
    tab.setAttribute("tabindex", active ? "0" : "-1");
  });
  els.editorViews.forEach((view) => {
    const active = view.id === `editor${capitalize(name)}View`;
    view.classList.toggle("active", active);
    view.setAttribute("aria-hidden", active ? "false" : "true");
  });
  updateGenreQuestionListVisibility();
}

function updateGenreQuestionListVisibility() {
  if (!els.genreQuestionListCard || !els.toggleGenreQuestionListBtn) return;
  const inGenreView = document.getElementById("editorGenreView")?.classList.contains("active");
  const open = inGenreView && state.editorGenreListOpen;
  els.genreQuestionListCard.classList.toggle("hidden", !open);
  els.toggleGenreQuestionListBtn.textContent = open ? "問題一覧を隠す" : "問題一覧を表示";
}

function renderExamStepIndicator() {
  if (!els.examStepIndicator) return;
  let step = "list";
  if (!els.examSolveView.classList.contains("hidden")) step = "solve";
  else if (!els.examBuilderView.classList.contains("hidden")) step = "builder";
  else if (!els.examListView.classList.contains("hidden")) step = "list";
  els.examStepIndicator.querySelectorAll("[data-step]").forEach((el) => {
    const active = el.getAttribute("data-step") === step;
    el.classList.toggle("active", active);
    el.setAttribute("aria-current", active ? "step" : "false");
  });
}

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

function handleArrowTabNavigation(event, tabButtons, activateFn) {
  if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
  const tabs = Array.from(tabButtons);
  const current = tabs.indexOf(event.currentTarget);
  if (current < 0) return;
  event.preventDefault();
  const delta = event.key === "ArrowRight" ? 1 : -1;
  const next = (current + delta + tabs.length) % tabs.length;
  tabs[next].focus();
  activateFn(tabs[next]);
}

els.tabs.forEach((tab) => {
  tab.addEventListener("click", () => switchTab(tab.dataset.tab));
  tab.addEventListener("keydown", (event) => {
    handleArrowTabNavigation(event, els.tabs, (target) => switchTab(target.dataset.tab));
  });
});
els.homeResumeBtn?.addEventListener("click", () => {
  if (state.running) {
    switchTab("exam");
    openExamSolve();
    return;
  }
  if (state.memorize.started && !state.memorize.finished) {
    switchTab("memorize");
    return;
  }
  switchTab("exam");
});
els.homeCreateQuestionBtn?.addEventListener("click", () => {
  switchTab("editor");
  switchEditorView("question");
  els.questionText?.focus();
});
els.homeCreateExamBtn?.addEventListener("click", () => {
  switchTab("exam");
  openExamBuilder();
});
els.homeStartMemorizeBtn?.addEventListener("click", () => {
  switchTab("memorize");
});
els.homeOpenPrintBtn?.addEventListener("click", () => {
  switchTab("print");
});
els.editorSubTabs.forEach((tab) => {
  tab.addEventListener("click", () => switchEditorView(tab.dataset.editorView));
  tab.addEventListener("keydown", (event) => {
    handleArrowTabNavigation(event, els.editorSubTabs, (target) =>
      switchEditorView(target.dataset.editorView)
    );
  });
});

els.questionType.addEventListener("change", () => {
  updateQuestionTypeInputs();
  renderFillAuthorPreview();
});
els.questionText.addEventListener("input", renderFillAuthorPreview);
els.fillAnswer.addEventListener("input", renderFillAuthorPreview);

els.mcqLabelMode.addEventListener("change", updateMcqEditorLabels);
els.mcqOptionA.addEventListener("input", updateMcqAnswerAvailability);
els.mcqOptionB.addEventListener("input", updateMcqAnswerAvailability);
els.mcqOptionC.addEventListener("input", updateMcqAnswerAvailability);
els.mcqOptionD.addEventListener("input", updateMcqAnswerAvailability);
els.addGenreBtn.addEventListener("click", addGenreFromInput);
els.questionGenre.addEventListener("change", handleQuestionGenreChange);
els.genreNameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    addGenreFromInput();
  }
});
els.toggleGenreQuestionListBtn.addEventListener("click", () => {
  state.editorGenreListOpen = !state.editorGenreListOpen;
  updateGenreQuestionListVisibility();
});

els.newExamOpenBtn.addEventListener("click", () => {
  runWithButton(els.newExamOpenBtn, "作成中...", () => {
    const exam = createExam(`模試${state.exams.length + 1}`);
    state.exams.unshift(exam);
    state.activeExamId = exam.id;
    state.examBuilderGenre = "all";
    saveExams();
    saveActiveExamId();
    renderExamManager();
    renderExamBuilder();
    renderPrintPreview();
    renderMemorize();
    renderStatus();
    openExamBuilder();
  });
});
els.importSharedExamBtn.addEventListener("click", importSharedExamByCodePrompt);
els.backToExamListBtn.addEventListener("click", closeExamBuilder);
els.backToBuilderBtn.addEventListener("click", closeExamSolve);
els.examSearchInput.addEventListener("input", () => {
  state.examSearch = String(els.examSearchInput.value || "").trim().toLowerCase();
  renderExamManager();
});
els.examSortSelect.addEventListener("change", () => {
  state.examSort = String(els.examSortSelect.value || "updated_desc");
  renderExamManager();
});
els.saveExamTitleBtn.addEventListener("click", () => {
  runWithButton(els.saveExamTitleBtn, "保存中...", () =>
    renameExam(state.activeExamId, els.examTitleInput.value)
  );
});
els.addWholeGenreBtn.addEventListener("click", addSelectedGenreWholeToExam);
els.examSelectedOnlyToggle.addEventListener("change", () => {
  state.examPickerSelectedOnly = Boolean(els.examSelectedOnlyToggle.checked);
  renderExamBuilder();
});
els.pickVisibleAllBtn.addEventListener("click", () => pickVisibleQuestions(true));
els.unpickVisibleAllBtn.addEventListener("click", () => pickVisibleQuestions(false));
els.applyPrintPresetBtn.addEventListener("click", () => {
  applyPrintPreset(els.printPresetSelect.value || "custom");
});
els.printModeQuestionBtn.addEventListener("click", () => setPrintMode("question"));
els.printModeAnswerBtn.addEventListener("click", () => setPrintMode("answer"));
els.printExamSelect.addEventListener("change", () => {
  state.printExamId = els.printExamSelect.value || "";
  state.printPreset = "custom";
  savePrintPrefs();
  renderPrintPreview();
});
els.printCustomTitle.addEventListener("input", () => {
  state.printCustomTitle = String(els.printCustomTitle.value || "");
  state.printPreset = "custom";
  savePrintPrefs();
  renderPrintPreview();
});
els.printShowNameDate.addEventListener("change", () => {
  state.printShowNameDate = Boolean(els.printShowNameDate.checked);
  state.printPreset = "custom";
  savePrintPrefs();
  renderPrintPreview();
});
els.printShowGenre.addEventListener("change", () => {
  state.printShowGenre = Boolean(els.printShowGenre.checked);
  state.printPreset = "custom";
  savePrintPrefs();
  renderPrintPreview();
});
els.printIncludeExplanation.addEventListener("change", () => {
  state.printIncludeExplanation = Boolean(els.printIncludeExplanation.checked);
  state.printPreset = "custom";
  savePrintPrefs();
  renderPrintPreview();
});
els.printIncludeAnswerSheet?.addEventListener("change", () => {
  state.printIncludeAnswerSheet = Boolean(els.printIncludeAnswerSheet.checked);
  state.printPreset = "custom";
  savePrintPrefs();
  renderPrintPreview();
});
els.printShowFooter?.addEventListener("change", () => {
  state.printShowFooter = Boolean(els.printShowFooter.checked);
  state.printPreset = "custom";
  savePrintPrefs();
  renderPrintPreview();
});
els.printQuestionsPerPage.addEventListener("change", () => {
  const perPage = Number(els.printQuestionsPerPage.value);
  state.printQuestionsPerPage = [8, 10, 12].includes(perPage) ? perPage : 10;
  state.printPreset = "custom";
  savePrintPrefs();
  renderPrintPreview();
});
els.examTitleInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    renameExam(state.activeExamId, els.examTitleInput.value);
  }
});
els.examTitleInput.addEventListener("input", scheduleExamAutoSave);
els.examTimeLimitInput.addEventListener("input", scheduleExamAutoSave);
els.startMemorizeBtn.addEventListener("click", () => {
  runWithButton(els.startMemorizeBtn, "開始中...", startMemorize);
});
els.finishMemorizeBtn.addEventListener("click", () => {
  runWithButton(els.finishMemorizeBtn, "集計中...", finishMemorize);
});
els.memorizeSourceType?.addEventListener("change", () => {
  state.memorize.started = false;
  state.memorize.finished = false;
  renderMemorize();
});
els.memorizeTargetSelect?.addEventListener("change", () => {
  if (state.memorize.started) {
    state.memorize.started = false;
    state.memorize.finished = false;
  }
  renderMemorize();
});
els.questionSearchInput.addEventListener("input", () => {
  state.questionSearch = String(els.questionSearchInput.value || "").trim().toLowerCase();
  renderQuestionList();
});
els.historySearchInput.addEventListener("input", () => {
  state.historySearch = String(els.historySearchInput.value || "").trim().toLowerCase();
  renderHistory();
});
els.cancelEditQuestionBtn.addEventListener("click", resetQuestionForm);
els.exportDataBtn.addEventListener("click", () => {
  runWithButton(els.exportDataBtn, "出力中...", exportAllData);
});
els.finishCancelBtn.addEventListener("click", closeFinishConfirmModal);
els.finishConfirmBtn.addEventListener("click", () => {
  closeFinishConfirmModal();
  finishExam("手動終了");
});
els.shareCloseBtn.addEventListener("click", closeShareModal);
els.shareCloseTopBtn?.addEventListener("click", closeShareModal);
els.shareCodeTabBtn.addEventListener("click", () => switchShareView("code"));
els.shareLinkTabBtn.addEventListener("click", () => switchShareView("link"));
els.shareCodeTabBtn.addEventListener("keydown", (event) => {
  handleArrowTabNavigation(event, [els.shareCodeTabBtn, els.shareLinkTabBtn], (target) => {
    switchShareView(target === els.shareCodeTabBtn ? "code" : "link");
  });
});
els.shareLinkTabBtn.addEventListener("keydown", (event) => {
  handleArrowTabNavigation(event, [els.shareCodeTabBtn, els.shareLinkTabBtn], (target) => {
    switchShareView(target === els.shareCodeTabBtn ? "code" : "link");
  });
});
els.sharePasswordInput.addEventListener("input", refreshShareModalCode);
els.shareIncludeInsight?.addEventListener("change", refreshShareModalCode);
els.shareNoteInput?.addEventListener("input", refreshShareModalCode);
els.shareQrBtn.addEventListener("click", () => {
  const src = String(els.shareQrImage.src || "");
  if (!src) return;
  openQrFullscreen(src);
});
els.shareLinkQrBtn.addEventListener("click", () => {
  const src = String(els.shareLinkQrImage.src || "");
  if (!src) return;
  openQrFullscreen(src);
});
els.qrFullscreenCloseBtn.addEventListener("click", closeQrFullscreen);
els.qrFullscreenModal.addEventListener("click", (event) => {
  if (event.target === els.qrFullscreenModal) closeQrFullscreen();
});
els.settingsModal.addEventListener("click", (event) => {
  if (event.target === els.settingsModal) closeSettingsModal();
});
els.rewardedAdModal.addEventListener("click", (event) => {
  if (event.target === els.rewardedAdModal) cancelRewardedAdPlayback();
});
els.cancelRewardedAdBtn.addEventListener("click", cancelRewardedAdPlayback);
els.shareModal.addEventListener("click", (event) => {
  if (event.target === els.shareModal) closeShareModal();
});
document.addEventListener("keydown", handleModalKeyboard);
els.settingsBtn.addEventListener("click", () => {
  openSettingsModal();
});
els.closeSettingsBtn.addEventListener("click", closeSettingsModal);
els.saveSettingsBtn.addEventListener("click", () => {
  const next = String(els.fontSizeSelect.value || "system");
  state.settings.fontSize =
    next === "small" || next === "large" || next === "medium" || next === "system"
      ? next
      : "system";
  state.settings.simpleUi = Boolean(els.simpleUiToggle?.checked);
  state.settings.autoNextMcq = Boolean(els.autoNextMcqToggle?.checked);
  state.settings.memorizeOrder = els.memorizeOrderSelect?.value === "random" ? "random" : "original";
  const shareHours = Number(els.defaultShareExpireSelect?.value || 24);
  state.settings.defaultShareExpireHours = [24, 168, 720].includes(shareHours) ? shareHours : 24;
  state.settings.toastDuration =
    els.toastDurationSelect?.value === "short" || els.toastDurationSelect?.value === "long"
      ? els.toastDurationSelect.value
      : "standard";
  state.settings.highContrast = Boolean(els.highContrastToggle?.checked);
  state.settings.hideDailyQuote = Boolean(els.hideDailyQuoteToggle?.checked);
  applyUiSettings();
  saveSettings();
  closeSettingsModal();
  notify("設定を保存しました", "success");
});
els.watchRewardedAdBtn.addEventListener("click", () => {
  runWithButton(els.watchRewardedAdBtn, "広告読み込み中...", async () => {
    const completed = await showRewardedAd();
    if (!completed) {
      notify("広告の視聴が完了しなかったため、特典は付与されませんでした。", "warn");
      return;
    }
    state.billing.rewardedAdUntil = Date.now() + 24 * 60 * 60 * 1000;
    saveBillingState();
    renderBilling();
    notify("広告視聴で24時間広告なしを有効化しました", "success");
  });
});
els.buyAdfreeMonthlyBtn.addEventListener("click", () => {
  runWithButton(els.buyAdfreeMonthlyBtn, "購入処理中...", async () => {
    const ok = await purchaseAdfreePlan({
      productID: "com.mockmaker.adfree.monthly",
      fallbackDays: 30,
      successMessage: "広告オフ（月額）を有効化しました",
    });
    if (!ok) notify("購入を完了できませんでした。通信状態を確認し、App Storeにサインインした状態で再試行してください。", "warn");
  });
});
els.buyAdfreeYearlyBtn.addEventListener("click", () => {
  runWithButton(els.buyAdfreeYearlyBtn, "購入処理中...", async () => {
    const ok = await purchaseAdfreePlan({
      productID: "com.mockmaker.adfree.yearly",
      fallbackDays: 365,
      successMessage: "広告オフ（年額）を有効化しました",
    });
    if (!ok) notify("購入を完了できませんでした。通信状態を確認し、App Storeにサインインした状態で再試行してください。", "warn");
  });
});
els.restorePurchaseBtn.addEventListener("click", () => {
  runWithButton(els.restorePurchaseBtn, "復元中...", async () => {
    const ok = await restoreAdfreePlan();
    if (!ok) notify("復元できる購入情報が見つかりませんでした。同じApple IDで購入済みか確認して再試行してください。", "info");
  });
});

async function purchaseAdfreePlan({ productID, fallbackDays, successMessage }) {
  const native = window.MockMakerBilling;
  if (native && typeof native.purchase === "function") {
    try {
      const result = await native.purchase(productID);
      if (!result || result.success !== true) return false;
      const expiresAt = Number(result.expiresAtMs || 0);
      state.billing.adfreeUntil = expiresAt > Date.now() ? expiresAt : Date.now() + fallbackDays * 24 * 60 * 60 * 1000;
      state.billing.rewardedAdUntil = 0;
      saveBillingState();
      renderBilling();
      notify(successMessage, "success");
      return true;
    } catch {
      return false;
    }
  }

  state.billing.adfreeUntil = Date.now() + fallbackDays * 24 * 60 * 60 * 1000;
  state.billing.rewardedAdUntil = 0;
  saveBillingState();
  renderBilling();
  notify(`${successMessage}（ローカル検証）`, "success");
  return true;
}

async function restoreAdfreePlan() {
  const native = window.MockMakerBilling;
  if (native && typeof native.restore === "function") {
    try {
      const restored = await native.restore();
      const list = Array.isArray(restored) ? restored : [];
      const maxExpires = list.reduce((max, item) => {
        if (!item || item.success !== true) return max;
        const value = Number(item.expiresAtMs || 0);
        return value > max ? value : max;
      }, 0);
      if (maxExpires <= Date.now()) return false;
      state.billing.adfreeUntil = maxExpires;
      state.billing.rewardedAdUntil = 0;
      saveBillingState();
      renderBilling();
      notify("購入情報を復元しました", "success");
      return true;
    } catch {
      return false;
    }
  }
  renderBilling();
  notify("購入情報を復元しました（ローカル検証）", "success");
  return true;
}
els.shareCopyCodeBtn.addEventListener("click", () => {
  copyTextToClipboard(els.shareCodeText.value, "共有コードをコピーしました");
});
els.shareNativeCodeBtn.addEventListener("click", async () => {
  const code = String(els.shareCodeText.value || "").trim();
  if (!code) {
    notify("共有コードがありません。共有モーダルでコードを生成してから再実行してください。", "warn");
    return;
  }
  await shareViaNative("模試共有コード", code);
});
els.shareQuickLinkBtn.addEventListener("click", () => {
  const code = String(els.shareCodeText.value || "").trim();
  if (!code) {
    notify("共有コードが無効です。4桁パスワードは空欄か有効な値にしてください。", "warn");
    return;
  }
  const link = buildExpiringShareLink(code, 24);
  els.shareLinkText.value = link;
  els.shareCopyLinkBtn.disabled = false;
  els.shareNativeLinkBtn.disabled = !navigator.share;
  updateShareQr(els.shareLinkQrImage, link);
  switchShareView("link");
  notify("24時間リンクを作成しました", "success");
});
els.shareGenerateLinkBtn.addEventListener("click", () => {
  const hours = Math.max(1, Number(els.shareExpireSelect.value || 24));
  const code = String(els.shareCodeText.value || "").trim();
  if (!code) {
    notify("共有コードが未作成です。4桁パスワードは空欄か有効な値にしてください。", "warn");
    return;
  }
  const link = buildExpiringShareLink(code, hours);
  els.shareLinkText.value = link;
  els.shareCopyLinkBtn.disabled = false;
  els.shareNativeLinkBtn.disabled = !navigator.share;
  updateShareQr(els.shareLinkQrImage, link);
  notify("期限付きリンクを作成しました", "success");
});
els.shareCopyLinkBtn.addEventListener("click", () => {
  const link = String(els.shareLinkText.value || "").trim();
  if (!link) {
    notify("先に「リンク作成」を押して共有リンクを生成してください。", "warn");
    return;
  }
  copyTextToClipboard(link, "共有リンクをコピーしました");
});
els.shareNativeLinkBtn.addEventListener("click", async () => {
  const link = String(els.shareLinkText.value || "").trim();
  if (!link) {
    notify("先に「リンク作成」を押して共有リンクを生成してください。", "warn");
    return;
  }
  await shareViaNative("模試共有リンク", link);
});
els.finishConfirmModal.addEventListener("click", (event) => {
  if (event.target === els.finishConfirmModal) {
    closeFinishConfirmModal();
  }
});
els.dangerConfirmNoBtn.addEventListener("click", () => closeDangerConfirmModal(false));
els.dangerConfirmYesBtn.addEventListener("click", () => closeDangerConfirmModal(true));
els.dangerConfirmModal.addEventListener("click", (event) => {
  if (event.target === els.dangerConfirmModal) {
    closeDangerConfirmModal(false);
  }
});
els.inputPromptCancelBtn.addEventListener("click", () => closeInputPromptModal(null));
els.inputPromptOkBtn.addEventListener("click", () => {
  closeInputPromptModal(String(els.inputPromptField.value || ""));
});
els.inputPromptField.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    closeInputPromptModal(String(els.inputPromptField.value || ""));
  }
});
els.inputPromptModal.addEventListener("click", (event) => {
  if (event.target === els.inputPromptModal) {
    closeInputPromptModal(null);
  }
});
els.optionPickerCloseBtn.addEventListener("click", () => closeOptionPickerModal(null));
els.optionPickerModal.addEventListener("click", (event) => {
  if (event.target === els.optionPickerModal) {
    closeOptionPickerModal(null);
  }
});
els.importDataInput.addEventListener("change", importAllData);

els.addQuestionBtn.addEventListener("click", () => {
  runWithButton(els.addQuestionBtn, "保存中...", () => {
    const genre = (els.questionGenre.value || "未分類").trim();
    const text = els.questionText.value.trim();
    const type = els.questionType.value;
    const explanation = els.questionExplanation.value.trim();

    if (!text) {
      notify("問題文が空です。問題文を入力してから「問題を追加」を押してください。", "error");
      return;
    }

    const q = {
      id: state.editingQuestionId || crypto.randomUUID(),
      genre,
      text,
      type,
      explanation,
      options: [],
      answer: "",
      mcqLabelMode: "alpha",
    };

    if (type === "mcq") {
      const rawOptions = [
        els.mcqOptionA.value.trim(),
        els.mcqOptionB.value.trim(),
        els.mcqOptionC.value.trim(),
        els.mcqOptionD.value.trim(),
      ];
      const hasGap = rawOptions.some((opt, i) => !opt && rawOptions.slice(i + 1).some(Boolean));
      if (hasGap) {
        notify("4択はAから順番に入力してください（途中を空欄にできません）", "error");
        return;
      }
      q.options = rawOptions.filter(Boolean);
      q.mcqLabelMode = els.mcqLabelMode.value;
      if (q.options.length < 2) {
        notify("4択は2つ以上の選択肢が必要です", "error");
        return;
      }
      const answerIndex = Number(els.mcqAnswer.value);
      q.answer = String(answerIndex);
      if (answerIndex > q.options.length) {
        notify("正答に選んだ選択肢が未入力です", "error");
        return;
      }
    }

    if (type === "fill") {
      q.answer = els.fillAnswer.value.trim();
      if (!q.answer) {
        notify("穴埋めの正答が未入力です。正答を入力してから保存してください。", "error");
        return;
      }
    }

    if (type === "text") {
      q.answer = els.textAnswer.value.trim();
    }

    if (state.editingQuestionId) {
      state.questions = state.questions.map((item) => (item.id === state.editingQuestionId ? q : item));
    } else {
      state.questions.push(q);
    }
    if (!state.genres.includes(genre)) {
      state.genres.push(genre);
      saveGenres();
    }

    saveQuestions();
    syncExamsWithQuestions();
    saveExams();
    notify(state.editingQuestionId ? "問題を更新しました" : "問題を追加しました", "success");

    renderGenreUI();
    renderQuestionList();
    renderExamManager();
    renderExamBuilder();
    renderPrintPreview();
    renderMemorize();
    renderStatus();

    resetQuestionForm();
  });
});

els.clearAllBtn.addEventListener("click", async () => {
  if (!(await confirmDangerousAction("問題を全削除しますか？"))) return;
  const snapshot = {
    questions: cloneSerializable(state.questions),
    genres: cloneSerializable(state.genres),
    exams: cloneSerializable(state.exams),
    activeExamId: state.activeExamId,
    activeGenre: state.activeGenre,
    questionSearch: state.questionSearch,
    printExamId: state.printExamId,
  };
  state.questions = [];
  state.answers = [];
  state.running = false;
  stopTimer();
  clearExamSessionState();

  state.exams = state.exams.map((exam) => ({ ...exam, questionIds: [], updatedAt: Date.now() }));

  saveQuestions();
  saveExams();

  renderGenreUI();
  renderQuestionList();
  renderExamManager();
  renderExamBuilder();
  renderPrintPreview();
  renderMemorize();
  renderResult([], 0, 0, "");
  renderStatus();
  renderExamProgress();
  els.examQuestion.innerHTML = "<p>問題を作成して「開始」を押してください。</p>";
  resetQuestionForm();
  offerUndo("全問題を削除しました（元に戻せます）", () => {
    state.questions = snapshot.questions;
    state.genres = snapshot.genres;
    state.exams = snapshot.exams;
    state.activeExamId = snapshot.activeExamId;
    state.activeGenre = snapshot.activeGenre;
    state.questionSearch = snapshot.questionSearch;
    state.printExamId = snapshot.printExamId;
    els.questionSearchInput.value = snapshot.questionSearch;

    saveQuestions();
    saveGenres();
    saveExams();
    saveActiveExamId();
    savePrintPrefs();

    renderGenreUI();
    renderQuestionList();
    renderExamManager();
    renderExamBuilder();
    renderPrintPreview();
    renderMemorize();
    renderStatus();
    renderExamProgress();
  });
});

function createOrSelectGenre(rawGenre, sourceLabel = "ジャンル追加") {
  const genre = String(rawGenre || "").trim().replace(/\s+/g, " ");
  if (!genre) {
    notify("ジャンル名を入力してください（例: 英語長文）", "warn");
    return "";
  }
  const existing = state.genres.find((g) => String(g || "").trim() === genre);
  if (!existing) {
    state.genres.push(genre);
    saveGenres();
    notify(`${sourceLabel}: ジャンル「${genre}」を追加しました`, "success");
  } else {
    notify(`${sourceLabel}: ジャンル「${genre}」は既に存在します。既存ジャンルを選択しました。`, "info");
  }
  const selected = existing || genre;
  state.activeGenre = selected;
  renderGenreUI();
  renderQuestionList();
  renderExamBuilder();
  renderStatus();
  return selected;
}

function addGenreFromInput() {
  const selected = createOrSelectGenre(els.genreNameInput.value, "ジャンル追加");
  if (!selected) return;
  els.genreNameInput.value = "";
}

function setQuestionGenreSelection(nextGenre) {
  if (!els.questionGenre) return;
  const fallback = getAvailableGenres()[0] || "未分類";
  const target = String(nextGenre || "").trim();
  const selected = target && target !== QUESTION_GENRE_NEW_VALUE ? target : fallback;
  els.questionGenre.value = selected;
  lastQuestionGenreValue = selected;
  refreshEnhancedSelectTrigger("questionGenre");
}

async function handleQuestionGenreChange() {
  const selected = String(els.questionGenre.value || "");
  if (selected !== QUESTION_GENRE_NEW_VALUE) {
    lastQuestionGenreValue = selected;
    return;
  }

  const entered = await openInputPrompt({
    title: "新規ジャンル作成",
    message: "追加するジャンル名を入力してください。",
    placeholder: "例: 化学基礎",
    okLabel: "作成",
    cancelLabel: "キャンセル",
    maxLength: 40,
  });
  if (entered === null) {
    setQuestionGenreSelection(lastQuestionGenreValue);
    return;
  }

  const created = createOrSelectGenre(entered, "問題作成");
  if (!created) {
    setQuestionGenreSelection(lastQuestionGenreValue);
    return;
  }
  setQuestionGenreSelection(created);
}

function setQuestionFormMode() {
  const editing = Boolean(state.editingQuestionId);
  els.addQuestionBtn.textContent = editing ? "問題を更新" : "問題を追加";
  els.cancelEditQuestionBtn.classList.toggle("hidden", !editing);
}

function updateQuestionTypeInputs() {
  const type = els.questionType.value;
  els.mcqInputs.classList.toggle("hidden", type !== "mcq");
  els.fillInputs.classList.toggle("hidden", type !== "fill");
  els.textInputs.classList.toggle("hidden", type !== "text");
}

function resetQuestionForm() {
  state.editingQuestionId = "";
  els.questionText.value = "";
  els.questionExplanation.value = "";
  els.questionType.value = "mcq";
  els.mcqOptionA.value = "";
  els.mcqOptionB.value = "";
  els.mcqOptionC.value = "";
  els.mcqOptionD.value = "";
  if (!["alpha", "numeric"].includes(String(els.mcqLabelMode.value || ""))) {
    els.mcqLabelMode.value = "alpha";
  }
  els.mcqAnswer.value = "1";
  els.fillAnswer.value = "";
  els.textAnswer.value = "";
  updateMcqEditorLabels();
  updateMcqAnswerAvailability();
  updateQuestionTypeInputs();
  renderFillAuthorPreview();
  setQuestionFormMode();
}

function startQuestionEdit(questionId) {
  const q = state.questions.find((item) => item.id === questionId);
  if (!q) return;
  state.editingQuestionId = q.id;
  els.questionGenre.value = q.genre || "未分類";
  els.questionText.value = q.text || "";
  els.questionType.value = q.type || "mcq";
  els.questionExplanation.value = q.explanation || "";

  els.mcqOptionA.value = q.options?.[0] || "";
  els.mcqOptionB.value = q.options?.[1] || "";
  els.mcqOptionC.value = q.options?.[2] || "";
  els.mcqOptionD.value = q.options?.[3] || "";
  els.mcqLabelMode.value = q.mcqLabelMode === "numeric" ? "numeric" : "alpha";
  els.mcqAnswer.value = String(q.answer || "1");

  els.fillAnswer.value = q.type === "fill" ? String(q.answer || "") : "";
  els.textAnswer.value = q.type === "text" ? String(q.answer || "") : "";

  updateMcqEditorLabels();
  updateMcqAnswerAvailability();
  updateQuestionTypeInputs();
  renderFillAuthorPreview();
  setQuestionFormMode();
  switchEditorView("question");
  switchTab("editor");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderGenreUI() {
  const genres = getAvailableGenres();
  if (state.activeGenre !== "all" && !genres.includes(state.activeGenre)) {
    state.activeGenre = "all";
  }

  const currentFormGenre = els.questionGenre.value;
  els.questionGenre.innerHTML = genres
    .map((genre) => `<option value="${escapeHtml(genre)}">${escapeHtml(genre)}</option>`)
    .join("");
  els.questionGenre.insertAdjacentHTML(
    "beforeend",
    `<option value="${QUESTION_GENRE_NEW_VALUE}">+ 新規作成</option>`
  );

  if (genres.includes(currentFormGenre)) {
    setQuestionGenreSelection(currentFormGenre);
  } else if (state.activeGenre !== "all" && genres.includes(state.activeGenre)) {
    setQuestionGenreSelection(state.activeGenre);
  } else {
    setQuestionGenreSelection(genres[0]);
  }

  els.genreChips.innerHTML = `
    <button class="genreBtn ${state.activeGenre === "all" ? "active" : ""}" data-genre="all">すべて</button>
    ${genres
      .map(
        (genre) =>
          `<button class="genreBtn ${state.activeGenre === genre ? "active" : ""}" data-genre="${escapeHtml(genre)}">${escapeHtml(genre)}</button>`
      )
      .join("")}
  `;

  els.activeGenreLabel.textContent = state.activeGenre === "all" ? "すべて" : state.activeGenre;

  els.genreChips.querySelectorAll("button[data-genre]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const selected = btn.dataset.genre || "all";
      state.activeGenre = selected;
      if (selected !== "all") {
        els.questionGenre.value = selected;
      }
      renderGenreUI();
      renderQuestionList();
      renderExamBuilder();
      renderStatus();
    });
  });
}

function renderQuestionList() {
  els.questionList.innerHTML = "";
  const filtered = state.questions.filter((q) => {
    const genreMatch = state.activeGenre === "all" ? true : q.genre === state.activeGenre;
    const query = state.questionSearch;
    if (!query) return genreMatch;
    const haystack = `${q.text} ${q.genre} ${q.explanation || ""}`.toLowerCase();
    return genreMatch && haystack.includes(query);
  });

  if (!filtered.length) {
    const li = document.createElement("li");
    li.innerHTML = "<p>条件に一致する問題はありません。</p>";
    els.questionList.appendChild(li);
    return;
  }

  filtered.forEach((q, idx) => {
    const fullIndex = state.questions.findIndex((item) => item.id === q.id);
    const canMoveUp = fullIndex > 0;
    const canMoveDown = fullIndex < state.questions.length - 1;
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="listMeta">
        <span class="chip">第${idx + 1}問</span>
        <span class="chip">${escapeHtml(q.genre || "未分類")}</span>
        <span class="chip">${typeLabel(q.type)}</span>
        ${q.type === "mcq" ? `<span class="chip">${q.mcqLabelMode === "numeric" ? "123" : "ABC"}</span>` : ""}
      </div>
      <p>${escapeHtml(q.text)}</p>
      <div class="actions listActions">
        <button data-move-up="${q.id}" class="ghost" ${canMoveUp ? "" : "disabled"} aria-label="問題を上へ移動">↑</button>
        <button data-move-down="${q.id}" class="ghost" ${canMoveDown ? "" : "disabled"} aria-label="問題を下へ移動">↓</button>
        <button data-duplicate="${q.id}" class="ghost">複製</button>
        <button data-edit="${q.id}" class="ghost">編集</button>
        <button data-delete="${q.id}" class="danger">削除</button>
      </div>
    `;
    els.questionList.appendChild(li);
  });

  els.questionList.querySelectorAll("button[data-move-up]").forEach((btn) => {
    btn.addEventListener("click", () => moveQuestion(btn.dataset.moveUp, -1));
  });

  els.questionList.querySelectorAll("button[data-move-down]").forEach((btn) => {
    btn.addEventListener("click", () => moveQuestion(btn.dataset.moveDown, 1));
  });

  els.questionList.querySelectorAll("button[data-edit]").forEach((btn) => {
    btn.addEventListener("click", () => {
      startQuestionEdit(btn.dataset.edit);
    });
  });

  els.questionList.querySelectorAll("button[data-duplicate]").forEach((btn) => {
    btn.addEventListener("click", () => {
      duplicateQuestion(btn.dataset.duplicate);
    });
  });

  els.questionList.querySelectorAll("button[data-delete]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!(await confirmDangerousAction("この問題を削除しますか？"))) return;
      const snapshot = {
        questions: cloneSerializable(state.questions),
        exams: cloneSerializable(state.exams),
        activeExamId: state.activeExamId,
        activeGenre: state.activeGenre,
        questionSearch: state.questionSearch,
        printExamId: state.printExamId,
      };
      state.questions = state.questions.filter((q) => q.id !== btn.dataset.delete);
      if (state.editingQuestionId === btn.dataset.delete) {
        resetQuestionForm();
      }
      saveQuestions();
      syncExamsWithQuestions();
      saveExams();

      renderGenreUI();
      renderQuestionList();
      renderExamManager();
      renderExamBuilder();
      renderPrintPreview();
      renderMemorize();
      renderStatus();
      renderExamProgress();
      offerUndo("問題を削除しました（元に戻せます）", () => {
        state.questions = snapshot.questions;
        state.exams = snapshot.exams;
        state.activeExamId = snapshot.activeExamId;
        state.activeGenre = snapshot.activeGenre;
        state.questionSearch = snapshot.questionSearch;
        state.printExamId = snapshot.printExamId;
        els.questionSearchInput.value = snapshot.questionSearch;

        saveQuestions();
        saveExams();
        saveActiveExamId();
        savePrintPrefs();

        renderGenreUI();
        renderQuestionList();
        renderExamManager();
        renderExamBuilder();
        renderPrintPreview();
        renderMemorize();
        renderStatus();
        renderExamProgress();
      });
    });
  });
}

function duplicateQuestion(questionId) {
  const from = state.questions.findIndex((q) => q.id === questionId);
  if (from < 0) return;
  const source = state.questions[from];
  const copy = {
    ...source,
    id: crypto.randomUUID(),
    text: `${source.text}（コピー）`,
  };
  const next = [...state.questions];
  next.splice(from + 1, 0, copy);
  state.questions = next;
  saveQuestions();
  renderQuestionList();
  renderExamBuilder();
  renderPrintPreview();
  renderMemorize();
  renderStatus();
  notify("問題を複製しました", "success");
}

function moveQuestion(questionId, direction) {
  const from = state.questions.findIndex((q) => q.id === questionId);
  if (from < 0) return;
  const to = from + direction;
  if (to < 0 || to >= state.questions.length) return;

  const next = [...state.questions];
  const temp = next[from];
  next[from] = next[to];
  next[to] = temp;
  state.questions = next;
  saveQuestions();

  renderQuestionList();
  renderExamBuilder();
  renderPrintPreview();
  renderMemorize();
}

function renameExam(examId, title, options = {}) {
  const opts = options || {};
  const exam = state.exams.find((e) => e.id === examId);
  if (!exam) return;
  const normalized = String(title || "").trim();
  const nextTitle = normalized || String(exam.title || "").trim();
  if (!nextTitle) {
  if (!opts.silent) notify("模試タイトルが空です。タイトルを入力してから保存してください。", "error");
    return;
  }
  const nextTimeLimitMin = Math.max(0, Number(els.examTimeLimitInput.value || 0));
  const changed = exam.title !== nextTitle || Number(exam.timeLimitMin || 0) !== nextTimeLimitMin;
  if (!changed) return;

  exam.title = nextTitle;
  exam.timeLimitMin = nextTimeLimitMin;
  exam.updatedAt = Date.now();
  saveExams();
  els.examTitleInput.value = nextTitle;
  els.examTimeLimitInput.value = String(exam.timeLimitMin || 0);
  renderExamManager();
  renderExamBuilder();
  renderMemorize();
  renderStatus();
  renderPrintPreview();
  if (!opts.silent) notify("模試設定を保存しました", "success");
}

function deleteExam(examId) {
  if (state.running) {
    notify("受験中は模試を削除できません", "warn");
    return;
  }
  if (state.exams.length <= 1) {
    notify("模試は最低1つ必要です", "warn");
    return;
  }

  state.exams = state.exams.filter((e) => e.id !== examId);
  if (!state.exams.some((e) => e.id === state.activeExamId)) {
    state.activeExamId = state.exams[0].id;
  }
  saveExams();
  saveActiveExamId();

  renderExamManager();
  renderExamBuilder();
  renderPrintPreview();
  renderMemorize();
  renderStatus();
  renderExamProgress();
}

function duplicateExam(examId) {
  const source = state.exams.find((e) => e.id === examId);
  if (!source) return;
  const copy = {
    ...createExam(`${source.title} コピー`, source.questionIds),
    questionIds: [...source.questionIds],
    timeLimitMin: Number(source.timeLimitMin || 0),
  };
  state.exams.unshift(copy);
  state.activeExamId = copy.id;
  state.examBuilderGenre = "all";
  saveExams();
  saveActiveExamId();
  renderExamManager();
  renderExamBuilder();
  renderPrintPreview();
  renderMemorize();
  renderStatus();
  openExamBuilder();
}

function toBase64UrlUnicode(text) {
  const bytes = new TextEncoder().encode(String(text || ""));
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function fromBase64UrlUnicode(base64url) {
  let b64 = String(base64url || "").replaceAll("-", "+").replaceAll("_", "/");
  while (b64.length % 4 !== 0) b64 += "=";
  const binary = atob(b64);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function questionSignature(q) {
  return JSON.stringify({
    genre: String(q.genre || "").trim(),
    text: String(q.text || "").trim(),
    type: q.type,
    options: Array.isArray(q.options) ? q.options.map((o) => String(o || "").trim()) : [],
    answer: String(q.answer || "").trim(),
    mcqLabelMode: q.mcqLabelMode === "numeric" ? "numeric" : "alpha",
    explanation: String(q.explanation || "").trim(),
  });
}

function normalizeSharePassword(raw) {
  const v = String(raw || "").trim();
  if (!v) return "";
  if (!/^\d{4}$/.test(v)) return null;
  return v;
}

function updateSharePasswordHint(normalizedPassword) {
  if (!els.sharePasswordHint) return;
  els.sharePasswordHint.classList.remove("error", "ok", "muted");
  if (normalizedPassword === null) {
    els.sharePasswordHint.textContent = "4桁の数字で入力してください（例: 1234）。";
    els.sharePasswordHint.classList.add("fieldHint", "error");
    return;
  }
  if (normalizedPassword === "") {
    els.sharePasswordHint.textContent = "4桁の数字で設定できます。空欄ならパスワードなし。";
    els.sharePasswordHint.classList.add("fieldHint", "muted");
    return;
  }
  els.sharePasswordHint.textContent = "パスワード付き共有コードになります。";
  els.sharePasswordHint.classList.add("fieldHint", "ok");
}

function buildSharedExamCode(examId, password = "", options = {}) {
  const exam = state.exams.find((e) => e.id === examId);
  if (!exam) return "";
  const questions = exam.questionIds
    .map((id) => state.questions.find((q) => q.id === id))
    .filter(Boolean)
    .map((q) => ({
      genre: q.genre || "未分類",
      text: q.text || "",
      type: q.type || "mcq",
      options: Array.isArray(q.options) ? q.options : [],
      answer: q.answer ?? "",
      mcqLabelMode: q.mcqLabelMode === "numeric" ? "numeric" : "alpha",
      explanation: q.explanation || "",
    }));
  const payload = {
    v: 1,
    title: exam.title || "共有模試",
    timeLimitMin: Number(exam.timeLimitMin || 0),
    questions,
  };
  if (options.includeInsight) {
    payload.share = {
      note: String(options.note || "").trim(),
      insight: getLatestShareInsight(),
      generatedAt: Date.now(),
    };
  }
  const normalizedPassword = normalizeSharePassword(password);
  if (normalizedPassword) payload.p = normalizedPassword;
  return `MM1-${toBase64UrlUnicode(JSON.stringify(payload))}`;
}

function buildExpiringShareLink(code, hours) {
  const data = {
    v: 1,
    exp: Date.now() + hours * 60 * 60 * 1000,
    code,
  };
  const token = toBase64UrlUnicode(JSON.stringify(data));
  return `${window.location.origin}${window.location.pathname}#share=${token}`;
}

function copyTextToClipboard(text, successMsg) {
  if (!text) return;
  if (navigator.clipboard?.writeText) {
    navigator.clipboard
      .writeText(text)
      .then(() => notify(successMsg, "success"))
      .catch(() => {
        prompt("コピーできないため手動でコピーしてください", text);
      });
  } else {
    prompt("コピーできないため手動でコピーしてください", text);
  }
}

async function readClipboardTextSafe() {
  if (!navigator.clipboard?.readText) return "";
  try {
    return String((await navigator.clipboard.readText()) || "");
  } catch {
    return "";
  }
}

async function shareViaNative(title, text) {
  if (!navigator.share) {
    notify("この端末では共有シートが使えません。コピーで共有してください。", "warn");
    return false;
  }
  try {
    await navigator.share({ title, text });
    notify("共有シートを開きました", "success");
    return true;
  } catch (error) {
    if (error && error.name === "AbortError") return false;
    notify("共有シートを開けませんでした。コピーで共有してください。", "warn");
    return false;
  }
}

function updateShareQr(targetEl, value) {
  if (!targetEl) return;
  const data = encodeURIComponent(value || "");
  targetEl.src = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${data}`;
}

function switchShareView(name) {
  const isCode = name !== "link";
  lastShareView = isCode ? "code" : "link";
  els.shareCodeTabBtn.classList.toggle("active", isCode);
  els.shareLinkTabBtn.classList.toggle("active", !isCode);
  els.shareCodeTabBtn.setAttribute("aria-selected", isCode ? "true" : "false");
  els.shareLinkTabBtn.setAttribute("aria-selected", isCode ? "false" : "true");
  els.shareCodeTabBtn.setAttribute("tabindex", isCode ? "0" : "-1");
  els.shareLinkTabBtn.setAttribute("tabindex", isCode ? "-1" : "0");
  els.shareCodeView.classList.toggle("active", isCode);
  els.shareLinkView.classList.toggle("active", !isCode);
  els.shareCodeView.setAttribute("aria-hidden", isCode ? "false" : "true");
  els.shareLinkView.setAttribute("aria-hidden", isCode ? "true" : "false");
}

function refreshShareModalCode() {
  if (!currentShareExamId) return;
  const normalizedPassword = normalizeSharePassword(els.sharePasswordInput.value);
  updateSharePasswordHint(normalizedPassword);
  if (normalizedPassword === null) {
    els.shareCodeText.value = "";
    els.shareLinkText.value = "";
    els.shareCopyCodeBtn.disabled = true;
    els.shareNativeCodeBtn.disabled = true;
    els.shareQuickLinkBtn.disabled = true;
    els.shareGenerateLinkBtn.disabled = true;
    els.shareCopyLinkBtn.disabled = true;
    els.shareNativeLinkBtn.disabled = true;
    els.shareQrImage.removeAttribute("src");
    els.shareLinkQrImage.removeAttribute("src");
    return;
  }
  const code = buildSharedExamCode(currentShareExamId, normalizedPassword, {
    includeInsight: Boolean(els.shareIncludeInsight?.checked),
    note: String(els.shareNoteInput?.value || ""),
  });
  els.shareCodeText.value = code;
  els.shareCopyCodeBtn.disabled = !code;
  els.shareNativeCodeBtn.disabled = !code || !navigator.share;
  els.shareQuickLinkBtn.disabled = !code;
  els.shareGenerateLinkBtn.disabled = !code;
  els.shareCopyLinkBtn.disabled = true;
  els.shareNativeLinkBtn.disabled = true;
  els.shareLinkText.value = "";
  els.shareLinkQrImage.removeAttribute("src");
  updateShareQr(els.shareQrImage, code);
}

function openShareModal(exam) {
  currentShareExamId = exam.id;
  els.shareExamTitle.textContent = `対象: ${exam.title}`;
  els.sharePasswordInput.value = "";
  if (els.shareIncludeInsight) els.shareIncludeInsight.checked = false;
  if (els.shareNoteInput) els.shareNoteInput.value = "";
  els.shareLinkText.value = "";
  const defaultHours = Number(state.settings.defaultShareExpireHours || 24);
  els.shareExpireSelect.value = [24, 168, 720].includes(defaultHours) ? String(defaultHours) : "24";
  els.shareCopyLinkBtn.disabled = true;
  els.shareNativeLinkBtn.disabled = true;
  switchShareView(lastShareView);
  if (els.shareIncludeInsight) els.shareIncludeInsight.disabled = false;
  if (els.shareNoteInput) els.shareNoteInput.disabled = false;
  if (els.shareProHint) {
    els.shareProHint.textContent = "学習サマリーと共有メモをコードに含められます。";
  }
  refreshShareModalCode();
  openModal(els.shareModal, els.sharePasswordInput);
}

function closeShareModal() {
  currentShareExamId = "";
  closeModalBase(els.shareModal);
}

function openSettingsModal() {
  closeOptionPickerModal(null);
  if (els.fontSizeSelect) {
    els.fontSizeSelect.value = state.settings.fontSize;
  }
  if (els.simpleUiToggle) {
    els.simpleUiToggle.checked = Boolean(state.settings.simpleUi);
  }
  if (els.autoNextMcqToggle) {
    els.autoNextMcqToggle.checked = Boolean(state.settings.autoNextMcq);
  }
  if (els.memorizeOrderSelect) {
    els.memorizeOrderSelect.value = state.settings.memorizeOrder || "original";
  }
  if (els.defaultShareExpireSelect) {
    els.defaultShareExpireSelect.value = String(state.settings.defaultShareExpireHours || 24);
  }
  if (els.toastDurationSelect) {
    els.toastDurationSelect.value = state.settings.toastDuration || "standard";
  }
  if (els.highContrastToggle) {
    els.highContrastToggle.checked = Boolean(state.settings.highContrast);
  }
  if (els.hideDailyQuoteToggle) {
    els.hideDailyQuoteToggle.checked = Boolean(state.settings.hideDailyQuote);
  }
  renderBilling();
  openModal(
    els.settingsModal,
    document.getElementById("enhanced-fontSizeSelect") || els.fontSizeSelect
  );
}

function closeSettingsModal() {
  closeModalBase(els.settingsModal);
}

function openQrFullscreen(src) {
  els.qrFullscreenImage.src = src;
  openModal(els.qrFullscreenModal, els.qrFullscreenCloseBtn);
}

function closeQrFullscreen() {
  closeModalBase(els.qrFullscreenModal);
}

async function tryImportSharedLinkFromHash() {
  const hash = String(window.location.hash || "");
  if (!hash.startsWith("#share=")) return;
  const token = hash.slice(7);
  history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  try {
    const payload = JSON.parse(fromBase64UrlUnicode(token));
    if (!payload || payload.v !== 1 || !payload.code || !payload.exp) {
      notify("共有リンクの形式が不正です。送り主にリンク再発行を依頼してください。", "warn");
      return;
    }
    if (Date.now() > Number(payload.exp)) {
      notify("共有リンクの有効期限が切れています。送り主に新しいリンクを依頼してください。", "warn");
      return;
    }
    const ok = await confirmAction("共有リンクを検出しました。模試を取り込みますか？", {
      title: "共有取込",
      yesLabel: "取り込む",
      noLabel: "キャンセル",
      danger: false,
    });
    if (!ok) return;
    await importSharedExamCode(String(payload.code));
  } catch {
    notify("共有リンクを解読できませんでした。URLを最後までコピーして再度試してください。", "error");
  }
}

function shareExamByCode(examId) {
  const exam = state.exams.find((e) => e.id === examId);
  if (!exam) return;
  const picked = exam.questionIds
    .map((id) => state.questions.find((q) => q.id === id))
    .filter(Boolean);
  if (!picked.length) {
    notify("この模試には共有できる問題がありません。模試作成で問題を追加してください。", "warn");
    return;
  }
  openShareModal(exam);
}

async function importSharedExamByCodePrompt() {
  const clip = await readClipboardTextSafe();
  const prefilled = normalizeShareCodeInput(clip);
  const input = await openInputPrompt({
    title: "共有コード取込",
    message: "共有コードを貼り付けてください。",
    placeholder: "例: MM1-xxxx...",
    defaultValue: prefilled,
    okLabel: "取り込む",
    cancelLabel: "キャンセル",
    hint: prefilled
      ? "クリップボードの共有コードを自動入力しました。必要なら編集して取り込めます。"
      : "コードが長い場合はそのまま貼り付けできます。",
    type: "text",
  });
  if (input === null) return;
  const normalized = normalizeShareCodeInput(input);
  if (!normalized) return;
  await importSharedExamCode(normalized);
}

function normalizeShareCodeInput(raw) {
  const text = String(raw || "").normalize("NFKC").trim();
  if (!text) return "";

  const compact = text.replace(/\s+/g, "");
  if (compact.toUpperCase().startsWith("MM1-")) {
    return `MM1-${compact.slice(4)}`;
  }

  const embedded = compact.match(/MM1-[A-Za-z0-9\-_]+/i);
  if (embedded?.[0]) {
    return `MM1-${embedded[0].slice(4)}`;
  }
  return compact;
}

async function importSharedExamCode(code) {
  const normalizedCode = normalizeShareCodeInput(code);
  if (!normalizedCode) {
      notify("共有コードが空です。MM1- から始まるコードを貼り付けてください。", "warn");
    return false;
  }
  if (normalizedCode.length > 120000) {
    notify("共有コードが長すぎます。コピー内容を確認して再試行してください。", "warn");
    return false;
  }
  if (!normalizedCode.startsWith("MM1-")) {
    notify("共有コードの形式が正しくありません。MM1- から始まるコードを貼り付けてください。", "warn");
    return false;
  }
  try {
    const payload = JSON.parse(fromBase64UrlUnicode(normalizedCode.slice(4)));
    if (!payload || payload.v !== 1 || !Array.isArray(payload.questions)) {
      notify("共有コードの中身を読み取れませんでした。コピー漏れのないコードで再試行するか、送り主に再発行を依頼してください。", "error");
      return false;
    }
    if (!payload.questions.length) {
      notify("共有コードに問題が含まれていません。送り主に確認してください。", "warn");
      return false;
    }
    if (payload.questions.length > 500) {
      notify("共有コードの問題数が上限を超えています（500問まで）。", "warn");
      return false;
    }
    if (payload.p) {
      const entered = await openInputPrompt({
        title: "パスワード入力",
        message: "この共有コードにはパスワードが設定されています（4桁）",
        placeholder: "4桁の数字",
        okLabel: "確認",
        cancelLabel: "キャンセル",
        hint: "送り主から共有された4桁の数字を入力してください。",
        type: "password",
        inputMode: "numeric",
        maxLength: 4,
      });
      if (entered === null) return false;
      if (String(entered).trim() !== String(payload.p)) {
        notify("パスワードが一致しません。送り主に4桁パスワードを確認してください。", "warn");
        return false;
      }
    }

    const existingBySig = new Map(state.questions.map((q) => [questionSignature(q), q]));
    let skipped = 0;
    let reused = 0;
    let createdCount = 0;
    const importedIds = payload.questions.map((raw) => {
      const draft = {
        genre: String(raw.genre || "未分類"),
        text: String(raw.text || ""),
        type: raw.type === "fill" || raw.type === "text" ? raw.type : "mcq",
        options: Array.isArray(raw.options) ? raw.options.map((o) => String(o || "")) : [],
        answer: raw.answer ?? "",
        mcqLabelMode: raw.mcqLabelMode === "numeric" ? "numeric" : "alpha",
        explanation: String(raw.explanation || ""),
      };
      if (!String(draft.text || "").trim()) {
        skipped += 1;
        return "";
      }
      if (draft.type === "mcq" && draft.options.filter((o) => String(o || "").trim()).length < 2) {
        skipped += 1;
        return "";
      }
      const sig = questionSignature(draft);
      const existing = existingBySig.get(sig);
      if (existing) {
        reused += 1;
        return existing.id;
      }
      const created = { id: crypto.randomUUID(), ...draft };
      state.questions.push(created);
      existingBySig.set(sig, created);
      createdCount += 1;
      return created.id;
    }).filter(Boolean);
    if (!importedIds.length) {
      notify("有効な問題を取り込めませんでした。共有元データを確認してください。", "warn");
      return false;
    }

    const exam = createExam(`${String(payload.title || "共有模試").trim()}（共有）`, importedIds);
    exam.timeLimitMin = Math.max(0, Number(payload.timeLimitMin || 0));
    state.exams.unshift(exam);
    state.activeExamId = exam.id;

    state.questions.forEach((q) => {
      const g = String(q.genre || "").trim();
      if (g && !state.genres.includes(g)) state.genres.push(g);
    });

    saveQuestions();
    saveGenres();
    saveExams();
    saveActiveExamId();
    if (!state.running) clearExamSessionState();

    renderGenreUI();
    renderQuestionList();
    renderExamManager();
    renderExamBuilder();
    renderPrintPreview();
    renderMemorize();
    renderStatus();
    switchTab("exam");
    closeExamBuilder();
    const meta = `新規 ${createdCount}問 / 既存再利用 ${reused}問${skipped ? ` / 取込不可 ${skipped}問` : ""}`;
    notify(`共有コードから模試を取り込みました（${meta}）`, "success");
    if (payload.share?.note || payload.share?.insight) {
      const note = String(payload.share?.note || "").trim();
      const insight = String(payload.share?.insight || "").trim();
      const message = `共有メモ: ${note || "なし"}${insight ? ` / 学習サマリー: ${insight}` : ""}`;
      notify(message, "info", 4200);
    }
    return true;
  } catch {
    notify("共有コードを解読できませんでした。改行や欠けがないか確認し、コード全体を貼り付けて再試行してください。", "error");
    return false;
  }
}

function scheduleExamAutoSave() {
  if (examAutoSaveTimer) clearTimeout(examAutoSaveTimer);
  examAutoSaveTimer = setTimeout(() => {
    examAutoSaveTimer = 0;
    renameExam(state.activeExamId, els.examTitleInput.value, { silent: true });
  }, 420);
}

function getExamUsageStats(exam) {
  const related = state.history.filter((h) => {
    if (h.mode !== "exam") return false;
    if (h.examId && exam.id) return h.examId === exam.id;
    return h.examTitle === exam.title;
  });
  const count = related.length;
  const latestAt = count ? Math.max(...related.map((h) => Number(h.createdAt) || 0)) : 0;
  return { count, latestAt };
}

function renderExamManager() {
  const active = getActiveExam();
  els.activeExamTitle.textContent = active ? active.title : "未選択";
  els.examTitleInput.value = active ? active.title : "";
  els.examTimeLimitInput.value = active ? String(active.timeLimitMin || 0) : "0";
  els.examSearchInput.value = state.examSearch;
  els.examSortSelect.value = state.examSort;
  refreshEnhancedSelectTrigger("examSortSelect");

  const filtered = state.exams.filter((exam) => {
    const q = state.examSearch;
    if (!q) return true;
    return String(exam.title || "").toLowerCase().includes(q);
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (state.examSort) {
      case "updated_asc":
        return a.updatedAt - b.updatedAt;
      case "title_asc":
        return String(a.title || "").localeCompare(String(b.title || ""), "ja");
      case "title_desc":
        return String(b.title || "").localeCompare(String(a.title || ""), "ja");
      case "questions_desc":
        return b.questionIds.length - a.questionIds.length;
      case "questions_asc":
        return a.questionIds.length - b.questionIds.length;
      case "updated_desc":
      default:
        return b.updatedAt - a.updatedAt;
    }
  });

  if (!sorted.length) {
    els.examList.innerHTML = "<li class='examCard'><p class='muted'>条件に一致する模試はありません。</p></li>";
    return;
  }

  els.examList.innerHTML = sorted
    .map((exam) => {
      const isActive = exam.id === state.activeExamId;
      const usage = getExamUsageStats(exam);
      const lastLabel = usage.latestAt ? new Date(usage.latestAt).toLocaleDateString("ja-JP") : "未受験";
      return `
        <li class="examCard ${isActive ? "active" : ""}">
          <div class="examCardTop">
            <strong>${escapeHtml(exam.title)}${isActive ? "（選択中）" : ""}</strong>
            <span class="examMeta">${exam.questionIds.length}問 / ${exam.timeLimitMin > 0 ? `${exam.timeLimitMin}分` : "無制限"}</span>
          </div>
          <span class="examMeta">更新: ${new Date(exam.updatedAt).toLocaleDateString("ja-JP")}</span>
          <span class="examMeta">受験: ${usage.count}回 / 最終受験: ${lastLabel}</span>
          <div class="examActions">
            <button class="ghost" data-open-exam-id="${exam.id}">編集</button>
            <button data-start-exam-id="${exam.id}">受験開始</button>
            <button class="ghost" data-share-exam-id="${exam.id}">共有</button>
            <button class="ghost" data-duplicate-exam-id="${exam.id}">複製</button>
            <button class="danger" data-delete-exam-id="${exam.id}">削除</button>
          </div>
        </li>
      `;
    })
    .join("");

  els.examList.querySelectorAll("button[data-open-exam-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      setActiveExam(btn.dataset.openExamId);
      state.examBuilderGenre = "all";
      renderExamBuilder();
      openExamBuilder();
    });
  });

  els.examList.querySelectorAll("button[data-start-exam-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      setActiveExam(btn.dataset.startExamId);
      runWithButton(btn, "開始中...", startExam);
    });
  });

  els.examList.querySelectorAll("button[data-delete-exam-id]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!(await confirmDangerousAction("この模試を削除しますか？"))) return;
      const beforeCount = state.exams.length;
      const snapshot = {
        exams: cloneSerializable(state.exams),
        activeExamId: state.activeExamId,
        printExamId: state.printExamId,
      };
      deleteExam(btn.dataset.deleteExamId);
      if (state.exams.length === beforeCount) return;
      offerUndo("模試を削除しました（元に戻せます）", () => {
        state.exams = snapshot.exams;
        state.activeExamId = snapshot.activeExamId;
        state.printExamId = snapshot.printExamId;
        saveExams();
        saveActiveExamId();
        savePrintPrefs();
        renderExamManager();
        renderExamBuilder();
        renderPrintPreview();
        renderMemorize();
        renderStatus();
        renderExamProgress();
      });
    });
  });

  els.examList.querySelectorAll("button[data-share-exam-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      shareExamByCode(btn.dataset.shareExamId);
    });
  });

  els.examList.querySelectorAll("button[data-duplicate-exam-id]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const ok = await confirmAction("この模試を複製しますか？", {
        title: "複製確認",
        yesLabel: "はい",
        noLabel: "いいえ",
        danger: false,
      });
      if (!ok) return;
      duplicateExam(btn.dataset.duplicateExamId);
    });
  });
}

function getExamQuestions() {
  const active = getActiveExam();
  if (!active) return [];
  const selectedSet = new Set(active.questionIds);
  return state.questions.filter((q) => selectedSet.has(q.id));
}

function shuffleArray(list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }
  return arr;
}

function getMemorizeQuestions(activeExamQuestions = null) {
  const base = activeExamQuestions || getExamQuestions();
  if (!state.memorize.started || !state.memorize.questionIds.length) return base;
  const byId = new Map(base.map((q) => [q.id, q]));
  const ordered = state.memorize.questionIds.map((id) => byId.get(id)).filter(Boolean);
  return ordered.length ? ordered : base;
}

function toggleExamQuestionSelection(questionId, checked) {
  if (!getActiveExam()) return;
  updateActiveExam((exam) => {
    const selected = new Set(exam.questionIds);
    if (checked) selected.add(questionId);
    else selected.delete(questionId);
    exam.questionIds = state.questions.map((q) => q.id).filter((id) => selected.has(id));
  });
  renderExamManager();
  renderExamBuilder();
  renderPrintPreview();
  renderMemorize();
  renderExamProgress();
}

function addSelectedGenreWholeToExam() {
  const active = getActiveExam();
  if (!active) return;
  if (state.examBuilderGenre === "all") {
    notify("先にジャンルを選択してください", "warn");
    return;
  }
  const ids = state.questions.filter((q) => q.genre === state.examBuilderGenre).map((q) => q.id);
  if (!ids.length) {
    notify(`ジャンル「${state.examBuilderGenre}」に問題がありません。`, "warn");
    return;
  }
  const before = new Set(active.questionIds);
  let added = 0;
  ids.forEach((id) => {
    if (!before.has(id)) added += 1;
  });
  updateActiveExam((exam) => {
    exam.questionIds = [...exam.questionIds, ...ids];
  });
  renderExamManager();
  renderExamBuilder();
  renderPrintPreview();
  renderMemorize();
  renderExamProgress();
  if (added === 0) {
    notify(`ジャンル「${state.examBuilderGenre}」の問題はすでに追加済みです。`, "info");
  } else {
    notify(`ジャンル「${state.examBuilderGenre}」から ${added}問 追加しました。`, "success");
  }
}

function getVisibleBuilderQuestionIds() {
  const filterGenre = state.examBuilderGenre || "all";
  if (filterGenre === "all") return [];
  return state.questions.filter((q) => q.genre === filterGenre).map((q) => q.id);
}

function pickVisibleQuestions(selectAll) {
  const active = getActiveExam();
  if (!active) return;
  const visibleIds = getVisibleBuilderQuestionIds();
  if (!visibleIds.length) {
    notify("先にジャンルを選択してください", "warn");
    return;
  }
  const before = new Set(active.questionIds);
  let changed = 0;
  if (selectAll) {
    visibleIds.forEach((id) => {
      if (!before.has(id)) changed += 1;
    });
  } else {
    visibleIds.forEach((id) => {
      if (before.has(id)) changed += 1;
    });
  }

  updateActiveExam((exam) => {
    const selected = new Set(exam.questionIds);
    if (selectAll) {
      visibleIds.forEach((id) => selected.add(id));
    } else {
      visibleIds.forEach((id) => selected.delete(id));
    }
    exam.questionIds = state.questions.map((q) => q.id).filter((id) => selected.has(id));
  });

  renderExamManager();
  renderExamBuilder();
  renderPrintPreview();
  renderMemorize();
  renderExamProgress();
  if (changed === 0) {
    notify(selectAll ? "表示中の問題はすでに全選択済みです。" : "表示中の問題はすでに全解除済みです。", "info");
  } else {
    notify(
      selectAll
        ? `表示中の問題を全選択しました（${changed}問を追加）`
        : `表示中の問題を全解除しました（${changed}問を解除）`,
      "success"
    );
  }
}

function renderExamBuilder() {
  const active = getActiveExam();
  const genres = getAvailableGenres().filter((g) => g !== "未分類" || state.questions.some((q) => q.genre === "未分類"));
  if (state.examBuilderGenre !== "all" && !genres.includes(state.examBuilderGenre)) {
    state.examBuilderGenre = genres[0] || "all";
  }

  if (!active) {
    els.examSelectionSummary.textContent = "模試がありません。新規作成してください。";
    els.examQuestionPicker.innerHTML = "<p class='muted'>模試が未作成です。</p>";
    els.examGenreList.innerHTML = "";
    return;
  }

  els.activeExamTitle.textContent = active.title;
  els.examTitleInput.value = active.title;
  els.examTimeLimitInput.value = String(active.timeLimitMin || 0);

  const selectedSet = new Set(active.questionIds);
  els.examGenreList.innerHTML = genres.length
    ? genres
        .map((genre) => {
          const totalInGenre = state.questions.filter((q) => q.genre === genre).length;
          const pickedInGenre = state.questions.filter((q) => q.genre === genre && selectedSet.has(q.id)).length;
          const activeCls = state.examBuilderGenre === genre ? "active" : "";
          const allAddedCls = totalInGenre > 0 && pickedInGenre === totalInGenre ? "allAdded" : "";
          return `<button class="examGenreBtn ${activeCls} ${allAddedCls}" data-builder-genre="${escapeHtml(genre)}">${escapeHtml(genre)} (${pickedInGenre}/${totalInGenre})</button>`;
        })
        .join("")
    : "<span class='muted'>ジャンルがありません。</span>";

  els.examGenreList.querySelectorAll("button[data-builder-genre]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.examBuilderGenre = btn.dataset.builderGenre;
      renderExamBuilder();
      // ジャンル切替時は、問題一覧の先頭から見えるようにスクロール位置をリセット
      els.examQuestionPicker.scrollTop = 0;
      els.examQuestionPicker.scrollIntoView({ block: "start", behavior: "auto" });
    });
  });

  els.examSelectionSummary.textContent = `「${active.title}」 選択中: ${active.questionIds.length} / ${state.questions.length}問`;
  els.selectedGenreText.textContent =
    state.examBuilderGenre === "all"
      ? "ジャンルを選択すると問題を表示します。"
      : `選択中ジャンル: ${state.examBuilderGenre}`;
  const bulkDisabled = state.examBuilderGenre === "all";
  els.examSelectedOnlyToggle.checked = state.examPickerSelectedOnly;
  els.examSelectedOnlyToggle.disabled = bulkDisabled;
  els.pickVisibleAllBtn.disabled = bulkDisabled;
  els.unpickVisibleAllBtn.disabled = bulkDisabled;

  if (!state.questions.length) {
    els.examQuestionPicker.innerHTML = "<p class='muted'>問題を作成するとここに表示されます。</p>";
    return;
  }

  const filterGenre = state.examBuilderGenre || "all";
  if (filterGenre === "all") {
    els.examQuestionPicker.innerHTML = "<p class='muted'>上のジャンルをクリックしてください。</p>";
    return;
  }
  const list = state.questions.filter((q) => {
    if (q.genre !== filterGenre) return false;
    if (!state.examPickerSelectedOnly) return true;
    return selectedSet.has(q.id);
  });

  if (!list.length) {
    els.examQuestionPicker.innerHTML = state.examPickerSelectedOnly
      ? "<p class='muted'>このジャンルで選択済みの問題はありません。</p>"
      : "<p class='muted'>このジャンルに問題がありません。</p>";
    return;
  }

  els.examQuestionPicker.innerHTML = list
    .map(
      (q, idx) => `
      <label class="pickerItem">
        <input type="checkbox" data-pick-id="${q.id}" ${selectedSet.has(q.id) ? "checked" : ""} />
        <span>
          <span class="pickerMeta">
            <span class="chip">#${idx + 1}</span>
            <span class="chip">${escapeHtml(q.genre || "未分類")}</span>
            <span class="chip">${typeLabel(q.type)}</span>
            ${q.type === "mcq" ? `<span class="chip">${q.mcqLabelMode === "numeric" ? "123" : "ABC"}</span>` : ""}
          </span>
          ${escapeHtml(q.text)}
        </span>
      </label>
    `
    )
    .join("");

  els.examQuestionPicker.querySelectorAll("input[data-pick-id]").forEach((input) => {
    input.addEventListener("change", () => toggleExamQuestionSelection(input.dataset.pickId, input.checked));
  });
}

function typeLabel(type) {
  if (type === "mcq") return "4択";
  if (type === "fill") return "穴埋め";
  return "記述";
}

function buildFillMaskedHtml(text, answer, markerHtml) {
  const baseText = String(text || "");
  const ans = String(answer || "").trim();
  if (!ans) return escapeHtml(baseText);
  const idx = baseText.indexOf(ans);
  if (idx < 0) return `${escapeHtml(baseText)} ${markerHtml}`;
  return `${escapeHtml(baseText.slice(0, idx))}${markerHtml}${escapeHtml(baseText.slice(idx + ans.length))}`;
}

function renderFillAuthorPreview() {
  if (!els.fillAuthorPreview) return;
  const type = String(els.questionType?.value || "mcq");
  if (type !== "fill") {
    els.fillAuthorPreview.classList.add("hidden");
    return;
  }
  els.fillAuthorPreview.classList.remove("hidden");
  const text = String(els.questionText?.value || "").trim();
  const answer = String(els.fillAnswer?.value || "").trim();
  if (!text) {
    els.fillAuthorPreview.innerHTML = "問題文を入力すると、空欄位置プレビューを表示します。";
    return;
  }
  if (!answer) {
    els.fillAuthorPreview.innerHTML = "正答を入力すると、（正答）が色付きで表示されます。";
    return;
  }
  const marker = `<span class="fillAuthorBlank">（${escapeHtml(answer)}）</span>`;
  const preview = buildFillMaskedHtml(text, answer, marker);
  els.fillAuthorPreview.innerHTML = `${preview}<div class="fillBlankHint">※受験時はこの部分が（　）で表示されます。</div>`;
}

async function startExam() {
  const active = getActiveExam();
  let examQuestions = getExamQuestions();

  if (!state.questions.length) {
    notify("先に問題を作成してください。作成タブ > 問題作成で1問以上追加してください。", "warn");
    return;
  }
  if (!active) {
    notify("模試がありません。模試タブで「新規作成」を押して模試を作成してください。", "warn");
    return;
  }
  if (!examQuestions.length) {
    if (!state.questions.length) {
      notify("先に問題を作成してください。作成タブ > 問題作成で1問以上追加してください。", "warn");
      return;
    }
    const ok = await confirmAction("この模試に問題が未設定です。全問題を追加して開始しますか？", {
      title: "模試開始確認",
      yesLabel: "追加して開始",
      noLabel: "キャンセル",
      danger: false,
    });
    if (!ok) {
      notify("模試作成画面でジャンルを選び、問題を追加してから開始してください。", "info");
      return;
    }
    updateActiveExam((exam) => {
      exam.questionIds = state.questions.map((q) => q.id);
    });
    examQuestions = getExamQuestions();
    renderExamManager();
    renderExamBuilder();
    renderPrintPreview();
    renderMemorize();
  }

  state.answers = examQuestions.map(() => "");
  state.current = 0;
  state.running = true;
  state.startedAt = Date.now();
  state.elapsedSec = 0;
  state.examDurationSec = Math.max(0, Number(active.timeLimitMin || 0)) * 60;
  lastSessionPersistSec = -1;
  renderResult([], 0, 0, "");

  startTimer();
  openExamSolve();
  renderExamQuestion();
  renderStatus();
  renderExamProgress();
  updateExamSolveActions();
  saveExamSessionState();
}

els.startExamBtn.addEventListener("click", () => {
  runWithButton(els.startExamBtn, "保存中...", () => {
    const active = getActiveExam();
    if (!active) {
      notify("模試がありません。模試タブで「新規作成」を押してください。", "warn");
      return;
    }
    notify(`「${active.title}」を保存しました。受験は一覧から開始できます。`, "success");
    closeExamBuilder();
  });
});
els.prevBtn.addEventListener("click", () => {
  if (!state.running) return;
  state.current = Math.max(0, state.current - 1);
  renderExamQuestion();
  saveExamSessionState();
});
els.nextBtn.addEventListener("click", () => {
  if (!state.running) return;
  state.current = Math.min(getExamQuestions().length - 1, state.current + 1);
  renderExamQuestion();
  saveExamSessionState();
});
els.finishBtn.addEventListener("click", openFinishConfirmModal);

function renderExamQuestion() {
  const examQuestions = getExamQuestions();
  const q = examQuestions[state.current];
  if (!q) {
    updateExamSolveActions();
    return;
  }

  let answerInput = "";
  const currentValue = state.answers[state.current] || "";
  const questionTextHtml =
    q.type === "fill"
      ? buildFillMaskedHtml(q.text, q.answer, "<span>（　）</span>")
      : escapeHtml(q.text);

  if (q.type === "mcq") {
    answerInput = q.options
      .map(
        (opt, i) => `
          <button
            type="button"
            class="ghost examChoice memorizeChoice ${currentValue === String(i + 1) ? "active" : ""}"
            data-exam-pick="${i + 1}"
            aria-pressed="${currentValue === String(i + 1) ? "true" : "false"}"
          >
            ${optionLabel(q, i)}. ${escapeHtml(opt)}
          </button>
        `
      )
      .join("");
    answerInput = `<div class="memorizeChoices">${answerInput}</div>`;
  } else {
    const tag = q.type === "text" ? "textarea" : "input";
    answerInput =
      tag === "textarea"
        ? `<textarea id="answerInput" rows="4">${escapeHtml(currentValue)}</textarea>`
        : `<input id="answerInput" type="text" value="${escapeHtml(currentValue)}" />`;
  }

  els.examQuestion.innerHTML = `
    <h3>第${state.current + 1}問 / ${examQuestions.length}</h3>
    <p>${questionTextHtml}</p>
    <div>${answerInput}</div>
  `;

  if (q.type === "mcq") {
    els.examQuestion.querySelectorAll("button[data-exam-pick]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.answers[state.current] = String(btn.dataset.examPick || "");
        if (state.settings.autoNextMcq && state.current < examQuestions.length - 1) {
          state.current += 1;
        }
        renderExamQuestion();
        saveExamSessionState();
      });
    });
  } else {
    const input = document.getElementById("answerInput");
    input.addEventListener("input", () => {
      state.answers[state.current] = input.value;
      renderExamProgress();
      saveExamSessionState();
    });
  }

  renderExamProgress();
  updateExamSolveActions();
}

function finishExam(endReason = "手動終了") {
  if (!state.running) return;
  stopTimer();
  state.running = false;
  clearExamSessionState();

  const active = getActiveExam();
  const examQuestions = getExamQuestions();
  let score = 0;
  let autoTotal = 0;

  const rows = examQuestions.map((q, idx) => {
    const ans = (state.answers[idx] || "").trim();
    let ok = false;
    let auto = true;

    if (q.type === "text") {
      auto = false;
    } else {
      autoTotal += 1;
      ok = ans === String(q.answer).trim();
      if (ok) score += 1;
    }

    return { q, ans, ok, auto, selfGrade: null };
  });

  state.lastExamResult = {
    examTitle: active ? active.title : "",
    endReason,
    autoScore: score,
    autoTotal,
    elapsedSec: state.elapsedSec,
    rows,
  };

  renderResult(rows, score, autoTotal, active ? active.title : "", endReason);
  addHistoryEntry({
    mode: "exam",
    examId: active ? active.id : "",
    examTitle: active ? active.title : "模試",
    summary: `${endReason} / 自動採点 ${score}/${autoTotal}問`,
    rows: rows.map((r, idx) => ({
      no: idx + 1,
      type: typeLabel(r.q.type),
      question: r.q.text,
      userAnswer: r.ans ? displayAnswer(r.q, r.ans) : "(未解答)",
      correctAnswer: displayAnswer(r.q, r.q.answer || "-"),
      judge: r.auto ? (r.ok ? "○" : "×") : "自己判定",
    })),
  });
  renderStatus();
  openExamSolve();
  updateExamSolveActions();
  notify(`採点が完了しました（自動採点 ${score}/${autoTotal}問）`, "success");
}

function renderResult(rows, score, autoTotal, examTitle, endReason = "") {
  if (!rows.length) {
    state.lastExamResult = null;
    els.scoreSummary.textContent = "まだ採点していません。";
    els.resultList.innerHTML = "";
    return;
  }
  if (!state.lastExamResult) {
    state.lastExamResult = {
      examTitle,
      endReason,
      autoScore: score,
      autoTotal,
      elapsedSec: state.elapsedSec,
      rows,
    };
  }
  const result = state.lastExamResult;
  const selfRows = result.rows.filter((r) => !r.auto);
  const selfDone = selfRows.filter((r) => r.selfGrade !== null).length;
  const selfCounts = {
    good: selfRows.filter((r) => r.selfGrade === "good").length,
    middle: selfRows.filter((r) => r.selfGrade === "middle").length,
    bad: selfRows.filter((r) => r.selfGrade === "bad").length,
  };
  const sec = result.elapsedSec;
  els.scoreSummary.textContent = `模試: ${result.examTitle} / ${result.endReason || "終了"} / 自動採点: ${result.autoScore} / ${result.autoTotal}問 / 記述自己採点: ${selfDone} / ${selfRows.length}問（○${selfCounts.good} △${selfCounts.middle} ×${selfCounts.bad}） 受験時間: ${formatTime(sec)}`;
  els.resultList.innerHTML = "";

  result.rows.forEach((r, idx) => {
    const selfGradeLabel =
      r.selfGrade === "good" ? "○" : r.selfGrade === "middle" ? "△" : r.selfGrade === "bad" ? "×" : "未採点";
    const selfGradeControls = !r.auto
      ? `<div class="selfGradeControls">
          <button class="ghost ${r.selfGrade === "good" ? "active" : ""}" data-self-grade="${idx}" data-grade="good">○</button>
          <button class="ghost ${r.selfGrade === "middle" ? "active" : ""}" data-self-grade="${idx}" data-grade="middle">△</button>
          <button class="ghost ${r.selfGrade === "bad" ? "active" : ""}" data-self-grade="${idx}" data-grade="bad">×</button>
        </div>`
      : "";
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>第${idx + 1}問 ${typeLabel(r.q.type)}</strong><br />
      問題: ${escapeHtml(r.q.text)}<br />
      解答: ${escapeHtml(r.ans ? displayAnswer(r.q, r.ans) : "(未解答)")}<br />
      正答: <span class="answerAccent">${escapeHtml(displayAnswer(r.q, r.q.answer || "-"))}</span><br />
      判定: ${r.auto ? (r.ok ? "○" : "×") : `自己採点 ${selfGradeLabel}`}<br />
      ${selfGradeControls}
      ${r.q.explanation ? `解説: ${escapeHtml(r.q.explanation)}` : ""}
    `;
    els.resultList.appendChild(li);
  });

  els.resultList.querySelectorAll("button[data-self-grade]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.selfGrade);
      const grade = btn.dataset.grade;
      if (Number.isNaN(idx) || !state.lastExamResult?.rows[idx]) return;
      state.lastExamResult.rows[idx].selfGrade = grade;
      renderResult(
        state.lastExamResult.rows,
        state.lastExamResult.autoScore,
        state.lastExamResult.autoTotal,
        state.lastExamResult.examTitle,
        state.lastExamResult.endReason
      );
    });
  });
}

function renderPrintPreview() {
  const exam = getPrintTargetExam();
  els.printExamSelect.innerHTML = state.exams
    .map((item) => `<option value="${item.id}">${escapeHtml(item.title)}</option>`)
    .join("");

  if (!exam) {
    els.printPresetSelect.disabled = true;
    els.applyPrintPresetBtn.disabled = true;
    els.printExamSelect.disabled = true;
    els.printModeQuestionBtn.disabled = true;
    els.printModeAnswerBtn.disabled = true;
    els.printCustomTitle.disabled = true;
    els.printShowNameDate.disabled = true;
    els.printShowGenre.disabled = true;
    els.printIncludeExplanation.disabled = true;
    if (els.printIncludeAnswerSheet) els.printIncludeAnswerSheet.disabled = true;
    if (els.printShowFooter) els.printShowFooter.disabled = true;
    els.printQuestionsPerPage.disabled = true;
    els.printBtn.disabled = true;
    els.printPreview.innerHTML = "<p>模試がありません。</p>";
    return;
  }

  const examQuestions = exam.questionIds
    .map((id) => state.questions.find((q) => q.id === id))
    .filter(Boolean);

  els.printExamSelect.disabled = false;
  els.printPresetSelect.disabled = false;
  els.applyPrintPresetBtn.disabled = false;
  els.printModeQuestionBtn.disabled = false;
  els.printModeAnswerBtn.disabled = false;
  els.printCustomTitle.disabled = false;
  els.printShowNameDate.disabled = false;
  els.printShowGenre.disabled = false;
  els.printIncludeExplanation.disabled = false;
  if (els.printIncludeAnswerSheet) els.printIncludeAnswerSheet.disabled = false;
  if (els.printShowFooter) els.printShowFooter.disabled = false;
  els.printQuestionsPerPage.disabled = false;
  els.printPresetSelect.value = ["custom", "exam", "review"].includes(state.printPreset) ? state.printPreset : "custom";
  els.printExamSelect.value = exam.id;
  els.printCustomTitle.value = state.printCustomTitle;
  els.printShowNameDate.checked = state.printShowNameDate;
  els.printShowGenre.checked = state.printShowGenre;
  els.printIncludeExplanation.checked = state.printIncludeExplanation;
  if (els.printIncludeAnswerSheet) els.printIncludeAnswerSheet.checked = state.printIncludeAnswerSheet;
  if (els.printShowFooter) els.printShowFooter.checked = state.printShowFooter;
  els.printQuestionsPerPage.value = String(state.printQuestionsPerPage);

  if (els.printProHint) {
    els.printProHint.textContent = "マークシート追加・フッター表示が使えます。";
  }

  if (!examQuestions.length) {
    els.printBtn.disabled = true;
    els.printPreview.innerHTML = "<p>この模試に選択した問題がありません。</p>";
    return;
  }
  els.printBtn.disabled = false;

  const isAnswerMode = state.printMode === "answer";
  els.printModeLabel.textContent = isAnswerMode
    ? `解答用${state.printIncludeExplanation ? "（解説あり）" : "（解説なし）"}`
    : "問題用";
  els.printModeQuestionBtn.classList.toggle("active", !isAnswerMode);
  els.printModeAnswerBtn.classList.toggle("active", isAnswerMode);

  const headingBase = state.printCustomTitle.trim() || exam.title;
  const heading = `${headingBase} ${isAnswerMode ? "解答冊子" : "問題冊子"}`;
  const chunkSize = Math.max(1, Number(state.printQuestionsPerPage || 10));
  const questionPages = [];
  for (let i = 0; i < examQuestions.length; i += chunkSize) {
    questionPages.push(examQuestions.slice(i, i + chunkSize));
  }
  const answerSheetEnabled = !isAnswerMode && state.printIncludeAnswerSheet;
  const totalPages = questionPages.length + (answerSheetEnabled ? 1 : 0);
  const headerLine = state.printShowNameDate
    ? "<p class='print-meta'>氏名: ____________________ 受験日: ____________________</p>"
    : "";

  const pageHtml = questionPages
    .map((pageQuestions, pageIdx) => {
      const items = pageQuestions
        .map((q, localIdx) => {
          const idx = pageIdx * chunkSize + localIdx;
          const options = q.type === "mcq"
            ? `<ul class="print-options">${q.options.map((o, i) => `<li>${optionLabel(q, i)} ${escapeHtml(normalizePrintOptionText(o))}</li>`).join("")}</ul>`
            : "";
          const answerBlock = `
            <p><strong>正答</strong> <span class="answerAccent">${escapeHtml(displayAnswerWithOptionText(q, q.answer || "-"))}</span></p>
            ${state.printIncludeExplanation && q.explanation ? `<p><strong>解説</strong> ${escapeHtml(q.explanation)}</p>` : ""}
          `;
          const genreBlock = state.printShowGenre ? `<p class="print-genre">［${escapeHtml(q.genre || "未分類")}］</p>` : "";
          const questionHtml =
            q.type === "fill"
              ? buildFillMaskedHtml(q.text, q.answer, "<span>（　）</span>")
              : escapeHtml(q.text);
          return `
            <section class="print-q">
              ${genreBlock}
              <p class="print-qtext"><span class="print-qnoInline">${idx + 1}.</span>${questionHtml}</p>
              ${isAnswerMode ? answerBlock : options}
            </section>
          `;
        })
        .join("");
      const footerHtml =
        state.printShowFooter
          ? `<footer class="print-meta">出力日時: ${new Date().toLocaleString("ja-JP")} / ${pageIdx + 1} / ${totalPages} ページ</footer>`
          : "";
      return `
        <article class="print-sheet examStyleSheet density-${state.printQuestionsPerPage}">
          <header class="print-head">
            ${pageIdx === 0 ? `<h3>${escapeHtml(heading)}</h3>` : ""}
            ${pageIdx === 0 ? headerLine : ""}
          </header>
          <div class="print-body">${items}</div>
          ${footerHtml}
        </article>
      `;
    })
    .join("");

  const answerSheetHtml =
    answerSheetEnabled
      ? `
      <article class="print-sheet examStyleSheet density-${state.printQuestionsPerPage}">
        <header class="print-head"></header>
        <div class="print-body">
          <section class="print-q">
            <ul class="print-options">
              ${examQuestions
                .map((q, idx) =>
                  q.type === "mcq"
                    ? `<li>${idx + 1}. [ ]A [ ]B [ ]C [ ]D</li>`
                    : `<li>${idx + 1}. （記述）</li>`
                )
                .join("")}
            </ul>
          </section>
        </div>
      </article>
      `
      : "";

  els.printPreview.innerHTML = `
    ${pageHtml}
    ${answerSheetHtml}
  `;
}

function setPrintMode(mode) {
  state.printMode = mode === "answer" ? "answer" : "question";
  state.printPreset = "custom";
  savePrintPrefs();
  renderPrintPreview();
}

function applyPrintPreset(preset) {
  if (preset === "exam") {
    state.printPreset = "exam";
    state.printMode = "question";
    state.printShowNameDate = true;
    state.printShowGenre = false;
    state.printIncludeExplanation = false;
    state.printIncludeAnswerSheet = false;
    state.printShowFooter = false;
    state.printQuestionsPerPage = 10;
  } else if (preset === "review") {
    state.printPreset = "review";
    state.printMode = "answer";
    state.printShowNameDate = false;
    state.printShowGenre = true;
    state.printIncludeExplanation = true;
    state.printIncludeAnswerSheet = false;
    state.printShowFooter = false;
    state.printQuestionsPerPage = 8;
  } else {
    state.printPreset = "custom";
  }
  savePrintPrefs();
  renderPrintPreview();
  notify(state.printPreset === "custom" ? "カスタム表示に戻しました" : "プリセットを適用しました", "success");
}

function exportAllData() {
  const payload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    data: {
      questions: state.questions,
      genres: state.genres,
      exams: state.exams,
      activeExamId: state.activeExamId,
      history: state.history,
    },
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const ts = new Date().toISOString().replaceAll(":", "-").slice(0, 19);
  a.href = url;
  a.download = `mock-maker-backup-${ts}.json`;
  a.click();
  URL.revokeObjectURL(url);
  localStorage.setItem(STORAGE_KEY_LAST_EXPORT_AT, String(Date.now()));
  notify("エクスポートしました", "success");
}

function importAllData(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async () => {
    try {
      const parsed = JSON.parse(String(reader.result || ""));
      const incoming = parsed?.data || parsed;
      if (!incoming || typeof incoming !== "object") throw new Error("invalid");

      const ok = await confirmAction("現在のデータを上書きしてインポートしますか？", {
        title: "インポート確認",
        yesLabel: "上書きする",
        noLabel: "キャンセル",
        danger: true,
      });
      if (!ok) return;

      state.questions = Array.isArray(incoming.questions) ? incoming.questions.map((q) => ({
        ...q,
        genre: q.genre || "未分類",
        options: Array.isArray(q.options) ? q.options : [],
        answer: q.answer ?? "",
        mcqLabelMode: q.mcqLabelMode === "numeric" ? "numeric" : "alpha",
      })) : [];
      state.genres = Array.isArray(incoming.genres) ? incoming.genres : [];
      state.exams = Array.isArray(incoming.exams) ? incoming.exams.map(normalizeExam).filter(Boolean) : [];
      state.activeExamId = typeof incoming.activeExamId === "string" ? incoming.activeExamId : "";
      state.history = Array.isArray(incoming.history) ? incoming.history : [];

      syncExamsWithQuestions();
      if (!state.exams.some((e) => e.id === state.activeExamId)) {
        state.activeExamId = state.exams[0]?.id || "";
      }

      saveQuestions();
      saveGenres();
      saveExams();
      saveActiveExamId();
      saveHistory();

      state.running = false;
      stopTimer();
      clearExamSessionState();
      state.answers = [];
      state.current = 0;
      state.elapsedSec = 0;
      state.examDurationSec = 0;
      state.memorize = { examId: "", questionIds: [], started: false, finished: false, answers: [], revealed: [] };

      renderGenreUI();
      renderQuestionList();
      renderExamManager();
      renderExamBuilder();
      renderPrintPreview();
      renderMemorize();
      renderHistory();
      renderStatus();
      renderExamProgress();
      resetQuestionForm();
      closeExamBuilder();

      notify("インポートが完了しました", "success");
    } catch {
      notify("インポートに失敗しました。ファイル形式がJSONか、内容が正しいか確認して再試行してください。", "error", 3000);
    } finally {
      els.importDataInput.value = "";
    }
  };
  reader.readAsText(file, "utf-8");
}

async function loadDemoData() {
  const ok = await confirmAction("現在のデータをデモデータで上書きしますか？", {
    title: "デモ投入確認",
    yesLabel: "上書きする",
    noLabel: "キャンセル",
    danger: true,
  });
  if (!ok) return;

  const now = Date.now();
  const genres = ["英語", "数学", "国語", "理科", "社会", "情報", "時事", "一般常識"];
  const questionsPerGenre = 30;
  const totalQuestions = genres.length * questionsPerGenre;
  const questions = [];

  const makeMcq = (genre, serial) => {
    const labels = ["A", "B", "C", "D"];
    const answerIdx = serial % 4;
    return {
      id: crypto.randomUUID(),
      genre,
      text: `${genre}のデモ4択問題 ${serial + 1}: 正しい選択肢を選びなさい。`,
      type: "mcq",
      explanation: `${genre}のデモ解説 ${serial + 1}。`,
      options: labels.map((l, i) => `${genre}の選択肢${l}${serial + i + 1}`),
      answer: String(answerIdx + 1),
      mcqLabelMode: serial % 2 === 0 ? "alpha" : "numeric",
    };
  };

  genres.forEach((genre, genreIndex) => {
    for (let i = 0; i < questionsPerGenre; i += 1) {
      const serial = genreIndex * questionsPerGenre + i;
      questions.push(makeMcq(genre, serial));
    }
  });

  const pickIds = (list, count) => {
    const pool = [...list];
    const result = [];
    while (pool.length && result.length < count) {
      const idx = Math.floor(Math.random() * pool.length);
      result.push(pool[idx].id);
      pool.splice(idx, 1);
    }
    return result;
  };

  const exams = [
    {
      id: crypto.randomUUID(),
      title: "デモ模試 総合 60問",
      questionIds: pickIds(questions, 60),
      timeLimitMin: 90,
      createdAt: now,
      updatedAt: now,
    },
    ...genres.map((genre, i) => {
      const genreQuestions = questions.filter((q) => q.genre === genre);
      const ts = now + i + 1;
      return {
        id: crypto.randomUUID(),
        title: `デモ模試 ${genre} 30問`,
        questionIds: pickIds(genreQuestions, 30),
        timeLimitMin: 45,
        createdAt: ts,
        updatedAt: ts,
      };
    }),
    {
      id: crypto.randomUUID(),
      title: "デモ模試 総合 120問",
      questionIds: pickIds(questions, 120),
      timeLimitMin: 180,
      createdAt: now + 30,
      updatedAt: now + 30,
    },
  ];

  state.questions = questions;
  state.genres = genres;
  state.exams = exams;
  state.activeExamId = exams[0].id;
  state.history = [
    {
      id: crypto.randomUUID(),
      mode: "exam",
      examId: exams[0].id,
      examTitle: "デモ模試 総合 60問",
      summary: "手動終了 / 自動採点 4/6問",
      createdAt: now,
      rows: [
        { no: 1, type: "4択", question: questions[0].text, userAnswer: "A", correctAnswer: "A", judge: "○" },
        { no: 2, type: "4択", question: questions[1].text, userAnswer: "B", correctAnswer: "B", judge: "○" },
        { no: 3, type: "4択", question: questions[2].text, userAnswer: "D", correctAnswer: "C", judge: "×" },
        { no: 4, type: "4択", question: questions[3].text, userAnswer: "B", correctAnswer: "A", judge: "×" },
        { no: 5, type: "4択", question: questions[4].text, userAnswer: "A", correctAnswer: "A", judge: "○" },
        { no: 6, type: "4択", question: questions[5].text, userAnswer: "C", correctAnswer: "D", judge: "×" },
      ],
    },
  ];

  state.questionSearch = "";
  state.historySearch = "";
  state.activeGenre = "all";
  state.examBuilderGenre = "all";
  state.running = false;
  stopTimer();
  clearExamSessionState();
  state.answers = [];
  state.current = 0;
  state.elapsedSec = 0;
  state.examDurationSec = 0;
  state.lastExamResult = null;
  state.memorize = { examId: "", questionIds: [], started: false, finished: false, answers: [], revealed: [] };

  saveQuestions();
  saveGenres();
  saveExams();
  saveActiveExamId();
  saveHistory();

  els.questionSearchInput.value = "";
  els.historySearchInput.value = "";

  renderGenreUI();
  renderQuestionList();
  renderExamManager();
  renderExamBuilder();
  renderPrintPreview();
  renderMemorize();
  renderHistory();
  renderStatus();
  renderExamProgress();
  resetQuestionForm();
  closeExamBuilder();
  notify(`デモデータを投入しました（問題${totalQuestions}問 / 模試${exams.length}個）`, "success", 2800);
}

function collectPrintIssues() {
  const exam = getPrintTargetExam();
  if (!exam) return ["印刷対象の模試がありません。"];

  const examQuestions = exam.questionIds
    .map((id) => state.questions.find((q) => q.id === id))
    .filter(Boolean);

  if (!examQuestions.length) {
    return ["この模試に選択した問題がありません。"];
  }

  const issues = [];
  examQuestions.forEach((q, idx) => {
    const no = `第${idx + 1}問`;
    if (!String(q.text || "").trim()) {
      issues.push(`${no}: 問題文が未入力です`);
    }

    if (q.type === "mcq") {
      const options = Array.isArray(q.options) ? q.options.map((o) => normalizePrintOptionText(o).trim()) : [];
      if (options.length < 4 || options.some((o) => !o)) {
        issues.push(`${no}: 4択の選択肢が不足しています`);
      }
      const answerNo = Number(q.answer);
      if (!Number.isInteger(answerNo) || answerNo < 1 || answerNo > 4) {
        issues.push(`${no}: 正答（1-4）が未設定です`);
      } else if (!options[answerNo - 1]) {
        issues.push(`${no}: 正答が空の選択肢を指しています`);
      }
      return;
    }

    if (!String(q.answer || "").trim()) {
      issues.push(`${no}: 正答が未設定です`);
    }
  });

  return issues;
}

els.printBtn.addEventListener("click", async () => {
  const exam = getPrintTargetExam();
  if (!exam) {
    notify("印刷対象の模試がありません。模試を作成してから印刷してください。", "warn");
    return;
  }
  const examQuestions = exam.questionIds
    .map((id) => state.questions.find((q) => q.id === id))
    .filter(Boolean);
  if (!examQuestions.length) {
    notify("この模試に問題がありません。模試作成で問題を追加してから印刷してください。", "warn");
    return;
  }
  const issues = collectPrintIssues();
  if (issues.length) {
    const detailItems = issues.slice(0, 12);
    if (issues.length > 12) detailItems.push(`ほか ${issues.length - 12} 件`);
    const go = await confirmAction(
      `印刷前チェックで ${issues.length} 件の注意があります。内容を確認して、このまま印刷しますか？`,
      {
        title: "印刷確認",
        yesLabel: "このまま印刷",
        noLabel: "キャンセル",
        danger: false,
        details: detailItems,
      }
    );
    if (!go) {
      notify("印刷を中止しました。問題を修正して再実行してください。", "warn", 2800);
      return;
    }
  }

  const originalTitle = document.title;
  let restored = false;
  const restoreTitle = () => {
    if (restored) return;
    restored = true;
    document.title = originalTitle;
  };
  document.title = "";
  window.addEventListener("afterprint", restoreTitle, { once: true });
  window.print();
  setTimeout(restoreTitle, 1500);
});

function getMemorizeSource() {
  const sourceType = els.memorizeSourceType?.value === "genre" ? "genre" : "exam";
  const selectedTarget = String(els.memorizeTargetSelect?.value || "").trim();
  if (sourceType === "genre") {
    const genre = selectedTarget;
    if (!genre) return null;
    const questions = state.questions.filter((q) => q.genre === genre);
    return {
      type: "genre",
      key: `genre:${genre}`,
      title: `ジャンル: ${genre}`,
      sourceId: genre,
      questions,
    };
  }

  const selectedExamId = String(selectedTarget || state.activeExamId || "");
  const exam = state.exams.find((item) => item.id === selectedExamId) || null;
  if (!exam) return null;
  const byId = new Map(state.questions.map((q) => [q.id, q]));
  const questions = exam.questionIds.map((id) => byId.get(id)).filter(Boolean);
  return {
    type: "exam",
    key: `exam:${exam.id}`,
    title: exam.title,
    sourceId: exam.id,
    questions,
  };
}

function ensureMemorizeState(source) {
  const questionIds = source.questions.map((q) => q.id);
  const questionSet = new Set(questionIds);
  const currentIds = state.memorize.questionIds.filter((id) => questionSet.has(id));
  const isSameQuestions =
    currentIds.length === questionIds.length &&
    questionIds.every((id) => currentIds.includes(id));
  const needsReset =
    state.memorize.examId !== source.key ||
    !isSameQuestions ||
    state.memorize.answers.length !== source.questions.length;
  if (!needsReset) return;
  state.memorize = {
    examId: source.key,
    questionIds,
    started: false,
    finished: false,
    answers: source.questions.map(() => ""),
    revealed: source.questions.map(() => false),
  };
}

function startMemorize() {
  const source = getMemorizeSource();
  if (!source) {
    notify("暗記対象を選択してください。", "warn");
    return;
  }
  if (!source.questions.length) {
    notify("この暗記対象に問題がありません。問題を追加してから開始してください。", "warn");
    return;
  }
  const ids = source.questions.map((q) => q.id);
  const questionIds =
    state.settings.memorizeOrder === "random" ? shuffleArray(ids) : ids;
  state.memorize = {
    examId: source.key,
    questionIds,
    started: true,
    finished: false,
    answers: source.questions.map(() => ""),
    revealed: source.questions.map(() => false),
  };
  renderMemorize();
}

function finishMemorize() {
  const source = getMemorizeSource();
  if (!source || !source.questions.length) return;
  ensureMemorizeState(source);
  const viewQuestions = getMemorizeQuestions(source.questions);
  if (!state.memorize.started) {
    notify("先に「暗記開始」を押してから終了してください。", "warn");
    return;
  }
  state.memorize.finished = true;

  const answeredCount = state.memorize.answers.filter((a) => String(a).trim()).length;
  let autoTotal = 0;
  let autoCorrect = 0;
  viewQuestions.forEach((q, idx) => {
    if (q.type === "text") return;
    autoTotal += 1;
    if (String(state.memorize.answers[idx] || "").trim() === String(q.answer || "").trim()) {
      autoCorrect += 1;
    }
  });
  els.memorizeSummary.textContent = `対象: ${source.title} / 回答: ${answeredCount} / ${viewQuestions.length}問 / 自動判定: ${autoCorrect} / ${autoTotal}問`;
  els.memorizeResultList.innerHTML = viewQuestions
    .map((q, idx) => {
      const userAnswer = state.memorize.answers[idx] ? displayAnswer(q, state.memorize.answers[idx]) : "(未回答)";
      return `
        <li>
          <strong>第${idx + 1}問 ${typeLabel(q.type)}</strong><br />
          問題: ${escapeHtml(q.text)}<br />
          自分の回答: ${escapeHtml(userAnswer)}<br />
          正答: <span class="answerAccent">${escapeHtml(displayAnswer(q, q.answer || "-"))}</span>
        </li>
      `;
    })
    .join("");

  addHistoryEntry({
    mode: "memorize",
    examId: source.type === "exam" ? source.sourceId : "",
    examTitle: source.title,
    summary: `暗記(${source.type === "exam" ? "模試" : "ジャンル"}) 回答 ${answeredCount}/${viewQuestions.length}問 自動判定 ${autoCorrect}/${autoTotal}問`,
    rows: viewQuestions.map((q, idx) => ({
      no: idx + 1,
      type: typeLabel(q.type),
      question: q.text,
      userAnswer: state.memorize.answers[idx] ? displayAnswer(q, state.memorize.answers[idx]) : "(未回答)",
      correctAnswer: displayAnswer(q, q.answer || "-"),
      judge:
        q.type === "text"
          ? "自己判定"
          : String(state.memorize.answers[idx] || "").trim() === String(q.answer || "").trim()
            ? "○"
            : "×",
    })),
  });
}

function addHistoryEntry(entry) {
  const item = {
    id: crypto.randomUUID(),
    mode: entry.mode,
    examId: entry.examId || "",
    examTitle: entry.examTitle,
    summary: entry.summary,
    rows: entry.rows,
    createdAt: Date.now(),
  };
  state.history.unshift(item);
  state.history = state.history.slice(0, 50);
  saveHistory();
  renderHistory();
}

function renderHistory() {
  if (!els.historyList) return;
  const query = state.historySearch;
  const filtered = state.history.filter((h) => {
    if (!query) return true;
    const rowText = (h.rows || [])
      .map((r) => `${r.question || ""} ${r.userAnswer || ""} ${r.correctAnswer || ""}`)
      .join(" ");
    const haystack = `${h.examTitle || ""} ${h.summary || ""} ${rowText}`.toLowerCase();
    return haystack.includes(query);
  });

  if (!filtered.length) {
    els.historyList.innerHTML = query ? "<li>検索条件に一致する履歴はありません。</li>" : "<li>履歴はまだありません。</li>";
    return;
  }
  els.historyList.innerHTML = filtered
    .map((h) => {
      const detail = h.rows
        .map(
          (r) =>
            `第${r.no}問 ${r.type} | 問題: ${escapeHtml(r.question)} | 回答: ${escapeHtml(r.userAnswer)} | 正答: ${escapeHtml(r.correctAnswer)} | 判定: ${r.judge}`
        )
        .join("<br />");
      return `
        <li>
          <strong>${h.mode === "exam" ? "模試" : "暗記"} / ${escapeHtml(h.examTitle)}</strong><br />
          ${escapeHtml(h.summary)}<br />
          ${new Date(h.createdAt).toLocaleString("ja-JP")}<br />
          ${detail}
        </li>
      `;
    })
    .join("");
}

function revealMemorizeAnswerAt(idx) {
  if (idx < 0 || idx >= state.memorize.answers.length) return;
  const current = String(state.memorize.answers[idx] || "").trim();
  if (!current) {
    notify("回答が空です。回答を入力または選択してから「回答して答えを見る」を押してください。", "warn");
    return;
  }
  state.memorize.revealed[idx] = true;
  renderMemorize();
}

function renderMemorize() {
  const sourceType = els.memorizeSourceType?.value === "genre" ? "genre" : "exam";
  if (els.memorizeSourceType) els.memorizeSourceType.value = sourceType;
  if (els.memorizeTargetSelect && els.memorizeTargetSelectLabel) {
    const previousValue = String(els.memorizeTargetSelect.value || "");
    if (sourceType === "genre") {
      const genres = getAvailableGenres();
      els.memorizeTargetSelectLabel.textContent = "暗記するジャンルを選択";
      els.memorizeTargetSelect.innerHTML = genres
        .map((genre) => `<option value="${escapeHtml(genre)}">${escapeHtml(genre)}</option>`)
        .join("");
      const selectedGenre = genres.includes(previousValue) ? previousValue : String(genres[0] || "");
      if (selectedGenre) els.memorizeTargetSelect.value = selectedGenre;
    } else {
      els.memorizeTargetSelectLabel.textContent = "暗記する模試を選択";
      els.memorizeTargetSelect.innerHTML = state.exams
        .map((exam) => `<option value="${exam.id}">${escapeHtml(exam.title)}</option>`)
        .join("");
      const active = getActiveExam();
      const defaultExamId = String(active?.id || state.exams[0]?.id || "");
      const selectedExamId = state.exams.some((exam) => exam.id === previousValue) ? previousValue : defaultExamId;
      if (selectedExamId) els.memorizeTargetSelect.value = selectedExamId;
    }
    refreshEnhancedSelectTrigger("memorizeTargetSelect");
  }

  const source = getMemorizeSource();
  els.memorizeTargetTitle.textContent = source ? source.title : "対象なし";

  if (!source) {
    els.memorizeList.innerHTML = "<p class='muted'>暗記対象を選択してください。</p>";
    els.memorizeSummary.textContent = "まだ開始していません。";
    els.memorizeResultList.innerHTML = "";
    return;
  }
  if (!source.questions.length) {
    els.memorizeList.innerHTML = "<p class='muted'>この暗記対象に問題がありません。</p>";
    els.memorizeSummary.textContent = "まだ開始していません。";
    els.memorizeResultList.innerHTML = "";
    return;
  }

  ensureMemorizeState(source);
  const viewQuestions = getMemorizeQuestions(source.questions);
  if (!state.memorize.started) {
    els.memorizeList.innerHTML = "<p class='muted'>暗記開始を押すと問題が表示されます。</p>";
    els.memorizeSummary.textContent = "まだ開始していません。";
    els.memorizeResultList.innerHTML = "";
    return;
  }

  els.memorizeList.innerHTML = viewQuestions
    .map((q, idx) => {
      const current = state.memorize.answers[idx] || "";
      const currentAnswered = String(current).trim();
      const userDisplay = currentAnswered ? displayAnswer(q, current) : "(未回答)";
      const autoJudge =
        q.type === "text"
          ? "記述: 自己判定"
          : String(currentAnswered) === String(q.answer || "").trim()
            ? "判定: ○"
            : "判定: ×";
      const answerInput =
        q.type === "mcq"
          ? `<div class="memorizeChoices">
              ${q.options
                .map((opt, i) => {
                  const value = String(i + 1);
                  const selected = current === value;
                  return `
                    <button
                      type="button"
                      class="ghost examChoice memorizeChoice ${selected ? "active" : ""}"
                      data-memorize-pick="${idx}"
                      data-memorize-value="${value}"
                      aria-pressed="${selected ? "true" : "false"}"
                    >
                      ${optionLabel(q, i)}. ${escapeHtml(opt)}
                    </button>
                  `;
                })
                .join("")}
            </div>`
          : q.type === "text"
            ? `<textarea data-memorize-input="${idx}" rows="3">${escapeHtml(current)}</textarea>`
            : `<input data-memorize-input="${idx}" type="text" value="${escapeHtml(current)}" />`;
      const hasAnswer = Boolean(currentAnswered);
      const revealLabel = state.memorize.revealed[idx] ? "答えを更新表示" : "回答して答えを見る";

      return `
        <article class="card">
          <div class="listMeta">
            <span class="chip">第${idx + 1}問</span>
            <span class="chip">${escapeHtml(q.genre || "未分類")}</span>
            <span class="chip">${typeLabel(q.type)}</span>
            <span class="chip ${hasAnswer ? "chipOk" : "chipPending"}">${hasAnswer ? "回答済み" : "未回答"}</span>
          </div>
          <p><strong>問題:</strong> ${
            q.type === "fill"
              ? buildFillMaskedHtml(q.text, q.answer, "<span>（　）</span>")
              : escapeHtml(q.text)
          }</p>
          <div>${answerInput}</div>
          <button class="ghost" data-reveal-idx="${idx}" ${hasAnswer ? "" : "disabled"}>${revealLabel}</button>
          ${
            state.memorize.revealed[idx]
              ? `<p><strong>自分の回答:</strong> ${escapeHtml(String(userDisplay))}</p>
                 <p><strong>答え:</strong> <span class="answerAccent">${escapeHtml(displayAnswer(q, q.answer || "-"))}</span></p>
                 <p><strong>${autoJudge}</strong></p>
                 ${q.explanation ? `<p><strong>解説:</strong> ${escapeHtml(q.explanation)}</p>` : ""}`
              : ""
          }
        </article>
      `;
    })
    .join("");

  viewQuestions.forEach((q, idx) => {
    if (q.type === "mcq") {
      els.memorizeList.querySelectorAll(`button[data-memorize-pick='${idx}']`).forEach((btn) => {
        btn.addEventListener("click", () => {
          state.memorize.answers[idx] = String(btn.dataset.memorizeValue || "");
          renderMemorize();
        });
      });
    } else {
      const input = els.memorizeList.querySelector(`[data-memorize-input='${idx}']`);
      if (input) {
        input.addEventListener("input", () => {
          state.memorize.answers[idx] = input.value;
          const revealBtn = els.memorizeList.querySelector(`button[data-reveal-idx='${idx}']`);
          if (revealBtn) {
            revealBtn.disabled = !String(input.value || "").trim();
          }
        });
        if (q.type === "fill") {
          input.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              revealMemorizeAnswerAt(idx);
            }
          });
        } else {
          input.addEventListener("keydown", (event) => {
            if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
              event.preventDefault();
              revealMemorizeAnswerAt(idx);
            }
          });
        }
      }
    }
  });

  els.memorizeList.querySelectorAll("button[data-reveal-idx]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.revealIdx);
      if (Number.isNaN(idx)) return;
      revealMemorizeAnswerAt(idx);
    });
  });
}

function renderStatus() {
  const questionCount = state.questions.length;
  const genreCount = countAllGenres();

  const active = getActiveExam();
  const label = active ? active.title : "模試なし";
  const examLabel = state.running ? `受験中 (${label})` : `待機中 (${label})`;

  if (els.statusQuestions) els.statusQuestions.textContent = `${questionCount}問`;
  if (els.statusGenres) els.statusGenres.textContent = `${genreCount}件`;
  if (els.statusExam) els.statusExam.textContent = examLabel;
  renderHomeDashboard();
  maybeNotifyBackupHint();
  renderUxGuide();
}

function countAllGenres() {
  const genreSet = new Set();
  state.genres.forEach((g) => {
    const n = String(g || "").trim();
    if (n) genreSet.add(n);
  });
  state.questions.forEach((q) => {
    const n = String(q.genre || "").trim();
    if (n) genreSet.add(n);
  });
  return genreSet.size;
}

function renderHomeDashboard() {
  if (!els.homeRecentExamsList || !els.homeRecentHistoryList) return;
  const questionCount = state.questions.length;
  const genreCount = countAllGenres();
  const examCount = state.exams.length;
  if (els.homeStatQuestions) els.homeStatQuestions.textContent = `${questionCount}問`;
  if (els.homeStatGenres) els.homeStatGenres.textContent = `${genreCount}件`;
  if (els.homeStatExams) els.homeStatExams.textContent = `${examCount}件`;

  const recentExams = [...state.exams]
    .sort((a, b) => Number(b.updatedAt || 0) - Number(a.updatedAt || 0))
    .slice(0, 4);
  if (!recentExams.length) {
    els.homeRecentExamsList.innerHTML = "<li class='muted'>模試はまだありません。</li>";
  } else {
    els.homeRecentExamsList.innerHTML = recentExams
      .map(
        (exam) => `
      <li>
        <div>
          <strong>${escapeHtml(exam.title || "無題模試")}</strong>
          <p class="muted">${exam.questionIds.length}問 / 更新: ${new Date(exam.updatedAt).toLocaleDateString("ja-JP")}</p>
        </div>
        <button class="ghost" data-home-open-exam-id="${exam.id}">開く</button>
      </li>
    `
      )
      .join("");
  }

  const recentHistory = state.history.slice(0, 4);
  if (!recentHistory.length) {
    els.homeRecentHistoryList.innerHTML = "<li class='muted'>結果履歴はまだありません。</li>";
  } else {
    els.homeRecentHistoryList.innerHTML = recentHistory
      .map(
        (h) => `
      <li>
        <div>
          <strong>${h.mode === "exam" ? "模試" : "暗記"} / ${escapeHtml(h.examTitle || "-")}</strong>
          <p class="muted">${escapeHtml(h.summary || "")}</p>
        </div>
      </li>
    `
      )
      .join("");
  }

  els.homeRecentExamsList.querySelectorAll("button[data-home-open-exam-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      setActiveExam(String(btn.dataset.homeOpenExamId || ""));
      switchTab("exam");
      closeExamBuilder();
    });
  });
}

function maybeNotifyBackupHint() {
  if (state.backupHintShown) return;
  if (state.questions.length < 50) return;
  const lastExportAt = Number(localStorage.getItem(STORAGE_KEY_LAST_EXPORT_AT) || 0);
  const stale = !lastExportAt || Date.now() - lastExportAt > 3 * 24 * 60 * 60 * 1000;
  if (!stale) return;
  state.backupHintShown = true;
  notify("バックアップ推奨: データ管理の「エクスポート」で保存してください。", "info", 3600);
}

function getActiveTabName() {
  const tab = Array.from(els.tabs).find((t) => t.classList.contains("active"));
  return tab?.dataset?.tab || "editor";
}

function renderUxGuide() {
  if (!els.uxGuide) return;
  const tab = getActiveTabName();
  const active = getActiveExam();
  const picked = active ? active.questionIds.length : 0;

  let msg = "NEXT STEP: 使う機能を選んでください。";
  if (tab === "editor") {
    if (!state.questions.length) {
      msg = "NEXT STEP: 問題を1問追加してください。";
    } else if (state.editingQuestionId) {
      msg = "NEXT STEP: 更新するか、編集をキャンセルしてください。";
    } else {
      msg = "NEXT STEP: 問題追加を続けるか、模試作成へ進んでください。";
    }
  } else if (tab === "home") {
    msg = "NEXT STEP: 問題作成・模試作成・暗記開始を選べます。";
  } else if (tab === "exam") {
    if (!active) {
      msg = "NEXT STEP: 模試を新規作成してください。";
    } else if (!els.examListView.classList.contains("hidden")) {
      msg = "NEXT STEP: 新規作成または編集後、一覧から受験開始します。";
    } else if (!els.examBuilderView.classList.contains("hidden")) {
      msg =
        picked === 0
          ? "NEXT STEP: ジャンル追加か個別選択で問題を入れてください。"
          : `NEXT STEP: ${picked}問を選択中です。模試を作成して保存してください。`;
    } else if (!els.examSolveView.classList.contains("hidden")) {
      msg = state.running
        ? "NEXT STEP: 回答して、最後に終了して採点してください。"
        : "NEXT STEP: 結果確認か、模試作成へ戻って調整してください。";
    }
  } else if (tab === "memorize") {
    msg = !state.memorize.started
      ? "NEXT STEP: 暗記開始を押してください。"
      : state.memorize.finished
        ? "NEXT STEP: 結果を確認し、必要なら再開してください。"
        : "NEXT STEP: 回答後に答えを表示し、最後に結果表示してください。";
  } else if (tab === "print") {
    msg = "NEXT STEP: 問題用/解答用を選び、印刷してください。";
  } else if (tab === "billing") {
    msg = "NEXT STEP: 無料利用か広告オフを選んでください。";
  }

  els.uxGuide.textContent = msg;
}

function renderDailyQuote() {
  if (!els.dailyQuote) return;
  const hidden = Boolean(state.settings.hideDailyQuote);
  els.dailyQuote.classList.toggle("hidden", hidden);
  if (hidden) return;
  if (!DAILY_QUOTE_ITEMS.length) {
    els.dailyQuote.textContent = "";
    return;
  }
  const dayKey = Number(new Date().toISOString().slice(0, 10).replaceAll("-", "")) || Date.now();
  const idx = Math.abs(dayKey) % DAILY_QUOTE_ITEMS.length;
  const item = DAILY_QUOTE_ITEMS[idx];
  els.dailyQuote.textContent = `今日の${item.kind}: ${item.text}（${item.source}）`;
}

function formatRemainingShort(untilMs) {
  const remain = Math.max(0, untilMs - Date.now());
  if (!remain) return "期限切れ";
  const h = Math.floor(remain / (60 * 60 * 1000));
  const m = Math.floor((remain % (60 * 60 * 1000)) / (60 * 1000));
  if (h > 0) return `${h}時間${m}分`;
  return `${m}分`;
}

function getBillingTier() {
  const now = Date.now();
  const paidUntil = Math.max(Number(state.billing.adfreeUntil || 0), Number(state.billing.proUntil || 0));
  if (paidUntil > now) return "adfree";
  if (Number(state.billing.rewardedAdUntil || 0) > now) return "rewarded";
  return "free";
}

function getLatestShareInsight() {
  const r = state.lastExamResult;
  if (!r || !Array.isArray(r.rows) || !r.rows.length) return "";
  const autoRows = r.rows.filter((row) => row.auto);
  const wrongRows = autoRows.filter((row) => !row.ok);
  const weak = wrongRows.slice(0, 3).map((row) => row.q?.text || "").filter(Boolean);
  const weakText = weak.length ? ` / 要復習: ${weak.join(" | ").slice(0, 90)}` : "";
  return `直近: ${r.examTitle} ${r.autoScore}/${r.autoTotal}問 ${r.endReason || ""}${weakText}`;
}


function renderBilling() {
  if (!els.billingCurrentState) return;
  const tier = getBillingTier();
  const now = Date.now();
  const adfreeUntil = Math.max(Number(state.billing.adfreeUntil || 0), Number(state.billing.proUntil || 0));
  const adfreeActive = adfreeUntil > now;
  const rewardedActive = Number(state.billing.rewardedAdUntil || 0) > now;

  if (tier === "adfree") {
    els.billingCurrentState.textContent = `広告オフ 利用中（残り ${formatRemainingShort(adfreeUntil)}）`;
    els.billingAdState.textContent = "なし（広告オフ）";
  } else if (tier === "rewarded") {
    els.billingCurrentState.textContent = `無料（広告視聴で一時的に広告なし）`;
    els.billingAdState.textContent = `なし（残り ${formatRemainingShort(state.billing.rewardedAdUntil)}）`;
  } else {
    els.billingCurrentState.textContent = "無料（広告あり）";
    els.billingAdState.textContent = "あり";
  }

  els.billingRewardedUntil.textContent = rewardedActive
    ? `広告なし残り時間: ${formatRemainingShort(state.billing.rewardedAdUntil)}`
    : "広告なし残り時間: なし";
  els.adfreeStatusText.textContent = adfreeActive
    ? `利用中（残り ${formatRemainingShort(adfreeUntil)}）`
    : "未契約";
  els.watchRewardedAdBtn.disabled = tier !== "free";
  els.buyAdfreeMonthlyBtn.disabled = false;
  els.buyAdfreeYearlyBtn.disabled = false;
  renderAdBanner();
}

function renderAdBanner() {
  // 常時バナーは表示しない（報酬型広告のみ運用）
  if (!els.adBanner) return;
  els.adBanner.classList.add("hidden");
}

function showRewardedAd() {
  const provider = window.MockMakerAds;
  if (provider && typeof provider.showRewardedAd === "function") {
    return provider
      .showRewardedAd()
      .then((result) => Boolean(result?.completed ?? result === true))
      .catch(() => false);
  }
  return showBuiltInRewardedAdFallback();
}

function showBuiltInRewardedAdFallback() {
  return new Promise((resolve) => {
    if (!els.rewardedAdModal || !els.rewardedAdProgressBar || !els.rewardedAdRemain) {
      resolve(false);
      return;
    }
    stopRewardedAdPlaybackTimer();
    state.adPlayback.resolve = resolve;
    state.adPlayback.remainingSec = 5;
    els.rewardedAdProgressBar.style.width = "0%";
    els.rewardedAdRemain.textContent = "残り 00:05";
    openModal(els.rewardedAdModal, els.cancelRewardedAdBtn);

    state.adPlayback.timerId = setInterval(() => {
      state.adPlayback.remainingSec -= 1;
      const elapsed = 5 - state.adPlayback.remainingSec;
      const ratio = Math.min(100, Math.max(0, Math.round((elapsed / 5) * 100)));
      els.rewardedAdProgressBar.style.width = `${ratio}%`;
      const remain = Math.max(0, state.adPlayback.remainingSec);
      els.rewardedAdRemain.textContent = `残り 00:0${remain}`;
      if (remain <= 0) {
        stopRewardedAdPlaybackTimer();
        closeModalBase(els.rewardedAdModal);
        const done = state.adPlayback.resolve;
        state.adPlayback.resolve = null;
        if (done) done(true);
      }
    }, 1000);
  });
}

function stopRewardedAdPlaybackTimer() {
  if (state.adPlayback.timerId) clearInterval(state.adPlayback.timerId);
  state.adPlayback.timerId = null;
}

function cancelRewardedAdPlayback() {
  if (!els.rewardedAdModal || els.rewardedAdModal.classList.contains("hidden")) return;
  stopRewardedAdPlaybackTimer();
  closeModalBase(els.rewardedAdModal);
  const done = state.adPlayback.resolve;
  state.adPlayback.resolve = null;
  if (done) done(false);
}

function renderExamProgress() {
  const examCount = getExamQuestions().length;
  if (!examCount) {
    els.examProgressBar.style.width = "0%";
    els.examProgressText.textContent = "0 / 0 解答済み";
    els.examUnansweredText.textContent = "未回答: 0問";
    updateExamSolveActions();
    return;
  }
  const answered = state.answers.filter((a) => String(a).trim()).length;
  const unanswered = Math.max(0, examCount - answered);
  const ratio = Math.round((answered / examCount) * 100);
  els.examProgressBar.style.width = `${ratio}%`;
  els.examProgressText.textContent = `${answered} / ${examCount} 解答済み`;
  els.examUnansweredText.textContent = `未回答: ${unanswered}問`;
  updateExamSolveActions();
}

function updateExamSolveActions() {
  const total = getExamQuestions().length;
  const running = Boolean(state.running);
  const atFirst = state.current <= 0;
  const atLast = state.current >= Math.max(0, total - 1);
  if (els.prevBtn) els.prevBtn.disabled = !running || total === 0 || atFirst;
  if (els.nextBtn) els.nextBtn.disabled = !running || total === 0 || atLast;
  if (els.finishBtn) els.finishBtn.disabled = !running || total === 0;
}

function openFinishConfirmModal() {
  if (!state.running) return;
  const total = getExamQuestions().length;
  const answered = state.answers.filter((a) => String(a).trim()).length;
  const unanswered = Math.max(0, total - answered);
  els.finishConfirmText.textContent =
    unanswered > 0
      ? `未回答が ${unanswered}問 あります。このまま終了して採点しますか？`
      : "全問回答済みです。終了して採点しますか？";
  openModal(els.finishConfirmModal, els.finishCancelBtn);
}

function closeFinishConfirmModal() {
  closeModalBase(els.finishConfirmModal);
}

function closeDangerConfirmModal(result) {
  closeModalBase(els.dangerConfirmModal);
  if (pendingDangerousConfirm) {
    const resolver = pendingDangerousConfirm;
    pendingDangerousConfirm = null;
    resolver(Boolean(result));
  }
}

function markSaved() {
  lastSavedAt = Date.now();
  if (!els.saveStateText) return;
  const time = new Date(lastSavedAt).toLocaleTimeString("ja-JP", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  els.saveStateText.textContent = `保存状態: 自動保存済み ${time}`;
}

function confirmAction(message, options = {}) {
  if (!els.dangerConfirmModal || !els.dangerConfirmText) {
    return Promise.resolve(confirm(String(message || "実行しますか？")));
  }
  if (pendingDangerousConfirm) {
    pendingDangerousConfirm(false);
    pendingDangerousConfirm = null;
  }
  const title = String(options.title || "確認");
  const yesLabel = String(options.yesLabel || "はい");
  const noLabel = String(options.noLabel || "いいえ");
  const danger = options.danger !== false;
  const details = Array.isArray(options.details) ? options.details.filter(Boolean).map(String) : [];
  if (els.dangerConfirmTitle) els.dangerConfirmTitle.textContent = title;
  els.dangerConfirmText.textContent = String(message || "実行しますか？");
  if (els.dangerConfirmList) {
    if (details.length) {
      els.dangerConfirmList.innerHTML = details
        .map((item) => `<li>${escapeHtml(item)}</li>`)
        .join("");
      els.dangerConfirmList.classList.remove("hidden");
    } else {
      els.dangerConfirmList.innerHTML = "";
      els.dangerConfirmList.classList.add("hidden");
    }
  }
  els.dangerConfirmYesBtn.textContent = yesLabel;
  els.dangerConfirmNoBtn.textContent = noLabel;
  els.dangerConfirmYesBtn.classList.toggle("danger", danger);
  els.dangerConfirmYesBtn.classList.toggle("ghost", !danger);
  openModal(els.dangerConfirmModal, els.dangerConfirmNoBtn);
  return new Promise((resolve) => {
    pendingDangerousConfirm = resolve;
  });
}

function openInputPrompt(options = {}) {
  if (!els.inputPromptModal || !els.inputPromptField) {
    return Promise.resolve(prompt(String(options.message || "入力してください。")));
  }
  if (pendingInputPrompt) {
    pendingInputPrompt(null);
    pendingInputPrompt = null;
  }
  const title = String(options.title || "入力");
  const message = String(options.message || "入力してください。");
  const placeholder = String(options.placeholder || "");
  const defaultValue = String(options.defaultValue || "");
  const okLabel = String(options.okLabel || "OK");
  const cancelLabel = String(options.cancelLabel || "キャンセル");
  const hint = String(options.hint || "");
  const type = options.type === "password" ? "password" : "text";
  const inputMode = String(options.inputMode || "");
  const maxLength = Number(options.maxLength || 0);

  if (els.inputPromptTitle) els.inputPromptTitle.textContent = title;
  if (els.inputPromptText) els.inputPromptText.textContent = message;
  if (els.inputPromptHint) els.inputPromptHint.textContent = hint;
  els.inputPromptOkBtn.textContent = okLabel;
  els.inputPromptCancelBtn.textContent = cancelLabel;
  els.inputPromptField.type = type;
  els.inputPromptField.placeholder = placeholder;
  els.inputPromptField.value = defaultValue;
  els.inputPromptField.inputMode = inputMode;
  if (maxLength > 0) els.inputPromptField.maxLength = maxLength;
  else els.inputPromptField.removeAttribute("maxlength");

  openModal(els.inputPromptModal, els.inputPromptField);
  return new Promise((resolve) => {
    pendingInputPrompt = resolve;
  });
}

function closeInputPromptModal(result) {
  closeModalBase(els.inputPromptModal);
  if (pendingInputPrompt) {
    const resolver = pendingInputPrompt;
    pendingInputPrompt = null;
    resolver(result);
  }
}

function openOptionPicker(options = {}) {
  if (!els.optionPickerModal || !els.optionPickerList) {
    return Promise.resolve(null);
  }
  if (pendingOptionPicker) {
    pendingOptionPicker(null);
    pendingOptionPicker = null;
  }
  const title = String(options.title || "選択");
  const items = Array.isArray(options.items) ? options.items : [];
  if (els.optionPickerTitle) els.optionPickerTitle.textContent = title;

  els.optionPickerList.innerHTML = items.length
    ? items
        .map(
          (item) => `
            <button
              type="button"
              class="ghost optionPickerItem ${item.active ? "active" : ""}"
              data-option-picker-value="${escapeHtml(String(item.value || ""))}"
            >
              ${escapeHtml(String(item.label || item.value || ""))}
            </button>
          `
        )
        .join("")
    : "<p class='muted'>選択肢がありません。</p>";

  els.optionPickerList.querySelectorAll("button[data-option-picker-value]").forEach((btn) => {
    btn.addEventListener("click", () => {
      closeOptionPickerModal(btn.dataset.optionPickerValue || "");
    });
  });
  openModal(els.optionPickerModal, els.optionPickerCloseBtn);
  return new Promise((resolve) => {
    pendingOptionPicker = resolve;
  });
}

function closeOptionPickerModal(result) {
  closeModalBase(els.optionPickerModal);
  if (pendingOptionPicker) {
    const resolver = pendingOptionPicker;
    pendingOptionPicker = null;
    resolver(result);
  }
}

function getSelectDisplayLabel(selectEl) {
  if (!selectEl) return "";
  const opt = selectEl.options[selectEl.selectedIndex];
  return opt ? opt.textContent || opt.value : "";
}

function refreshEnhancedSelectTrigger(selectId) {
  const selectEl = document.getElementById(selectId);
  const trigger = document.getElementById(`enhanced-${selectId}`);
  if (!selectEl || !trigger) return;
  const label = getSelectDisplayLabel(selectEl) || "選択";
  trigger.textContent = label;
}

function setupEnhancedSelect(selectId, title) {
  const selectEl = document.getElementById(selectId);
  if (!selectEl || document.getElementById(`enhanced-${selectId}`)) return;
  selectEl.classList.add("hiddenNativeSelect");
  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.id = `enhanced-${selectId}`;
  trigger.className = "ghost selectLikeBtn";
  trigger.setAttribute("aria-haspopup", "dialog");
  selectEl.insertAdjacentElement("afterend", trigger);
  trigger.addEventListener("click", async () => {
    const items = Array.from(selectEl.options).map((opt) => ({
      value: opt.value,
      label: opt.textContent || opt.value,
      active: opt.value === selectEl.value,
    }));
    const picked = await openOptionPicker({ title, items });
    if (picked === null) return;
    if (String(picked) !== String(selectEl.value)) {
      selectEl.value = String(picked);
      selectEl.dispatchEvent(new Event("change", { bubbles: true }));
      selectEl.dispatchEvent(new Event("input", { bubbles: true }));
    }
    refreshEnhancedSelectTrigger(selectId);
  });
  refreshEnhancedSelectTrigger(selectId);
}

function startTimer() {
  stopTimer();
  state.timerId = setInterval(() => {
    state.elapsedSec = Math.floor((Date.now() - state.startedAt) / 1000);
    if (state.running && state.elapsedSec % 5 === 0 && state.elapsedSec !== lastSessionPersistSec) {
      lastSessionPersistSec = state.elapsedSec;
      saveExamSessionState();
    }
    if (state.examDurationSec > 0) {
      const remain = Math.max(0, state.examDurationSec - state.elapsedSec);
      els.timer.textContent = formatTime(remain);
      if (remain <= 0) {
        finishExam("時間切れ");
      }
      return;
    }
    els.timer.textContent = formatTime(state.elapsedSec);
  }, 1000);
}

function stopTimer() {
  if (state.timerId) clearInterval(state.timerId);
  state.timerId = null;
}

function formatTime(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function runWithButton(button, busyText, fn, minMs = 280) {
  if (!button || button.dataset.busy === "1") return;
  const idleText = button.textContent;
  const started = Date.now();
  button.dataset.busy = "1";
  button.disabled = true;
  button.classList.add("isBusy");
  button.textContent = busyText;

  const restore = () => {
    const wait = Math.max(0, minMs - (Date.now() - started));
    setTimeout(() => {
      button.disabled = false;
      button.dataset.busy = "0";
      button.classList.remove("isBusy");
      button.textContent = idleText;
    }, wait);
  };

  try {
    const result = fn();
    if (result && typeof result.then === "function") {
      return result.finally(restore);
    }
    restore();
    return result;
  } catch (error) {
    restore();
    throw error;
  }
}

function cloneSerializable(value) {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value));
}

function offerUndo(message, restoreFn, timeoutMs = 7000) {
  const token = Date.now() + Math.random();
  latestUndoToken = token;
  notify(message, "warn", timeoutMs, {
    actionLabel: "元に戻す",
    actionFn: () => {
      if (latestUndoToken !== token) return;
      latestUndoToken = 0;
      restoreFn();
      notify("取り消しました", "success");
    },
  });
}

function getDefaultToastTimeout() {
  if (state.settings.toastDuration === "short") return 1500;
  if (state.settings.toastDuration === "long") return 3500;
  return 2200;
}

function confirmDangerousAction(message) {
  return confirmAction(message, { title: "削除確認", yesLabel: "はい", noLabel: "いいえ", danger: true });
}

function notify(message, type = "info", timeoutMs = undefined, options = {}) {
  let opts = options || {};
  if (typeof timeoutMs === "object" && timeoutMs !== null) {
    opts = timeoutMs;
    timeoutMs = undefined;
  }
  const actualTimeout = timeoutMs === undefined ? getDefaultToastTimeout() : timeoutMs;
  if (!els.toastContainer) return;
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  const text = document.createElement("span");
  text.textContent = message;
  toast.appendChild(text);
  if (opts.actionLabel && typeof opts.actionFn === "function") {
    const actionBtn = document.createElement("button");
    actionBtn.type = "button";
    actionBtn.className = "toastAction";
    actionBtn.textContent = String(opts.actionLabel);
    actionBtn.addEventListener("click", () => {
      opts.actionFn();
      toast.remove();
    });
    toast.appendChild(actionBtn);
  }
  els.toastContainer.appendChild(toast);
  if (actualTimeout > 0) {
    setTimeout(() => {
      toast.remove();
    }, actualTimeout);
  }
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function optionLabel(q, index) {
  if (q.mcqLabelMode === "numeric") return String(index + 1);
  return ["A", "B", "C", "D"][index] || String(index + 1);
}

function displayAnswer(q, answer) {
  if (q.type === "fill") return `（${String(answer)}）`;
  if (q.type !== "mcq") return String(answer);
  const idx = Number(answer) - 1;
  if (Number.isNaN(idx) || idx < 0) return String(answer);
  return optionLabel(q, idx);
}

function normalizePrintOptionText(value) {
  return String(value || "").replace(/^\s*[・•●]\s*/, "");
}

function displayAnswerWithOptionText(q, answer) {
  if (q.type === "fill") return `（${String(answer)}）`;
  if (q.type !== "mcq") return String(answer);
  const idx = Number(answer) - 1;
  if (Number.isNaN(idx) || idx < 0) return String(answer);
  const label = optionLabel(q, idx);
  const text = normalizePrintOptionText(q.options?.[idx] || "");
  return text ? `${label} ${text}` : label;
}

function updateMcqEditorLabels() {
  const isNumeric = els.mcqLabelMode.value === "numeric";
  const labels = isNumeric ? ["1", "2", "3", "4"] : ["A", "B", "C", "D"];
  els.mcqOptionA.placeholder = `${labels[0]}: 選択肢を入力`;
  els.mcqOptionB.placeholder = `${labels[1]}: 選択肢を入力`;
  els.mcqOptionC.placeholder = `${labels[2]}: 選択肢を入力`;
  els.mcqOptionD.placeholder = `${labels[3]}: 選択肢を入力`;
  els.mcqAnswerLabel.textContent = isNumeric ? "正答（1-4）" : "正答（A-D）";
  Array.from(els.mcqAnswer.options).forEach((opt, i) => {
    opt.textContent = labels[i];
  });
  updateMcqAnswerAvailability();
}

function updateMcqAnswerAvailability() {
  const rawOptions = [
    String(els.mcqOptionA.value || "").trim(),
    String(els.mcqOptionB.value || "").trim(),
    String(els.mcqOptionC.value || "").trim(),
    String(els.mcqOptionD.value || "").trim(),
  ];
  // Aから連続して入力されている長さを有効選択肢数とみなす
  let enabledCount = 0;
  for (const opt of rawOptions) {
    if (!opt) break;
    enabledCount += 1;
  }
  if (!enabledCount) enabledCount = 1;

  Array.from(els.mcqAnswer.options).forEach((opt, i) => {
    opt.disabled = i + 1 > enabledCount;
  });
  const current = Number(els.mcqAnswer.value || "1");
  if (current > enabledCount) {
    els.mcqAnswer.value = String(enabledCount);
  }
}

state.settings = loadSettings();
applyUiSettings();
initExamState();
initPrintPrefs();
setupEnhancedSelect("questionGenre", "ジャンルを選択");
setupEnhancedSelect("examSortSelect", "並び替えを選択");
setupEnhancedSelect("fontSizeSelect", "文字サイズ");
setupEnhancedSelect("memorizeSourceType", "暗記対象");
setupEnhancedSelect("memorizeTargetSelect", "暗記対象を選択");
setupEnhancedSelect("memorizeOrderSelect", "暗記の出題順");
setupEnhancedSelect("defaultShareExpireSelect", "共有リンクの既定有効期限");
setupEnhancedSelect("toastDurationSelect", "通知表示時間");
renderGenreUI();
renderQuestionList();
renderExamManager();
renderExamBuilder();
renderExamStepIndicator();
updateGenreQuestionListVisibility();
renderPrintPreview();
renderBilling();
renderMemorize();
renderHistory();
renderHomeDashboard();
renderStatus();
renderExamProgress();
els.timer.textContent = "00:00";
resetQuestionForm();
switchEditorView("question");
const restoredExamSession = restoreExamSessionIfAny();
if (restoredExamSession) {
  switchTab("exam");
} else {
  switchTab("home");
}
tryImportSharedLinkFromHash();

window.addEventListener("beforeunload", () => {
  saveExamSessionState();
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").then((registration) => {
      registration.update();
      if (registration.waiting) {
        registration.waiting.postMessage("SKIP_WAITING");
      }
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (!newWorker) return;
        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            newWorker.postMessage("SKIP_WAITING");
          }
        });
      });
    });
  });
}

let deferredPrompt;
window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredPrompt = event;
  els.installBtn.hidden = false;
});

els.installBtn.addEventListener("click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  els.installBtn.hidden = true;
});
