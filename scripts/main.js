const monthTitle = document.getElementById('month-title');
const daysGrid = document.getElementById('calendar-days');
const previousButton = document.getElementById('previous-month');
const nextButton = document.getElementById('next-month');
const todayButton = document.getElementById('today-button');
const selectedDateTitle = document.getElementById('selected-date');
const selectedCount = document.getElementById('selected-count');
const dayEntries = document.getElementById('day-entries');
const addLogButton = document.getElementById('add-log-button');
const logDialog = document.getElementById('log-dialog');
const logForm = document.getElementById('log-form');
const logTime = document.getElementById('log-time');
const logNote = document.getElementById('log-note');
const logPhoto = document.getElementById('log-photo');
const dialogDate = document.getElementById('dialog-date');
const toast = document.getElementById('toast');
const storageKey = 'daily-poop-calendar-entries';
const touristStorageKey = 'dookie-diary-toilet-tourist-visits';
const usersStorageKey = 'dookie-diary-users';
const currentUserKey = 'dookie-diary-current-user';
const authTokenKey = 'dookie-diary-auth-token';
const apiBaseUrl = 'http://localhost:3001';
const calendarTab = document.getElementById('calendar-tab');
const touristTab = document.getElementById('toilet-tourist-tab');
const rhythmTab = document.getElementById('rhythm-tab');
const captureTab = document.getElementById('capture-tab');
const calendarPanel = document.getElementById('calendar-panel');
const touristPanel = document.getElementById('toilet-tourist-panel');
const rhythmPanel = document.getElementById('rhythm-panel');
const capturePanel = document.getElementById('capture-panel');
const captureGallery = document.getElementById('capture-gallery');
const captureStatus = document.getElementById('capture-status');
const captureAddLogButton = document.getElementById('capture-add-log');
const diaryTabs = [
  { tab: calendarTab, panel: calendarPanel },
  { tab: touristTab, panel: touristPanel },
  { tab: rhythmTab, panel: rhythmPanel },
  { tab: captureTab, panel: capturePanel }
];
const touristDialog = document.getElementById('tourist-dialog');
const touristDialogTitle = document.getElementById('tourist-dialog-title');
const touristForm = document.getElementById('tourist-form');
const touristDate = document.getElementById('tourist-date');
const touristLocation = document.getElementById('tourist-location');
const touristLocationSuggestions = document.getElementById('tourist-location-suggestions');
const touristNote = document.getElementById('tourist-note');
const touristRatingHelp = document.getElementById('tourist-rating-help');
const touristCategoryRatings = document.getElementById('tourist-category-ratings');
const touristList = document.getElementById('tourist-list');
const touristMapElement = document.getElementById('tourist-map');
const touristMapStatus = document.getElementById('tourist-map-status');
const touristGeocodeStatus = document.getElementById('tourist-geocode-status');
const touristMapDescription = document.getElementById('tourist-map-description');
const touristSharingNotice = document.querySelector('.tourist-sharing-notice');
const privacyNote = document.getElementById('privacy-note');
const authUserLabel = document.getElementById('auth-user-label');
const openAuthButton = document.getElementById('open-auth-button');
const logoutButton = document.getElementById('logout-button');
const authDialog = document.getElementById('auth-dialog');
const authForm = document.getElementById('auth-form');
const authUsername = document.getElementById('auth-username');
const authPassword = document.getElementById('auth-password');
const authDialogTitle = document.getElementById('auth-dialog-title');
const authSubmit = document.getElementById('auth-submit');
const authModeCopy = document.getElementById('auth-mode-copy');
const authError = document.getElementById('auth-error');
const toggleAuthModeButton = document.getElementById('toggle-auth-mode');
let authMode = 'login';
const touristRatingCategories = [
  { key: 'ambience', label: 'Ambience' },
  { key: 'cleanliness', label: 'Cleanliness' },
  { key: 'prePooSmell', label: 'Pre-poo smell' },
  { key: 'postPooSmell', label: 'Post-poo smell' },
  { key: 'reverb', label: 'Reverb' },
  { key: 'toiletPaper', label: 'Toilet paper quality' },
  { key: 'noTouch', label: 'No-touch access' },
  { key: 'amenities', label: 'Amenities' }
];
const touristRatingLabels = {
  1: 'Pretty rough',
  2: 'Not great',
  3: 'Okay',
  4: 'Good',
  5: 'Excellent'
};
function buildTouristRatingControls() {
  for (const category of touristRatingCategories) {
    const row = document.createElement('div');
    row.className = 'tourist-rating-row';
    const label = document.createElement('label');
    label.className = 'tourist-rating-label';
    label.textContent = category.label;
    label.setAttribute('for', `tourist-${category.key}`);

    const control = document.createElement('div');
    control.className = 'tourist-rating-control';

    for (let value = 1; value <= 5; value += 1) {
      const option = document.createElement('label');
      option.className = 'tourist-rating-option';
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = `tourist-${category.key}`;
      input.value = String(value);
      input.setAttribute('aria-label', `${category.label} ${value} out of 5 flys`);
      input.dataset.category = category.key;
      if (value === 3) input.checked = true;
      const fly = document.createElement('img');
      fly.src = 'assets/images/fly-doodle.jpg';
      fly.alt = '';
      fly.setAttribute('aria-hidden', 'true');
      option.append(input, fly);
      control.append(option);
    }

    row.append(label, control);
    touristCategoryRatings.append(row);
  }

  touristCategoryRatings.querySelectorAll('input[type="radio"]').forEach((input) => {
    input.addEventListener('change', updateTouristRatingHelp);
  });
}
buildTouristRatingControls();
const stoolTypes = new Map([
  ['type-1', {
    label: 'Type 1 — Separate hard lumps, like Nerds Gummy Clusters (hard to pass)',
    image: 'assets/images/stool-type-1.jpg'
  }],
  ['type-2', {
    label: 'Type 2 — Sausage-shaped, but lumpy and has texture',
    image: 'assets/images/stool-type-2.jpg'
  }],
  ['type-3', {
    label: 'Type 3 — Like a sausage but with cracks on the surface',
    image: 'assets/images/stool-type-3.jpg'
  }],
  ['type-4', {
    label: 'Type 4 — Like a sausage or snake, so soft and smooth. Best kind of stool',
    image: 'assets/images/stool-type-4.jpg'
  }],
  ['type-5', {
    label: 'Type 5 — Soft blobs with clear cut edges',
    image: 'assets/images/stool-type-5.jpg'
  }],
  ['type-6', {
    label: 'Type 6 — Entering diarrhea village',
    image: 'assets/images/stool-type-6.jpg'
  }],
  ['type-7', {
    label: 'Type 7 — Just straight water, I’m so sorry',
    image: 'assets/images/stool-type-7.jpg'
  }]
]);

const today = new Date();
let displayedMonth = new Date(today.getFullYear(), today.getMonth(), 1);
let selectedDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
let storageAvailable = true;
let currentUser = readCurrentUser();
let users = loadUsers();
let entries = loadEntries();
let touristStorageAvailable = true;
let touristVisits = loadTouristVisits();
let communityTouristVisits = [];
let editingTouristVisitId = null;
let photoDatabasePromise;
let captureRenderId = 0;
const photoObjectUrls = new Set();
const maxPhotoSize = 8 * 1024 * 1024;
const photoDatabaseName = 'dookie-diary-private-photos';
const photoStoreName = 'photos';
let touristMap = null;
let touristMapMarkers = null;
let lastGeocodeRequestAt = 0;
let touristSuggestionTimeout = null;
let touristSuggestionRequest = null;
let touristSuggestionRequestId = 0;
let touristSuggestionItems = [];
let activeTouristSuggestionIndex = -1;
let selectedTouristCoordinates = null;
let toastTimeout;

function dateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDateKey(key) {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function getAuthToken() {
  try {
    return localStorage.getItem(authTokenKey) || '';
  } catch {
    return '';
  }
}

function saveAuthToken(token) {
  if (!token) {
    localStorage.removeItem(authTokenKey);
    return;
  }
  localStorage.setItem(authTokenKey, token);
}

async function apiRequest(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  const token = getAuthToken();

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }

  if (token) {
    headers.Authorization = 'Bearer ' + token;
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = {};
  }

  if (!response.ok) {
    throw new Error(payload?.error || 'Request failed');
  }

  return payload;
}

function normalizeSelectedStoolTypes(value) {
  if (Array.isArray(value)) {
    return value.filter((item) => typeof item === 'string' && stoolTypes.has(item));
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return [];

    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return normalizeSelectedStoolTypes(parsed);
        }
      } catch {
        return [];
      }
    }

    if (stoolTypes.has(trimmed)) {
      return [trimmed];
    }
  }

  return [];
}

function serializeStoolType(value) {
  const normalized = normalizeSelectedStoolTypes(value);
  if (normalized.length === 0) return null;
  return normalized.length === 1 ? normalized[0] : normalized;
}

function readCurrentUser() {
  try {
    const username = localStorage.getItem(currentUserKey);
    return username ? String(username).trim() : null;
  } catch {
    return null;
  }
}

function loadUsers() {
  try {
    const storedUsers = JSON.parse(localStorage.getItem(usersStorageKey) || '[]');
    if (!Array.isArray(storedUsers)) return [];
    return storedUsers.filter((user) => user && typeof user.username === 'string' && typeof user.password === 'string');
  } catch {
    return [];
  }
}

function saveUsers() {
  localStorage.setItem(usersStorageKey, JSON.stringify(users));
}

function getUserStorageKey(prefix, username) {
  const normalized = String(username || '').trim().toLowerCase();
  const slug = normalized.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'guest';
  return `${prefix}-${slug}`;
}

function getEntryStorageKey() {
  return currentUser ? getUserStorageKey('dookie-diary-user-entries', currentUser) : storageKey;
}

function getTouristVisitStorageKey() {
  return currentUser ? getUserStorageKey('dookie-diary-user-tourist-visits', currentUser) : touristStorageKey;
}

function getPrivatePhotoKey(entryId) {
  const accountScope = currentUser
    ? `user:${encodeURIComponent(currentUser.trim())}`
    : 'guest';
  return `dookie-diary-photos:${accountScope}:${entryId}`;
}

function openPhotoDatabase() {
  if (!('indexedDB' in window)) {
    return Promise.reject(new Error('Private photo storage is not available in this browser.'));
  }
  if (photoDatabasePromise) return photoDatabasePromise;

  photoDatabasePromise = new Promise((resolve, reject) => {
    const request = window.indexedDB.open(photoDatabaseName, 1);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(photoStoreName)) {
        database.createObjectStore(photoStoreName, { keyPath: 'key' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Could not open private photo storage.'));
    request.onblocked = () => reject(new Error('Private photo storage is blocked by another browser tab.'));
  }).catch((error) => {
    photoDatabasePromise = null;
    throw error;
  });

  return photoDatabasePromise;
}

async function runPhotoTransaction(mode, operation) {
  const database = await openPhotoDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(photoStoreName, mode);
    const request = operation(transaction.objectStore(photoStoreName));
    transaction.oncomplete = () => resolve(request?.result);
    transaction.onerror = () => reject(transaction.error || new Error('Could not update private photo storage.'));
    transaction.onabort = () => reject(transaction.error || new Error('Private photo storage update was cancelled.'));
  });
}

async function savePrivatePhoto(entry, file) {
  return runPhotoTransaction('readwrite', (store) => store.put({
    key: getPrivatePhotoKey(entry.id),
    entryId: entry.id,
    date: entry.date,
    time: entry.time,
    note: entry.note,
    blob: file,
    fileName: file.name,
    mediaType: file.type
  }));
}

async function getPrivatePhotos() {
  const scope = `${getPrivatePhotoKey('')}`;
  const photos = await runPhotoTransaction('readonly', (store) => store.getAll());
  return photos.filter((photo) => photo.key.startsWith(scope));
}

async function deletePrivatePhoto(entryId) {
  if (!('indexedDB' in window)) return;
  return runPhotoTransaction('readwrite', (store) => store.delete(getPrivatePhotoKey(entryId)));
}

function revokePhotoObjectUrls() {
  for (const url of photoObjectUrls) URL.revokeObjectURL(url);
  photoObjectUrls.clear();
}

function renderAuthState() {
  currentUser = readCurrentUser();
  if (currentUser) {
    authUserLabel.textContent = `Signed in as ${currentUser}`;
    openAuthButton.textContent = 'Switch user';
    logoutButton.hidden = false;
    privacyNote.textContent = 'Diary logs are private. Photos stay in this browser and are not shared. Toilet Tourist visits are shared with signed-in users.';
  } else {
    authUserLabel.textContent = 'Not signed in';
    openAuthButton.textContent = 'Log in';
    logoutButton.hidden = true;
    privacyNote.textContent = 'Diary logs and photos are private. Photos stay in this browser; guest Toilet Tourist visits stay on this device.';
  }
}

async function loadUserDataFromApi() {
  if (!getAuthToken()) return;

  try {
    const [diaryResult, touristResult, communityResult] = await Promise.all([
      apiRequest('/api/entries/diary'),
      apiRequest('/api/entries/tourist'),
      apiRequest('/api/entries/tourist/community')
    ]);
    entries = Array.isArray(diaryResult.entries) ? diaryResult.entries : [];
    touristVisits = Array.isArray(touristResult.visits) ? touristResult.visits : [];
    communityTouristVisits = Array.isArray(communityResult.visits) ? communityResult.visits : [];
    renderAll();
  } catch (error) {
    showToast(error.message || 'Could not load your saved data.');
  }
}

async function syncUserSession() {
  const token = getAuthToken();
  if (!token) {
    entries = loadEntries();
    touristVisits = loadTouristVisits();
    communityTouristVisits = [];
    return;
  }

  try {
    const userResponse = await apiRequest('/api/auth/me');
    localStorage.setItem(currentUserKey, userResponse.user.username);
    currentUser = userResponse.user.username;
    await loadUserDataFromApi();
    renderAuthState();
  } catch {
    localStorage.removeItem(authTokenKey);
    localStorage.removeItem(currentUserKey);
    currentUser = null;
    entries = loadEntries();
    touristVisits = loadTouristVisits();
    communityTouristVisits = [];
    renderAuthState();
  }
}

function setAuthMode(mode) {
  authMode = mode === 'signup' ? 'signup' : 'login';
  const isLogin = authMode === 'login';

  authDialogTitle.textContent = isLogin ? 'Welcome back' : 'Create your account';
  authSubmit.textContent = isLogin ? 'Log in' : 'Create account';
  authModeCopy.textContent = isLogin
    ? 'Log in to keep your diary, logs, and toilet tourist visits in one place.'
    : 'Create an account to save your private entries and keep them separate from other users.';
  toggleAuthModeButton.textContent = isLogin ? 'Need an account? Create one' : 'Already have an account? Log in';
}

function setAuthError(message) {
  authError.textContent = message || '';
  authError.hidden = !message;
  const hasError = Boolean(message);
  authUsername.setAttribute('aria-invalid', hasError ? 'true' : 'false');
  authPassword.setAttribute('aria-invalid', hasError ? 'true' : 'false');
}

function openAuthDialog() {
  authForm.reset();
  setAuthError('');
  setAuthMode(authMode);
  authDialog.showModal();
  authUsername.focus();
}

function handleLogout() {
  currentUser = null;
  localStorage.removeItem(currentUserKey);
  localStorage.removeItem(authTokenKey);
  entries = loadEntries();
  touristVisits = loadTouristVisits();
  communityTouristVisits = [];
  renderAuthState();
  renderAll();
  showToast('Logged out.');
}

