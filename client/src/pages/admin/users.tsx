import React from 'react';
import { Card, CardHeader, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Button, Input, Chip, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Spinner } from '@heroui/react';
import { Icon } from '@iconify/react';
import axios from 'axios';
import { addToast } from '@heroui/react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  lastLogin: string;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = React.useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [searchQuery, setSearchQuery] = React.useState('');
  const rowsPerPage = 10;
  
  React.useEffect(() => {
    fetchUsers();
  }, []);
  
  React.useEffect(() => {
    const filtered = users.filter(user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
    setPage(1);
  }, [searchQuery, users]);
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/users');
      setUsers(response.data);
      setFilteredUsers(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      await axios.patch(`/api/users/${userId}/status`, { status: newStatus });
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: newStatus as 'active' | 'inactive' | 'pending' } : user
      ));
      
      addToast({
        title: 'Status Updated',
        description: `User status has been updated to ${newStatus}`,
        color: 'success'
      });
    } catch (err) {
      addToast({
        title: 'Update Failed',
        description: 'Failed to update user status',
        color: 'danger'
      });
    }
  };
  
  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await axios.patch(`/api/users/${userId}/role`, { role: newRole });
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole as 'user' | 'admin' } : user
      ));
      
      addToast({
        title: 'Role Updated',
        description: `User role has been updated to ${newRole}`,
        color: 'success'
      });
    } catch (err) {
      addToast({
        title: 'Update Failed',
        description: 'Failed to update user role',
        color: 'danger'
      });
    }
  };
  
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'primary';
      case 'user':
        return 'default';
      default:
        return 'default';
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'danger';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const pages = Math.ceil(filteredUsers.length / rowsPerPage);
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredUsers.slice(start, end);
  }, [page, filteredUsers]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-default-500">Manage system users and their permissions</p>
        </div>
        <Button 
          color="primary"
          startContent={<Icon icon="lucide:user-plus" />}
          className="mt-4 sm:mt-0"
        >
          Add User
        </Button>
      </div>
      
      <Card className="bg-content1">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-4">
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startContent={<Icon icon="lucide:search" className="text-default-400 text-sm" />}
              isClearable
              onClear={() => setSearchQuery('')}
              className="w-full sm:max-w-xs"
            />
            <div className="flex gap-2">
              <Button 
                variant="flat" 
                size="sm"
                startContent={<Icon icon="lucide:filter" className="text-sm" />}
              >
                Filter
              </Button>
              <Button 
                variant="flat" 
                size="sm"
                startContent={<Icon icon="lucide:refresh-cw" className="text-sm" />}
                onPress={() => fetchUsers()}
                isLoading={loading}
              >
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardBody>
          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner color="primary" />
            </div>
          ) : error ? (
            <div className="text-center py-12 text-danger">
              <Icon icon="lucide:alert-circle" className="text-5xl mb-2" />
              <p>{error}</p>
              <Button 
                color="primary"
                variant="flat"
                size="sm"
                onPress={() => fetchUsers()}
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <>
              <Table aria-label="Users table">
                <TableHeader>
                  <TableColumn>USER</TableColumn>
                  <TableColumn>ROLE</TableColumn>
                  <TableColumn>STATUS</TableColumn>
                  <TableColumn>CREATED</TableColumn>
                  <TableColumn>LAST LOGIN</TableColumn>
                  <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody emptyContent="No users found">
                  {items.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <p className="font-medium">{user.name}</p>
                          <p className="text-default-500 text-xs">{user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Dropdown>
                          <DropdownTrigger>
                            <Chip 
                              color={getRoleColor(user.role) as any}
                              variant="flat"
                              className="cursor-pointer"
                            >
                              {user.role}
                            </Chip>
                          </DropdownTrigger>
                          <DropdownMenu 
                            aria-label="Role Actions"
                            onAction={(key) => handleRoleChange(user.id, key as string)}
                          >
                            <DropdownItem key="user">User</DropdownItem>
                            <DropdownItem key="admin">Admin</DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </TableCell>
                      <TableCell>
                        <Dropdown>
                          <DropdownTrigger>
                            <Chip 
                              color={getStatusColor(user.status) as any}
                              variant="flat"
                              className="cursor-pointer"
                            >
                              {user.status}
                            </Chip>
                          </DropdownTrigger>
                          <DropdownMenu 
                            aria-label="Status Actions"
                            onAction={(key) => handleStatusChange(user.id, key as string)}
                          >
                            <DropdownItem key="active">Active</DropdownItem>
                            <DropdownItem key="inactive">Inactive</DropdownItem>
                            <DropdownItem key="pending">Pending</DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell>{formatDate(user.lastLogin)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button isIconOnly size="sm" variant="light">
                            <Icon icon="lucide:eye" className="text-default-500" />
                          </Button>
                          <Button isIconOnly size="sm" variant="light">
                            <Icon icon="lucide:edit" className="text-default-500" />
                          </Button>
                          <Button isIconOnly size="sm" variant="light">
                            <Icon icon="lucide:trash" className="text-danger" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="flex justify-between items-center mt-4">
                <p className="text-small text-default-500">
                  Showing {items.length} of {filteredUsers.length} users
                </p>
                <Pagination
                  total={pages}
                  page={page}
                  onChange={setPage}
                />
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default AdminUsers;