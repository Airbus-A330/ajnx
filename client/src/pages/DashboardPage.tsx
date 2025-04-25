import React from "react";
import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";
import { getMe } from "../api/api";

interface UserData {
    username: string;
    role: string;
    lastLogin: string;
}

const DashboardPage: React.FC = () => {
    const [userData, setUserData] = React.useState<UserData | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState("");

    React.useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await getMe();
                setUserData(response.data);
            } catch (err) {
                setError("Failed to load user data");
                console.error("Error fetching user data:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (isLoading) {
        return (
            <div className="container mx-auto max-w-5xl flex justify-center items-center h-64">
                <p>Loading...</p>
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

    return (
        <div className="container mx-auto max-w-5xl">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardBody className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary-100 rounded-full">
                                <Icon
                                    icon="lucide:user"
                                    width={24}
                                    height={24}
                                    className="text-primary"
                                />
                            </div>
                            <div>
                                <p className="text-default-500 text-sm">
                                    Welcome
                                </p>
                                <p className="font-bold text-xl">
                                    {userData?.username}
                                </p>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <Card>
                    <CardBody className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-secondary-100 rounded-full">
                                <Icon
                                    icon="lucide:shield"
                                    width={24}
                                    height={24}
                                    className="text-secondary"
                                />
                            </div>
                            <div>
                                <p className="text-default-500 text-sm">Role</p>
                                <p className="font-bold text-xl">
                                    {userData?.role || "Customer"}
                                </p>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <Card>
                    <CardBody className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary-100 rounded-full">
                                <Icon
                                    icon="lucide:clock"
                                    width={24}
                                    height={24}
                                    className="text-primary"
                                />
                            </div>
                            <div>
                                <p className="text-default-500 text-sm">
                                    Last Login
                                </p>
                                <p className="font-bold text-xl">
                                    {userData?.lastLogin || "Now"}
                                </p>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>

            <Card className="mb-8">
                <CardHeader className="flex gap-3">
                    <Icon icon="lucide:info" className="text-primary" />
                    <div className="flex flex-col">
                        <p className="text-md font-bold">Quick Start Guide</p>
                        <p className="text-small text-default-500">
                            How to use AJNX Banking
                        </p>
                    </div>
                </CardHeader>
                <Divider />
                <CardBody>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-2">
                            <Icon
                                icon="lucide:check-circle"
                                className="text-primary mt-1"
                            />
                            <span>
                                View your accounts and balances on the Accounts
                                page
                            </span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Icon
                                icon="lucide:check-circle"
                                className="text-primary mt-1"
                            />
                            <span>
                                Make deposits, withdrawals, and transfers on the
                                Transactions page
                            </span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Icon
                                icon="lucide:check-circle"
                                className="text-primary mt-1"
                            />
                            <span>
                                Access admin features through the Account
                                dropdown in the navigation bar
                            </span>
                        </li>
                    </ul>
                </CardBody>
            </Card>
        </div>
    );
};

export default DashboardPage;
