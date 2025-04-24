const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const requireAuth = require("../functions/requireAuth.js");
const requireAdmin = require("../functions/requireAdmin.js");

router.ratelimit = {
    GET: {
        reset: 1 * 1000,
        limit: 5,
    },
    DELETE: {
        reset: 1 * 1000,
        limit: 5,
    },
};

/*
    Path: /api/users
    Method: GET
    Description: List all users.
    Headers: { Authorization }
    Response: { users: Array }
    Error: { error: string }
    Notes: Only admins can view the list of users.
*/
router.get("/", requireAuth, requireAdmin, async (req, res) => {
    // Check if user is authenticated
    try {
        // Retrieve userID from the request object
        const [rows] = await db.query(
            "SELECT userID, username, role FROM Users",
        );

        // Return the list of users
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
    Path: /api/users/:id
    Method: GET
    Description: Get user details by userID.
    Headers: { Authorization }
    Response: { user: Object }
    Error: { error: string }
    Notes: Only admins can view user details.
*/
router.get("/:id", requireAuth, requireAdmin, async (req, res) => {
    // Check if user is authenticated
    try {
        // Retrieve userID from the request object
        // Check if the userID is valid
        const [rows] = await db.query(
            "SELECT userID, username, role FROM Users WHERE userID = ?",
            [req.params.id],
        );

        // Check if the user exists
        if (rows.length === 0)
            return res.status(404).json({ error: "User not found" });

        // Return the user details
        res.json(rows[0]);
    } catch (err) {
        // Handle errors
        // Log the error for debugging
        // Return 500 Internal Server Error
        console.error("Get user error:", err);
        res.status(500).json({ error: "Could not retrieve user" });
    }
});

/*
    Path: /api/users/:id
    Method: DELETE
    Description: Delete a user by userID.
    Headers: { Authorization }
    Response: { message: string }
    Error: { error: string }
    Notes: Only admins can delete users.
*/
router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
    // Check if user is authenticated
    try {
        // Check if the userID is valid
        const [result] = await db.query("DELETE FROM Users WHERE userID = ?", [
            req.params.id,
        ]);

        // Check if the user exists
        // If no rows were affected, the user was not found
        if (result.affectedRows === 0)
            return res
                .status(404)
                .json({ error: "User not found or already deleted" });

        // Return success message
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        // Handle errors
        // Log the error for debugging
        // Return 500 Internal Server Error
        console.error("Delete user error:", err);
        res.status(500).json({ error: "Could not delete user" });
    }
});

module.exports = router;
