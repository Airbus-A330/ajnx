import React from 'react';
import { useHistory, Link as RouterLink, useLocation } from 'react-router-dom';
import { Card, CardHeader, CardBody, CardFooter, Input, Button, Checkbox, Link, Divider } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useAuth } from '../../contexts/auth-context';

const Login: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState('');
  const { login } = useAuth();
  const history = useHistory();
  const location = useLocation();
  
  // Get redirect location if user was redirected to login
  const { from } = location.state as { from?: { pathname: string } } || { from: { pathname: '/dashboard' } };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setFormError('Please fill in all fields');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setFormError('');
      await login(email, password);
      history.replace(from);
    } catch (error: any) {
      setFormError(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-content1 shadow-xl">
      <CardHeader className="flex flex-col gap-1 items-center justify-center pt-8 pb-0">
        <div className="bg-primary/10 p-3 rounded-full">
          <Icon icon="lucide:lock" className="text-primary text-2xl" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mt-4">Sign In</h1>
        <p className="text-default-500 text-sm">Enter your credentials to access your account</p>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardBody className="gap-4 py-6">
          {formError && (
            <div className="bg-danger/10 text-danger text-sm p-3 rounded-medium mb-2">
              {formError}
            </div>
          )}
          
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
            placeholder="Enter your password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="bordered"
            startContent={
              <Icon icon="lucide:key" className="text-default-400 text-sm" />
            }
            isRequired
          />
          
          <div className="flex justify-between items-center">
            <Checkbox size="sm">Remember me</Checkbox>
            <Link href="#" size="sm">Forgot password?</Link>
          </div>
        </CardBody>
        
        <CardFooter className="flex flex-col gap-4 pt-0">
          <Button 
            type="submit" 
            color="primary" 
            fullWidth
            isLoading={isSubmitting}
          >
            Sign In
          </Button>
          
          <Divider className="my-2" />
          
          <div className="text-center text-sm">
            Don't have an account?{' '}
            <Link as={RouterLink} to="/register" color="primary">
              Sign Up
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default Login;