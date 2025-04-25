import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Card, CardHeader, CardBody, Button, Spinner, Link, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Input, Select, SelectItem } from '@heroui/react';
import { Icon } from '@iconify/react';
import axios from 'axios';
import { addToast } from '@heroui/react';

interface Account {
  id: string;
  name: string;
  accountNumber: string;
  balance: number;
  currency: string;
  type: string;
  status: string;
  createdAt: string;
}

const Accounts: React.FC = () => {
  const [accounts, setAccounts] = React.useState<Account[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  
  // Form state
  const [accountName, setAccountName] = React.useState('');
  const [accountType, setAccountType] = React.useState('');
  const [currency, setCurrency] = React.useState('USD');
  const [initialDeposit, setInitialDeposit] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState('');
  
  React.useEffect(() => {
    fetchAccounts();
  }, []);
  
  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/accounts');
      setAccounts(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load accounts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateAccount = async () => {
    if (!accountName || !accountType || !currency || !initialDeposit) {
      setFormError('Please fill in all fields');
      return;
    }
    
    if (isNaN(Number(initialDeposit)) || Number(initialDeposit) <= 0) {
      setFormError('Initial deposit must be a positive number');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setFormError('');
      
      await axios.post('/api/accounts', {
        name: accountName,
        type: accountType,
        currency,
        initialDeposit: Number(initialDeposit)
      });
      
      onClose();
      fetchAccounts();
      
      // Reset form
      setAccountName('');
      setAccountType('');
      setCurrency('USD');
      setInitialDeposit('');
      
      addToast({
        title: 'Account Created',
        description: 'Your new account has been created successfully',
        color: 'success'
      });
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to create account');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getAccountTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
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
    switch (status.toLowerCase()) {
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Your Accounts</h1>
          <p className="text-default-500">Manage your banking accounts and create new ones</p>
        </div>
        <Button 
          color="primary"
          startContent={<Icon icon="lucide:plus" />}
          onPress={onOpen}
          className="mt-4 sm:mt-0"
        >
          New Account
        </Button>
      </div>
      
      <Card className="bg-content1">
        <CardHeader>
          <div className="flex justify-between items-center w-full">
            <h2 className="text-xl font-bold">All Accounts</h2>
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
                onPress={() => fetchAccounts()}
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
                onPress={() => fetchAccounts()}
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          ) : accounts.length === 0 ? (
            <div className="text-center py-12 text-default-500">
              <Icon icon="lucide:inbox" className="text-5xl mb-2" />
              <p className="mb-4">You don't have any accounts yet</p>
              <Button 
                color="primary"
                onPress={onOpen}
              >
                Create Your First Account
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {accounts.map((account) => (
                <Card 
                  key={account.id}
                  isPressable
                  as={RouterLink}
                  to={`/accounts/${account.id}`}
                  className="bg-content2/50 card-hover"
                >
                  <CardBody className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-content2/70 rounded-lg">
                        <Icon 
                          icon={
                            account.type.toLowerCase() === 'checking' 
                              ? 'lucide:credit-card' 
                              : account.type.toLowerCase() === 'savings' 
                                ? 'lucide:piggy-bank' 
                                : 'lucide:trending-up'
                          } 
                          className={`text-${getAccountTypeColor(account.type)}`}
                        />
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs bg-${getStatusColor(account.status)}/10 text-${getStatusColor(account.status)}`}>
                        {account.status}
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-lg">{account.name}</h3>
                    <p className="text-default-500 text-sm mb-4">
                      {account.accountNumber.replace(/(\d{4})/g, '$1 ').trim()}
                    </p>
                    
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs text-default-500">Balance</p>
                        <p className="font-bold text-xl">
                          {account.currency} {account.balance.toLocaleString()}
                        </p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs bg-${getAccountTypeColor(account.type)}/10 text-${getAccountTypeColor(account.type)}`}>
                        {account.type}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
      
      {/* Create Account Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Create New Account</ModalHeader>
              <ModalBody>
                {formError && (
                  <div className="bg-danger/10 text-danger text-sm p-3 rounded-medium mb-2">
                    {formError}
                  </div>
                )}
                
                <Input
                  label="Account Name"
                  placeholder="e.g., Primary Checking"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  variant="bordered"
                  isRequired
                />
                
                <Select
                  label="Account Type"
                  placeholder="Select account type"
                  selectedKeys={accountType ? [accountType] : []}
                  onChange={(e) => setAccountType(e.target.value)}
                  variant="bordered"
                  isRequired
                >
                  <SelectItem key="checking" value="checking">Checking</SelectItem>
                  <SelectItem key="savings" value="savings">Savings</SelectItem>
                  <SelectItem key="investment" value="investment">Investment</SelectItem>
                </Select>
                
                <Select
                  label="Currency"
                  placeholder="Select currency"
                  selectedKeys={[currency]}
                  onChange={(e) => setCurrency(e.target.value)}
                  variant="bordered"
                  isRequired
                >
                  <SelectItem key="USD" value="USD">USD - US Dollar</SelectItem>
                  <SelectItem key="EUR" value="EUR">EUR - Euro</SelectItem>
                  <SelectItem key="GBP" value="GBP">GBP - British Pound</SelectItem>
                  <SelectItem key="JPY" value="JPY">JPY - Japanese Yen</SelectItem>
                </Select>
                
                <Input
                  label="Initial Deposit"
                  placeholder="Enter amount"
                  value={initialDeposit}
                  onChange={(e) => setInitialDeposit(e.target.value)}
                  variant="bordered"
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">$</span>
                    </div>
                  }
                  type="number"
                  min="0"
                  isRequired
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button 
                  color="primary" 
                  onPress={handleCreateAccount}
                  isLoading={isSubmitting}
                >
                  Create Account
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Accounts;