import React from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Tabs,
    Tab,
    Input,
    Button,
    Select,
    SelectItem,
    Divider,
    Chip,
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

    const [historyTab, setHistoryTab] = React.useState("all");
    const [transactionHistory, setTransactionHistory] = React.useState<{
        deposits: any[];
        withdrawals: any[];
    }>({
        deposits: [],
        withdrawals: [],
    });

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

    const fetchHistory = async (type: string) => {
        try {
            const response = await getTransactionHistory(type);
            setTransactionHistory(response);
        } catch (err) {
            console.error("Error loading transaction history:", err);
        }
    };

    React.useEffect(() => {
        fetchAccounts();
        fetchHistory("all");
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
            await fetchAccounts();
            await fetchHistory(historyTab);
        } catch (err) {
            setError("Deposit failed. Please try again.");
            console.error("Deposit error:", err);
        } finally {
            setIsDepositLoading(false);
        }
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
            await fetchAccounts();
            await fetchHistory(historyTab);
        } catch (err) {
            setError("Withdrawal failed. Please try again.");
            console.error("Withdraw error:", err);
        } finally {
            setIsWithdrawLoading(false);
        }
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
            await fetchAccounts();
        } catch (err) {
            setError("Transfer failed. Please try again.");
            console.error("Transfer error:", err);
        } finally {
            setIsTransferLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

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

            <Card className="mb-6">
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
                            {/* Deposit form here */}
                            {/* omitted for brevity */}
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
                            {/* Withdraw form here */}
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
                            {/* Transfer form here */}
                        </Tab>
                    </Tabs>
                </CardBody>
            </Card>

            <Card>
                <CardHeader className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Transaction History</h2>
                    <Select
                        label="Filter by"
                        selectedKeys={[historyTab]}
                        onSelectionChange={(keys) => {
                            const newTab = Array.from(keys)[0] as string;
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
                                            <Chip
                                                size="sm"
                                                color={
                                                    txn.type === "Deposit"
                                                        ? "primary"
                                                        : "warning"
                                                }
                                                variant="flat"
                                            >
                                                {txn.type}
                                            </Chip>
                                        </td>
                                        <td className="py-2 pr-4">
                                            {txn.account_id}
                                        </td>
                                        <td className="py-2 pr-4">
                                            {formatCurrency(txn.amount)}
                                        </td>
                                        <td className="py-2 pr-4">
                                            {txn.deposit_date ||
                                                txn.withdrawal_date ||
                                                "-"}
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
