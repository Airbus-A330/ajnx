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
import { getUsers } from "../api/api";

interface User {
    userID: number;
    username: string;
    role: string;
    createdAt: string;
    lastLogin: string;
}

const AdminUsersPage: React.FC = () => {
    const [users, setUsers] = React.useState<User[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState("");

    React.useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getUsers();
                setUsers(response);
            } catch (err) {
                setError("Failed to load users");
                console.error("Error fetching users:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
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
                                <TableColumn>CREATED</TableColumn>
                                <TableColumn>LAST LOGIN</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.userID}>
                                        <TableCell>{user.userID}</TableCell>
                                        <TableCell>{user.username}</TableCell>
                                        <TableCell>
                                            <Chip
                                                color={getRoleColor(user.role)}
                                                variant="flat"
                                                size="sm"
                                            >
                                                {user.role}
                                            </Chip>
                                        </TableCell>
                                        <TableCell>
                                            {formatDate(user.createdAt)}
                                        </TableCell>
                                        <TableCell>
                                            {formatDate(user.lastLogin)}
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

export default AdminUsersPage;
