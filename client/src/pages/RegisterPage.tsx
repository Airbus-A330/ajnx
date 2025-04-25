import React from "react";
import { useHistory, Link as RouterLink } from "react-router-dom";
import {
    Card,
    CardBody,
    CardFooter,
    Input,
    Button,
    Link,
    Divider,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { register } from "../api/api";

const RegisterPage: React.FC = () => {
    const history = useHistory();
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState("");

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);

        try {
            await register(username, password, "customer");
            history.push("/login");
        } catch (err: any) {
            setError(
                err.response?.message ||
                    "Registration failed. Please try again.",
            );
            console.error("Register error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto max-w-md">
            <Card className="border-none">
                <CardBody className="p-6">
                    <div className="flex justify-center mb-6">
                        <Icon
                            icon="lucide:user-plus"
                            width={48}
                            height={48}
                            className="text-primary"
                        />
                    </div>
                    <h1 className="text-2xl font-bold text-center mb-6">
                        Create an Account
                    </h1>

                    {error && (
                        <div className="bg-danger-50 text-danger p-3 rounded-lg mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister}>
                        <div className="space-y-4">
                            <Input
                                label="Username"
                                placeholder="Choose a username"
                                value={username}
                                onValueChange={setUsername}
                                startContent={
                                    <Icon
                                        icon="lucide:user"
                                        className="text-default-400"
                                    />
                                }
                                isRequired
                            />

                            <Input
                                label="Password"
                                placeholder="Create a password"
                                type="password"
                                value={password}
                                onValueChange={setPassword}
                                startContent={
                                    <Icon
                                        icon="lucide:lock"
                                        className="text-default-400"
                                    />
                                }
                                isRequired
                            />

                            <Input
                                label="Confirm Password"
                                placeholder="Confirm your password"
                                type="password"
                                value={confirmPassword}
                                onValueChange={setConfirmPassword}
                                startContent={
                                    <Icon
                                        icon="lucide:lock"
                                        className="text-default-400"
                                    />
                                }
                                isRequired
                            />

                            <Button
                                type="submit"
                                color="primary"
                                className="w-full"
                                isLoading={isLoading}
                            >
                                Register
                            </Button>
                        </div>
                    </form>
                </CardBody>

                <Divider />

                <CardFooter className="justify-center p-4">
                    <p className="text-center text-default-600">
                        Already have an account?{" "}
                        <Link as={RouterLink} to="/login" color="primary">
                            Login
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default RegisterPage;
