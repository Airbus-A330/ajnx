const API_URL = "https://db.aerex.tk/api";

const request = async <T = any>(
    endpoint: string,
    options: {
        method?: "GET" | "POST" | "PUT" | "DELETE";
        body?: any;
        expectJson?: boolean; // ✅ new
    } = {},
): Promise<T> => {
    const token = localStorage.getItem("token");

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
    };

    const res = await fetch(`${API_URL}${endpoint}`, {
        method: options.method || "GET",
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!res.ok) {
        const contentType = res.headers.get("content-type");
        const errorMessage = contentType?.includes("application/json")
            ? (await res.json())?.error || "API error"
            : res.statusText;

        if (res.status === 401) {
            // Clear token and redirect after a short delay
            localStorage.removeItem("token");

            setTimeout(() => {
                window.location.href = "/login";
            }, 1000); // give the toast time to show (1 sec)

            throw new Error("Unauthorized, redirecting to login...");
        }

        throw new Error(errorMessage);
    }

    if (
        options.expectJson === false ||
        res.status === 204 ||
        res.status === 201
    ) {
        return undefined as T;
    }

    return res.json() as Promise<T>;
};

// Response Types
type AuthResponse = { token: string };
type User = { userID: number; username: string; role: string };
type Account = { accountID: number; accountType: string; balance: number };
type CustomerProfile = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
};

// Auth API calls
export const login = (
    username: string,
    password: string,
): Promise<AuthResponse> =>
    request("/auth/login", {
        method: "POST",
        body: { username, password },
    });

export const register = (
    username: string,
    password: string,
    role: string = "customer",
): Promise<void> =>
    request("/auth/register", {
        method: "POST",
        body: { username, password, role },
    });

export const getMe = (): Promise<User> => request("/auth/me");

// Accounts API calls
export const getAccounts = (): Promise<Account[]> => request("/accounts");

// Create account API calls
export const createAccount = (
    accountType: string,
    branch_id: number,
): Promise<void> =>
    request("/accounts", {
        method: "POST",
        body: { accountType, branch_id },
        expectJson: false,
    });

// Branch API calls
export const getBranches = (): Promise<
    { branch_id: number; branch_name: string; location: string }[]
> => request("/branches", { method: "GET" });

// Customer Profile API
export const getCustomerProfile = async (): Promise<CustomerProfile> =>
    request("/customers");

export const createCustomerProfile = async (
    data: CustomerProfile,
): Promise<void> =>
    request("/customers", {
        method: "POST",
        body: data,
    });

export const updateCustomerProfile = async (
    data: CustomerProfile,
): Promise<void> =>
    request("/customers", {
        method: "PUT",
        body: data,
    });

// Fetch deposit/withdrawal history for the current user
export const getTransactionHistory = (
    type: "all" | "deposits" | "withdrawals" = "all",
): Promise<{ deposits: any[]; withdrawals: any[] }> =>
    request(`/transactions/history/${type}`, {
        method: "GET",
    });

// Transactions API calls
export const deposit = (accountID: number, amount: number): Promise<void> =>
    request("/transactions/deposit", {
        method: "POST",
        body: { accountID, amount, description: "Deposit" },
    });

export const withdraw = (accountID: number, amount: number): Promise<void> =>
    request("/transactions/withdraw", {
        method: "POST",
        body: { accountID, amount, description: "Withdraw" },
    });

export const transfer = (
    fromAccountID: number,
    toAccountID: number,
    amount: number,
): Promise<void> =>
    request("/transactions/transfer", {
        method: "POST",
        body: { fromAccountID, toAccountID, amount, description: "Transfer" },
    });

// Fetch credit cards
export const getCreditCards = (): Promise<CreditCard[]> =>
    request("/credit-cards", {
        method: "GET",
    });

// Create credit card
export const createCreditCard = (): Promise<void> =>
    request("/credit-cards", {
        method: "POST",
        body: {}, // no body needed
    });

// LOANS API
export const createLoan = (
    accountId: number,
    loanAmount: number,
): Promise<void> =>
    request("/loans", {
        method: "POST",
        body: { accountID: accountId, loanAmount },
    });

export const getLoans = (): Promise<any[]> =>
    request("/loans", {
        method: "GET",
    });

// PAYMENTS API
export const makePayment = (loanId: number, amount: number): Promise<void> =>
    request(`/payments/${loanId}`, {
        method: "POST",
        body: { amount },
    });

export const getPayments = (loanId: number): Promise<any[]> =>
    request(`/payments/${loanId}`, {
        method: "GET",
    });

// Admin API calls
export const getUsers = (): Promise<User[]> => request("/users");

export const exportData = (): Promise<any> => request("/export/json");

export const deleteUser = async (userID: number): Promise<void> => {
    const token = localStorage.getItem("token");

    const res = await fetch(`https://db.aerex.tk/api/users/${userID}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    });

    if (!res.ok) {
        const contentType = res.headers.get("content-type");
        const errorMessage = contentType?.includes("application/json")
            ? (await res.json())?.error || "API error"
            : res.statusText;

        throw new Error(errorMessage);
    }

    // ✅ no res.json() if 204
    return;
};

// Admin - update user
export const updateUser = (userID: number, form: any): Promise<void> =>
    request(`/admin/customers/update`, {
        method: "PUT",
        body: { customer_id: userID, ...form },
    });
