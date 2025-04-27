import React from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Divider,
    Input,
    Button,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import {
    getMe,
    getCustomerProfile,
    createCustomerProfile,
    updateCustomerProfile,
} from "../api/api";

interface UserData {
    username: string;
    role: string;
    lastLogin: string;
}

interface CustomerProfile {
    first_name: string;
    last_name: string;
    address: string;
    phone: string;
    email: string;
}

const formatPhoneNumber = (phoneNumberString: string) => {
    var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return "(" + match[1] + ") " + match[2] + "-" + match[3];
    }
    return null;
};

const DashboardPage: React.FC = () => {
    const [userData, setUserData] = React.useState<UserData | null>(null);
    const [customerProfile, setCustomerProfile] =
        React.useState<CustomerProfile | null>(null);
    const [formData, setFormData] = React.useState<CustomerProfile>({
        first_name: "",
        last_name: "",
        address: "",
        phone: "",
        email: "",
    });
    const [editing, setEditing] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState("");

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const user = await getMe();
                setUserData({
                    username: user.username,
                    role: user.role,
                    lastLogin: user?.lastLogin || "Now",
                });

                try {
                    const profile = await getCustomerProfile();
                    if (profile) {
                        setCustomerProfile(profile);
                        setFormData(profile);
                    }
                } catch (profileError: any) {
                    setCustomerProfile(null);
                }
            } catch (err) {
                console.error("Error loading dashboard data:", err);
                setError("Failed to load user data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleChange = (field: keyof CustomerProfile, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = async () => {
        try {
            if (customerProfile) {
                await updateCustomerProfile(formData);
            } else {
                await createCustomerProfile(formData);
            }
            setCustomerProfile(formData);
            setEditing(false);
        } catch (err) {
            alert("Failed to save profile");
            console.error("Save error:", err);
        }
    };

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
                    <Icon icon="lucide:user-circle" className="text-primary" />
                    <div className="flex flex-col">
                        <p className="text-md font-bold">Profile</p>
                        <p className="text-small text-default-500">
                            Manage your personal details
                        </p>
                    </div>
                </CardHeader>
                <Divider />
                <CardBody>
                    {editing || !customerProfile ? (
                        <form className="space-y-4">
                            <Input
                                label="First Name"
                                value={formData.first_name}
                                onChange={(e) =>
                                    handleChange("first_name", e.target.value)
                                }
                                required
                            />
                            <Input
                                label="Last Name"
                                value={formData.last_name}
                                onChange={(e) =>
                                    handleChange("last_name", e.target.value)
                                }
                                required
                            />
                            <Input
                                label="Address"
                                value={formData.address}
                                onChange={(e) =>
                                    handleChange("address", e.target.value)
                                }
                                required
                            />
                            <Input
                                label="Phone"
                                value={formatPhoneNumber(formData.phone)}
                                onChange={(e) =>
                                    handleChange("phone", e.target.value)
                                }
                                required
                            />
                            <Input
                                label="Email"
                                value={formData.email}
                                onChange={(e) =>
                                    handleChange("email", e.target.value)
                                }
                                required
                            />
                            <div className="flex gap-4">
                                <Button color="primary" onClick={handleSubmit}>
                                    Save
                                </Button>
                                <Button
                                    variant="light"
                                    onClick={() => setEditing(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-2">
                            <p>
                                <strong>Name:</strong>{" "}
                                {customerProfile.first_name}{" "}
                                {customerProfile.last_name}
                            </p>
                            <p>
                                <strong>Address:</strong>{" "}
                                {customerProfile.address}
                            </p>
                            <p>
                                <strong>Phone:</strong> {customerProfile.phone}
                            </p>
                            <p>
                                <strong>Email:</strong> {customerProfile.email}
                            </p>
                            <Button
                                color="primary"
                                onClick={() => setEditing(true)}
                                disabled={
                                    !formData.first_name.trim() ||
                                    !formData.last_name.trim() ||
                                    !formData.address.trim() ||
                                    !formData.phone.trim() ||
                                    !formData.email.trim()
                                }
                            >
                                Edit Profile
                            </Button>
                        </div>
                    )}
                </CardBody>
            </Card>

            <Card className="mb-8">
                <CardHeader className="flex gap-3">
                    <Icon icon="lucide:info" className="text-primary" />
                    <div className="flex flex-col">
                        <p className="text-md font-bold">Quick Start</p>
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
