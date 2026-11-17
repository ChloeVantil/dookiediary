const express = require('express');
const { all, get, run } = require('../db');
const { requireAuth } = require('../auth');

const router = express.Router();

const parseStoolType = (value) => {
  if (!value) return null;
  if (typeof value !== 'string') return value;

  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed);
      return Array.isArray(parsed) ? parsed : trimmed;
    } catch {
      return trimmed;
    }
  }

  return trimmed;
};

const normalizeDiaryEntry = (row) => ({
  id: row.id,
  date: row.date,
  time: row.time || '',
  note: row.note || '',
  stoolType: parseStoolType(row.stool_type)
});

const normalizeTouristVisit = (row) => ({
  id: row.id,
  date: row.date,
  location: row.location || '',
  note: row.note || '',
  ratings: row.rating_json ? JSON.parse(row.rating_json) : {},
  latitude: row.latitude ?? null,
  longitude: row.longitude ?? null
});

const hasValidCoordinates = (latitude, longitude) => {
  if (latitude == null && longitude == null) return true;
  return Number.isFinite(latitude) && latitude >= -90 && latitude <= 90 &&
    Number.isFinite(longitude) && longitude >= -180 && longitude <= 180;
};

router.use(requireAuth);

router.get('/', async (req, res) => {
  try {
    const rows = await all(
      'SELECT * FROM entries WHERE user_id = ? ORDER BY date DESC, created_at DESC',
      [req.user.id]
    );

    return res.json({
      diaryEntries: rows.filter((entry) => entry.type === 'diary').map(normalizeDiaryEntry),
      touristVisits: rows.filter((entry) => entry.type === 'tourist').map(normalizeTouristVisit)
    });
  } catch (error) {
    console.error('Get entries error:', error);
    return res.status(500).json({ error: 'Could not load entries.' });
  }
});

router.get('/diary', async (req, res) => {
  try {
    const rows = await all(
      'SELECT * FROM entries WHERE user_id = ? AND type = ? ORDER BY date DESC, created_at DESC',
      [req.user.id, 'diary']
    );

    return res.json({ entries: rows.map(normalizeDiaryEntry) });
  } catch (error) {
    console.error('Get diary entries error:', error);
    return res.status(500).json({ error: 'Could not load diary entries.' });
  }
});

router.get('/tourist', async (req, res) => {
  try {
    const rows = await all(
      'SELECT * FROM entries WHERE user_id = ? AND type = ? ORDER BY date DESC, created_at DESC',
      [req.user.id, 'tourist']
    );

    return res.json({ visits: rows.map(normalizeTouristVisit) });
  } catch (error) {
    console.error('Get tourist visits error:', error);
    return res.status(500).json({ error: 'Could not load Toilet Tourist visits.' });
  }
});

router.get('/tourist/community', async (req, res) => {
  try {
    const rows = await all(
      `SELECT entries.*, users.username AS author
       FROM entries
       JOIN users ON users.id = entries.user_id
       WHERE entries.type = ?
       ORDER BY entries.date DESC, entries.created_at DESC`,
      ['tourist']
    );

    return res.json({
      visits: rows.map((row) => ({
        ...normalizeTouristVisit(row),
        author: row.author,
        isOwn: row.user_id === req.user.id
      }))
    });
  } catch (error) {
    console.error('Get community Toilet Tourist visits error:', error);
    return res.status(500).json({ error: 'Could not load community Toilet Tourist visits.' });
  }
});

router.post('/diary', async (req, res) => {
  const { date, time, note, stoolType } = req.body || {};

  if (!date || !time) {
    return res.status(400).json({ error: 'Date and time are required.' });
  }

  const normalizedStoolType = Array.isArray(stoolType)
    ? JSON.stringify(stoolType)
    : (stoolType || null);

  try {
    const result = await run(
      'INSERT INTO entries (user_id, type, date, time, note, stool_type) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, 'diary', date, time, note || '', normalizedStoolType]
    );

    const row = await get('SELECT * FROM entries WHERE id = ?', [result.id]);
    return res.status(201).json(normalizeDiaryEntry(row));
  } catch (error) {
    console.error('Create diary entry error:', error);
    return res.status(500).json({ error: 'Could not save diary entry.' });
  }
});

