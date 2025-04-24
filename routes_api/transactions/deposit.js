const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const requireAuth = require("../../functions/requireAuth.js");

router.ratelimit = {
    POST: {
        reset: 1 * 1000,
        limit: 5,
    },
};

/*
    Path: /api/transactions/deposit
    Method: POST
    Description: Deposit money into an account.
    Headers: { Authorization }
    Body: { accountID, amount, description }
    Response: { message: string }
    Error: { error: string }
    Notes: Only the account owner or admin can deposit money.
*/
router.post("/", requireAuth, async (req, res) => {
    // Check if user is authenticated
    const { accountID, amount, description } = req.body;

    // Validate input
    if (!accountID || amount <= 0)
        return res.status(400).json({ error: "Invalid deposit data" });

    // Check if the user is authenticated
    try {
        // Ensure user owns the account
        const [accounts] = await db.query(
            "SELECT * FROM Accounts WHERE accountID = ?",
            [accountID],
        );

        // Check if the account exists
        const account = accounts[0];

        // Check if the account belongs to the user or if the user is an admin
        if (
            !account ||
            (account.userID !== req.user.userID && req.user.role !== "admin")
        ) {
            return res.status(403).json({ error: "Unauthorized deposit" });
        }

        // Check if the account is active
        await db.query(
            "UPDATE Accounts SET balance = balance + ? WHERE accountID = ?",
            [amount, accountID],
        );
        await db.query(
            "INSERT INTO Transactions (accountID, amount, transactionType, description) VALUES (?, ?, ?, ?)",
            [accountID, amount, "deposit", description || "Deposit"],
        );

        // Return success message
        res.status(201).json({ message: "Deposit successful" });
    } catch (err) {
        // Handle errors
        // Log the error for debugging
        // Return 500 Internal Server Error
        console.error("Deposit error:", err);
        res.status(500).json({ error: "Deposit failed" });
    }
});

module.exports = router;
