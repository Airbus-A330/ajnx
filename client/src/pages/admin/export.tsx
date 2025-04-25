import React from 'react';
import { Card, CardHeader, CardBody, Button, Spinner, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';
import axios from 'axios';
import { addToast } from '@heroui/react';

interface ExportOption {
  id: string;
  name: string;
  description: string;
  format: string;
  endpoint: string;
  icon: string;
}

const AdminExport: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const [exportingId, setExportingId] = React.useState<string | null>(null);
  
  const exportOptions: ExportOption[] = [
    {
      id: 'users',
      name: 'Users Data',
      description: 'Export all user accounts and their details',
      format: 'JSON',
      endpoint: '/api/export/users',
      icon: 'lucide:users'
    },
    {
      id: 'accounts',
      name: 'Accounts Data',
      description: 'Export all banking accounts and balances',
      format: 'JSON',
      endpoint: '/api/export/accounts',
      icon: 'lucide:credit-card'
    },
    {
      id: 'transactions',
      name: 'Transactions Data',
      description: 'Export all transaction records',
      format: 'JSON',
      endpoint: '/api/export/transactions',
      icon: 'lucide:repeat'
    },
    {
      id: 'audit',
      name: 'Audit Logs',
      description: 'Export system audit logs and user activities',
      format: 'JSON',
      endpoint: '/api/export/audit',
      icon: 'lucide:file-text'
    }
  ];
  
  const handleExport = async (option: ExportOption) => {
    try {
      setExportingId(option.id);
      setLoading(true);
      
      const response = await axios.get(option.endpoint, {
        responseType: 'blob'
      });
      
      // Create a blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${option.name.toLowerCase().replace(/\s+/g, '-')}.${option.format.toLowerCase()}`);
      
      // Append to html link element page
      document.body.appendChild(link);
      
      // Start download
      link.click();
      
      // Clean up and remove the link
      link.parentNode?.removeChild(link);
      
      addToast({
        title: 'Export Successful',
        description: `${option.name} has been exported successfully`,
        color: 'success'
      });
    } catch (err) {
      addToast({
        title: 'Export Failed',
        description: `Failed to export ${option.name}`,
        color: 'danger'
      });
    } finally {
      setLoading(false);
      setExportingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Export Data</h1>
        <p className="text-default-500">Export system data for backup or analysis</p>
      </div>
      
      <Card className="bg-content1">
        <CardHeader>
          <h2 className="text-xl font-bold">Available Exports</h2>
        </CardHeader>
        
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exportOptions.map((option) => (
              <Card key={option.id} className="bg-content2/50">
                <CardBody className="flex flex-row items-center gap-4">
                  <div className="p-3 bg-content2/70 rounded-lg">
                    <Icon icon={option.icon} className="text-primary text-xl" />
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{option.name}</h3>
                      <Chip size="sm" variant="flat">{option.format}</Chip>
                    </div>
                    <p className="text-default-500 text-sm">{option.description}</p>
                  </div>
                  
                  <Button
                    color="primary"
                    variant="flat"
                    onPress={() => handleExport(option)}
                    isLoading={loading && exportingId === option.id}
                    startContent={!loading || exportingId !== option.id ? <Icon icon="lucide:download" /> : null}
                  >
                    Export
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>
          
          <div className="mt-8 p-4 bg-content2/30 rounded-lg">
            <h3 className="text-md font-semibold mb-2 flex items-center gap-2">
              <Icon icon="lucide:info" className="text-primary" />
              Export Information
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Icon icon="lucide:check" className="text-success mt-0.5" />
                <span>Exported data is formatted in JSON for easy integration with other systems.</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon icon="lucide:check" className="text-success mt-0.5" />
                <span>All exports include timestamps and are encrypted for security.</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon icon="lucide:alert-triangle" className="text-warning mt-0.5" />
                <span>Sensitive user information is redacted in compliance with data protection regulations.</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon icon="lucide:shield" className="text-primary mt-0.5" />
                <span>All export activities are logged for audit purposes.</span>
              </li>
            </ul>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default AdminExport;