const express = require("express");
const router = express.Router();

const requireAuth = require("../functions/requireAuth.js");

/*
    Path: /api/payments/:loanId
    Method: POST
    Description: Process a payment for a loan
    Request Body: { amount: number }
    Response: { message: string }
    Notes: This route is for users to make payments on their loans.
*/
router.post("/:loanId", requireAuth, async (req, res) => {
    // Destructure amount from request body and loanId from request parameters
    const { amount } = req.body;
    const { loanId } = req.params;

    // Validate input
    if (!amount || amount <= 0) {
        return res.status(400).json({ error: "Invalid payment amount" });
    }

    try {
        // Get loan info first
        const [loans] = await db.query(
            "SELECT * FROM Loans WHERE loan_id = ?",
            [loanId],
        );

        const loan = loans[0];

        if (!loan) {
            return res.status(404).json({ error: "Loan not found" });
        }

        // Prevent paying a loan that's already paid
        if (loan.status === "Paid") {
            return res.status(400).json({ error: "Loan is already paid off" });
        }

        // Prevent paying more than the amount left
        if (amount > loan.loan_amount) {
            return res
                .status(400)
                .json({ error: "Payment exceeds remaining loan balance" });
        }

        // Call the stored procedure 'paybackloan'
        await db.query("CALL paybackloan(?, ?)", [loanId, amount]);

        // Check if the payment was successful
        res.status(201).json({ message: "Payment processed successfully" });
    } catch (err) {
        // Handle errors
        // Log the error for debugging
        // Return 500 Internal Server Error
        console.error("Payment error:", err);
        res.status(500).json({ error: "Failed to process payment" });
    }
});

/*
    Path: /api/payments/:loanId
    Method: GET
    Description: Get all payments for a loan
    Response: { paymentID: number, amount: number, payment_date: string }[]
    Notes: This route is for users to view their payment history.
*/
router.get("/:loanId", requireAuth, async (req, res) => {
    // Destructure loanId from request parameters
    const { loanId } = req.params;

    // Validate input   
    if (!loanId) {
        return res.status(400).json({ error: "Invalid loan ID" });
    }

    try {
        // Select all payments for the loan
        const [payments] = await db.query(
            "SELECT * FROM Payments WHERE loan_id = ? ORDER BY payment_date DESC",
            [loanId],
        );

        // Check if the payments are retrieved successfully
        res.json(payments);
    } catch (err) {
        // Handle errors
        // Log the error for debugging
        // Return 500 Internal Server Error
        console.error("Get payments error:", err);
        res.status(500).json({ error: "Failed to fetch payments" });
    }
});

module.exports = router;
