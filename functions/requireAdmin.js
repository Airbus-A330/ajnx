const db = require("../db");

async function requireAdmin(req, res, next) {
    try {
        // Get user ID from JWT
        const userID = req.user.userID;

        // Query database to verify role
        const [rows] = await db.query(
            "SELECT role FROM Users WHERE userID = ?",
            [userID],
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const userRole = rows[0].role;

        if (userRole !== "admin") {
            return res.status(403).json({ error: "Admin access required" });
        }

        next();
    } catch (err) {
        console.error("Admin verification error:", err);
        return res.status(500).json({ error: "Failed to verify admin access" });
    }
}

module.exports = requireAdmin;
