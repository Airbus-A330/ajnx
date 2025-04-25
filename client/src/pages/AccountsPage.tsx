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
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { getAccounts } from "../api/api";

interface Account {
    accountID: number;
    accountType: string;
    balance: number;
}

const AccountsPage: React.FC = () => {
    const [accounts, setAccounts] = React.useState<Account[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState("");

    React.useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const response = await getAccounts();
                setAccounts(response.data);
            } catch (err) {
                setError("Failed to load accounts");
                console.error("Error fetching accounts:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAccounts();
    }, []);

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
        (sum, account) => sum + account.balance,
        0,
    );

    return (
        <div className="container mx-auto max-w-5xl">
            <h1 className="text-3xl font-bold mb-6">Your Accounts</h1>

            <Card className="mb-6">
                <CardBody>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-default-500">Total Balance</p>
                            <p className="text-3xl font-bold">
                                {formatCurrency(totalBalance)}
                            </p>
                        </div>
                        <div className="p-3 bg-primary-100 rounded-full">
                            <Icon
                                icon="lucide:wallet"
                                width={32}
                                height={32}
                                className="text-primary"
                            />
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
