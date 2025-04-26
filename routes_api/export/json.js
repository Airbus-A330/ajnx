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
        // Get all table names from the current DB
        const [tables] = await db.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = DATABASE()
        `);

        // Filter out the tables we want to export
        const exportData = {};

        console.log("Tables to export:", tables);

        // Loop through each table and fetch its data
        for (const { table_name } of tables) {
            const [rows] = await db.query(`SELECT * FROM \`${table_name}\``);
            exportData[table_name] = rows;
        }

        // Return everything with timestamp
        res.json({
            exportedAt: new Date().toISOString(),
            ...exportData,
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
