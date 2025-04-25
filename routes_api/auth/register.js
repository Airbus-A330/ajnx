const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Implement hashing and JWT signing
const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET;

/*
    Path: /api/auth/register
    Method: POST
    Description: Register a new user.
    Request Body: { username: string, password: string, role: string }
    Response: { message: string }
    Error: { error: string }
*/
router.post("/", async (req, res) => {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
        return res
            .status(400)
            .json({ error: "Missing username, password, or role" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        await db.query(
            "INSERT INTO Users (username, passwordHash, role) VALUES (?, ?, ?)",
            [username, hashedPassword, role],
        );
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error("Register error:", err);
        res.status(500).json({
            error: "Registration failed",
            details: err.message,
        });
    }
});

module.exports = router;
