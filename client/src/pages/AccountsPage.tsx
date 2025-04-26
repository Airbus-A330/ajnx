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
import {
    getAccounts,
    getBranches,
    createAccount,
    getCreditCards,
} from "../api/api";

interface Account {
    accountID: number;
    accountType: string;
    balance: number;
    branch_name: string;
    first_name: string;
    last_name: string;
}

interface CreditCardAccount {
    account_id: number;
    card_type: string;
    balance: number;
    credit_limit: number;
    card_number: string;
}

interface Branch {
    branch_id: number;
    branch_name: string;
}

const AccountsPage: React.FC = () => {
    const [accounts, setAccounts] = React.useState<Account[]>([]);
    const [creditCard, setCreditCard] =
        React.useState<CreditCardAccount | null>(null);
    const [branches, setBranches] = React.useState<Branch[]>([]);
    const [accountType, setAccountType] = React.useState<string>("checking");
    const [branch_id, setBranchId] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [creating, setCreating] = React.useState(false);
    const [error, setError] = React.useState("");

    const fetchAccounts = async () => {
        try {
            const response = await getAccounts();
            setAccounts(
                response.map((account: any) => ({
                    accountID: account.accountID,
                    accountType: account.accountType,
                    balance: account.balance,
                    branch_name: account.branch_name,
                    first_name: account.first_name,
                    last_name: account.last_name,
                })),
            );
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
                setBranchId(response[0].branch_id.toString());
            }
        } catch (err) {
            console.error("Error fetching branches:", err);
        }
    };

    const fetchCreditCards = async () => {
        try {
            const response = await getCreditCards();
            setCreditCard(response.length > 0 ? response[0] : null);
        } catch (err) {
            console.error("Error fetching credit card:", err);
        }
    };

    React.useEffect(() => {
        fetchBranches();
        fetchAccounts();
        fetchCreditCards();
    }, []);

    const handleCreateAccount = async () => {
        if (!branch_id) return alert("Please select a branch");
        setCreating(true);
        try {
            await createAccount(accountType, parseInt(branch_id));
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
                return <Icon icon="lucide:coins" className="text-primary" />;
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

    const totalBalance =
        accounts.reduce(
            (sum, account) => sum + Number(account.balance || 0),
            0,
        ) + (creditCard ? Number(creditCard.balance || 0) : 0);

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
                                <SelectItem key="checking">Checking</SelectItem>
                                <SelectItem key="savings">Savings</SelectItem>
                            </Select>

                            <Select
                                label="Branch"
                                name="branch"
                                selectedKeys={[branch_id || ""]}
                                onSelectionChange={(keys) =>
                                    setBranchId(Array.from(keys)[0] as string)
                                }
                                className="min-w-[10rem]"
                            >
                                {branches.map((branch) => (
                                    <SelectItem key={branch.branch_id}>
                                        {branch.branch_name}
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
                    {[
                        ...accounts,
                        ...(creditCard
                            ? [
                                  {
                                      accountID: creditCard.account_id,
                                      accountType: "credit",
                                      balance: creditCard.balance,
                                      branch_name: (
                                          <Chip
                                              color={"primary"}
                                              variant="flat"
                                              size="sm"
                                          >
                                              <strong>Not Applicable</strong>
                                          </Chip>
                                      ),
                                  },
                              ]
                            : []),
                    ].length === 0 ? (
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
                                <TableColumn>BANKER</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {[
                                    ...accounts,
                                    ...(creditCard
                                        ? [
                                              {
                                                  accountID:
                                                      creditCard.account_id,
                                                  accountType: "credit",
                                                  balance: creditCard.balance,
                                                  branch_name: (
                                                      <Chip
                                                          color={"primary"}
                                                          variant="flat"
                                                          size="sm"
                                                      >
                                                          <strong>
                                                              Not Applicable
                                                          </strong>
                                                      </Chip>
                                                  ),
                                              },
                                          ]
                                        : []),
                                ].map((account) => (
                                    <TableRow key={account.accountID}>
                                        <TableCell>
                                            {account.accountID}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {account.accountType ===
                                                "credit" ? (
                                                    <Icon
                                                        icon="lucide:credit-card"
                                                        className="text-warning"
                                                    />
                                                ) : (
                                                    getAccountTypeIcon(
                                                        account.accountType,
                                                    )
                                                )}
                                                <Chip
                                                    color={
                                                        account.accountType.toLowerCase() ===
                                                        "checking"
                                                            ? "primary"
                                                            : account.accountType.toLowerCase() ===
                                                                "savings"
                                                              ? "secondary"
                                                              : "warning"
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
                                            {account.branch_name}
                                        </TableCell>
                                        <TableCell>
                                            {"first_name" in account &&
                                            "last_name" in account ? (
                                                `${account.first_name} ${account.last_name}`
                                            ) : (
                                                <Chip
                                                    color="primary"
                                                    variant="flat"
                                                    size="sm"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Icon
                                                            icon="lucide:shield-check"
                                                            className="text-primary"
                                                        />
                                                       <strong>AJNX Card Services</strong>
                                                    </div>
                                                </Chip>
                                            )}
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
