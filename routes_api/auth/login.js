const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Implement hashing and JWT signing
const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET;

/*
    Path: /api/auth/login
    Method: POST
    Description: Authenticate a user and return a JWT token.
    Request Body: { username: string, password: string }
    Response: { message: string, token: string }
*/
router.post("/", async (req, res) => {
    // Destructure username and password from request body
    const { username, password } = req.body;

    // Check if username and password are provided
    try {
        // Check if username and password in database
        const [users] = await db.query(
            "SELECT * FROM Users WHERE username = ?",
            [username],
        );

        // Check if user exists
        const user = users[0];

        // If user does not exist, return 401 Unauthorized
        if (!user)
            return res
                .status(401)
                .json({ error: "Invalid username or password" });

        // Check if password is correct
        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid)
            return res
                .status(401)
                .json({ error: "Invalid username or password" });

        // Generate JWT token
        // Include userID, username, and role in the token payload
        // Set token expiration to 2 hours
        const token = jwt.sign(
            { userID: user.userID, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: "2h" },
        );

        // Return success message and token
        res.json({ message: "Login successful", token });
    } catch (err) {
        // Handle errors
        // Log the error for debugging
        // Return 500 Internal Server Error
        console.error("Login error:", err);
        res.status(500).json({ error: "Login failed", details: err.message });
    }
});

module.exports = router;
