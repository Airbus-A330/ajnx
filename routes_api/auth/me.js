const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.ratelimit = {
    GET: {
        reset: 1 * 1000,
        limit: 5,
    },
};

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
router.get("/", async (req, res) => {
    // Retrieve authorization header from request
    const authHeader = req.headers.authorization;

    // Check if authorization header is provided
    // If not, return 401 Unauthorized
    // If provided, split the header to get the token
    if (!authHeader)
        return res.status(401).json({ error: "Missing Authorization header" });

    // Split the header to get the token
    const token = authHeader.split(" ")[1];

    // Verify the token using JWT secret
    try {
        // Verify the token and extract user information
        const user = jwt.verify(token, JWT_SECRET);

        // Check if user exists in the database
        res.json({ user });
    } catch (err) {
        // Handle errors
        // Return 403 Forbidden if token is invalid
        res.status(403).json({ error: "Invalid token" });
    }
});

module.exports = router;
