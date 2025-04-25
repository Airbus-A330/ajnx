const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Implement hashing and JWT signing
const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET;

/*
    Path: /api/auth/me
    Method: GET
    Description: Authenticate a user and return a JWT token.
    Headers: { Authorization }
    Response: { user }
*/
router.get("/", requireAuth, async (req, res) => {
    try {
        // Check if user is authenticated
        // Retrieve userID from the request object
        const [rows] = await db.query(
            "SELECT username, role FROM Users WHERE userID = ?",
            [req.user.userID],
        );

        // Check if user exists
        if (rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        // Return the user info
        res.json(rows[0]);
    } catch (err) {
        // Handle errors
        // Log the error for debugging
        // Return 500 Internal Server Error
        console.error("Get user info error:", err);
        res.status(500).json({ error: "Could not retrieve user info" });
    }
});

module.exports = router;
