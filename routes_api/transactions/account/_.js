const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const requireAuth = require("../../../functions/requireAuth.js");

/*
    Path: /api/transactions/accounts/:id
    Method: GET
    Description: Get all transactions for a specific account.
    Headers: { Authorization }
    Response: { transactions: Array }
    Error: { error: string }
    Notes: Only the owner of the account or an admin can view the transactions.
*/
router.get("/:id", requireAuth, async (req, res) => {
    // Check if user is authenticated
    try {
        // Validate accountID
        const accountID = req.params.id;
        const [accounts] = await db.query(
            "SELECT * FROM Accounts WHERE accountID = ?",
            [accountID],
        );
        const account = accounts[0];

        // Check if the account exists
        if (
            !account ||
            (account.userID !== req.user.userID && req.user.role !== "admin")
        ) {
            return res.status(403).json({ error: "Unauthorized access" });
        }

        // Check if the account is active
        const [transactions] = await db.query(
            "SELECT * FROM Transactions WHERE accountID = ? ORDER BY timestamp DESC",
            [accountID],
        );

        // Return the list of transactions
        res.json(transactions);
    } catch (err) {
        // Handle errors
        // Log the error for debugging
        // Return 500 Internal Server Error
        console.error("Fetch transactions error:", err);
        res.status(500).json({ error: "Could not retrieve transactions" });
    }
});

module.exports = router;