function loadEntries() {
  let stored;
  try {
    stored = localStorage.getItem(getEntryStorageKey());
  } catch {
    storageAvailable = false;
    window.setTimeout(() => showToast('Browser storage is unavailable. New logs may not be saved.'), 0);
    return [];
  }

  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed) || parsed.some((entry) => {
      if (!entry || typeof entry.id !== 'string' || typeof entry.date !== 'string' ||
          typeof entry.time !== 'string' || typeof entry.note !== 'string') {
        return true;
      }

      if (entry.stoolType === undefined || entry.stoolType === null) return false;
      const stoolTypesForEntry = normalizeSelectedStoolTypes(entry.stoolType);
      const hasLegacyNone = entry.stoolType === 'none';
      return stoolTypesForEntry.length === 0 && !hasLegacyNone;
    })) {
      throw new TypeError('Saved logs have an unexpected format.');
    }
    return parsed;
  } catch {
    storageAvailable = false;
    window.setTimeout(() => showToast('Saved logs could not be read. They have not been changed.'), 0);
    return [];
  }
}

function saveEntries() {
  if (!storageAvailable) {
    showToast('Browser storage is unavailable. This change will only last until you close this page.');
    return false;
  }
  try {
    localStorage.setItem(getEntryStorageKey(), JSON.stringify(entries));
    return true;
  } catch {
    storageAvailable = false;
    showToast('This log is visible for now, but browser storage is unavailable, so it may not be saved.');
    return false;
  }
}

function getTouristRatingFromValue(value) {
  const parsed = Number(value ?? 3);
  return Number.isInteger(parsed) && parsed >= 1 && parsed <= 5 ? parsed : 3;
}

function getTouristCategoryRating(ratings, category) {
  const explicitValue = ratings?.[category.key];
  if (explicitValue !== undefined && explicitValue !== null) {
    return getTouristRatingFromValue(explicitValue);
  }

  if (category.key === 'prePooSmell' && ratings && Object.prototype.hasOwnProperty.call(ratings, 'smell')) {
    return getTouristRatingFromValue(ratings.smell);
  }

  return 3;
}

function getTouristAverageRating(ratings) {
  const categoryRatings = touristRatingCategories
    .map((category) => getTouristCategoryRating(ratings, category));
  const total = categoryRatings.reduce((sum, rating) => sum + rating, 0);
  return Number((total / categoryRatings.length).toFixed(1));
}

function getTouristAverageLabel(value) {
  if (value >= 4.5) return 'Excellent';
  if (value >= 3.5) return 'Good';
  if (value >= 2.5) return 'Okay';
  if (value >= 1.5) return 'Needs work';
  return 'Pretty rough';
}

function updateTouristRatingHelp() {
  const ratings = {};
  for (const category of touristRatingCategories) {
    const checkedInput = touristForm.querySelector(`input[name="tourist-${category.key}"]:checked`);
    ratings[category.key] = getTouristRatingFromValue(checkedInput?.value ?? 3);
  }

  const avg = getTouristAverageRating(ratings);
  touristRatingHelp.textContent = `Overall: ${avg.toFixed(1)}/5 flys — ${getTouristAverageLabel(avg)}`;
}

function loadTouristVisits() {
  let stored;
  try {
    stored = localStorage.getItem(getTouristVisitStorageKey());
  } catch {
    touristStorageAvailable = false;
    window.setTimeout(() => showToast('Browser storage is unavailable. Toilet Tourist visits may not be saved.'), 0);
    return [];
  }

  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed) || parsed.some((visit) => {
      if (!visit || typeof visit.id !== 'string' ||
          typeof visit.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(visit.date) ||
          dateKey(parseDateKey(visit.date)) !== visit.date ||
          typeof visit.location !== 'string' || !visit.location.trim() ||
          typeof visit.note !== 'string') {
        return true;
      }

      const hasLatitude = visit.latitude != null;
      const hasLongitude = visit.longitude != null;
      if (hasLatitude !== hasLongitude ||
          (hasLatitude && (!Number.isFinite(visit.latitude) || visit.latitude < -90 || visit.latitude > 90 ||
            !Number.isFinite(visit.longitude) || visit.longitude < -180 || visit.longitude > 180))) {
        return true;
      }

      if (!visit.ratings || typeof visit.ratings !== 'object') return true;
      return touristRatingCategories.some((category) => {
        const rating = getTouristCategoryRating(visit.ratings, category);
        return !Number.isInteger(rating) || rating < 1 || rating > 5;
      });
    })) {
      throw new TypeError('Saved Toilet Tourist visits have an unexpected format.');
    }

    return parsed.map((visit) => ({
      ...visit,
      ratings: touristRatingCategories.reduce((accumulator, category) => {
        accumulator[category.key] = getTouristCategoryRating(visit.ratings || {}, category);
        return accumulator;
      }, {})
    }));
  } catch {
    touristStorageAvailable = false;
    window.setTimeout(() => showToast('Saved Toilet Tourist visits could not be read. They have not been changed.'), 0);
    return [];
  }
}

function saveTouristVisits() {
  if (!touristStorageAvailable) {
    showToast('Browser storage is unavailable. This change will only last until you close this page.');
    return false;
  }
  try {
    localStorage.setItem(getTouristVisitStorageKey(), JSON.stringify(touristVisits));
    return true;
  } catch {
    touristStorageAvailable = false;
    showToast('This visit is visible for now, but browser storage is unavailable, so it may not be saved.');
    return false;
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove('is-visible'), 4200);
}

function getEntriesForDate(date) {
  const key = dateKey(date);
  return entries
    .filter((entry) => entry.date === key)
    .sort((a, b) => a.time.localeCompare(b.time));
}

function formatTime(value) {
  const [hour, minute] = value.split(':').map(Number);
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

function renderCalendar() {
  const year = displayedMonth.getFullYear();
  const month = displayedMonth.getMonth();
  monthTitle.textContent = displayedMonth.toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric'
  });
  daysGrid.replaceChildren();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cellCount = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  for (let index = 0; index < cellCount; index++) {
    const date = new Date(year, month, index - firstDay + 1);
    const dateId = dateKey(date);
    const isCurrentMonth = date.getMonth() === month;
    const dayLogs = getEntriesForDate(date);
    const dayButton = document.createElement('button');
    dayButton.type = 'button';
    dayButton.className = 'day-cell';
    dayButton.setAttribute('role', 'gridcell');
    dayButton.setAttribute('aria-label', `${date.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })}${dayLogs.length ? `, ${dayLogs.length} ${dayLogs.length === 1 ? 'log' : 'logs'}` : ''}`);
    dayButton.setAttribute('aria-pressed', String(dateId === dateKey(selectedDate)));
    if (!isCurrentMonth) dayButton.classList.add('other-month');
    if (dateId === dateKey(today)) dayButton.classList.add('is-today');
    if (dateId === dateKey(selectedDate)) dayButton.classList.add('is-selected');

    const number = document.createElement('span');
    number.textContent = date.getDate();
    dayButton.append(number);

    if (dayLogs.length > 0) {
      const dots = document.createElement('span');
      dots.className = 'log-dots';
      dots.setAttribute('aria-hidden', 'true');
      for (let dot = 0; dot < Math.min(dayLogs.length, 3); dot++) {
        const marker = document.createElement('img');
        marker.className = 'logged-marker';
        marker.src = 'assets/images/toilet-doodle.jpg';
        marker.alt = '';
        dots.append(marker);
      }
      if (dayLogs.length > 3) {
        const more = document.createElement('span');
        more.className = 'log-more';
        more.textContent = '+';
        dots.append(more);
      }
      dayButton.append(dots);
    } else {
      const spacer = document.createElement('span');
      spacer.className = 'log-dots';
      spacer.setAttribute('aria-hidden', 'true');
      dayButton.append(spacer);
    }

    dayButton.addEventListener('click', () => {
      selectedDate = date;
      displayedMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      renderAll();
    });
    daysGrid.append(dayButton);
  }
}

