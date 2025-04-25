import React from "react";
import { Card, CardBody, CardHeader, Button, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";
import { exportData } from "../api/api";

const AdminExportPage: React.FC = () => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState("");
    const [success, setSuccess] = React.useState("");

    const handleExport = async () => {
        setIsLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await exportData();

            // Create a blob from the response data
            const blob = new Blob([JSON.stringify(response, null, 2)], {
                type: "application/json",
            });

            // Create a URL for the blob
            const url = window.URL.createObjectURL(blob);

            // Create a temporary link element
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "ajnx-banking-export.json");

            // Append the link to the body
            document.body.appendChild(link);

            // Trigger the download
            link.click();

            // Clean up
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);

            setSuccess("Data exported successfully!");
        } catch (err) {
            setError("You do not have access to this feature.");
            console.error("Export error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto max-w-5xl">
            <div className="flex items-center gap-2 mb-6">
                <Icon icon="lucide:download" className="text-primary" />
                <h1 className="text-3xl font-bold">Admin: Export Data</h1>
            </div>

            {error && (
                <div className="bg-danger-50 text-danger p-4 rounded-lg mb-6">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-success-50 text-success p-4 rounded-lg mb-6">
                    {success}
                </div>
            )}

            <Card>
                <CardHeader className="flex gap-3">
                    <div className="flex flex-col">
                        <p className="text-md font-bold">Export System Data</p>
                        <p className="text-small text-default-500">
                            Download all system data in JSON format
                        </p>
                    </div>
                </CardHeader>
                <Divider />
                <CardBody>
                    <div className="space-y-6">
                        <p>
                            This will export all system data including users,
                            accounts, and transactions in JSON format. The
                            exported file can be used for backup or analysis
                            purposes.
                        </p>

                        <div className="flex justify-center">
                            <Button
                                color="primary"
                                startContent={<Icon icon="lucide:download" />}
                                onPress={handleExport}
                                isLoading={isLoading}
                                size="lg"
                            >
                                Export Data
                            </Button>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

export default AdminExportPage;
