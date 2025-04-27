import React from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Chip,
    Tabs,
    Tab,
    Input,
    Button,
    Select,
    SelectItem,
    Divider,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import {
    getAccounts,
    deposit,
    withdraw,
    transfer,
    getTransactionHistory,
} from "../api/api";

interface Account {
    accountID: number;
    accountType: string;
    balance: number;
}

const TransactionsPage: React.FC = () => {
    const [accounts, setAccounts] = React.useState<Account[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState("");
    const [success, setSuccess] = React.useState("");
    const [selectedItem, setSelectedItem] = React.useState<string>("");

    // Deposit state
    const [depositAccountId, setDepositAccountId] = React.useState("");
    const [depositAmount, setDepositAmount] = React.useState("");
    const [isDepositLoading, setIsDepositLoading] = React.useState(false);

    // Withdraw state
    const [withdrawAccountId, setWithdrawAccountId] = React.useState("");
    const [withdrawAmount, setWithdrawAmount] = React.useState("");
    const [isWithdrawLoading, setIsWithdrawLoading] = React.useState(false);

    // Transfer state
    const [fromAccountId, setFromAccountId] = React.useState("");
    const [toAccountId, setToAccountId] = React.useState("");
    const [transferAmount, setTransferAmount] = React.useState("");
    const [isTransferLoading, setIsTransferLoading] = React.useState(false);

    React.useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const response = await getAccounts();
                setAccounts(response);
            } catch (err) {
                setError("Failed to load accounts");
                console.error("Error fetching accounts:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAccounts();
    }, []);

    const handleDeposit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setIsDepositLoading(true);

        try {
            await deposit(Number(depositAccountId), Number(depositAmount));
            setSuccess("Deposit successful!");
            setDepositAmount("");

            // Refresh accounts
            const response = await getAccounts();
            setAccounts(response);
        } catch (err) {
            setError("Deposit failed. Please try again.");
            console.error("Deposit error:", err);
        } finally {
            setIsDepositLoading(false);
        }

        await fetchHistory(historyTab);
    };

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setIsWithdrawLoading(true);

        try {
            await withdraw(Number(withdrawAccountId), Number(withdrawAmount));
            setSuccess("Withdrawal successful!");
            setWithdrawAmount("");

            // Refresh accounts
            const response = await getAccounts();
            setAccounts(response);
        } catch (err) {
            setError("Withdrawal failed. Please try again.");
            console.error("Withdraw error:", err);
        } finally {
            setIsWithdrawLoading(false);
        }

        await fetchHistory(historyTab);
    };

    const handleTransfer = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setIsTransferLoading(true);

        try {
            await transfer(
                Number(fromAccountId),
                Number(toAccountId),
                Number(transferAmount),
            );
            setSuccess("Transfer successful!");
            setTransferAmount("");

            // Refresh accounts
            const response = await getAccounts();
            setAccounts(response);
        } catch (err) {
            setError("Transfer failed. Please try again.");
            console.error("Transfer error:", err);
        } finally {
            setIsTransferLoading(false);
        }
    };

    const [historyTab, setHistoryTab] = React.useState<
        "all" | "deposits" | "withdrawals"
    >("all");
    const [transactionHistory, setTransactionHistory] = React.useState<{
        deposits: any[];
        withdrawals: any[];
    }>({
        deposits: [],
        withdrawals: [],
    });

    const fetchHistory = async (type: "all" | "deposits" | "withdrawals") => {
        try {
            const response = await getTransactionHistory(type);
            setTransactionHistory(response);
        } catch (err) {
            console.error("Error loading transaction history:", err);
        }
    };

    React.useEffect(() => {
        fetchHistory("all");
    }, []);

    if (isLoading) {
        return (
            <div className="container mx-auto max-w-5xl flex justify-center items-center h-64">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-5xl">
            <h1 className="text-3xl font-bold mb-6">Transactions</h1>

            {error && (
                <div className="bg-danger-50 text-danger p-4 rounded-lg mb-6">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-success-50 text-success p-4 rounded-lg mb-6">
                    {success}
                </div>
            )}

            <Card className="mt-6">
                <CardHeader>
                    <h2 className="text-xl font-bold">Manage Your Money</h2>
                </CardHeader>
                <Divider />
                <CardBody>
                    <Tabs aria-label="Transaction options">
                        <Tab
                            key="deposit"
                            title={
                                <div className="flex items-center gap-2">
                                    <Icon icon="lucide:arrow-down-circle" />
                                    <span>Deposit</span>
                                </div>
                            }
                        >
                            <form
                                onSubmit={handleDeposit}
                                className="py-4 space-y-4"
                            >
                                <Select
                                    label="Select Account"
                                    placeholder={
                                        selectedItem || "Choose an account"
                                    }
                                    onSelectionChange={(key) => {
                                        console.log("Selected key:", key);
                                        const account = accounts.find(
                                            (acc) =>
                                                acc.accountID.toString() ===
                                                (key as string),
                                        );
                                        if (account) {
                                            console.log("Setting selected item:", account);
                                            setSelectedItem(
                                                `${account.accountType} (ID: ${account.accountID})`,
                                            );
                                        }
                                    }}
                                    className="min-w-[10rem]"
                                    isRequired
                                >
                                    {accounts.map((account) => (
                                        <SelectItem
                                            key={account.accountID.toString()}
                                            value={account.accountID.toString()}
                                        >
                                            {account.accountType} (ID:{" "}
                                            {account.accountID})
                                        </SelectItem>
                                    ))}
                                </Select>

                                <Input
                                    type="number"
                                    label="Amount"
                                    placeholder="Enter amount"
                                    value={depositAmount}
                                    onValueChange={setDepositAmount}
                                    startContent={
                                        <span className="text-default-400">
                                            $
                                        </span>
                                    }
                                    min="0.01"
                                    step="0.01"
                                    isRequired
                                />

                                <Button
                                    type="submit"
                                    color="primary"
                                    isLoading={isDepositLoading}
                                    startContent={
                                        <Icon icon="lucide:arrow-down-circle" />
                                    }
                                >
                                    Deposit Funds
                                </Button>
                            </form>
                        </Tab>

                        <Tab
                            key="withdraw"
                            title={
                                <div className="flex items-center gap-2">
                                    <Icon icon="lucide:arrow-up-circle" />
                                    <span>Withdraw</span>
                                </div>
                            }
                        >
                            <form
                                onSubmit={handleWithdraw}
                                className="py-4 space-y-4"
                            >
                                <Select
                                    label="Select Account"
                                    placeholder="Choose an account"
                                    selectedKeys={
                                        withdrawAccountId
                                            ? [withdrawAccountId]
                                            : []
                                    }
                                    onChange={(e) =>
                                        setWithdrawAccountId(e.target.value)
                                    }
                                    isRequired
                                >
                                    {accounts.map((account) => (
                                        <SelectItem
                                            key={account.accountID.toString()}
                                            value={account.accountID}
                                        >
                                            {account.accountType} (ID:{" "}
                                            {account.accountID}) - Balance: $
                                            {account.balance}
                                        </SelectItem>
                                    ))}
                                </Select>

                                <Input
                                    type="number"
                                    label="Amount"
                                    placeholder="Enter amount"
                                    value={withdrawAmount}
                                    onValueChange={setWithdrawAmount}
                                    startContent={
                                        <span className="text-default-400">
                                            $
                                        </span>
                                    }
                                    min="0.01"
                                    step="0.01"
                                    isRequired
                                />

                                <Button
                                    type="submit"
                                    color="primary"
                                    isLoading={isWithdrawLoading}
                                    startContent={
                                        <Icon icon="lucide:arrow-up-circle" />
                                    }
                                >
                                    Withdraw Funds
                                </Button>
                            </form>
                        </Tab>

                        <Tab
                            key="transfer"
                            title={
                                <div className="flex items-center gap-2">
                                    <Icon icon="lucide:repeat" />
                                    <span>Transfer</span>
                                </div>
                            }
                        >
                            <form
                                onSubmit={handleTransfer}
                                className="py-4 space-y-4"
                            >
                                <Select
                                    label="From Account"
                                    placeholder="Choose source account"
                                    selectedKeys={
                                        fromAccountId ? [fromAccountId] : []
                                    }
                                    onChange={(e) =>
                                        setFromAccountId(e.target.value)
                                    }
                                    isRequired
                                >
                                    {accounts.map((account) => (
                                        <SelectItem
                                            key={account.accountID.toString()}
                                            value={account.accountID}
                                        >
                                            {account.accountType} (ID:{" "}
                                            {account.accountID}) - Balance: $
                                            {account.balance}
                                        </SelectItem>
                                    ))}
                                </Select>

                                <Select
                                    label="To Account"
                                    placeholder="Choose destination account"
                                    selectedKeys={
                                        toAccountId ? [toAccountId] : []
                                    }
                                    onChange={(e) =>
                                        setToAccountId(e.target.value)
                                    }
                                    isRequired
                                >
                                    {accounts.map((account) => (
                                        <SelectItem
                                            key={account.accountID.toString()}
                                            value={account.accountID}
                                        >
                                            {account.accountType} (ID:{" "}
                                            {account.accountID})
                                        </SelectItem>
                                    ))}
                                </Select>

                                <Input
                                    type="number"
                                    label="Amount"
                                    placeholder="Enter amount"
                                    value={transferAmount}
                                    onValueChange={setTransferAmount}
                                    startContent={
                                        <span className="text-default-400">
                                            $
                                        </span>
                                    }
                                    min="0.01"
                                    step="0.01"
                                    isRequired
                                />

                                <Button
                                    type="submit"
                                    color="primary"
                                    isLoading={isTransferLoading}
                                    startContent={<Icon icon="lucide:repeat" />}
                                >
                                    Transfer Funds
                                </Button>
                            </form>
                        </Tab>
                    </Tabs>
                </CardBody>
            </Card>

            <Card className="mt-6">
                <CardHeader className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Transaction History</h2>
                    <Select
                        label="Filter by"
                        selectedKeys={[historyTab]}
                        onSelectionChange={(keys) => {
                            const newTab = Array.from(keys)[0] as
                                | "all"
                                | "deposits"
                                | "withdrawals";
                            setHistoryTab(newTab);
                            fetchHistory(newTab);
                        }}
                        className="max-w-xs"
                    >
                        <SelectItem key="all" value="all">
                            All
                        </SelectItem>
                        <SelectItem key="deposits" value="deposits">
                            Deposits
                        </SelectItem>
                        <SelectItem key="withdrawals" value="withdrawals">
                            Withdrawals
                        </SelectItem>
                    </Select>
                </CardHeader>
                <Divider />
                <CardBody>
                    <div className="overflow-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="text-left text-sm text-default-500 border-b">
                                    <th className="py-2 pr-4">Type</th>
                                    <th className="py-2 pr-4">Account ID</th>
                                    <th className="py-2 pr-4">Amount</th>
                                    <th className="py-2 pr-4">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(historyTab === "all"
                                    ? [
                                          ...transactionHistory.deposits.map(
                                              (d) => ({
                                                  ...d,
                                                  type: "Deposit",
                                              }),
                                          ),
                                          ...transactionHistory.withdrawals.map(
                                              (w) => ({
                                                  ...w,
                                                  type: "Withdrawal",
                                              }),
                                          ),
                                      ]
                                    : historyTab === "deposits"
                                      ? transactionHistory.deposits.map(
                                            (d) => ({ ...d, type: "Deposit" }),
                                        )
                                      : transactionHistory.withdrawals.map(
                                            (w) => ({
                                                ...w,
                                                type: "Withdrawal",
                                            }),
                                        )
                                ).map((txn, idx) => (
                                    <tr key={idx} className="border-b text-sm">
                                        <td className="py-2 pr-4">
                                            <div className="flex items-center gap-2">
                                                <Icon
                                                    icon={`lucide:${txn.type === "Deposit" ? "banknote-arrow-up" : "banknote-arrow-down"}`}
                                                    className={`text-${
                                                        txn.type === "Deposit"
                                                            ? "primary"
                                                            : "warning"
                                                    }`}
                                                />
                                                <Chip
                                                    size="sm"
                                                    color={
                                                        txn.type === "Deposit"
                                                            ? "primary"
                                                            : "warning"
                                                    }
                                                    variant="flat"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span>{txn.type}</span>
                                                    </div>
                                                </Chip>
                                            </div>
                                        </td>
                                        <td className="py-2 pr-4">
                                            {txn.account_id}
                                        </td>
                                        <td className="py-2 pr-4">
                                            ${Number(txn.amount).toFixed(2)}
                                        </td>
                                        <td className="py-2 pr-4">
                                            {txn.deposit_date
                                                ? new Date(
                                                      txn.deposit_date,
                                                  ).toLocaleDateString()
                                                : txn.withdrawal_date
                                                  ? new Date(
                                                        txn.withdrawal_date,
                                                    ).toLocaleDateString()
                                                  : "-"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

export default TransactionsPage;