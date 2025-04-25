import React from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Card, CardHeader, CardBody, Button, Spinner, Chip, Divider, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination } from '@heroui/react';
import { Icon } from '@iconify/react';
import axios from 'axios';

interface Account {
  id: string;
  name: string;
  accountNumber: string;
  balance: number;
  availableBalance: number;
  currency: string;
  type: string;
  status: string;
  createdAt: string;
  interestRate?: number;
}

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  reference: string;
}

const AccountDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [account, setAccount] = React.useState<Account | null>(null);
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;
  
  React.useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch account details
        const accountResponse = await axios.get(`/api/accounts/${id}`);
        setAccount(accountResponse.data);
        
        // Fetch account transactions
        const transactionsResponse = await axios.get(`/api/transactions/account/${id}`);
        setTransactions(transactionsResponse.data);
        
        setError('');
      } catch (err) {
        setError('Failed to load account details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAccountDetails();
  }, [id]);
  
  const getAccountTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'checking':
        return 'primary';
      case 'savings':
        return 'success';
      case 'investment':
        return 'warning';
      default:
        return 'default';
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
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
  
  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'success';
      case 'withdrawal':
        return 'danger';
      case 'transfer':
        return 'primary';
      default:
        return 'default';
    }
  };
  
  const getTransactionStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'danger';
      default:
        return 'default';
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const pages = Math.ceil(transactions.length / rowsPerPage);
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return transactions.slice(start, end);
  }, [page, transactions]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-default-500 text-sm">
        <Button 
          as={RouterLink}
          to="/accounts"
          variant="light"
          size="sm"
          startContent={<Icon icon="lucide:chevron-left" className="text-sm" />}
        >
          Back to Accounts
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner color="primary" size="lg" />
        </div>
      ) : error ? (
        <div className="text-center py-12 text-danger">
          <Icon icon="lucide:alert-circle" className="text-5xl mb-2" />
          <p>{error}</p>
          <Button 
            as={RouterLink}
            to="/accounts"
            color="primary"
            variant="flat"
            size="sm"
            className="mt-4"
          >
            Back to Accounts
          </Button>
        </div>
      ) : account ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-content1">
                <CardHeader className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">{account.name}</h1>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-default-500">
                        {account.accountNumber.replace(/(\d{4})/g, '$1 ').trim()}
                      </p>
                      <Chip 
                        color={getAccountTypeColor(account.type) as any}
                        variant="flat"
                        size="sm"
                      >
                        {account.type}
                      </Chip>
                      <Chip 
                        color={getStatusColor(account.status) as any}
                        variant="flat"
                        size="sm"
                      >
                        {account.status}
                      </Chip>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      as={RouterLink}
                      to={`/transactions/deposit?accountId=${account.id}`}
                      color="primary"
                      variant="flat"
                      size="sm"
                      startContent={<Icon icon="lucide:plus" />}
                    >
                      Deposit
                    </Button>
                    <Button 
                      as={RouterLink}
                      to={`/transactions/withdraw?accountId=${account.id}`}
                      color="primary"
                      variant="flat"
                      size="sm"
                      startContent={<Icon icon="lucide:minus" />}
                    >
                      Withdraw
                    </Button>
                  </div>
                </CardHeader>
                
                <CardBody>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-content2/30 rounded-xl">
                      <p className="text-default-500 text-sm">Current Balance</p>
                      <h2 className="text-3xl font-bold mt-1">
                        {account.currency} {account.balance.toLocaleString()}
                      </h2>
                      {account.availableBalance !== undefined && (
                        <p className="text-xs text-default-500 mt-1">
                          Available: {account.currency} {account.availableBalance.toLocaleString()}
                        </p>
                      )}
                    </div>
                    
                    <div className="p-4 bg-content2/30 rounded-xl">
                      <p className="text-default-500 text-sm">Account Details</p>
                      <div className="mt-2 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-default-500">Account Type:</span>
                          <span>{account.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-default-500">Currency:</span>
                          <span>{account.currency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-default-500">Opened On:</span>
                          <span>{formatDate(account.createdAt)}</span>
                        </div>
                        {account.interestRate !== undefined && (
                          <div className="flex justify-between">
                            <span className="text-default-500">Interest Rate:</span>
                            <span>{account.interestRate}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <Divider className="my-6" />
                  
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Transaction History</h3>
                    <Button 
                      variant="flat" 
                      size="sm"
                      startContent={<Icon icon="lucide:filter" className="text-sm" />}
                    >
                      Filter
                    </Button>
                  </div>
                  
                  {transactions.length === 0 ? (
                    <div className="text-center py-8 text-default-500">
                      <Icon icon="lucide:inbox" className="text-3xl mb-2" />
                      <p>No transactions found for this account</p>
                      <div className="flex gap-2 justify-center mt-4">
                        <Button 
                          as={RouterLink}
                          to={`/transactions/deposit?accountId=${account.id}`}
                          color="primary"
                          variant="flat"
                          size="sm"
                        >
                          Make a Deposit
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Table aria-label="Transaction history">
                        <TableHeader>
                          <TableColumn>DESCRIPTION</TableColumn>
                          <TableColumn>TYPE</TableColumn>
                          <TableColumn>DATE</TableColumn>
                          <TableColumn>STATUS</TableColumn>
                          <TableColumn>AMOUNT</TableColumn>
                        </TableHeader>
                        <TableBody>
                          {items.map((transaction) => (
                            <TableRow key={transaction.id}>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{transaction.description}</p>
                                  <p className="text-xs text-default-500">Ref: {transaction.reference}</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Chip 
                                  color={getTransactionTypeColor(transaction.type) as any}
                                  variant="flat"
                                  size="sm"
                                >
                                  {transaction.type}
                                </Chip>
                              </TableCell>
                              <TableCell>{formatDate(transaction.date)}</TableCell>
                              <TableCell>
                                <Chip 
                                  color={getTransactionStatusColor(transaction.status) as any}
                                  variant="flat"
                                  size="sm"
                                >
                                  {transaction.status}
                                </Chip>
                              </TableCell>
                              <TableCell>
                                <span className={`font-medium ${
                                  transaction.type === 'deposit' 
                                    ? 'text-success' 
                                    : transaction.type === 'withdrawal' 
                                      ? 'text-danger' 
                                      : ''
                                }`}>
                                  {transaction.type === 'deposit' ? '+' : transaction.type === 'withdrawal' ? '-' : ''}
                                  {account.currency} {transaction.amount.toLocaleString()}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      
                      <div className="flex justify-center mt-4">
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
            
            <div>
              <Card className="bg-content1">
                <CardHeader>
                  <h3 className="text-xl font-bold">Quick Actions</h3>
                </CardHeader>
                <CardBody className="gap-2">
                  <Button 
                    as={RouterLink}
                    to={`/transactions/deposit?accountId=${account.id}`}
                    color="primary"
                    startContent={<Icon icon="lucide:plus" />}
                    fullWidth
                    className="justify-start"
                  >
                    Deposit Funds
                  </Button>
                  <Button 
                    as={RouterLink}
                    to={`/transactions/withdraw?accountId=${account.id}`}
                    color="primary"
                    startContent={<Icon icon="lucide:minus" />}
                    fullWidth
                    className="justify-start"
                  >
                    Withdraw Funds
                  </Button>
                  <Button 
                    as={RouterLink}
                    to={`/transactions/transfer?fromAccountId=${account.id}`}
                    color="primary"
                    startContent={<Icon icon="lucide:send" />}
                    fullWidth
                    className="justify-start"
                  >
                    Transfer Money
                  </Button>
                  <Button 
                    color="primary"
                    variant="flat"
                    startContent={<Icon icon="lucide:file-text" />}
                    fullWidth
                    className="justify-start"
                  >
                    Download Statement
                  </Button>
                  <Button 
                    color="primary"
                    variant="flat"
                    startContent={<Icon icon="lucide:settings" />}
                    fullWidth
                    className="justify-start"
                  >
                    Account Settings
                  </Button>
                </CardBody>
              </Card>
              
              <Card className="bg-content1 mt-6">
                <CardHeader>
                  <h3 className="text-xl font-bold">Account Summary</h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    <div>
                      <p className="text-default-500 text-sm">Total Deposits</p>
                      <p className="text-xl font-semibold text-success">
                        {account.currency} {(transactions
                          .filter(t => t.type === 'deposit' && t.status === 'completed')
                          .reduce((sum, t) => sum + t.amount, 0)).toLocaleString()}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-default-500 text-sm">Total Withdrawals</p>
                      <p className="text-xl font-semibold text-danger">
                        {account.currency} {(transactions
                          .filter(t => t.type === 'withdrawal' && t.status === 'completed')
                          .reduce((sum, t) => sum + t.amount, 0)).toLocaleString()}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-default-500 text-sm">Pending Transactions</p>
                      <p className="text-xl font-semibold">
                        {transactions.filter(t => t.status === 'pending').length}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default AccountDetails;