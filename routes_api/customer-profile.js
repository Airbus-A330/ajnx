const express = require("express");
const router = express.Router();

const requireAuth = require("../../functions/requireAuth.js");

/*
    Path: /api/customer-profile
    Method: POST
    Description: Create a new customer profile
    Request Body: { first_name: string, last_name: string, address: string, phone: string, email: string }
    Response: 201 Created or 400 Bad Request or 500 Internal Server Error
    Notes: This route is for creating a new customer profile.
*/
router.post("/", requireAuth, async (req, res) => {
    // Destructure request body
    const { first_name, last_name, address, phone, email } = req.body;

    // Validate required fields
    if (!first_name || !last_name || !address || !phone || !email) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        // Check if customer profile already exists
        const [existing] = await db.query(
            "SELECT customer_id FROM Customer WHERE customer_id = ?",
            [req.user.userID],
        );

        // If it exists, return 400 Bad Request
        if (existing.length > 0) {
            return res.status(400).json({ error: "Profile already exists." });
        }

        // Insert new customer profile into the database
        await db.query(
            `INSERT INTO Customer (customer_id, first_name, last_name, address, phone, email)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [req.user.userID, first_name, last_name, address, phone, email],
        );

        // Profile created successfully
        res.sendStatus(201);
    } catch (err) {
        // Handle errors
        // Log the error for debugging
        // Return 500 Internal Server Error
        console.error("Create customer profile error:", err);
        res.status(500).json({ error: "Failed to create profile." });
    }
});

/*
    Path: /api/customer-profile
    Method: GET
    Description: Fetch customer profile
    Request Body: N/A
    Response: { customer_id: number, first_name: string, last_name: string, address: string, phone: string, email: string } 
    Notes: This route is for fetching the customer profile.
*/
router.get("/", requireAuth, async (req, res) => {
    try {
        // Select customer profile from the database
        const [rows] = await db.query(
            "SELECT customer_id, first_name, last_name, address, phone, email FROM Customer WHERE customer_id = ?",
            [req.user.userID],
        );

        // Check if the customer profile exists
        if (rows.length === 0) {
            return res
                .status(404)
                .json({ error: "Customer profile not found." });
        }

        // Return the customer profile
        res.json(rows[0]);
    } catch (err) {
        // Handle errors
        // Log the error for debugging
        // Return 500 Internal Server Error
        console.error("Fetch customer profile error:", err);
        res.status(500).json({ error: "Failed to fetch customer profile." });
    }
});

/*
    Path: /api/customer-profile
    Method: PUT
    Description: Update customer profile
    Request Body: { first_name: string, last_name: string, address: string, phone: string, email: string }
    Response: 204 No Content or 400 Bad Request or 404 Not Found or 500 Internal Server Error
    Notes: This route is for updating the customer profile.
*/
router.put("/", requireAuth, async (req, res) => {
    // Destructure request body
    const { first_name, last_name, address, phone, email } = req.body;

    // Validate required fields
    if (!first_name || !last_name || !address || !phone || !email) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        // Check if customer profile exists
        const [existing] = await db.query(
            "SELECT customer_id FROM Customer WHERE customer_id = ?",
            [req.user.userID],
        );

        // If it doesn't exist, return 404 Not Found
        if (existing.length === 0) {
            return res
                .status(404)
                .json({ error: "Customer profile not found." });
        }

        // Update customer profile in the database
        await db.query(
            `UPDATE Customer SET first_name = ?, last_name = ?, address = ?, phone = ?, email = ? WHERE customer_id = ?`,
            [first_name, last_name, address, phone, email, req.user.userID],
        );

        // Profile updated successfully
        res.sendStatus(204);
    } catch (err) {
        // Handle errors
        // Log the error for debugging
        // Return 500 Internal Server Error
        console.error("Update customer profile error:", err);
        res.status(500).json({ error: "Failed to update profile." });
    }
});

module.exports = router;
