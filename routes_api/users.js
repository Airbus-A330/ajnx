const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const requireAdmin = require("../middleware/requireAdmin");

/*
    Path: /api/users
    Method: GET
    Description: User management routes
    Response: { userID: number, username: string, role: string, accountCount: number }[]
    Notes: This route is for admin users to manage other users.
*/
router.get("/", requireAuth, requireAdmin, async (req, res) => {
    try {
        // Select all users with their account count
        const [rows] = await db.query(`
            SELECT u.userID, u.username, u.role, COUNT(a.accountID) AS accountCount
            FROM Users u
            LEFT JOIN Accounts a ON u.userID = a.userID
            GROUP BY u.userID, u.username, u.role
        `);

        // Check if the users are retrieved successfully
        res.json(rows);
    } catch (err) {
        // Handle errors
        // Log the error for debugging
        // Return 500 Internal Server Error
        console.error("List users error:", err);
        res.status(500).json({ error: "Could not retrieve users" });
    }
});

/*
    Path: /api/users/:userID
    Method: GET
    Description: Get user details by userID
    Response: N/A
    Notes: This route is for admin users to view details of a specific user.
*/
router.delete("/:userID", requireAuth, requireAdmin, async (req, res) => {
    // Destructure userID from request parameters
    const { userID } = req.params;

    // Validate userID
    try {
        // Prevent deleting self or admin accounts
        if (Number(userID) === req.user.userID) {
            return res.status(403).json({ error: "You cannot delete yourself." });
        }

        // Delete the user from the Users table
        await db.query("DELETE FROM Users WHERE userID = ?", [userID]);

        // User was deleted successfully
        res.sendStatus(204); // No Content
    } catch (err) {
        // Handle errors
        // Log the error for debugging
        // Return 500 Internal Server Error
        console.error("Delete user error:", err);
        res.status(500).json({ error: "Could not delete user" });
    }
});

module.exports = router;