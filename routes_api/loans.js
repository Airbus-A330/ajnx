const express = require("express");
const router = express.Router();

const requireAuth = require("../functions/requireAuth.js");

// Calculate interest rate based on loan amount and total balance
const calculateInterestRate = (loanAmount, totalBalance) => {
    const ratio = loanAmount / (totalBalance || 1); // avoid divide-by-zero
    let rate = 1 + ratio * 4; // base 1% plus up to 4% more depending on ratio

    // Cap the rate between 1% and 5%
    if (rate > 5) rate = 5;
    if (rate < 1) rate = 1;

    // Convert to percentage
    return parseFloat(rate.toFixed(2));
};

/*
    Path: /api/loans
    Method: POST
    Description: Create a new loan for the user
    Request Body: { accountID: number, loanAmount: number }
    Response: { message: string }
    Notes: This route is for users to create a new loan.
*/
router.post("/", requireAuth, async (req, res) => {
    // Destructure accountID and loanAmount from request body
    const { accountID, loanAmount } = req.body;

    // Validate input
    if (!accountID || !loanAmount || loanAmount <= 0) {
        return res.status(400).json({ error: "Invalid loan request" });
    }

    try {
        // Check if the account belongs to the user
        const [accounts] = await db.query(
            "SELECT * FROM Accounts WHERE accountID = ?",
            [accountID],
        );

        // Check if the account exists and belongs to the user
        const account = accounts[0];

        if (
            !account ||
            (account.userID !== req.user.userID && req.user.role !== "admin")
        ) {
            return res.status(403).json({ error: "Unauthorized loan request" });
        }

        // Calculate total balance across all user's accounts
        const [userAccounts] = await db.query(
            "SELECT SUM(balance) AS totalBalance FROM Accounts WHERE userID = ?",
            [req.user.userID],
        );

        // Check if the user has any accounts
        const totalBalance = userAccounts[0]?.totalBalance || 0;

        // Calculate interest rate
        const interestRate = calculateInterestRate(loanAmount, totalBalance);

        // Before inserting, we need to fetch the customer_id that matches the userID
        const [customers] = await db.query(
            "SELECT customer_id FROM Customers WHERE customer_id = ?",
            [req.user.userID],
        );

        // If customer not found, reject
        if (customers.length === 0) {
            return res
                .status(400)
                .json({
                    error: "No customer profile found. Please complete your profile first.",
                });
        }

        // Insert the new loan
        await db.query(
            `INSERT INTO Loans (customer_id, account_id, loan_amount, interest_rate, start_date, due_date, status)
     VALUES (?, ?, ?, ?, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 YEAR), ?)`,
            [
                customers[0].customer_id,
                accountID,
                loanAmount,
                interestRate,
                "Unpaid",
            ],
        );

        // Update the account balance
        res.status(201).json({ message: "Loan created successfully" });
    } catch (err) {
        // Handle errors
        // Log the error for debugging
        // Return 500 Internal Server Error
        console.error("Loan creation error:", err);
        res.status(500).json({ error: "Could not create loan" });
    }
});

/*
    Path: /api/loans
    Method: GET
    Description: Get all loans for the user
    Response: { loanID: number, accountID: number, loanAmount: number, interestRate: number, startDate: string, dueDate: string, status: string }[]
    Notes: This route is for users to view their loans.
*/
router.get("/", requireAuth, async (req, res) => {
    try {
        // Select all loans for the user
        const [loans] = await db.query(
            "SELECT * FROM Loans WHERE customer_id = ?",
            [req.user.userID],
        );

        // Check if the loans are retrieved successfully
        res.json(loans);
    } catch (err) {
        // Handle errors
        // Log the error for debugging
        // Return 500 Internal Server Error
        console.error("Loan fetch error:", err);
        res.status(500).json({ error: "Could not fetch loans" });
    }
});

module.exports = router;
