import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Card, CardHeader, CardBody, Spinner, Link, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';
import axios from 'axios';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

const RecentTransactions: React.FC = () => {
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  
  React.useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('/api/transactions/recent');
        setTransactions(response.data);
      } catch (err) {
        setError('Failed to load transactions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransactions();
  }, []);
  
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <Icon icon="lucide:arrow-down-right" className="text-success" />;
      case 'withdrawal':
        return <Icon icon="lucide:arrow-up-right" className="text-danger" />;
      case 'transfer':
        return <Icon icon="lucide:repeat" className="text-primary" />;
      default:
        return <Icon icon="lucide:circle" className="text-default-500" />;
    }
  };
  
  const getStatusChip = (status: string) => {
    switch (status) {
      case 'completed':
        return <Chip color="success" variant="flat" size="sm">Completed</Chip>;
      case 'pending':
        return <Chip color="warning" variant="flat" size="sm">Pending</Chip>;
      case 'failed':
        return <Chip color="danger" variant="flat" size="sm">Failed</Chip>;
      default:
        return <Chip color="default" variant="flat" size="sm">{status}</Chip>;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Card className="bg-content1">
      <CardHeader>
        <div>
          <h2 className="text-xl font-bold">Recent Transactions</h2>
          <p className="text-default-500 text-sm">Your latest financial activity</p>
        </div>
      </CardHeader>
      
      <CardBody>
        {loading ? (
          <div className="flex justify-center py-8">
            <Spinner color="primary" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-danger">
            <Icon icon="lucide:alert-circle" className="text-3xl mb-2" />
            <p>{error}</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8 text-default-500">
            <Icon icon="lucide:inbox" className="text-3xl mb-2" />
            <p>No recent transactions</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.slice(0, 5).map((transaction) => (
              <div 
                key={transaction.id} 
                className="flex items-center justify-between p-3 rounded-lg border border-content2/50 hover:bg-content2/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-content2/30 rounded-lg">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">
                      {transaction.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-default-500">
                        {formatDate(transaction.date)}
                      </span>
                      {getStatusChip(transaction.status)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-semibold ${
                    transaction.type === 'deposit' 
                      ? 'text-success' 
                      : transaction.type === 'withdrawal' 
                        ? 'text-danger' 
                        : ''
                  }`}>
                    {transaction.type === 'deposit' ? '+' : transaction.type === 'withdrawal' ? '-' : ''}
                    ${transaction.amount.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
            
            <div className="text-center pt-2">
              <Link as={RouterLink} to="/accounts" color="primary" size="sm">
                View All Transactions
              </Link>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default RecentTransactions;