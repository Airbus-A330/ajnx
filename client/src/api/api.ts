const API_URL = "https://db.aerex.tk/api";

type RequestOptions = {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: any;
    token?: string;
};

const request = async <T>(
    endpoint: string,
    options: RequestOptions = {},
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

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "API error");
    }

    return data as T;
};

// Response Types
type AuthResponse = { token: string };
type User = { userID: number; username: string; role: string };
type Account = { accountID: number; accountType: string; balance: number };

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
export const createAccount = (accountType: string): Promise<void> =>
    request("/accounts", {
        method: "POST",
        body: { accountType },
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

// Admin API calls
export const getUsers = (): Promise<User[]> => request("/users");

export const exportData = (): Promise<any> => request("/export/json");

export const deleteUser = (userID: number): Promise<void> =>
    request(`/users/${userID}`, {
        method: "DELETE",
    });
