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
    Divider,
    Button,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { getCreditCards, createCreditCard } from "../api/api";

interface CreditCard {
    card_number: string;
    card_type: string;
    credit_limit: number;
    balance: number;
    issue_date: string;
    expiration_date: string;
    account_id: number;
}

const CreditCardsPage: React.FC = () => {
    const [cards, setCards] = React.useState<CreditCard[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [creating, setCreating] = React.useState(false);
    const [error, setError] = React.useState("");

    const fetchCards = async () => {
        try {
            const response = await getCreditCards();
            setCards(response);
        } catch (err) {
            setError("Failed to load credit cards");
            console.error("Error fetching cards:", err);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchCards();
    }, []);

    const handleApplyCard = async () => {
        setCreating(true);
        try {
            await createCreditCard();
            await fetchCards();
        } catch (err) {
            console.error("Error creating card:", err);
            alert("Failed to create credit card");
        } finally {
            setCreating(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    const totalLimit = cards.reduce((sum, c) => sum + c.credit_limit, 0);
    const totalBalance = cards.reduce((sum, c) => sum + c.balance, 0);
    const utilization = totalLimit > 0 ? (totalBalance / totalLimit) * 100 : 0;

    return (
        <div className="container mx-auto max-w-5xl">
            <h1 className="text-3xl font-bold mb-6">Your Credit Cards</h1>

            {/* Promo / apply card */}
            <Card className="mb-6 bg-primary-50">
                <CardBody className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <p className="text-default-600">
                            Enjoy simplified purchasing power with AJNXBanking
                            credit cards. No annual fees. Competitive interest.
                            Pure convenience.
                        </p>
                    </div>
                    {cards.length === 0 && (
                        <Button
                            color="primary"
                            onClick={handleApplyCard}
                            isLoading={creating}
                        >
                            Apply Now
                        </Button>
                    )}
                </CardBody>
            </Card>

            <Card className="mb-6">
                <CardBody>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <p className="text-default-500">
                                Total Credit Limit
                            </p>
                            <p className="text-xl font-bold">
                                {formatCurrency(totalLimit)}
                            </p>
                        </div>
                        <div>
                            <p className="text-default-500">Total Balance</p>
                            <p className="text-xl font-bold">
                                {formatCurrency(totalBalance)}
                            </p>
                        </div>
                        <div>
                            <p className="text-default-500">Utilization</p>
                            <p className="text-xl font-bold">
                                {utilization.toFixed(1)}%
                            </p>
                        </div>
                    </div>
                </CardBody>
            </Card>

            <Card>
                <CardHeader className="flex gap-3">
                    <div className="flex flex-col">
                        <p className="text-md font-bold">Card Details</p>
                        <p className="text-small text-default-500">
                            View your card information and balances
                        </p>
                    </div>
                </CardHeader>
                <Divider />
                <CardBody>
                    {loading ? (
                        <div className="text-center">Loading...</div>
                    ) : cards.length === 0 ? (
                        <div className="text-center py-6">
                            <p className="text-default-500">
                                No credit card found.
                            </p>
                        </div>
                    ) : (
                        <Table aria-label="Credit Card Table">
                            <TableHeader>
                                <TableColumn>CARD NUMBER</TableColumn>
                                <TableColumn>TYPE</TableColumn>
                                <TableColumn>LIMIT</TableColumn>
                                <TableColumn>BALANCE</TableColumn>
                                <TableColumn>ISSUED</TableColumn>
                                <TableColumn>EXPIRES</TableColumn>
                                <TableColumn>ACCOUNT</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {cards.map((card) => (
                                    <TableRow key={card.card_number}>
                                        <TableCell>
                                            {"•••• " +
                                                card.card_number.toString().slice(-4)}
                                        </TableCell>
                                        <TableCell>{card.card_type}</TableCell>
                                        <TableCell>
                                            {formatCurrency(card.credit_limit)}
                                        </TableCell>
                                        <TableCell>
                                            {formatCurrency(card.balance)}
                                        </TableCell>
                                        <TableCell>{card.issue_date}</TableCell>
                                        <TableCell>
                                            {card.expiration_date}
                                        </TableCell>
                                        <TableCell>{card.account_id}</TableCell>
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

export default CreditCardsPage;
