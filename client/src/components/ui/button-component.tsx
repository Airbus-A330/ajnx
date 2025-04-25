import React from 'react';
import { Button, ButtonProps } from '@heroui/react';

interface ButtonComponentProps extends ButtonProps {
  children: React.ReactNode;
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({ 
  children, 
  color = "primary", 
  variant = "solid",
  ...props 
}) => {
  return (
    <Button
      color={color}
      variant={variant}
      {...props}
    >
      {children}
    </Button>
  );
};

export default ButtonComponent;