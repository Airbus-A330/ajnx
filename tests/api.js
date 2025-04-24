require("dotenv").config();
const fetch = require("node-fetch");

const API = "https://db.aerex.tk/api";
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "password123!";

let adminToken = "";
let testUserToken = "";
let testUserID = null;
let testAccountID = null;
let transferAccountID = null;

async function fetchJson(url, options = {}) {
    const res = await fetch(url, options);
    const data = await res.json();
    if (!res.ok) throw new Error(JSON.stringify(data));
    return data;
}

async function runTests() {
    try {
        console.log("\n🔐 Registering and logging in admin...");
        await fetchJson(`${API}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: ADMIN_USERNAME,
                password: ADMIN_PASSWORD,
                role: "admin",
            }),
        });

        const loginRes = await fetchJson(`${API}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: ADMIN_USERNAME,
                password: ADMIN_PASSWORD,
            }),
        });
        adminToken = loginRes.token;
        console.log("✅ Admin logged in");

        console.log("\n👤 Registering test customer...");
        await fetchJson(`${API}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: "testuser",
                password: "testpass",
                role: "customer",
            }),
        });

        const loginTest = await fetchJson(`${API}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: "testuser",
                password: "testpass",
            }),
        });
        testUserToken = loginTest.token;
        console.log("✅ Customer logged in");

        console.log("\n🔍 Getting user list...");
        const userList = await fetchJson(`${API}/users`, {
            headers: { Authorization: `Bearer ${adminToken}` },
        });
        testUserID = userList.find((u) => u.username === "testuser")?.userID;
        console.log(`✅ Found test user ID: ${testUserID}`);

        console.log("\n🏦 Creating account...");
        const createAcc = await fetchJson(`${API}/accounts`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${testUserToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ accountType: "checking" }),
        });
        testAccountID = createAcc.accountID;
        console.log(`✅ Created account ID: ${testAccountID}`);

        console.log("\n🏦 Creating transfer destination account...");
        const transferAcc = await fetchJson(`${API}/accounts`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${testUserToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ accountType: "savings" }),
        });
        transferAccountID = transferAcc.accountID;

        console.log("\n💰 Depositing...");
        await fetchJson(`${API}/transactions/deposit`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${testUserToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                accountID: testAccountID,
                amount: 500,
                description: "Initial deposit",
            }),
        });
        console.log("✅ Deposit successful");

        console.log("\n💸 Withdrawing...");
        await fetchJson(`${API}/transactions/withdraw`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${testUserToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                accountID: testAccountID,
                amount: 200,
                description: "Bill payment",
            }),
        });
        console.log("✅ Withdrawal successful");

        console.log("\n🔁 Transferring...");
        await fetchJson(`${API}/transactions/transfer`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${testUserToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                fromAccountID: testAccountID,
                toAccountID: transferAccountID,
                amount: 100,
                description: "To savings",
            }),
        });
        console.log("✅ Transfer successful");

        console.log("\n📄 Viewing transactions...");
        const transactions = await fetchJson(
            `${API}/transactions/account/${testAccountID}`,
            {
                headers: { Authorization: `Bearer ${testUserToken}` },
            },
        );
        console.log(`✅ Found ${transactions.length} transactions`);

        console.log("\n📤 Exporting all data as admin...");
        const exportRes = await fetchJson(`${API}/export/json`, {
            headers: { Authorization: `Bearer ${adminToken}` },
        });
        console.log(
            `✅ Export successful — ${exportRes.users.length} users exported`,
        );

        console.log("\n🗑️ Deleting test user (admin)...");
        await fetchJson(`${API}/users/${testUserID}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${adminToken}` },
        });
        console.log("✅ Test user deleted");

        console.log("\n✅✅ All API tests passed!");
    } catch (err) {
        console.error("❌ Test failed:", err.message);
        try {
            const details = JSON.parse(err.message);
            console.error("Details:", details);
        } catch {
            // not JSON
        }
    }
}

runTests();
