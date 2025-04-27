const express = require("express");
const router = express.Router();

const requireAuth = require("../../../functions/requireAuth.js");
const requireAdmin = require("../../../functions/requireAdmin.js");

/*
    Path: /api/admin/customers/:id
    Method: GET
    Description: Fetch customer profile by id
    Request Body: N/A
    Response: { customer_id: number, first_name: string, last_name: string, address: string, phone: string, email: string } 
    Notes: This route is for fetching the customer profile.
*/
router.get("/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
        // Destructure id from request parameters
        const { id } = req.params;

        // Validate input
        if (!id) {
            return res.status(400).json({ error: "Customer ID is required." });
        }
        
        // Select customer profile from the database
        const [rows] = await db.query(
            "SELECT customer_id, first_name, last_name, address, phone, email FROM Customers WHERE customer_id = ?",
            [id],
        );

        // Check if the customer profile exists
        if (rows.length === 0) {
            return res
                .status(404)
                .json({ error: "Customers profile not found." });
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

module.exports = router;