function renderSelectedDay() {
  selectedDateTitle.textContent = selectedDate.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric'
  });
  const selectedEntries = getEntriesForDate(selectedDate);
  selectedCount.textContent = `${selectedEntries.length} ${selectedEntries.length === 1 ? 'log' : 'logs'}`;
  dayEntries.replaceChildren();

  if (selectedEntries.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-day';
    emptyState.textContent = 'A blank page for this day. Add a log whenever you like.';
    dayEntries.append(emptyState);
    return;
  }

  for (const entry of selectedEntries) {
    const card = document.createElement('article');
    card.className = 'entry-card';
    const time = document.createElement('p');
    time.className = 'entry-time';
    time.textContent = formatTime(entry.time);
    card.append(time);

    if (entry.note) {
      const note = document.createElement('p');
      note.className = 'entry-note';
      note.textContent = entry.note;
      card.append(note);
    }

    const selectedStoolTypes = normalizeSelectedStoolTypes(entry.stoolType);
    if (selectedStoolTypes.length > 0) {
      selectedStoolTypes.forEach((stoolTypeValue) => {
        const stoolType = stoolTypes.get(stoolTypeValue);
        if (!stoolType) return;

        const image = document.createElement('img');
        image.className = 'entry-stool-image';
        image.src = stoolType.image;
        image.alt = '';
        image.loading = 'lazy';
        card.append(image);

        const typeLabel = document.createElement('p');
        typeLabel.className = 'entry-stool-type';
        typeLabel.textContent = stoolType.label;
        card.append(typeLabel);
      });
    }

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-entry';
    deleteButton.type = 'button';
    deleteButton.textContent = '×';
    deleteButton.setAttribute('aria-label', `Delete log at ${formatTime(entry.time)}`);
    deleteButton.addEventListener('click', () => deleteEntry(entry.id));
    card.append(deleteButton);
    dayEntries.append(card);
  }
}

function renderStats() {
  const loggedDays = [...new Set(entries.map((entry) => entry.date))].sort();
  const rhythm = document.getElementById('rhythm');
  const rhythmCaption = document.getElementById('rhythm-caption');
  renderRhythmChart();
  if (loggedDays.length < 2) {
    rhythm.textContent = 'Getting started';
    rhythmCaption.textContent = 'Averages appear over time';
    return;
  }

  const intervals = loggedDays.slice(1).map((day, index) =>
    (parseDateKey(day) - parseDateKey(loggedDays[index])) / 86400000
  );
  const average = intervals.reduce((total, interval) => total + interval, 0) / intervals.length;
  const roundedAverage = Math.round(average * 10) / 10;
  rhythm.textContent = `Every ${roundedAverage} ${roundedAverage === 1 ? 'day' : 'days'}`;
  rhythmCaption.textContent = 'Average between logged days';
}

function renderRhythmChart() {
  const chartContainer = document.getElementById('rhythm-chart');
  const chartSummary = document.getElementById('rhythm-chart-summary');
  const dataList = document.getElementById('rhythm-chart-data-list');
  const countsByDate = new Map();
  for (const entry of entries) {
    countsByDate.set(entry.date, (countsByDate.get(entry.date) || 0) + 1);
  }

  const days = Array.from({ length: 30 }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29 + index);
    const key = dateKey(date);
    return {
      date,
      key,
      count: countsByDate.get(key) || 0,
      label: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    };
  });
  const totalLogs = days.reduce((total, day) => total + day.count, 0);
  chartSummary.textContent = `${totalLogs} ${totalLogs === 1 ? 'log' : 'logs'} in the last 30 days`;
  dataList.replaceChildren();

  for (const day of days) {
    const item = document.createElement('li');
    item.textContent = `${day.label}: ${day.count} ${day.count === 1 ? 'log' : 'logs'}`;
    dataList.append(item);
  }

  chartContainer.replaceChildren();
  const namespace = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(namespace, 'svg');
  const width = 720;
  const height = 300;
  const margin = { top: 20, right: 16, bottom: 42, left: 42 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const maxCount = Math.max(1, ...days.map((day) => day.count));
  const tickStep = Math.max(1, Math.ceil(maxCount / 4));
  const scaleMax = Math.max(tickStep, Math.ceil(maxCount / tickStep) * tickStep);
  const slotWidth = plotWidth / days.length;
  const barWidth = slotWidth * 0.62;

  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-labelledby', 'rhythm-chart-heading rhythm-chart-summary');

  const title = document.createElementNS(namespace, 'title');
  title.textContent = 'Daily log counts over the last 30 days';
  const description = document.createElementNS(namespace, 'desc');
  description.textContent = `${totalLogs} total logs. Open the daily log counts list for each date and value.`;
  svg.append(title, description);

  for (let tick = 0; tick <= scaleMax; tick += tickStep) {
    const y = margin.top + plotHeight - (tick / scaleMax) * plotHeight;
    const gridLine = document.createElementNS(namespace, 'line');
    gridLine.setAttribute('x1', String(margin.left));
    gridLine.setAttribute('x2', String(width - margin.right));
    gridLine.setAttribute('y1', String(y));
    gridLine.setAttribute('y2', String(y));
    gridLine.setAttribute('class', 'rhythm-chart-gridline');
    svg.append(gridLine);

    const tickLabel = document.createElementNS(namespace, 'text');
    tickLabel.setAttribute('x', String(margin.left - 10));
    tickLabel.setAttribute('y', String(y + 4));
    tickLabel.setAttribute('text-anchor', 'end');
    tickLabel.setAttribute('class', 'rhythm-chart-axis-label');
    tickLabel.textContent = String(tick);
    svg.append(tickLabel);
  }

  days.forEach((day, index) => {
    const barHeight = (day.count / scaleMax) * plotHeight;
    const x = margin.left + index * slotWidth + (slotWidth - barWidth) / 2;
    const y = margin.top + plotHeight - barHeight;
    const bar = document.createElementNS(namespace, 'rect');
    bar.setAttribute('x', String(x));
    bar.setAttribute('y', String(y));
    bar.setAttribute('width', String(barWidth));
    bar.setAttribute('height', String(Math.max(day.count ? 2 : 0, barHeight)));
    bar.setAttribute('rx', '3');
    bar.setAttribute('class', day.count ? 'rhythm-chart-bar' : 'rhythm-chart-bar is-empty');

    const barTitle = document.createElementNS(namespace, 'title');
    barTitle.textContent = `${day.label}: ${day.count} ${day.count === 1 ? 'log' : 'logs'}`;
    bar.append(barTitle);
    svg.append(bar);

    if (index % 5 === 0 || index === days.length - 1) {
      const dateLabel = document.createElementNS(namespace, 'text');
      dateLabel.setAttribute('x', String(margin.left + index * slotWidth + slotWidth / 2));
      dateLabel.setAttribute('y', String(height - 12));
      dateLabel.setAttribute('text-anchor', 'middle');
      dateLabel.setAttribute('class', 'rhythm-chart-axis-label');
      dateLabel.textContent = day.label;
      svg.append(dateLabel);
    }
  });

  chartContainer.append(svg);
}