router.post('/tourist', async (req, res) => {
  const { date, location, note, rating, latitude = null, longitude = null } = req.body || {};

  if (!date || !location) {
    return res.status(400).json({ error: 'Date and location are required.' });
  }
  if (!hasValidCoordinates(latitude, longitude)) {
    return res.status(400).json({ error: 'A valid latitude and longitude pair is required.' });
  }

  try {
    const result = await run(
      'INSERT INTO entries (user_id, type, date, location, note, rating_json, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [req.user.id, 'tourist', date, location.trim(), note || '', JSON.stringify(rating || {}), latitude, longitude]
    );

    const row = await get('SELECT * FROM entries WHERE id = ?', [result.id]);
    return res.status(201).json(normalizeTouristVisit(row));
  } catch (error) {
    console.error('Create tourist visit error:', error);
    return res.status(500).json({ error: 'Could not save Toilet Tourist visit.' });
  }
});

router.put('/tourist/:id', async (req, res) => {
  const { id } = req.params;
  const { date, location, note, rating, latitude = null, longitude = null } = req.body || {};

  if (!date || !location) {
    return res.status(400).json({ error: 'Date and location are required.' });
  }
  if (!hasValidCoordinates(latitude, longitude)) {
    return res.status(400).json({ error: 'A valid latitude and longitude pair is required.' });
  }

  try {
    const existingEntry = await get('SELECT * FROM entries WHERE id = ? AND user_id = ? AND type = ?', [id, req.user.id, 'tourist']);
    if (!existingEntry) {
      return res.status(404).json({ error: 'Toilet Tourist visit not found.' });
    }

    await run(
      'UPDATE entries SET date = ?, location = ?, note = ?, rating_json = ?, latitude = ?, longitude = ? WHERE id = ? AND user_id = ? AND type = ?',
      [date, location.trim(), note || '', JSON.stringify(rating || {}), latitude, longitude, id, req.user.id, 'tourist']
    );

    const row = await get('SELECT * FROM entries WHERE id = ? AND user_id = ? AND type = ?', [id, req.user.id, 'tourist']);
    return res.json(normalizeTouristVisit(row));
  } catch (error) {
    console.error('Update tourist visit error:', error);
    return res.status(500).json({ error: 'Could not update Toilet Tourist visit.' });
  }
});

router.delete('/diary/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const existingEntry = await get('SELECT * FROM entries WHERE id = ? AND user_id = ? AND type = ?', [id, req.user.id, 'diary']);
    if (!existingEntry) {
      return res.status(404).json({ error: 'Diary entry not found.' });
    }

    await run('DELETE FROM entries WHERE id = ? AND user_id = ? AND type = ?', [id, req.user.id, 'diary']);
    return res.json({ message: 'Diary entry deleted.' });
  } catch (error) {
    console.error('Delete diary entry error:', error);
    return res.status(500).json({ error: 'Could not delete diary entry.' });
  }
});

router.delete('/tourist/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const existingEntry = await get('SELECT * FROM entries WHERE id = ? AND user_id = ? AND type = ?', [id, req.user.id, 'tourist']);
    if (!existingEntry) {
      return res.status(404).json({ error: 'Toilet Tourist visit not found.' });
    }

    await run('DELETE FROM entries WHERE id = ? AND user_id = ? AND type = ?', [id, req.user.id, 'tourist']);
    return res.json({ message: 'Toilet Tourist visit deleted.' });
  } catch (error) {
    console.error('Delete tourist visit error:', error);
    return res.status(500).json({ error: 'Could not delete Toilet Tourist visit.' });
  }
});

module.exports = router;
