import React from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    Divider,
    Select,
    SelectItem,
    Button,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { getAccounts, getBranches, createAccount } from "../api/api";

interface Account {
    accountID: number;
    accountType: string;
    balance: number;
    branchName: string;
}

interface Branch {
    branchId: number;
    branchName: string;
}

const AccountsPage: React.FC = () => {
    const [accounts, setAccounts] = React.useState<Account[]>([]);
    const [branches, setBranches] = React.useState<Branch[]>([]);
    const [accountType, setAccountType] = React.useState<string>("checking");
    const [branchId, setBranchId] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [creating, setCreating] = React.useState(false);
    const [error, setError] = React.useState("");

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

    const fetchBranches = async () => {
        try {
            const response = await getBranches();
            setBranches(response);
            if (response.length > 0) {
                setBranchId(response[0].branchId.toString());
            }
        } catch (err) {
            console.error("Error fetching branches:", err);
        }
    };

    React.useEffect(() => {
        fetchBranches();
        fetchAccounts();
    }, []);

    const handleCreateAccount = async () => {
        if (!branchId) return alert("Please select a branch");
        setCreating(true);
        try {
            await createAccount(accountType, parseInt(branchId));
            await fetchAccounts();
        } catch (err) {
            console.error("Error creating account:", err);
            alert("Failed to create account.");
        } finally {
            setCreating(false);
        }
    };

    const getAccountTypeIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case "checking":
                return (
                    <Icon icon="lucide:credit-card" className="text-primary" />
                );
            case "savings":
                return (
                    <Icon icon="lucide:piggy-bank" className="text-secondary" />
                );
            default:
                return (
                    <Icon icon="lucide:landmark" className="text-default-500" />
                );
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    if (isLoading) {
        return (
            <div className="container mx-auto max-w-5xl flex justify-center items-center h-64">
                <p>Loading accounts...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto max-w-5xl">
                <div className="bg-danger-50 text-danger p-4 rounded-lg">
                    {error}
                </div>
            </div>
        );
    }

    const totalBalance = accounts.reduce(
        (sum, account) => sum + Number(account.balance || 0),
        0,
    );

    return (
        <div className="container mx-auto max-w-5xl">
            <h1 className="text-3xl font-bold mb-6">Your Accounts</h1>

            <Card className="mb-6">
                <CardBody>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <p className="text-default-500">Total Balance</p>
                            <p className="text-3xl font-bold">
                                {formatCurrency(totalBalance)}
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <Select
                                label="Account Type"
                                name="accountType"
                                selectedKeys={[accountType]}
                                onSelectionChange={(keys) =>
                                    setAccountType(
                                        Array.from(keys)[0] as string,
                                    )
                                }
                                className="min-w-[10rem]"
                            >
                                <SelectItem key="checking" value="checking">
                                    Checking
                                </SelectItem>
                                <SelectItem key="savings" value="savings">
                                    Savings
                                </SelectItem>
                            </Select>

                            <Select
                                label="Branch"
                                name="branch"
                                selectedKeys={[branchId || ""]}
                                onSelectionChange={(keys) =>
                                    setBranchId(Array.from(keys)[0] as string)
                                }
                                className="min-w-[10rem]"
                            >
                                {branches.map((branch) => (
                                    <SelectItem
                                        key={branch.branchId}
                                        value={branch.branchId.toString()}
                                    >
                                        {branch.branchName}
                                    </SelectItem>
                                ))}
                            </Select>

                            <Button
                                color="primary"
                                onClick={handleCreateAccount}
                                isLoading={creating}
                            >
                                Create
                            </Button>
                        </div>
                    </div>
                </CardBody>
            </Card>

            <Card>
                <CardHeader className="flex gap-3">
                    <div className="flex flex-col">
                        <p className="text-md font-bold">Account Details</p>
                        <p className="text-small text-default-500">
                            View all your accounts and balances
                        </p>
                    </div>
                </CardHeader>
                <Divider />
                <CardBody>
                    {accounts.length === 0 ? (
                        <div className="text-center py-6">
                            <p className="text-default-500">
                                No accounts found.
                            </p>
                        </div>
                    ) : (
                        <Table aria-label="Accounts table">
                            <TableHeader>
                                <TableColumn>ACCOUNT ID</TableColumn>
                                <TableColumn>TYPE</TableColumn>
                                <TableColumn>BALANCE</TableColumn>
                                <TableColumn>BRANCH</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {accounts.map((account) => (
                                    <TableRow key={account.accountID}>
                                        <TableCell>
                                            {account.accountID}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {getAccountTypeIcon(
                                                    account.accountType,
                                                )}
                                                <Chip
                                                    color={
                                                        account.accountType.toLowerCase() ===
                                                        "checking"
                                                            ? "primary"
                                                            : "secondary"
                                                    }
                                                    variant="flat"
                                                    size="sm"
                                                >
                                                    {account.accountType}
                                                </Chip>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {formatCurrency(account.balance)}
                                        </TableCell>
                                        <TableCell>
                                            {account.branchName}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardBody>
            </Card>
        </div>
    );
};

export default AccountsPage;