async function renderCaptureGallery() {
  const renderId = ++captureRenderId;
  revokePhotoObjectUrls();
  captureGallery.replaceChildren();
  captureStatus.textContent = 'Loading your private photos…';

  try {
    const photos = await getPrivatePhotos();
    if (renderId !== captureRenderId) return;

    const entriesById = new Map(entries.map((entry) => [String(entry.id), entry]));
    const savedPhotos = photos
      .filter((photo) => entriesById.has(String(photo.entryId)))
      .sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));

    if (savedPhotos.length === 0) {
      captureStatus.textContent = entries.length
        ? 'No photos yet. Add one when you create a diary log.'
        : 'Create a diary log with a photo to start your private gallery.';
      return;
    }

    captureStatus.textContent = `${savedPhotos.length} private ${savedPhotos.length === 1 ? 'photo' : 'photos'} on this device.`;
    for (const photo of savedPhotos) {
      const card = document.createElement('article');
      card.className = 'capture-card';
      const image = document.createElement('img');
      const objectUrl = URL.createObjectURL(photo.blob);
      photoObjectUrls.add(objectUrl);
      image.src = objectUrl;
      image.alt = `Private diary photo from ${parseDateKey(photo.date).toLocaleDateString()}`;
      image.loading = 'lazy';

      const details = document.createElement('div');
      details.className = 'capture-card-details';
      const date = document.createElement('p');
      date.className = 'capture-card-date';
      date.textContent = parseDateKey(photo.date).toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
      const time = document.createElement('p');
      time.className = 'capture-card-time';
      time.textContent = formatTime(photo.time);
      details.append(date, time);

      if (photo.note) {
        const note = document.createElement('p');
        note.className = 'capture-card-note';
        note.textContent = photo.note;
        details.append(note);
      }

      const actions = document.createElement('div');
      actions.className = 'capture-card-actions';
      const viewLogButton = document.createElement('button');
      viewLogButton.type = 'button';
      viewLogButton.className = 'tourist-card-action';
      viewLogButton.textContent = 'View diary log';
      viewLogButton.addEventListener('click', () => {
        selectedDate = parseDateKey(photo.date);
        displayedMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
        selectTab(calendarTab);
        renderAll();
      });

      const deletePhotoButton = document.createElement('button');
      deletePhotoButton.type = 'button';
      deletePhotoButton.className = 'tourist-card-action';
      deletePhotoButton.textContent = 'Remove photo';
      deletePhotoButton.addEventListener('click', async () => {
        if (!window.confirm('Remove this private photo? The diary log will stay.')) return;
        deletePhotoButton.disabled = true;
        try {
          await deletePrivatePhoto(photo.entryId);
          await renderCaptureGallery();
          showToast('Private photo removed.');
        } catch (error) {
          deletePhotoButton.disabled = false;
          console.error('Could not remove private diary photo:', error);
          showToast(error.message || 'Could not remove this photo.');
        }
      });
      actions.append(viewLogButton, deletePhotoButton);
      details.append(actions);
      card.append(image, details);
      captureGallery.append(card);
    }
  } catch (error) {
    if (renderId !== captureRenderId) return;
    console.error('Could not load private diary photos:', error);
    captureStatus.textContent = error.message || 'Could not load private photos.';
  }
}

function renderAll() {
  renderCalendar();
  renderSelectedDay();
  renderStats();
  renderTouristVisits();
  if (!capturePanel.hidden) void renderCaptureGallery();
}

function getVisibleTouristVisits() {
  return currentUser && getAuthToken() ? communityTouristVisits : touristVisits;
}

async function refreshCommunityTouristVisits() {
  if (!currentUser || !getAuthToken()) return;

  try {
    const result = await apiRequest('/api/entries/tourist/community');
    communityTouristVisits = Array.isArray(result.visits) ? result.visits : [];
    renderTouristVisits();
  } catch (error) {
    showToast(error.message || 'Could not refresh community visits.');
  }
}

function hasMapCoordinates(visit) {
  return Number.isFinite(visit.latitude) && visit.latitude >= -90 && visit.latitude <= 90 &&
    Number.isFinite(visit.longitude) && visit.longitude >= -180 && visit.longitude <= 180;
}

function getTouristMapsUrl(visit) {
  const destination = hasMapCoordinates(visit)
    ? `${visit.latitude},${visit.longitude}`
    : visit.location;
  const query = new URLSearchParams({ api: '1', destination });
  return `https://www.google.com/maps/dir/?${query}`;
}

function createTouristMapsLink(visit, label, className = '') {
  const link = document.createElement('a');
  link.href = getTouristMapsUrl(visit);
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = label;
  if (className) link.className = className;
  return link;
}

async function findTouristCoordinates(location) {
  const wait = Math.max(0, 1000 - (Date.now() - lastGeocodeRequestAt));
  if (wait) await new Promise((resolve) => window.setTimeout(resolve, wait));
  lastGeocodeRequestAt = Date.now();

  const query = new URLSearchParams({ q: location, format: 'jsonv2', limit: '1' });
  const response = await fetch(`https://nominatim.openstreetmap.org/search?${query}`, {
    headers: { Accept: 'application/json' }
  });
  if (!response.ok) {
    throw new Error(`Place lookup failed (${response.status}).`);
  }

  const results = await response.json();
  if (!Array.isArray(results) || results.length === 0) return null;

  const latitude = Number(results[0].lat);
  const longitude = Number(results[0].lon);
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90 ||
      !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    throw new Error('Place lookup returned invalid coordinates.');
  }
  return { latitude, longitude };
}

function formatTouristPlace(feature) {
  const properties = feature?.properties || {};
  const coordinates = feature?.geometry?.coordinates;
  if (!Array.isArray(coordinates) || coordinates.length < 2) return null;

  const longitude = Number(coordinates[0]);
  const latitude = Number(coordinates[1]);
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90 ||
      !Number.isFinite(longitude) || longitude < -180 || longitude > 180) return null;

  const name = String(properties.name || '').trim();
  const street = [properties.housenumber, properties.street].filter(Boolean).join(' ');
  const locality = properties.city || properties.town || properties.village ||
    properties.district || properties.county;
  const details = [street, locality, properties.state, properties.country]
    .map((part) => String(part || '').trim())
    .filter((part, index, parts) => part && parts.findIndex((item) => item.toLowerCase() === part.toLowerCase()) === index);
  const label = (name
    ? `${name}${details.length ? `, ${details.join(', ')}` : ''}`
    : details.join(', ')).slice(0, 100);
  if (!label) return null;

  return { label, latitude, longitude };
}

function clearTouristLocationSuggestions() {
  if (touristSuggestionTimeout !== null) {
    window.clearTimeout(touristSuggestionTimeout);
    touristSuggestionTimeout = null;
  }
  touristSuggestionRequest?.abort();
  touristSuggestionRequest = null;
  touristSuggestionRequestId += 1;
  touristSuggestionItems = [];
  activeTouristSuggestionIndex = -1;
  touristLocationSuggestions.replaceChildren();
  touristLocationSuggestions.hidden = true;
  touristLocation.setAttribute('aria-expanded', 'false');
  touristLocation.removeAttribute('aria-activedescendant');
}

function selectTouristLocationSuggestion(index) {
  const suggestion = touristSuggestionItems[index];
  if (!suggestion) return;

  clearTouristLocationSuggestions();
  touristLocation.value = suggestion.label;
  touristLocation.setCustomValidity('');
  selectedTouristCoordinates = {
    latitude: suggestion.latitude,
    longitude: suggestion.longitude
  };
  touristGeocodeStatus.textContent = 'Place selected. Its map pin will be added when you save.';
}

function renderTouristLocationSuggestions(features) {
  touristSuggestionItems = features
    .map(formatTouristPlace)
    .filter((place) => place !== null)
    .filter((place, index, places) =>
      places.findIndex((item) => item.label.toLowerCase() === place.label.toLowerCase()) === index
    )
    .slice(0, 5);
  touristLocationSuggestions.replaceChildren();
  activeTouristSuggestionIndex = -1;

  for (const [index, place] of touristSuggestionItems.entries()) {
    const option = document.createElement('li');
    option.id = `tourist-location-suggestion-${index}`;
    option.className = 'tourist-location-suggestion';
    option.setAttribute('role', 'option');
    option.setAttribute('aria-selected', 'false');
    option.textContent = place.label;
    option.addEventListener('mousedown', (event) => event.preventDefault());
    option.addEventListener('click', () => selectTouristLocationSuggestion(index));
    touristLocationSuggestions.append(option);
  }

  const hasSuggestions = touristSuggestionItems.length > 0;
  touristLocationSuggestions.hidden = !hasSuggestions;
  touristLocation.setAttribute('aria-expanded', String(hasSuggestions));
  touristGeocodeStatus.textContent = hasSuggestions
    ? 'Choose a suggested place, or keep typing.'
    : 'No matching places found. You can still save this location.';
}

