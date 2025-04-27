const express = require("express");
const router = express.Router();

const requireAuth = require("../../../functions/requireAuth.js");
const requireAdmin = require("../../../functions/requireAdmin.js");

/*
    Path: /api/admin/customers/update
    Method: PUT
    Description: Allows admin to update a customer's profile and their role
    Body: { customer_id, first_name, last_name, address, phone, email, role }
    Response: { message: string }
    Notes: Admin only
*/

router.put("/", requireAuth, requireAdmin, async (req, res) => {
    const { customer_id, first_name, last_name, address, phone, email, role } = req.body;

    // Validate input
    if (!customer_id || !first_name || !last_name || !address || !phone || !email || !role) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        // Update the Customers table
        await db.query(
            `UPDATE Customers
             SET first_name = ?, last_name = ?, address = ?, phone = ?, email = ?
             WHERE customer_id = ?`,
            [first_name, last_name, address, phone, email, customer_id]
        );

        // Update the Users table (role)
        await db.query(
            `UPDATE Users
             SET role = ?
             WHERE userID = ?`,
            [role, customer_id]
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
