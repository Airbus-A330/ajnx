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
  Tooltip
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { getUsers, deleteUser } from "../api/api";

interface User {
  userID: number;
  username: string;
  role: string;
  accountCount: number; // ✅ new
}

const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = React.useState<User[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("");

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
    const confirm = window.confirm("Are you sure you want to delete this user?");
    if (!confirm) return;

    try {
      await deleteUser(userID);
      setUsers((prev) => prev.filter((user) => user.userID !== userID));
    } catch (err) {
      alert("Failed to delete user");
      console.error(err);
    }
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
                      <Chip
                        color={getRoleColor(user.role)}
                        variant="flat"
                        size="sm"
                      >
                        {user.role}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      {user.accountCount ?? 0}
                    </TableCell>
                    <TableCell>
                      <Tooltip content="Delete user">
                        <Button
                          isIconOnly
                          color="danger"
                          variant="light"
                          size="sm"
                          onClick={() => handleDeleteUser(user.userID)}
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
    </div>
  );
};

export default AdminUsersPage;