function searchTouristLocationSuggestions(query) {
  clearTouristLocationSuggestions();
  selectedTouristCoordinates = null;
  touristGeocodeStatus.textContent = '';
  if (query.length < 3) return;

  const requestId = touristSuggestionRequestId;
  touristSuggestionTimeout = window.setTimeout(async () => {
    const controller = new AbortController();
    touristSuggestionRequest = controller;
    touristGeocodeStatus.textContent = 'Searching places…';
    try {
      const params = new URLSearchParams({ q: query, limit: '5' });
      const response = await fetch(`https://photon.komoot.io/api/?${params}`, {
        headers: { Accept: 'application/json' },
        signal: controller.signal
      });
      if (!response.ok) throw new Error(`Place suggestions failed (${response.status}).`);

      const result = await response.json();
      if (requestId !== touristSuggestionRequestId) return;
      renderTouristLocationSuggestions(Array.isArray(result.features) ? result.features : []);
    } catch (error) {
      if (error.name === 'AbortError' || requestId !== touristSuggestionRequestId) return;
      console.error('Toilet Tourist place suggestions failed:', error);
      touristGeocodeStatus.textContent = 'Place suggestions are unavailable. You can still enter the location manually.';
    } finally {
      if (requestId === touristSuggestionRequestId) touristSuggestionRequest = null;
    }
  }, 300);
}

function updateActiveTouristSuggestion(index) {
  if (touristSuggestionItems.length === 0) return;
  activeTouristSuggestionIndex = (index + touristSuggestionItems.length) % touristSuggestionItems.length;
  touristLocationSuggestions.querySelectorAll('[role="option"]').forEach((option, optionIndex) => {
    const isActive = optionIndex === activeTouristSuggestionIndex;
    option.setAttribute('aria-selected', String(isActive));
  });
  touristLocation.setAttribute(
    'aria-activedescendant',
    `tourist-location-suggestion-${activeTouristSuggestionIndex}`
  );
}

function renderTouristMap() {
  const visibleVisits = getVisibleTouristVisits();
  const mappedVisits = visibleVisits.filter(hasMapCoordinates);
  touristMapDescription.textContent = currentUser && getAuthToken()
    ? 'Explore places and reviews shared by signed-in users.'
    : 'Your guest map is only visible on this device. Sign in to browse community places and reviews.';

  if (typeof L === 'undefined') {
    touristMapElement.hidden = true;
    touristMapStatus.hidden = false;
    touristMapStatus.textContent = 'The map could not load. Check your internet connection and refresh the page.';
    return;
  }

  if (mappedVisits.length === 0) {
    touristMapElement.hidden = true;
    touristMapStatus.hidden = false;
    touristMapStatus.textContent = visibleVisits.length
      ? 'No saved visits have a mapped location yet. Edit a visit and save its place again to add it to the map.'
      : currentUser && getAuthToken()
        ? 'No community visits have map pins yet. Add a visit with a recognizable place or address.'
        : 'Sign in to browse community visits. Guest visits stay on this device.';
    if (touristMapMarkers) touristMapMarkers.clearLayers();
    return;
  }

  touristMapStatus.hidden = true;
  if (touristPanel.hidden) {
    touristMapElement.hidden = true;
    return;
  }
  touristMapElement.hidden = false;

  if (!touristMap) {
    touristMap = L.map(touristMapElement, { scrollWheelZoom: false });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(touristMap);
    touristMapMarkers = L.layerGroup().addTo(touristMap);
  }

  touristMapMarkers.clearLayers();
  const markerBounds = [];
  for (const visit of mappedVisits) {
    const coordinates = [visit.latitude, visit.longitude];
    markerBounds.push(coordinates);

    const popup = document.createElement('div');
    const location = createTouristMapsLink(visit, visit.location);
    const locationHeading = document.createElement('strong');
    locationHeading.append(location);
    const date = document.createElement('p');
    date.textContent = parseDateKey(visit.date).toLocaleDateString(undefined, {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    const author = document.createElement('p');
    author.textContent = visit.author ? `Logged by ${visit.author}` : 'Your guest visit';
    const review = document.createElement('p');
    const average = getTouristAverageRating(visit.ratings || {});
    review.textContent = `${average.toFixed(1)}/5 flys · ${getTouristAverageLabel(average)}`;
    popup.append(locationHeading, date, author, review);
    if (visit.note) {
      const note = document.createElement('p');
      note.textContent = visit.note;
      popup.append(note);
    }
    L.marker(coordinates).bindPopup(popup).addTo(touristMapMarkers);
  }

  touristMap.fitBounds(markerBounds, { padding: [28, 28], maxZoom: 14 });
  window.requestAnimationFrame(() => touristMap.invalidateSize());
}

function renderTouristVisits() {
  touristList.replaceChildren();
  touristSharingNotice.hidden = !currentUser || !getAuthToken();
  renderTouristMap();
  const sortedVisits = [...getVisibleTouristVisits()].sort((a, b) =>
    b.date.localeCompare(a.date) || String(b.id).localeCompare(String(a.id))
  );

  if (sortedVisits.length === 0) {
    const emptyState = document.createElement('p');
    emptyState.className = 'tourist-empty';
    emptyState.textContent = currentUser && getAuthToken()
      ? 'No community visits yet. Be the first to log a bathroom visit.'
      : 'No pit stops logged yet. Sign in to share visits and browse the community map.';
    touristList.append(emptyState);
    return;
  }

  for (const visit of sortedVisits) {
    const card = document.createElement('article');
    card.className = 'tourist-card';

    const date = document.createElement('p');
    date.className = 'tourist-visit-date';
    date.textContent = parseDateKey(visit.date).toLocaleDateString(undefined, {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    const location = document.createElement('h3');
    location.className = 'tourist-visit-location';
    location.append(createTouristMapsLink(visit, visit.location, 'tourist-visit-map-link'));
    card.append(date, location);

    const author = document.createElement('p');
    author.className = 'tourist-visit-author';
    author.textContent = visit.author ? `Logged by ${visit.author}` : 'Your guest visit';
    card.append(author);

    const average = getTouristAverageRating(visit.ratings || {});
    const rating = document.createElement('div');
    rating.className = 'tourist-visit-rating';
    const flies = document.createElement('span');
    flies.className = 'tourist-rating-stars';
    flies.setAttribute('aria-label', `${average} out of 5 flys`);
    const flyCount = Math.max(0, Math.min(5, Math.round(average)));
    for (let index = 0; index < 5; index += 1) {
      const flyIcon = document.createElement('img');
      flyIcon.src = 'assets/images/fly-doodle.jpg';
      flyIcon.alt = '';
      flyIcon.className = index < flyCount ? 'tourist-fly-icon is-active' : 'tourist-fly-icon';
      flyIcon.setAttribute('aria-hidden', 'true');
      flies.append(flyIcon);
    }
    const label = document.createElement('span');
    label.textContent = `${average.toFixed(1)}/5 flys · ${getTouristAverageLabel(average)}`;
    rating.append(flies, label);
    card.append(rating);

    const categoryList = document.createElement('ul');
    categoryList.className = 'tourist-visit-category-list';
    for (const category of touristRatingCategories) {
      const item = document.createElement('li');
      item.className = 'tourist-visit-category-item';
      item.innerHTML = `<span>${category.label}</span><strong>${getTouristCategoryRating(visit.ratings || {}, category)}/5 flys</strong>`;
      categoryList.append(item);
    }
    card.append(categoryList);

    if (visit.note) {
      const note = document.createElement('p');
      note.className = 'tourist-visit-note';
      note.textContent = visit.note;
      card.append(note);
    }

    if (!currentUser || !getAuthToken() || visit.isOwn) {
      const actionRow = document.createElement('div');
      actionRow.className = 'tourist-card-actions';

      const editButton = document.createElement('button');
      editButton.className = 'tourist-card-action';
      editButton.type = 'button';
      editButton.textContent = 'Edit';
      editButton.addEventListener('click', () => openTouristDialog(visit));

      const deleteButton = document.createElement('button');
      deleteButton.className = 'delete-entry tourist-delete';
      deleteButton.type = 'button';
      deleteButton.textContent = '×';
      deleteButton.setAttribute('aria-label', `Delete visit to ${visit.location}`);
      deleteButton.addEventListener('click', () => deleteTouristVisit(visit.id));

      actionRow.append(editButton, deleteButton);
      card.append(actionRow);
    }
    touristList.append(card);
  }
}

function selectTab(selectedTab) {
  for (const { tab, panel } of diaryTabs) {
    const isSelected = tab === selectedTab;
    tab.classList.toggle('is-active', isSelected);
    tab.setAttribute('aria-selected', String(isSelected));
    tab.tabIndex = isSelected ? 0 : -1;
    panel.hidden = !isSelected;
  }

  if (selectedTab === touristTab) {
    renderTouristVisits();
    void refreshCommunityTouristVisits();
  }
  if (selectedTab === captureTab) void renderCaptureGallery();
}

function openLogDialog() {
  dialogDate.textContent = selectedDate.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  const now = new Date();
  logTime.value = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  logNote.value = '';
  logPhoto.value = '';
  logPhoto.setCustomValidity('');
  logForm.querySelectorAll('input[name="stool-type"]').forEach((input) => {
    input.checked = false;
  });
  logDialog.showModal();
  logTime.focus();
}

function openTouristDialog(visit = null) {
  clearTouristLocationSuggestions();
  selectedTouristCoordinates = null;
  touristForm.reset();
  touristGeocodeStatus.textContent = '';
  editingTouristVisitId = visit ? visit.id : null;
  touristDialogTitle.textContent = visit ? 'Edit bathroom visit' : 'Log a bathroom visit';
  touristDate.value = visit ? visit.date : dateKey(new Date());
  touristLocation.value = visit ? (visit.location || '') : '';
  touristNote.value = visit ? (visit.note || '') : '';

  touristCategoryRatings.querySelectorAll('input[type="radio"]').forEach((input) => {
    const category = input.dataset.category;
    const rating = visit ? (visit.ratings?.[category] ?? 3) : 3;
    input.checked = Number(input.value) === Number(rating);
  });

  updateTouristRatingHelp();
  touristDialog.showModal();
  touristLocation.focus();
}

async function deleteEntry(id) {
  if (!window.confirm('Delete this log? This cannot be undone.')) return;

  if (currentUser && getAuthToken()) {
    try {
      await apiRequest(`/api/entries/diary/${id}`, { method: 'DELETE' });
      entries = entries.filter((entry) => entry.id !== id);
      let photoRemoved = true;
      try {
        await deletePrivatePhoto(id);
      } catch (error) {
        photoRemoved = false;
        console.error('Could not remove the deleted diary log photo:', error);
      }
      renderAll();
      showToast(photoRemoved
        ? 'Log deleted.'
        : 'Log deleted, but its private photo could not be removed from this browser.');
      return;
    } catch (error) {
      showToast(error.message || 'Could not delete this log.');
      return;
    }
  }

  entries = entries.filter((entry) => entry.id !== id);
  const saved = saveEntries();
  let photoRemoved = true;
  try {
    await deletePrivatePhoto(id);
  } catch (error) {
    photoRemoved = false;
    console.error('Could not remove the deleted diary log photo:', error);
  }
  renderAll();
  if (saved) {
    showToast(photoRemoved
      ? 'Log deleted.'
      : 'Log deleted, but its private photo could not be removed from this browser.');
  }
}

async function deleteTouristVisit(id) {
  if (!window.confirm('Delete this Toilet Tourist visit? This cannot be undone.')) return;

  if (currentUser && getAuthToken()) {
    try {
      await apiRequest(`/api/entries/tourist/${id}`, { method: 'DELETE' });
      touristVisits = touristVisits.filter((visit) => visit.id !== id);
      communityTouristVisits = communityTouristVisits.filter((visit) => visit.id !== id);
      renderTouristVisits();
      showToast('Toilet Tourist visit deleted.');
      return;
    } catch (error) {
      showToast(error.message || 'Could not delete this visit.');
      return;
    }
  }

  touristVisits = touristVisits.filter((visit) => visit.id !== id);
  communityTouristVisits = communityTouristVisits.filter((visit) => visit.id !== id);
  const saved = saveTouristVisits();
  renderTouristVisits();
  if (saved) showToast('Toilet Tourist visit deleted.');
}

previousButton.addEventListener('click', () => {
  displayedMonth = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() - 1, 1);
  selectedDate = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth(), 1);
  renderAll();
});

nextButton.addEventListener('click', () => {
  displayedMonth = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() + 1, 1);
  selectedDate = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth(), 1);
  renderAll();
});

