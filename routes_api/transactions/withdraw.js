const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const requireAuth = require("../../functions/requireAuth.js");

/*
    Path: /api/transactions/withdraw
    Method: POST
    Description: Withdraw money from an account.
    Headers: { Authorization }
    Body: { accountID, amount, description }
    Response: { message: string }
    Error: { error: string }
    Notes: Only the account owner or admin can withdraw money.
*/
router.post("/", requireAuth, async (req, res) => {
    // Destructure request body
    const { accountID, amount, description } = req.body;

    // Validate required fields
    if (!accountID || amount <= 0)
        return res.status(400).json({ error: "Invalid withdrawal data" });

    if (!description) {
        return res.status(400).json({ error: "Description is required" });
    }

    try {
        // Check if the account exists and belongs to the user or if the user is an admin
        const [accounts] = await db.query(
            "SELECT * FROM Accounts WHERE accountID = ?",
            [accountID],
        );

        // If no account found, return 404 Not Found
        const account = accounts[0];

        // If account not found, return 404 Not Found
        if (
            !account ||
            (account.userID !== req.user.userID && req.user.role !== "admin")
        ) {
            return res.status(403).json({ error: "Unauthorized withdrawal" });
        }

        // Check if the account has sufficient balance
        if (account.balance < amount)
            return res.status(400).json({ error: "Insufficient funds" });

        // Update the account balance
        await db.query(
            "UPDATE Accounts SET balance = balance - ? WHERE accountID = ?",
            [amount, accountID],
        );

        // Insert the transaction into the Transactions table
        await db.query(
            "INSERT INTO Transactions (accountID, amount, transactionType, description) VALUES (?, ?, ?, ?)",
            [accountID, amount, "withdrawal", description || "Withdrawal"],
        );

        // Insert the withdrawal into the Withdrawals table
        await db.query(
            "INSERT INTO Withdrawals (account_id, amount, withdrawal_date) VALUES (?, ?, CURDATE())",
            [accountID, amount],
        );

        // Withdrawal successful
        res.status(201).json({ message: "Withdrawal successful" });
    } catch (err) {
        // Handle errors
        // Log the error for debugging
        // Return 500 Internal Server Error
        console.error("Withdraw error:", err);
        res.status(500).json({ error: "Withdrawal failed" });
    }
});

module.exports = router;
