const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const requireAuth = require("../../functions/requireAuth.js");
const requireAdmin = require("../../functions/requireAdmin.js");

/*
    Path: /api/transactions/export/json
    Method: GET
    Description: Export all transactions, users, and accounts in JSON format.
    Headers: { Authorization }
    Response: { exportedAt: string, users: Array, accounts: Array, transactions: Array }
    Error: { error: string }
    Notes: Only admins can export data.
*/
router.get("/", requireAuth, requireAdmin, async (req, res) => {
    // Check if user is authenticated
    try {
        // Retrieve userID from the request object
        const [users] = await db.query(
            "SELECT userID, username, role FROM Users",
        );
        const [accounts] = await db.query("SELECT * FROM Accounts");
        const [transactions] = await db.query("SELECT * FROM Transactions");

        // Return the exported data
        res.json({
            exportedAt: new Date().toISOString(),
            users,
            accounts,
            transactions,
        });
    } catch (err) {
        // Handle errors
        // Log the error for debugging
        // Return 500 Internal Server Error
        console.error("Full export error:", err);
        res.status(500).json({ error: "Export failed", details: err.message });
    }
});

module.exports = router;
