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
const dialogDate = document.getElementById('dialog-date');
const toast = document.getElementById('toast');
const storageKey = 'daily-poop-calendar-entries';
const touristStorageKey = 'dookie-diary-toilet-tourist-visits';
const calendarTab = document.getElementById('calendar-tab');
const touristTab = document.getElementById('toilet-tourist-tab');
const calendarPanel = document.getElementById('calendar-panel');
const touristPanel = document.getElementById('toilet-tourist-panel');
const touristDialog = document.getElementById('tourist-dialog');
const touristForm = document.getElementById('tourist-form');
const touristDate = document.getElementById('tourist-date');
const touristLocation = document.getElementById('tourist-location');
const touristNote = document.getElementById('tourist-note');
const touristRatingHelp = document.getElementById('tourist-rating-help');
const touristCategoryRatings = document.getElementById('tourist-category-ratings');
const touristList = document.getElementById('tourist-list');
const touristRatingCategories = [
  { key: 'ambience', label: 'Ambience' },
  { key: 'cleanliness', label: 'Cleanliness' },
  { key: 'smell', label: 'Pre-poo smell' },
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
let entries = loadEntries();
let touristStorageAvailable = true;
let touristVisits = loadTouristVisits();
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

function loadEntries() {
  let stored;
  try {
    stored = localStorage.getItem(storageKey);
  } catch {
    storageAvailable = false;
    window.setTimeout(() => showToast('Browser storage is unavailable. New logs may not be saved.'), 0);
    return [];
  }

  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed) || parsed.some((entry) =>
      !entry || typeof entry.id !== 'string' || typeof entry.date !== 'string' ||
      typeof entry.time !== 'string' || typeof entry.note !== 'string' ||
      (entry.stoolType !== undefined && entry.stoolType !== null &&
        (typeof entry.stoolType !== 'string' || !stoolTypes.has(entry.stoolType)))
    )) {
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
    localStorage.setItem(storageKey, JSON.stringify(entries));
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

function getTouristAverageRating(ratings) {
  const categoryRatings = touristRatingCategories
    .map((category) => getTouristRatingFromValue(ratings?.[category.key] ?? 3));
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
    stored = localStorage.getItem(touristStorageKey);
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

      if (!visit.ratings || typeof visit.ratings !== 'object') return true;
      return touristRatingCategories.some((category) => {
        const rating = visit.ratings[category.key] ?? 3;
        return !Number.isInteger(rating) || rating < 1 || rating > 5;
      });
    })) {
      throw new TypeError('Saved Toilet Tourist visits have an unexpected format.');
    }

    return parsed.map((visit) => ({
      ...visit,
      ratings: touristRatingCategories.reduce((accumulator, category) => {
        accumulator[category.key] = getTouristRatingFromValue(visit.ratings?.[category.key] ?? 3);
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
    localStorage.setItem(touristStorageKey, JSON.stringify(touristVisits));
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

    const stoolType = entry.stoolType ? stoolTypes.get(entry.stoolType) : null;
    if (stoolType) {
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
  const sortedEntries = [...entries].sort((a, b) =>
    b.date.localeCompare(a.date) || b.time.localeCompare(a.time)
  );
  const latest = sortedEntries[0];
  const lastLogged = document.getElementById('last-logged');
  const lastCaption = document.getElementById('last-caption');

  if (!latest) {
    lastLogged.textContent = '—';
    lastCaption.textContent = 'Your latest entry';
  } else {
    const latestDate = parseDateKey(latest.date);
    const dayDifference = Math.round((new Date(today.getFullYear(), today.getMonth(), today.getDate()) - latestDate) / 86400000);
    lastLogged.textContent = dayDifference === 0
      ? 'Today'
      : dayDifference === 1
        ? 'Yesterday'
        : latestDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    lastCaption.textContent = formatTime(latest.time);
  }

  const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  const weekStart = dateKey(monday);
  const weekCount = entries.filter((entry) => entry.date >= weekStart && entry.date <= dateKey(today)).length;
  document.getElementById('week-count').textContent = weekCount;
  document.getElementById('week-unit').textContent = weekCount === 1 ? ' log' : ' logs';

  const loggedDays = [...new Set(entries.map((entry) => entry.date))].sort();
  const rhythm = document.getElementById('rhythm');
  const rhythmCaption = document.getElementById('rhythm-caption');
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

function renderAll() {
  renderCalendar();
  renderSelectedDay();
  renderStats();
}

function renderTouristVisits() {
  touristList.replaceChildren();
  const sortedVisits = [...touristVisits].sort((a, b) =>
    b.date.localeCompare(a.date) || b.id.localeCompare(a.id)
  );

  if (sortedVisits.length === 0) {
    const emptyState = document.createElement('p');
    emptyState.className = 'tourist-empty';
    emptyState.textContent = 'No pit stops logged yet. Add a visit when you find a bathroom away from home.';
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
    location.textContent = visit.location;
    card.append(date, location);

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
      item.innerHTML = `<span>${category.label}</span><strong>${getTouristRatingFromValue(visit.ratings?.[category.key] ?? 3)}/5 flys</strong>`;
      categoryList.append(item);
    }
    card.append(categoryList);

    if (visit.note) {
      const note = document.createElement('p');
      note.className = 'tourist-visit-note';
      note.textContent = visit.note;
      card.append(note);
    }

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-entry tourist-delete';
    deleteButton.type = 'button';
    deleteButton.textContent = '×';
    deleteButton.setAttribute('aria-label', `Delete visit to ${visit.location}`);
    deleteButton.addEventListener('click', () => deleteTouristVisit(visit.id));
    card.append(deleteButton);
    touristList.append(card);
  }
}

function selectTab(selectedTab) {
  const isTouristTab = selectedTab === touristTab;
  calendarTab.classList.toggle('is-active', !isTouristTab);
  touristTab.classList.toggle('is-active', isTouristTab);
  calendarTab.setAttribute('aria-selected', String(!isTouristTab));
  touristTab.setAttribute('aria-selected', String(isTouristTab));
  calendarTab.tabIndex = isTouristTab ? -1 : 0;
  touristTab.tabIndex = isTouristTab ? 0 : -1;
  calendarPanel.hidden = isTouristTab;
  touristPanel.hidden = !isTouristTab;
  if (isTouristTab) renderTouristVisits();
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
  logForm.querySelectorAll('input[name="stool-type"]').forEach((input) => {
    input.checked = false;
  });
  logDialog.showModal();
  logTime.focus();
}

function openTouristDialog() {
  touristForm.reset();
  touristDate.value = dateKey(new Date());
  touristCategoryRatings.querySelectorAll('input[type="radio"]').forEach((input) => {
    input.checked = input.value === '3';
  });
  updateTouristRatingHelp();
  touristDialog.showModal();
  touristLocation.focus();
}

function deleteEntry(id) {
  if (!window.confirm('Delete this log? This cannot be undone.')) return;
  entries = entries.filter((entry) => entry.id !== id);
  const saved = saveEntries();
  renderAll();
  if (saved) showToast('Log deleted.');
}

function deleteTouristVisit(id) {
  if (!window.confirm('Delete this Toilet Tourist visit? This cannot be undone.')) return;
  touristVisits = touristVisits.filter((visit) => visit.id !== id);
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
document.getElementById('dialog-close').addEventListener('click', () => logDialog.close());
document.getElementById('cancel-log').addEventListener('click', () => logDialog.close());
calendarTab.addEventListener('click', () => selectTab(calendarTab));
touristTab.addEventListener('click', () => selectTab(touristTab));
for (const tab of [calendarTab, touristTab]) {
  tab.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const nextTab = tab === calendarTab ? touristTab : calendarTab;
    selectTab(nextTab);
    nextTab.focus();
  });
}

document.getElementById('add-tourist-log').addEventListener('click', openTouristDialog);
document.getElementById('tourist-dialog-close').addEventListener('click', () => touristDialog.close());
document.getElementById('tourist-cancel').addEventListener('click', () => touristDialog.close());

touristForm.addEventListener('submit', (event) => {
  event.preventDefault();
  touristLocation.setCustomValidity(touristLocation.value.trim() ? '' : 'Enter a bathroom location.');
  if (!touristForm.reportValidity()) return;

  const ratings = touristRatingCategories.reduce((accumulator, category) => {
    const selectedRating = touristForm.querySelector(`input[name="tourist-${category.key}"]:checked`);
    accumulator[category.key] = getTouristRatingFromValue(selectedRating?.value ?? 3);
    return accumulator;
  }, {});

  touristVisits.push({
    id: crypto.randomUUID(),
    date: touristDate.value,
    location: touristLocation.value.trim(),
    note: touristNote.value.trim(),
    ratings
  });

  touristLocation.addEventListener('input', () => touristLocation.setCustomValidity(''));
  const saved = saveTouristVisits();
  touristDialog.close();
  renderTouristVisits();
  if (saved) showToast('Toilet Tourist visit added.');
});

logForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!logForm.reportValidity()) return;

  const selectedStoolType = logForm.querySelector('input[name="stool-type"]:checked')?.value;
  const entry = {
    id: crypto.randomUUID(),
    date: dateKey(selectedDate),
    time: logTime.value,
    note: logNote.value.trim(),
    stoolType: selectedStoolType && selectedStoolType !== 'none' ? selectedStoolType : null
  };
  entries.push(entry);
  const saved = saveEntries();
  logDialog.close();
  renderAll();
  if (saved) showToast('Your log has been added.');
});

updateTouristRatingHelp();
renderAll();
