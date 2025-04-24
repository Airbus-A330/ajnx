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
    Path: /api/transactions/transfer
    Method: POST
    Description: Transfer money between accounts.
    Headers: { Authorization }
    Body: { fromAccountID, toAccountID, amount, description }
    Response: { message: string }
    Error: { error: string }
*/
router.post("/", requireAuth, async (req, res) => {
    // Destructure the request body
    const { fromAccountID, toAccountID, amount, description } = req.body;

    // Validate input
    if (!fromAccountID || !toAccountID || amount <= 0)
        return res.status(400).json({ error: "Invalid transfer data" });

    // Check if the user is authenticated
    const conn = await db.getConnection();

    // Ensure user owns the account
    try {
        // Begin transaction
        await conn.beginTransaction();

        // Check if the accounts exist
        const [[from]] = await conn.query(
            "SELECT * FROM Account WHERE accountID = ?",
            [fromAccountID],
        );
        const [[to]] = await conn.query(
            "SELECT * FROM Account WHERE accountID = ?",
            [toAccountID],
        );

        // Check if the accounts belong to the user or if the user is an admin
        if (
            !from ||
            !to ||
            (from.userID !== req.user.userID && req.user.role !== "admin")
        ) {
            throw new Error("Unauthorized transfer");
        }

        // Check if the accounts are active
        if (from.balance < amount) throw new Error("Insufficient funds");

        // Update the account balances and log the transaction
        await conn.query(
            "UPDATE Accounts SET balance = balance - ? WHERE accountID = ?",
            [amount, fromAccountID],
        );
        await conn.query(
            "UPDATE Accounts SET balance = balance + ? WHERE accountID = ?",
            [amount, toAccountID],
        );

        // Log the transactions
        await conn.query(
            "INSERT INTO Transactions (accountID, amount, transactionType, description) VALUES (?, ?, ?, ?)",
            [
                fromAccountID,
                amount,
                "transfer",
                `To ${toAccountID}: ${description || "Transfer"}`,
            ],
        );

        // Log the deposit transaction for the receiving account
        await conn.query(
            "INSERT INTO Transactions (accountID, amount, transactionType, description) VALUES (?, ?, ?, ?)",
            [
                toAccountID,
                amount,
                "deposit",
                `From ${fromAccountID}: ${description || "Transfer received"}`,
            ],
        );

        // Commit the transaction
        await conn.commit();

        // Return success message
        res.json({ message: "Transfer successful" });
    } catch (err) {
        // Handle errors
        // Rollback the transaction in case of error
        // Log the error for debugging
        // Return 500 Internal Server Error
        await conn.rollback();
        console.error("Transfer error:", err);
        res.status(500).json({
            error: "Transfer failed",
            details: err.message,
        });
    } finally {
        // Release the connection back to the pool
        // Ensure the connection is released even if an error occurs
        conn.release();
    }
});

module.exports = router;
