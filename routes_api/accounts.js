const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const requireAuth = require("../functions/requireAuth.js");

/*
    Path: /api/accounts
    Method: GET
    Description: List all accounts for the authenticated user.
    Headers: { Authorization }
    Response: { accounts: Array }
    Error: { error: string }
*/

router.get("/", requireAuth, async (req, res) => {
    try {
        // Retrieve userID from the request object
        const [rows] = await db.query(
            `SELECT 
                a.accountID, 
                a.accountType, 
                a.balance, 
                b.branch_name,
                bk.first_name,
                bk.last_name
            FROM Accounts a
            JOIN Branches b ON a.branch_id = b.branch_id
            JOIN Bankers bk ON a.branch_id = bk.branch_id
            WHERE a.userID = ?`,
            [req.user.userID],
        );

        // Check if accounts exist
        res.json(rows);
    } catch (err) {
        // Handle errors
        // Log the error for debugging
        // Return 500 Internal Server Error
        console.error("List accounts error:", err);
        res.status(500).json({ error: "Could not retrieve accounts" });
    }
});

/*
    Path: /api/accounts/:id
    Method: GET
    Description: Get account details by accountID.
    Headers: { Authorization }
    Response: { account: Object }
    Error: { error: string }
    Notes: Only the owner of the account or an admin can view the account details.
*/
router.get("/:id", requireAuth, async (req, res) => {
    // Check if user is authenticated
    try {
        // Retrieve accountID from the request parameters
        const [rows] = await db.query(
            "SELECT * FROM Accounts WHERE accountID = ?",
            [req.params.id],
        );

        // Check if account exists
        const account = rows[0];
        if (!account)
            return res.status(404).json({ error: "Account not found" });

        // Check if the user is authorized to view the account
        if (account.userID !== req.user.userID && req.user.role !== "admin") {
            return res
                .status(403)
                .json({ error: "Unauthorized to view this account" });
        }

        // Return the account details
        res.json(account);
    } catch (err) {
        // Handle errors
        // Log the error for debugging
        // Return 500 Internal Server Error
        console.error("Get account error:", err);
        res.status(500).json({ error: "Could not retrieve account" });
    }
});

/*
    Path: /api/accounts
    Method: POST
    Description: Create a new account for the authenticated user.
    Headers: { Authorization }
    Request Body: { accountType: string, branch_id: number }
    Response: { message: string, accountID: number }
    Error: { error: string }
*/
router.post("/", requireAuth, async (req, res) => {
    // Destructure the request body
    const { accountType, branch_id } = req.body;

    try {
        // Check if the user is authenticated
        // Validate input
        await db.query(
            "INSERT INTO Accounts (userID, accountType, balance, branch_id) VALUES (?, ?, 0.00, ?)",
            [req.user.userID, accountType, branch_id],
        );

        // Retrieve the newly created accountID
        res.sendStatus(201);
    } catch (err) {
        console.error("Create account error:", err);
        res.status(500).json({ error: "Could not create account" });
    }
});

/*
    Path: /api/accounts/:id
    Method: DELETE
    Description: Delete an account by accountID.
    Headers: { Authorization }
    Response: { message: string }
    Error: { error: string }
    Notes: Only the owner of the account or an admin can delete the account.
*/
router.delete("/:id", requireAuth, async (req, res) => {
    // Check if user is authenticated
    try {
        // Retrieve accountID from the request parameters
        const [rows] = await db.query(
            "SELECT * FROM Accounts WHERE accountID = ?",
            [req.params.id],
        );

        // Check if account exists
        const account = rows[0];
        if (!account)
            return res.status(404).json({ error: "Account not found" });

        // Check if the user is authorized to delete the account
        if (account.userID !== req.user.userID && req.user.role !== "admin") {
            return res
                .status(403)
                .json({ error: "Unauthorized to delete this account" });
        }

        // Delete the account from the database
        await db.query("DELETE FROM Accounts WHERE accountID = ?", [
            req.params.id,
        ]);

        // Check if account was deleted successfully
        res.json({ message: "Account closed successfully" });
    } catch (err) {
        // Handle errors
        // Log the error for debugging
        // Return 500 Internal Server Error
        console.error("Delete account error:", err);
        res.status(500).json({ error: "Could not delete account" });
    }
});

module.exports = router;
