import React from 'react';
import { useHistory, useLocation, Link as RouterLink } from 'react-router-dom';
import { Card, CardHeader, CardBody, CardFooter, Input, Button, Select, SelectItem, Textarea } from '@heroui/react';
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
}

const Deposit: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const preselectedAccountId = queryParams.get('accountId');
  
  const [accounts, setAccounts] = React.useState<Account[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const [selectedAccountId, setSelectedAccountId] = React.useState(preselectedAccountId || '');
  const [amount, setAmount] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [formError, setFormError] = React.useState('');
  
  React.useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get('/api/accounts');
        setAccounts(response.data);
      } catch (err) {
        console.error('Failed to load accounts', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAccounts();
  }, []);
  
  const selectedAccount = accounts.find(account => account.id === selectedAccountId);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAccountId || !amount) {
      setFormError('Please select an account and enter an amount');
      return;
    }
    
    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      setFormError('Amount must be a positive number');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setFormError('');
      
      await axios.post('/api/transactions/deposit', {
        accountId: selectedAccountId,
        amount: Number(amount),
        description: description || 'Deposit'
      });
      
      addToast({
        title: 'Deposit Successful',
        description: `$${Number(amount).toLocaleString()} has been deposited to your account`,
        color: 'success'
      });
      
      // Redirect to account details
      history.push(`/accounts/${selectedAccountId}`);
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to process deposit');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-2 text-default-500 text-sm mb-6">
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
      
      <Card className="bg-content1">
        <CardHeader className="flex gap-3">
          <div className="bg-success/10 p-3 rounded-full">
            <Icon icon="lucide:plus" className="text-success text-xl" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">Deposit Funds</h1>
            <p className="text-default-500">Add money to your account</p>
          </div>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardBody className="gap-6">
            {formError && (
              <div className="bg-danger/10 text-danger text-sm p-3 rounded-medium">
                {formError}
              </div>
            )}
            
            <Select
              label="Select Account"
              placeholder="Choose an account"
              selectedKeys={selectedAccountId ? [selectedAccountId] : []}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              isDisabled={loading || isSubmitting}
              isRequired
            >
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name} ({account.accountNumber.slice(-4)}) - {account.currency} {account.balance.toLocaleString()}
                </SelectItem>
              ))}
            </Select>
            
            <Input
              type="number"
              label="Amount"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">
                    {selectedAccount?.currency || '$'}
                  </span>
                </div>
              }
              isDisabled={isSubmitting}
              min="0.01"
              step="0.01"
              isRequired
            />
            
            <Textarea
              label="Description (Optional)"
              placeholder="Enter a description for this deposit"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              isDisabled={isSubmitting}
            />
            
            <div className="bg-content2/30 p-4 rounded-lg">
              <h3 className="text-md font-semibold mb-2">Deposit Information</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Icon icon="lucide:info" className="text-primary mt-0.5" />
                  <span>Funds will be available in your account immediately.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon icon="lucide:info" className="text-primary mt-0.5" />
                  <span>There are no fees for depositing funds.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon icon="lucide:info" className="text-primary mt-0.5" />
                  <span>You can view your deposit in your transaction history once completed.</span>
                </li>
              </ul>
            </div>
          </CardBody>
          
          <CardFooter className="justify-end gap-2">
            <Button
              as={RouterLink}
              to="/accounts"
              variant="flat"
              color="default"
              isDisabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              color="success"
              isLoading={isSubmitting}
              startContent={!isSubmitting && <Icon icon="lucide:check" />}
            >
              Complete Deposit
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Deposit;