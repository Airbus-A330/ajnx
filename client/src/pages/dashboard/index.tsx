import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Card, CardBody, CardHeader, CardFooter, Button, Progress, Chip, Link } from '@heroui/react';
import { Icon } from '@iconify/react';
import axios from 'axios';
import { useAuth } from '../../contexts/auth-context';
import AccountSummary from './account-summary';
import RecentTransactions from './recent-transactions';

interface Account {
  id: string;
  name: string;
  accountNumber: string;
  balance: number;
  currency: string;
  type: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = React.useState<Account[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  
  React.useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get('/api/accounts');
        setAccounts(response.data);
      } catch (err) {
        setError('Failed to load accounts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAccounts();
  }, []);
  
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back, {user?.name}</h1>
          <p className="text-default-500">Here's an overview of your finances</p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <Button 
            as={RouterLink}
            to="/transactions/deposit"
            color="primary"
            variant="flat"
            startContent={<Icon icon="lucide:plus" />}
          >
            Deposit
          </Button>
          <Button 
            as={RouterLink}
            to="/transactions/transfer"
            color="primary"
            startContent={<Icon icon="lucide:send" />}
          >
            Transfer
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-content1">
          <CardHeader className="flex gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Icon icon="lucide:wallet" className="text-primary text-xl" />
            </div>
            <div className="flex flex-col">
              <p className="text-md">Total Balance</p>
              <p className="text-sm text-default-500">Across all accounts</p>
            </div>
          </CardHeader>
          <CardBody>
            <h2 className="text-3xl font-bold">${totalBalance.toLocaleString()}</h2>
            <div className="flex items-center mt-2">
              <Icon icon="lucide:trending-up" className="text-success mr-1" />
              <span className="text-success text-sm">+2.5%</span>
              <span className="text-default-500 text-sm ml-2">from last month</span>
            </div>
          </CardBody>
        </Card>
        
        <Card className="bg-content1">
          <CardHeader className="flex gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Icon icon="lucide:credit-card" className="text-primary text-xl" />
            </div>
            <div className="flex flex-col">
              <p className="text-md">Active Accounts</p>
              <p className="text-sm text-default-500">Your banking accounts</p>
            </div>
          </CardHeader>
          <CardBody>
            <h2 className="text-3xl font-bold">{accounts.length}</h2>
            <Progress 
              value={accounts.length * 20} 
              className="mt-2" 
              color="primary"
              showValueLabel={false}
            />
            <div className="flex justify-between mt-1">
              <span className="text-default-500 text-xs">0</span>
              <span className="text-default-500 text-xs">5</span>
            </div>
          </CardBody>
          <CardFooter>
            <Button 
              as={RouterLink}
              to="/accounts"
              variant="flat"
              color="primary"
              size="sm"
              fullWidth
            >
              View All Accounts
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="bg-content1">
          <CardHeader className="flex gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Icon icon="lucide:activity" className="text-primary text-xl" />
            </div>
            <div className="flex flex-col">
              <p className="text-md">Quick Actions</p>
              <p className="text-sm text-default-500">Manage your finances</p>
            </div>
          </CardHeader>
          <CardBody className="gap-2">
            <Button 
              as={RouterLink}
              to="/transactions/deposit"
              variant="flat"
              color="primary"
              startContent={<Icon icon="lucide:plus" />}
              fullWidth
              className="justify-start"
            >
              Deposit Funds
            </Button>
            <Button 
              as={RouterLink}
              to="/transactions/withdraw"
              variant="flat"
              color="primary"
              startContent={<Icon icon="lucide:minus" />}
              fullWidth
              className="justify-start"
            >
              Withdraw Funds
            </Button>
            <Button 
              as={RouterLink}
              to="/transactions/transfer"
              variant="flat"
              color="primary"
              startContent={<Icon icon="lucide:send" />}
              fullWidth
              className="justify-start"
            >
              Transfer Money
            </Button>
          </CardBody>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AccountSummary accounts={accounts} loading={loading} error={error} />
        </div>
        <div>
          <RecentTransactions />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;