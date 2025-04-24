const express = require("express");
const router = express.Router();

router.ratelimit = {
    GET: {
        reset: 1 * 1000,
        limit: 5,
    },
};

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT CURRENT_TIMESTAMP AS server_time');
        res.json({ message: 'pong', serverTime: rows[0].current_time });
    } catch (err) {
        console.error('DB error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;
