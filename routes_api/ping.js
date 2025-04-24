const express = require("express");
const router = express.Router();

router.ratelimit = {
    GET: {
        reset: 1 * 1000,
        limit: 5,
    },
};

/*
    Path: /api/ping
    Method: GET
    Description: Ping the server and get the current server time.
    Response: { message: "pong", serverTime: string }
    Notes: This is a simple endpoint to check if the server is running.
*/

router.get("/", async (req, res) => {
    try {
        // Check if the request is rate-limited
        const [rows] = await db.query(
            "SELECT CURRENT_TIMESTAMP AS server_time",
        );

        // Check if the server time is retrieved successfully
        res.json({ message: "pong", serverTime: rows[0].server_time });
    } catch (err) {
        // Handle errors
        // Log the error for debugging
        // Return 500 Internal Server Error
        console.error("DB error:", err);
        res.status(500).json({ error: "Database error" });
    }
});

module.exports = router;
