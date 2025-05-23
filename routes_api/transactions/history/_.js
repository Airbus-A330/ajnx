const express = require("express");
const router = express.Router();
const requireAuth = require("../../../functions/requireAuth.js");

/*
    Path: /api/transactions/history/:type
    Method: GET
    Description: Returns deposits, withdrawals, or both for the authenticated user.
    Headers: { Authorization }
    Params: :type = "deposits", "withdrawals", "transfers", or "all"
    Response: { deposits: [...], withdrawals: [...], transfers: [...] }
*/

router.get("/:type", requireAuth, async (req, res) => {
    // Check if user is authenticated
    const { type } = req.params;

    // Validate type parameter
    const validTypes = ["deposits", "withdrawals", "all", "transfers"];

    if (!validTypes.includes(type)) {
        return res.status(400).json({ error: "Invalid transaction type" });
    }

    try {
        // Get userID from the request object
        const userID = req.user.userID;

        // Fetch account IDs owned by this user
        const [accounts] = await db.query(
            "SELECT accountID FROM Accounts WHERE userID = ?",
            [userID],
        );
        const accountIDs = accounts.map((acc) => acc.accountID);

        // If no accounts found, return empty arrays for deposits and withdrawals
        if (accountIDs.length === 0) {
            return res.json({
                message: "No accounts found",
                deposits: [],
                withdrawals: [],
                transfers: [],
            });
        }

        // Prepare placeholders for SQL query
        const placeholders = accountIDs.map(() => "?").join(",");

        // Fetch deposits and withdrawals based on the type parameter
        let deposits = [],
            withdrawals = [];

        // Fetch deposits if requested
        if (type === "deposits" || type === "all") {
            [deposits] = await db.query(
                `SELECT * 
                 FROM Transactions WHERE transactionType = 'deposit' AND accountID IN (${placeholders})`,
                accountIDs,
            );
        }

        // Fetch withdrawals if requested
        if (type === "withdrawals" || type === "all") {
            [withdrawals] = await db.query(
                `SELECT * 
                 FROM Transactions WHERE transactionType = 'withdrawal' AND accountID IN (${placeholders})`,
                accountIDs,
            );
        }

        if (type === "transfers" || type === "all") {
            [transfers] = await db.query(
                `SELECT * 
                 FROM Transactions WHERE transactionType = 'transfer' AND accountID IN (${placeholders})`,
                accountIDs,
            );
        }

        deposits = deposits.reverse();
        withdrawals = withdrawals.reverse();
        transfers = transfers.reverse();

        // Return the results
        res.json({ deposits, withdrawals, transfers });
    } catch (err) {
        // Handle errors
        // Log the error for debugging
        // Return 500 Internal Server Error
        console.error("Transaction history error:", err);
        res.status(500).json({
            error: "Failed to retrieve transaction history",
        });
    }
});

module.exports = router;
