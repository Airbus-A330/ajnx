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
    Button,
    Tooltip,
    Input,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import {
    getUsers,
    deleteUser,
    updateUser,
    getCustomerProfileById,
} from "../api/api";

interface User {
    userID: number;
    username: string;
    role: string;
    accountCount: number;
}

interface CustomerProfile {
    first_name: string;
    last_name: string;
    address: string;
    phone: string;
    email: string;
    role: string;
}

const AdminUsersPage: React.FC = () => {
    const [users, setUsers] = React.useState<User[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState("");
    const [isEditing, setIsEditing] = React.useState(false);
    const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
    const [editForm, setEditForm] = React.useState<CustomerProfile>({
        first_name: "",
        last_name: "",
        address: "",
        phone: "",
        email: "",
        role: "customer",
    });

    const formatPhoneNumber = (phoneNumberString: string) => {
        var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
        var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return "(" + match[1] + ") " + match[2] + "-" + match[3];
        }
        return null;
    };

    const fetchAndPopulateCustomerProfile = async (userID: number) => {
        try {
            const profile = await getCustomerProfileById(userID); 
            if (profile) {
                setEditForm({
                    first_name: profile.first_name || "",
                    last_name: profile.last_name || "",
                    address: profile.address || "",
                    phone: profile.phone || "",
                    email: profile.email || "",
                    role: profile.role || "customer", 
                });
            }
        } catch (error) {
            console.error("Failed to load customer profile:", error);
            setEditForm({
                first_name: "",
                last_name: "",
                address: "",
                phone: "",
                email: "",
                role: "customer",
            });
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await getUsers();
            setUsers(response);
        } catch (err) {
            setError("You do not have access to this feature.");
            console.error("Error fetching users:", err);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchUsers();
    }, []);

    const handleDeleteUser = async (userID: number) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this user?",
        );
        if (!confirmDelete) return;

        try {
            await deleteUser(userID);
            setUsers((prev) => prev.filter((user) => user.userID !== userID));
        } catch (err) {
            alert("Failed to delete user");
            console.error(err);
        }
    };

    const handleEditUser = (user: User) => {
        fetchAndPopulateCustomerProfile(user.userID);
        setSelectedUser(user.userID);
        setIsEditing(true);
    };

    const getRoleColor = (role: string) => {
        switch (role.toLowerCase()) {
            case "admin":
                return "danger";
            case "manager":
                return "warning";
            case "customer":
                return "primary";
            default:
                return "default";
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto max-w-5xl flex justify-center items-center h-64">
                <p>Loading users...</p>
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
            <div className="flex items-center gap-2 mb-6">
                <Icon icon="lucide:shield" className="text-primary" />
                <h1 className="text-3xl font-bold">Admin: User Management</h1>
            </div>

            <Card>
                <CardHeader className="flex gap-3">
                    <div className="flex flex-col">
                        <p className="text-md font-bold">All Users</p>
                        <p className="text-small text-default-500">
                            Manage system users
                        </p>
                    </div>
                </CardHeader>
                <Divider />
                <CardBody>
                    {users.length === 0 ? (
                        <div className="text-center py-6">
                            <p className="text-default-500">No users found.</p>
                        </div>
                    ) : (
                        <Table aria-label="Users table">
                            <TableHeader>
                                <TableColumn>ID</TableColumn>
                                <TableColumn>USERNAME</TableColumn>
                                <TableColumn>ROLE</TableColumn>
                                <TableColumn>ACCOUNTS</TableColumn>
                                <TableColumn>ACTIONS</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.userID}>
                                        <TableCell>{user.userID}</TableCell>
                                        <TableCell>{user.username}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Icon
                                                    className={`text-${getRoleColor(user.role)}`}
                                                    icon={`lucide:${user.role == "admin" ? "shield-user" : "user"}`}
                                                />
                                                <Chip
                                                    color={getRoleColor(
                                                        user.role,
                                                    )}
                                                    variant="flat"
                                                    size="sm"
                                                >
                                                    {user.role}
                                                </Chip>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {user.accountCount ?? 0}
                                        </TableCell>
                                        <TableCell className="flex gap-2">
                                            <Tooltip content="Edit user">
                                                <Button
                                                    isIconOnly
                                                    color="primary"
                                                    variant="light"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleEditUser(user)
                                                    }
                                                >
                                                    <Icon icon="lucide:pencil" />
                                                </Button>
                                            </Tooltip>
                                            <Tooltip content="Delete user">
                                                <Button
                                                    isIconOnly
                                                    color="danger"
                                                    variant="light"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleDeleteUser(
                                                            user.userID,
                                                        )
                                                    }
                                                >
                                                    <Icon icon="lucide:trash-2" />
                                                </Button>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardBody>
            </Card>

            {/* Edit Modal */}
            {isEditing && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md space-y-4">
                        <h2 className="text-xl font-bold mb-4">
                            Edit User: {selectedUser.username}
                        </h2>
                        <Input
                            label="First Name"
                            value={editForm.first_name}
                            onChange={(e) =>
                                setEditForm({
                                    ...editForm,
                                    first_name: e.target.value,
                                })
                            }
                            required
                        />
                        <Input
                            label="Last Name"
                            value={editForm.last_name}
                            onChange={(e) =>
                                setEditForm({
                                    ...editForm,
                                    last_name: e.target.value,
                                })
                            }
                            required
                        />
                        <Input
                            label="Address"
                            value={editForm.address}
                            onChange={(e) =>
                                setEditForm({
                                    ...editForm,
                                    address: e.target.value,
                                })
                            }
                            required
                        />
                        <Input
                            label="Phone"
                            value={formatPhoneNumber(editForm.phone)}
                            onChange={(e) =>
                                setEditForm({
                                    ...editForm,
                                    phone: e.target.value,
                                })
                            }
                            required
                        />
                        <Input
                            label="Email"
                            value={editForm.email}
                            onChange={(e) =>
                                setEditForm({
                                    ...editForm,
                                    email: e.target.value,
                                })
                            }
                            required
                        />

                        <div className="flex items-center justify-between mt-4">
                            <label className="text-sm font-medium">
                                Admin Access
                            </label>
                            <Button
                                color={
                                    editForm.role === "admin"
                                        ? "danger"
                                        : "secondary"
                                }
                                variant="flat"
                                size="sm"
                                onClick={() =>
                                    setEditForm({
                                        ...editForm,
                                        role:
                                            editForm.role === "admin"
                                                ? "customer"
                                                : "admin",
                                    })
                                }
                            >
                                {editForm.role === "admin"
                                    ? "Admin"
                                    : "Customer"}
                            </Button>
                        </div>

                        <div className="flex justify-end gap-2 mt-6">
                            <Button
                                variant="light"
                                onClick={() => setIsEditing(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                color="primary"
                                onClick={async () => {
                                    try {
                                        await updateUser(
                                            selectedUser.userID,
                                            editForm,
                                        );
                                        await fetchUsers();
                                        setIsEditing(false);
                                    } catch (err) {
                                        console.error(
                                            "Error updating user:",
                                            err,
                                        );
                                        alert("Failed to update user.");
                                    }
                                }}
                            >
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsersPage;
