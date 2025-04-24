const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const requireAuth = require("../functions/requireAuth.js");

router.get("/", requireAuth, async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM Accounts WHERE userID = ?",
            [req.user.userID],
        );
        res.json(rows);
    } catch (err) {
        console.error("List accounts error:", err);
        res.status(500).json({ error: "Could not retrieve accounts" });
    }
});

router.get("/:id", requireAuth, async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM Accounts WHERE accountID = ?",
            [req.params.id],
        );
        const account = rows[0];
        if (!account)
            return res.status(404).json({ error: "Account not found" });

        if (account.userID !== req.user.userID && req.user.role !== "admin") {
            return res
                .status(403)
                .json({ error: "Unauthorized to view this account" });
        }

        res.json(account);
    } catch (err) {
        console.error("Get account error:", err);
        res.status(500).json({ error: "Could not retrieve account" });
    }
});

router.post("/", requireAuth, async (req, res) => {
    const { accountType } = req.body;
    if (!["checking", "savings"].includes(accountType)) {
        return res.status(400).json({ error: "Invalid account type" });
    }

    try {
        const [result] = await db.query(
            "INSERT INTO Accounts (userID, accountType) VALUES (?, ?)",
            [req.user.userID, accountType],
        );
        res.status(201).json({
            message: "Account created",
            accountID: result.insertId,
        });
    } catch (err) {
        console.error("Create account error:", err);
        res.status(500).json({ error: "Could not create account" });
    }
});

router.delete("/:id", requireAuth, async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM Accounts WHERE accountID = ?",
            [req.params.id],
        );
        const account = rows[0];
        if (!account)
            return res.status(404).json({ error: "Account not found" });

        if (account.userID !== req.user.userID && req.user.role !== "admin") {
            return res
                .status(403)
                .json({ error: "Unauthorized to delete this account" });
        }

        await db.query("DELETE FROM Accounts WHERE accountID = ?", [
            req.params.id,
        ]);
        res.json({ message: "Account closed successfully" });
    } catch (err) {
        console.error("Delete account error:", err);
        res.status(500).json({ error: "Could not delete account" });
    }
});

module.exports = router;
