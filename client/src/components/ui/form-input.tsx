import React from 'react';
import { Input, InputProps } from '@heroui/react';

interface FormInputProps extends InputProps {
  label: string;
  error?: string;
}

const FormInput: React.FC<FormInputProps> = ({ label, error, ...props }) => {
  return (
    <div className="mb-4">
      <Input
        label={label}
        variant="bordered"
        color={error ? "danger" : "default"}
        errorMessage={error}
        isInvalid={!!error}
        fullWidth
        {...props}
      />
    </div>
  );
};

export default FormInput;