todayButton.addEventListener('click', () => {
  displayedMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  selectedDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  renderAll();
});

addLogButton.addEventListener('click', openLogDialog);
captureAddLogButton.addEventListener('click', () => {
  selectTab(calendarTab);
  openLogDialog();
});
document.getElementById('dialog-close').addEventListener('click', () => logDialog.close());
document.getElementById('cancel-log').addEventListener('click', () => logDialog.close());
calendarTab.addEventListener('click', () => selectTab(calendarTab));
touristTab.addEventListener('click', () => selectTab(touristTab));
rhythmTab.addEventListener('click', () => selectTab(rhythmTab));
captureTab.addEventListener('click', () => selectTab(captureTab));
for (const { tab } of diaryTabs) {
  tab.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const currentIndex = diaryTabs.findIndex((item) => item.tab === tab);
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const nextIndex = (currentIndex + direction + diaryTabs.length) % diaryTabs.length;
    const nextTab = diaryTabs[nextIndex].tab;
    selectTab(nextTab);
    nextTab.focus();
  });
}

openAuthButton.addEventListener('click', openAuthDialog);
logoutButton.addEventListener('click', handleLogout);

document.getElementById('auth-dialog-close').addEventListener('click', () => authDialog.close());
document.getElementById('auth-cancel').addEventListener('click', () => authDialog.close());
toggleAuthModeButton.addEventListener('click', () => {
  setAuthMode(authMode === 'login' ? 'signup' : 'login');
  setAuthError('');
  authUsername.focus();
});
authUsername.addEventListener('input', () => setAuthError(''));
authPassword.addEventListener('input', () => setAuthError(''));
authForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const username = authUsername.value.trim();
  const password = authPassword.value;

  setAuthError('');

  if (!username) {
    setAuthError('Choose a username.');
    authUsername.focus();
    return;
  }

  if (password.length < 8) {
    setAuthError('Password must be at least 8 characters.');
    authPassword.focus();
    return;
  }

  try {
    const path = authMode === 'signup' ? '/api/auth/signup' : '/api/auth/login';
    const response = await apiRequest(path, {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });

    saveAuthToken(response.token);
    localStorage.setItem(currentUserKey, response.user.username);
    currentUser = response.user.username;
    entries = [];
    touristVisits = [];
    communityTouristVisits = [];
    renderAuthState();
    authDialog.close();
    await loadUserDataFromApi();
    showToast(authMode === 'signup' ? `Welcome, ${response.user.username}!` : `Welcome back, ${response.user.username}!`);
  } catch (error) {
    setAuthError(error.message || 'Unable to sign in.');
    authPassword.focus();
  }
});

document.getElementById('add-tourist-log').addEventListener('click', () => openTouristDialog());
document.getElementById('tourist-dialog-close').addEventListener('click', () => {
  editingTouristVisitId = null;
  touristDialog.close();
});
document.getElementById('tourist-cancel').addEventListener('click', () => {
  editingTouristVisitId = null;
  touristDialog.close();
});
touristDialog.addEventListener('close', clearTouristLocationSuggestions);

touristForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  touristLocation.setCustomValidity(touristLocation.value.trim() ? '' : 'Enter a bathroom location.');
  if (!touristForm.reportValidity()) return;
  const saveButton = touristForm.querySelector('button[type="submit"]');
  saveButton.disabled = true;

  const ratings = touristRatingCategories.reduce((accumulator, category) => {
    const selectedRating = touristForm.querySelector(`input[name="tourist-${category.key}"]:checked`);
    accumulator[category.key] = getTouristRatingFromValue(selectedRating?.value ?? 3);
    return accumulator;
  }, {});

  try {
    const location = touristLocation.value.trim();
    const existingVisit = touristVisits.find((visit) => visit.id === editingTouristVisitId);
    let coordinates = selectedTouristCoordinates
      ? { ...selectedTouristCoordinates }
      : existingVisit?.location === location && hasMapCoordinates(existingVisit)
      ? { latitude: existingVisit.latitude, longitude: existingVisit.longitude }
      : null;
    let lookupWarning = '';

    if (!coordinates) {
      touristGeocodeStatus.textContent = 'Looking up this place for the map…';
      try {
        coordinates = await findTouristCoordinates(location);
        if (!coordinates) lookupWarning = 'This place was not found, so it has no map pin.';
      } catch (error) {
        console.error('Toilet Tourist place lookup failed:', error);
        lookupWarning = 'The place lookup failed, so it has no map pin.';
      }
      touristGeocodeStatus.textContent = lookupWarning;
    }

    const payload = {
      date: touristDate.value,
      location,
      note: touristNote.value.trim(),
      rating: ratings,
      latitude: coordinates?.latitude ?? null,
      longitude: coordinates?.longitude ?? null
    };
    let savedMessage;

    if (currentUser && getAuthToken()) {
      const path = editingTouristVisitId ? `/api/entries/tourist/${editingTouristVisitId}` : '/api/entries/tourist';
      const method = editingTouristVisitId ? 'PUT' : 'POST';
      const savedVisit = await apiRequest(path, {
        method,
        body: JSON.stringify(payload)
      });
      const communityVisit = { ...savedVisit, author: currentUser, isOwn: true };

      if (editingTouristVisitId) {
        touristVisits = touristVisits.map((visit) => (visit.id === editingTouristVisitId ? savedVisit : visit));
        communityTouristVisits = communityTouristVisits.map((visit) =>
          visit.id === savedVisit.id ? communityVisit : visit
        );
        savedMessage = 'Toilet Tourist visit updated.';
      } else {
        touristVisits.push(savedVisit);
        communityTouristVisits.push(communityVisit);
        savedMessage = 'Toilet Tourist visit added.';
      }

      editingTouristVisitId = null;
      touristDialog.close();
      renderTouristVisits();
      showToast(`${savedMessage}${lookupWarning ? ` ${lookupWarning}` : ''}`);
      return;
    }

    if (editingTouristVisitId) {
      touristVisits = touristVisits.map((visit) => visit.id === editingTouristVisitId ? {
        ...visit,
        ...payload,
        ratings
      } : visit);
      savedMessage = 'Toilet Tourist visit updated.';
    } else {
      touristVisits.push({
        id: crypto.randomUUID(),
        ...payload,
        ratings
      });
      savedMessage = 'Toilet Tourist visit added.';
    }

    const saved = saveTouristVisits();
    editingTouristVisitId = null;
    touristDialog.close();
    renderTouristVisits();
    if (!saved) showToast('This update is visible for now, but browser storage may not keep it.');
    else showToast(`${savedMessage}${lookupWarning ? ` ${lookupWarning}` : ''}`);
  } catch (error) {
    showToast(error.message || 'Could not save this bathroom visit.');
  } finally {
    saveButton.disabled = false;
  }
});

touristLocation.addEventListener('input', () => {
  touristLocation.setCustomValidity('');
  searchTouristLocationSuggestions(touristLocation.value.trim());
});
touristLocation.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowDown' && touristSuggestionItems.length) {
    event.preventDefault();
    updateActiveTouristSuggestion(activeTouristSuggestionIndex + 1);
  } else if (event.key === 'ArrowUp' && touristSuggestionItems.length) {
    event.preventDefault();
    updateActiveTouristSuggestion(
      activeTouristSuggestionIndex < 0
        ? touristSuggestionItems.length - 1
        : activeTouristSuggestionIndex - 1
    );
  } else if (event.key === 'Enter' && activeTouristSuggestionIndex >= 0) {
    event.preventDefault();
    selectTouristLocationSuggestion(activeTouristSuggestionIndex);
  } else if (event.key === 'Escape' && !touristLocationSuggestions.hidden) {
    event.preventDefault();
    clearTouristLocationSuggestions();
    touristGeocodeStatus.textContent = '';
  }
});
touristLocation.addEventListener('blur', () => {
  clearTouristLocationSuggestions();
  if (touristGeocodeStatus.textContent === 'Searching places…') {
    touristGeocodeStatus.textContent = '';
  }
});

logPhoto.addEventListener('change', () => {
  const file = logPhoto.files?.[0];
  const error = !file
    ? ''
    : !file.type.startsWith('image/')
      ? 'Choose an image file.'
      : file.size > maxPhotoSize
        ? 'Choose an image smaller than 8 MB.'
        : '';
  logPhoto.setCustomValidity(error);
  if (error) {
    showToast(error);
    logPhoto.value = '';
    logPhoto.setCustomValidity('');
  }
});

logForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!logForm.reportValidity()) return;
  const photoFile = logPhoto.files?.[0] || null;

  const selectedStoolTypes = Array.from(logForm.querySelectorAll('input[name="stool-type"]:checked'))
    .map((input) => input.value)
    .filter((value) => value !== 'none');

  const payload = {
    date: dateKey(selectedDate),
    time: logTime.value,
    note: logNote.value.trim(),
    stoolType: serializeStoolType(selectedStoolTypes)
  };

  try {
    if (currentUser && getAuthToken()) {
      const savedEntry = await apiRequest('/api/entries/diary', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      entries.push(savedEntry);
      let photoSaved = true;
      if (photoFile) {
        try {
          await savePrivatePhoto(savedEntry, photoFile);
        } catch (error) {
          photoSaved = false;
          console.error('Diary log saved, but its private photo could not be saved:', error);
        }
      }
      logDialog.close();
      renderAll();
      if (photoFile && !photoSaved) {
        showToast('Your log was saved, but its photo could not be saved in this browser.');
      } else {
        showToast(photoFile ? 'Your log and private photo have been saved.' : 'Your log has been added.');
      }
      if (photoSaved && photoFile) selectTab(captureTab);
      return;
    }

    const entry = {
      id: crypto.randomUUID(),
      date: payload.date,
      time: payload.time,
      note: payload.note,
      stoolType: payload.stoolType
    };
    entries.push(entry);
    const saved = saveEntries();
    let photoSaved = true;
    if (photoFile && saved) {
      try {
        await savePrivatePhoto(entry, photoFile);
      } catch (error) {
        photoSaved = false;
        console.error('Diary log saved, but its private photo could not be saved:', error);
      }
    } else if (photoFile) {
      photoSaved = false;
    }
    logDialog.close();
    renderAll();
    if (saved && photoFile && !photoSaved) {
      showToast('Your log was saved, but its photo could not be saved in this browser.');
    } else if (saved) {
      showToast(photoFile ? 'Your log and private photo have been saved.' : 'Your log has been added.');
    }
    if (saved && photoSaved && photoFile) selectTab(captureTab);
  } catch (error) {
    showToast(error.message || 'Could not save your log.');
  }
});

renderAuthState();
updateTouristRatingHelp();
renderAll();
if (getAuthToken()) {
  syncUserSession();
}
