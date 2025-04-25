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
  availableBalance: number;
  currency: string;
  type: string;
}

const Transfer: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const preselectedFromAccountId = queryParams.get('fromAccountId');
  
  const [accounts, setAccounts] = React.useState<Account[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const [fromAccountId, setFromAccountId] = React.useState(preselectedFromAccountId || '');
  const [toAccountId, setToAccountId] = React.useState('');
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
  
  const fromAccount = accounts.find(account => account.id === fromAccountId);
  const toAccount = accounts.find(account => account.id === toAccountId);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fromAccountId || !toAccountId || !amount) {
      setFormError('Please select both accounts and enter an amount');
      return;
    }
    
    if (fromAccountId === toAccountId) {
      setFormError('You cannot transfer funds to the same account');
      return;
    }
    
    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      setFormError('Amount must be a positive number');
      return;
    }
    
    if (fromAccount && Number(amount) > fromAccount.availableBalance) {
      setFormError('Insufficient funds. The amount exceeds your available balance.');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setFormError('');
      
      await axios.post('/api/transactions/transfer', {
        fromAccountId,
        toAccountId,
        amount: Number(amount),
        description: description || 'Transfer'
      });
      
      addToast({
        title: 'Transfer Successful',
        description: `$${Number(amount).toLocaleString()} has been transferred successfully`,
        color: 'success'
      });
      
      // Redirect to account details
      history.push(`/accounts/${fromAccountId}`);
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to process transfer');
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
          <div className="bg-primary/10 p-3 rounded-full">
            <Icon icon="lucide:send" className="text-primary text-xl" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">Transfer Funds</h1>
            <p className="text-default-500">Move money between your accounts</p>
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
              label="From Account"
              placeholder="Select source account"
              selectedKeys={fromAccountId ? [fromAccountId] : []}
              onChange={(e) => setFromAccountId(e.target.value)}
              isDisabled={loading || isSubmitting}
              isRequired
            >
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name} ({account.accountNumber.slice(-4)}) - {account.currency} {account.balance.toLocaleString()}
                </SelectItem>
              ))}
            </Select>
            
            {fromAccount && (
              <div className="bg-content2/30 p-3 rounded-lg">
                <p className="text-sm">
                  Available Balance: <span className="font-semibold">{fromAccount.currency} {fromAccount.availableBalance.toLocaleString()}</span>
                </p>
              </div>
            )}
            
            <Select
              label="To Account"
              placeholder="Select destination account"
              selectedKeys={toAccountId ? [toAccountId] : []}
              onChange={(e) => setToAccountId(e.target.value)}
              isDisabled={loading || isSubmitting || !fromAccountId}
              isRequired
            >
              {accounts
                .filter(account => account.id !== fromAccountId)
                .map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name} ({account.accountNumber.slice(-4)}) - {account.currency} {account.balance.toLocaleString()}
                  </SelectItem>
                ))
              }
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
                    {fromAccount?.currency || '$'}
                  </span>
                </div>
              }
              isDisabled={isSubmitting || !fromAccountId || !toAccountId}
              min="0.01"
              step="0.01"
              isRequired
            />
            
            <Textarea
              label="Description (Optional)"
              placeholder="Enter a description for this transfer"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              isDisabled={isSubmitting}
            />
            
            <div className="bg-content2/30 p-4 rounded-lg">
              <h3 className="text-md font-semibold mb-2">Transfer Information</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Icon icon="lucide:info" className="text-primary mt-0.5" />
                  <span>Transfers between your accounts are processed immediately.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon icon="lucide:info" className="text-primary mt-0.5" />
                  <span>There are no fees for transferring between your own accounts.</span>
                </li>
                {fromAccount && toAccount && fromAccount.currency !== toAccount.currency && (
                  <li className="flex items-start gap-2">
                    <Icon icon="lucide:alert-triangle" className="text-warning mt-0.5" />
                    <span>Currency conversion fees may apply for transfers between accounts with different currencies.</span>
                  </li>
                )}
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
              color="primary"
              isLoading={isSubmitting}
              startContent={!isSubmitting && <Icon icon="lucide:check" />}
            >
              Complete Transfer
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Transfer;