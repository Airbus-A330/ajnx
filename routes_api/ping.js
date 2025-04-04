const express = require("express");
const router = express.Router();

router.ratelimit = {
    GET: {
        reset: 1 * 1000,
        limit: 5,
    },
};

router.get("/", async (req, res) => {
    res.status(204).end();
});

module.exports = router;
