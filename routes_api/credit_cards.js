const express = require("express");
const router = express.Router();

const requireAuth = require("../functions/requireAuth.js");

// Generate a random 16-digit card number
const generateCardNumber = () =>
    Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString();

// Generate a random 3-digit CVC
const generateCVC = () => Math.floor(100 + Math.random() * 900).toString();

/*
    Path: /api/credit_cards
    Method: POST
    Description: Create a new credit card for the authenticated user.
    Headers: { Authorization }
    Body: { account_id }
    Response: { message: string }
    Error: { error: string }
*/

router.post("/", requireAuth, async (req, res) => {
    try {
        // Generate new credit card details
        const card_number = generateCardNumber();
        const cvc = generateCVC();
        const card_type = "MasterCard";
        const credit_limit = 5000.0;
        const balance = 0.0;

        const issue_date = new Date();
        const expiration_date = new Date();
        expiration_date.setFullYear(issue_date.getFullYear() + 3);

        // Inser data into database
        await db.query(
            `INSERT INTO Credit_Cards (
        card_number, customer_id, cvc, card_type, 
        credit_limit, balance, issue_date, expiration_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                card_number,
                req.user.userID,
                cvc,
                card_type,
                credit_limit,
                balance,
                issue_date,
                expiration_date,
            ],
        );

        // Send success response
        res.status(201).json({ message: "Credit card created successfully" });
    } catch (err) {
        // Handle errors
        // Log the error for debugging
        // Return 500 Internal Server Error
        console.error("Error creating credit card:", err);
        res.status(500).json({ error: "Could not create credit card" });
    }
});

/*
    Path: /api/credit_cards
    Method: GET
    Description: List all credit cards for the authenticated user.
    Headers: { Authorization }
    Response: { credit_cards: Array }
    Error: { error: string }
    Notes: Only the authenticated user can view their credit cards.
*/

router.get("/", requireAuth, async (req, res) => {
    try {
        // Retrieve userID from the request object
        const [rows] = await db.query(
            `SELECT 
           card_number, card_type, credit_limit, balance, 
           issue_date, expiration_date, account_id 
         FROM Credit_Cards 
         WHERE customer_id = ?`,
            [req.user.userID],
        );

        // Send data
        res.json(rows);
    } catch (err) {
        // Handle errors
        // Log the error for debugging
        // Return 500 Internal Server Error
        console.error("Error fetching credit cards:", err);
        res.status(500).json({ error: "Could not retrieve credit cards" });
    }
});

/*
    Path: /api/credit_cards/:card_number
    Method: DELETE
    Description: Delete a credit card for the authenticated user.
    Headers: { Authorization }
    Params: { card_number }
    Response: { message: string }
    Error: { error: string }
  */
router.delete("/:card_number", requireAuth, async (req, res) => {
    // Destructure the request parameters
    const { card_number } = req.params;

    try {
        // Validate input
        const [result] = await db.query(
            "DELETE FROM Credit_Cards WHERE card_number = ? AND customer_id = ?",
            [card_number, req.user.userID],
        );

        // Check if the card was deleted
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Credit card not found" });
        }

        // Send success response
        res.sendStatus(204);
    } catch (err) {
        // Handle errors
        // Log the error for debugging
        // Return 500 Internal Server Error
        console.error("Error deleting credit card:", err);
        res.status(500).json({ error: "Could not delete credit card" });
    }
});

/*
    Path: /api/credit_cards/:card_number
    Method: PUT
    Description: Apply a payment to a credit card for the authenticated user.
    Headers: { Authorization }
    Params: { card_number }
    Body: { amount }
    Response: { message: string }
  */
router.put("/:card_number", requireAuth, async (req, res) => {
    // Destructure the request parameters and body
    const { card_number } = req.params;
    const { amount } = req.body;

    // Validate input
    if (typeof amount !== "number" || amount < 0) {
        return res.status(400).json({ error: "Invalid amount" });
    }

    try {
        // Check if the card exists and belongs to the user
        const [result] = await db.query(
            "UPDATE Credit_Cards SET balance = balance - ? WHERE card_number = ? AND customer_id = ?",
            [amount, card_number, req.user.userID],
        );

        // Check if the card was updated
        if (result.affectedRows === 0) {
            return res
                .status(404)
                .json({ error: "Credit card not found or unauthorized" });
        }

        // Send success response
        res.json({ message: "Payment applied successfully" });
    } catch (err) {
        // Handle errors
        // Log the error for debugging
        // Return 500 Internal Server Error
        console.error("Error updating credit card:", err);
        res.status(500).json({ error: "Could not update credit card" });
    }
});

module.exports = router;
