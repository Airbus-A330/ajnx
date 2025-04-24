const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const requireAuth = require("../functions/requireAuth.js");
const requireAdmin = require("../functions/requireAdmin.js");

router.get("/", requireAuth, requireAdmin, async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT userID, username, role FROM Users",
        );
        res.json(rows);
    } catch (err) {
        console.error("List users error:", err);
        res.status(500).json({ error: "Could not retrieve users" });
    }
});

router.get("/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT userID, username, role FROM Users WHERE userID = ?",
            [req.params.id],
        );
        if (rows.length === 0)
            return res.status(404).json({ error: "User not found" });
        res.json(rows[0]);
    } catch (err) {
        console.error("Get user error:", err);
        res.status(500).json({ error: "Could not retrieve user" });
    }
});

router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
        const [result] = await db.query("DELETE FROM Users WHERE userID = ?", [
            req.params.id,
        ]);
        if (result.affectedRows === 0)
            return res
                .status(404)
                .json({ error: "User not found or already deleted" });
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        console.error("Delete user error:", err);
        res.status(500).json({ error: "Could not delete user" });
    }
});

module.exports = router;
