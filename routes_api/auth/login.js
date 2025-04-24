const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();
const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/", async (req, res) => {
    const { username, password } = req.body;

    try {
        const [users] = await db.query(
            "SELECT * FROM Users WHERE username = ?",
            [username],
        );
        const user = users[0];

        if (!user)
            return res
                .status(401)
                .json({ error: "Invalid username or password" });

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid)
            return res
                .status(401)
                .json({ error: "Invalid username or password" });

        const token = jwt.sign(
            { userID: user.userID, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: "2h" },
        );

        res.json({ message: "Login successful", token });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Login failed", details: err.message });
    }
});

module.exports = router;
