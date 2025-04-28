const express = require("express");
const router = express.Router();

const requireAuth = require("../../../functions/requireAuth.js");
const requireAdmin = require("../../../functions/requireAdmin.js");

/*
    Path: /api/admin/customers/update/:id
    Method: PUT
    Description: Allows admin to update a customer's profile and their role
    Body: { first_name, last_name, address, phone, email, role }
    Response: { message: string }
    Notes: Admin only
*/

router.put("/:id", requireAuth, requireAdmin, async (req, res) => {
    const { first_name, last_name, address, phone, email, role } = req.body;
    const { id: customer_id } = req.params;

    // Validate input
    if (!first_name || !last_name || !address || !phone || !email || !role) {
        return res.status(400).json({ error: "All fields are required" });
    }

    if (!customer_id) {
        return res.status(400).json({ error: "Customer ID is required" });
    }

    try {
        // Update the Customers table
        await db.query(
            `UPDATE Customers
             SET first_name = ?, last_name = ?, address = ?, phone = ?, email = ?
             WHERE customer_id = ?`,
            [first_name, last_name, address, phone, email, customer_id],
        );

        // Update the Users table (role)
        await db.query(
            `UPDATE Users
             SET role = ?
             WHERE userID = ?`,
            [role, customer_id],
        );

        // Check if the update was successful
        res.json({ message: "Customer profile and role updated successfully" });
    } catch (err) {
        // Log the error for debugging
        // Return 500 Internal Server Error
        // Handle errors
        console.error("Admin update customer error:", err);
        res.status(500).json({ error: "Failed to update customer profile" });
    }
});

module.exports = router;
