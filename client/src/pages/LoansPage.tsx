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
    Select,
    SelectItem,
    Input,
    Button,
    Divider,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import {
    getAccounts,
    getLoans,
    createLoan,
    makePayment,
    getPayments,
} from "../api/api";

interface Account {
    accountID: number;
    accountType: string;
    balance: number;
}

interface Loan {
    loan_id: number;
    account_id: number;
    loan_amount: number;
    interest_rate: number;
    start_date: string;
    due_date: string;
    status: string;
}

interface Payment {
    payment_id: number;
    loan_id: number;
    amount: number;
    payment_date: string;
}

const LoansPage: React.FC = () => {
    const [accounts, setAccounts] = React.useState<Account[]>([]);
    const [loans, setLoans] = React.useState<Loan[]>([]);
    const [payments, setPayments] = React.useState<Payment[]>([]);

    const [selectedAccountId, setSelectedAccountId] = React.useState<string>("");
    const [loanAmount, setLoanAmount] = React.useState<string>("");
    const [selectedLoanId, setSelectedLoanId] = React.useState<string>("");
    const [paymentAmount, setPaymentAmount] = React.useState<string>("");

    const [isLoading, setIsLoading] = React.useState(true);
    const [creatingLoan, setCreatingLoan] = React.useState(false);
    const [makingPayment, setMakingPayment] = React.useState(false);

    React.useEffect(() => {
        fetchAccounts();
        fetchLoans();
    }, []);

    const fetchAccounts = async () => {
        try {
            const response = await getAccounts();
            setAccounts(response);
        } catch (err) {
            console.error("Error fetching accounts:", err);
        }
    };

    const fetchLoans = async () => {
        try {
            const response = await getLoans();
            setLoans(response);
        } catch (err) {
            console.error("Error fetching loans:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchPayments = async (loanId: number) => {
        try {
            const response = await getPayments(loanId);
            setPayments(response);
        } catch (err) {
            console.error("Error fetching payments:", err);
        }
    };

    const handleApplyLoan = async () => {
        if (!selectedAccountId || !loanAmount) {
            alert("Please select an account and enter a loan amount.");
            return;
        }
        setCreatingLoan(true);
        try {
            await createLoan(Number(selectedAccountId), Number(loanAmount));
            await fetchLoans();
            setLoanAmount("");
        } catch (err) {
            console.error("Error applying for loan:", err);
            alert("Failed to apply for loan.");
        } finally {
            setCreatingLoan(false);
        }
    };

    const handleMakePayment = async () => {
        if (!selectedLoanId || !paymentAmount) {
            alert("Please select a loan and enter a payment amount.");
            return;
        }
        setMakingPayment(true);
        try {
            await makePayment(Number(selectedLoanId), Number(paymentAmount));
            await fetchLoans();
            await fetchPayments(Number(selectedLoanId));
            setPaymentAmount("");
        } catch (err) {
            console.error("Error making payment:", err);
            alert("Failed to make payment.");
        } finally {
            setMakingPayment(false);
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto max-w-5xl flex justify-center items-center h-64">
                <p>Loading loans...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-5xl">
            <h1 className="text-3xl font-bold mb-6">Loans</h1>

            {/* Apply for Loan Card */}
            <Card className="mb-6">
                <CardBody>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Select
                                label="Select Account"
                                selectedKeys={selectedAccountId ? [selectedAccountId] : []}
                                onChange={(e) => setSelectedAccountId(e.target.value)}
                                className="min-w-[10rem]"
                            >
                                {accounts.map((account) => (
                                    <SelectItem
                                        key={account.accountID}
                                        value={account.accountID.toString()}
                                    >
                                        {account.accountType} (ID: {account.accountID})
                                    </SelectItem>
                                ))}
                            </Select>

                            <Input
                                label="Loan Amount"
                                type="number"
                                value={loanAmount}
                                onChange={(e) => setLoanAmount(e.target.value)}
                                className="min-w-[10rem]"
                                startContent={<span className="text-default-400">$</span>}
                            />

                            <Button
                                color="primary"
                                onClick={handleApplyLoan}
                                isLoading={creatingLoan}
                            >
                                Apply
                            </Button>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Loan Details Card */}
            <Card className="mb-6">
                <CardHeader className="flex gap-3">
                    <div className="flex flex-col">
                        <p className="text-md font-bold">Your Loans</p>
                        <p className="text-small text-default-500">
                            Manage your current loans
                        </p>
                    </div>
                </CardHeader>
                <Divider />
                <CardBody>
                    {loans.length === 0 ? (
                        <div className="text-center py-6">
                            <p className="text-default-500">No loans found.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableColumn>Loan ID</TableColumn>
                                <TableColumn>Account ID</TableColumn>
                                <TableColumn>Loan Amount</TableColumn>
                                <TableColumn>Interest Rate (%)</TableColumn>
                                <TableColumn>Start Date</TableColumn>
                                <TableColumn>Due Date</TableColumn>
                                <TableColumn>Status</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {loans.map((loan) => (
                                    <TableRow key={loan.loan_id}>
                                        <TableCell>{loan.loan_id}</TableCell>
                                        <TableCell>{loan.account_id}</TableCell>
                                        <TableCell>${loan.loan_amount.toFixed(2)}</TableCell>
                                        <TableCell>{loan.interest_rate.toFixed(2)}</TableCell>
                                        <TableCell>{loan.start_date}</TableCell>
                                        <TableCell>{loan.due_date}</TableCell>
                                        <TableCell>{loan.status}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardBody>
            </Card>

            {/* Make a Payment Card */}
            <Card className="mb-6">
                <CardBody>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Select
                                label="Select Loan"
                                selectedKeys={selectedLoanId ? [selectedLoanId] : []}
                                onChange={(e) => {
                                    setSelectedLoanId(e.target.value);
                                    fetchPayments(Number(e.target.value));
                                }}
                                className="min-w-[10rem]"
                            >
                                {loans.map((loan) => (
                                    <SelectItem
                                        key={loan.loan_id}
                                        value={loan.loan_id.toString()}
                                    >
                                        Loan ID: {loan.loan_id}
                                    </SelectItem>
                                ))}
                            </Select>

                            <Input
                                label="Payment Amount"
                                type="number"
                                value={paymentAmount}
                                onChange={(e) => setPaymentAmount(e.target.value)}
                                className="min-w-[10rem]"
                                startContent={<span className="text-default-400">$</span>}
                            />

                            <Button
                                color="primary"
                                onClick={handleMakePayment}
                                isLoading={makingPayment}
                            >
                                Pay Loan
                            </Button>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Payment History Card */}
            {selectedLoanId && (
                <Card className="mb-8">
                    <CardHeader className="flex gap-3">
                        <div className="flex flex-col">
                            <p className="text-md font-bold">Payment History</p>
                            <p className="text-small text-default-500">
                                All payments made towards Loan ID: {selectedLoanId}
                            </p>
                        </div>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        {payments.length === 0 ? (
                            <div className="text-center py-6">
                                <p className="text-default-500">No payments found.</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableColumn>Payment ID</TableColumn>
                                    <TableColumn>Amount</TableColumn>
                                    <TableColumn>Date</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {payments.map((payment) => (
                                        <TableRow key={payment.payment_id}>
                                            <TableCell>{payment.payment_id}</TableCell>
                                            <TableCell>${payment.amount.toFixed(2)}</TableCell>
                                            <TableCell>{payment.payment_date}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardBody>
                </Card>
            )}
        </div>
    );
};

export default LoansPage;