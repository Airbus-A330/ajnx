import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Card, CardHeader, CardBody, Chip, Spinner, Link, Button } from '@heroui/react';
import { Icon } from '@iconify/react';

interface Account {
  id: string;
  name: string;
  accountNumber: string;
  balance: number;
  currency: string;
  type: string;
}

interface AccountSummaryProps {
  accounts: Account[];
  loading: boolean;
  error: string;
}

const AccountSummary: React.FC<AccountSummaryProps> = ({ accounts, loading, error }) => {
  const getAccountIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'checking':
        return <Icon icon="lucide:credit-card" className="text-primary" />;
      case 'savings':
        return <Icon icon="lucide:piggy-bank" className="text-success" />;
      case 'investment':
        return <Icon icon="lucide:trending-up" className="text-warning" />;
      default:
        return <Icon icon="lucide:landmark" className="text-default-500" />;
    }
  };
  
  const getAccountTypeChip = (type: string) => {
    switch (type.toLowerCase()) {
      case 'checking':
        return <Chip color="primary" variant="flat" size="sm">{type}</Chip>;
      case 'savings':
        return <Chip color="success" variant="flat" size="sm">{type}</Chip>;
      case 'investment':
        return <Chip color="warning" variant="flat" size="sm">{type}</Chip>;
      default:
        return <Chip color="default" variant="flat" size="sm">{type}</Chip>;
    }
  };

  return (
    <Card className="bg-content1">
      <CardHeader className="flex justify-between">
        <div>
          <h2 className="text-xl font-bold">Your Accounts</h2>
          <p className="text-default-500 text-sm">Manage your banking accounts</p>
        </div>
        <Button 
          as={RouterLink}
          to="/accounts"
          variant="flat"
          color="primary"
          size="sm"
          endContent={<Icon icon="lucide:chevron-right" className="text-sm" />}
        >
          View All
        </Button>
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
        ) : accounts.length === 0 ? (
          <div className="text-center py-8 text-default-500">
            <Icon icon="lucide:inbox" className="text-3xl mb-2" />
            <p>No accounts found</p>
            <Button 
              as={RouterLink}
              to="/accounts"
              color="primary"
              variant="flat"
              size="sm"
              className="mt-4"
            >
              Create an Account
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {accounts.slice(0, 3).map((account) => (
              <div 
                key={account.id} 
                className="flex items-center justify-between p-4 rounded-lg border border-content2/50 hover:bg-content2/20 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-content2/30 rounded-lg">
                    {getAccountIcon(account.type)}
                  </div>
                  <div>
                    <Link 
                      as={RouterLink}
                      to={`/accounts/${account.id}`}
                      className="font-medium text-foreground"
                    >
                      {account.name}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-default-500">
                        {account.accountNumber.replace(/(\d{4})/g, '$1 ').trim()}
                      </span>
                      {getAccountTypeChip(account.type)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    {account.currency} {account.balance.toLocaleString()}
                  </div>
                  <div className="text-xs text-default-500">Available Balance</div>
                </div>
              </div>
            ))}
            
            {accounts.length > 3 && (
              <div className="text-center pt-2">
                <Link as={RouterLink} to="/accounts" color="primary">
                  View {accounts.length - 3} more accounts
                </Link>
              </div>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default AccountSummary;