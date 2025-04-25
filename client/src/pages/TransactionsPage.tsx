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
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { getAccounts, deposit, withdraw, transfer } from "../api/api";

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

            <Card>
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
                                    placeholder="Choose an account"
                                    selectedKeys={
                                        depositAccountId
                                            ? [depositAccountId]
                                            : []
                                    }
                                    onChange={(e) =>
                                        setDepositAccountId(e.target.value)
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
        </div>
    );
};

export default TransactionsPage;
