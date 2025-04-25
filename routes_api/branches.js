const express = require("express");
const router = express.Router();

const requireAuth = require("../functions/requireAuth.js");

/*
    Path: /api/branches
    Method: GET
    Description: List all branches.
    Headers: { Authorization }
    Response: { branches: Array }
    Error: { error: string }
*/

router.get("/", requireAuth, async (req, res) => {
    // Check if user is authenticated
    try {
        // Retrieve userID from the request object
        const [rows] = await db.query(
            "SELECT branch_id, branch_name, location FROM Branches",
        );

        // Check if branches exist
        res.json(rows);
    } catch (err) {
        // Handle errors
        // Log the error for debugging
        // Return 500 Internal Server Error
        console.error("Error fetching branches:", err);
        res.status(500).json({ error: "Could not fetch branches" });
    }
});

module.exports = router;
