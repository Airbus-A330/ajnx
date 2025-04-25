import React from 'react';
import { Card, CardProps, CardHeader, CardBody, CardFooter } from '@heroui/react';

interface CardComponentProps extends CardProps {
  title?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  isHoverable?: boolean;
}

const CardComponent: React.FC<CardComponentProps> = ({ 
  title, 
  footer, 
  children, 
  isHoverable = false,
  className = "",
  ...props 
}) => {
  return (
    <Card
      className={`${isHoverable ? 'card-hover' : ''} ${className}`}
      {...props}
    >
      {title && <CardHeader>{title}</CardHeader>}
      <CardBody>{children}</CardBody>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
};

export default CardComponent;