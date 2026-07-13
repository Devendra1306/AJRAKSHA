const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { query } = require('../config/db');

router.get('/', protect, async (req, res, next) => {
  try {
    const { rows } = await query('SELECT * FROM farm_diary WHERE user_id = $1 ORDER BY date DESC LIMIT 100', [req.user.id]);
    res.json({ entries: rows });
  } catch (err) { next(err); }
});

router.post('/', protect, async (req, res, next) => {
  try {
    const { type, description, amount, date, crop } = req.body;
    const { rows } = await query(
      'INSERT INTO farm_diary (user_id, type, description, amount, date, crop) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [req.user.id, type, description, amount, date || new Date(), crop]
    );
    res.status(201).json({ entry: rows[0] });
  } catch (err) { next(err); }
});

router.delete('/:id', protect, async (req, res, next) => {
  try {
    await query('DELETE FROM farm_diary WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    res.json({ success: true });
  } catch (err) { next(err); }
});

module.exports = router;
