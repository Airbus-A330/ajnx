import React from 'react';
import { useHistory, Link as RouterLink } from 'react-router-dom';
import { Card, CardHeader, CardBody, CardFooter, Input, Button, Link, Divider } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useAuth } from '../../contexts/auth-context';

const Register: React.FC = () => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState('');
  const { register } = useAuth();
  const history = useHistory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      setFormError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      setFormError('Password must be at least 8 characters');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setFormError('');
      await register(name, email, password);
      history.replace('/dashboard');
    } catch (error: any) {
      setFormError(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-content1 shadow-xl">
      <CardHeader className="flex flex-col gap-1 items-center justify-center pt-8 pb-0">
        <div className="bg-primary/10 p-3 rounded-full">
          <Icon icon="lucide:user-plus" className="text-primary text-2xl" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mt-4">Create Account</h1>
        <p className="text-default-500 text-sm">Sign up to get started with AJNXBanking</p>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardBody className="gap-4 py-6">
          {formError && (
            <div className="bg-danger/10 text-danger text-sm p-3 rounded-medium mb-2">
              {formError}
            </div>
          )}
          
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="bordered"
            startContent={
              <Icon icon="lucide:user" className="text-default-400 text-sm" />
            }
            isRequired
          />
          
          <Input
            label="Email"
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="bordered"
            startContent={
              <Icon icon="lucide:mail" className="text-default-400 text-sm" />
            }
            isRequired
          />
          
          <Input
            label="Password"
            placeholder="Create a password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="bordered"
            startContent={
              <Icon icon="lucide:lock" className="text-default-400 text-sm" />
            }
            isRequired
          />
          
          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            variant="bordered"
            startContent={
              <Icon icon="lucide:lock" className="text-default-400 text-sm" />
            }
            isRequired
          />
        </CardBody>
        
        <CardFooter className="flex flex-col gap-4 pt-0">
          <Button 
            type="submit" 
            color="primary" 
            fullWidth
            isLoading={isSubmitting}
          >
            Create Account
          </Button>
          
          <Divider className="my-2" />
          
          <div className="text-center text-sm">
            Already have an account?{' '}
            <Link as={RouterLink} to="/login" color="primary">
              Sign In
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default Register;