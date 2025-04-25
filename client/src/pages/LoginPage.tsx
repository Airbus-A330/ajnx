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
import { login } from "../api/api";

const LoginPage: React.FC = () => {
    const history = useHistory();
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const response = await login(username, password);
            localStorage.setItem("token", response.token);
            history.push("/dashboard");
        } catch (err) {
            setError("Invalid username or password. Please try again.");
            console.error("Login error:", err);
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
                            icon="lucide:landmark"
                            width={48}
                            height={48}
                            className="text-primary"
                        />
                    </div>
                    <h1 className="text-2xl font-bold text-center mb-6">
                        Login to AJNX Banking
                    </h1>

                    {error && (
                        <div className="bg-danger-50 text-danger p-3 rounded-lg mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        <div className="space-y-4">
                            <Input
                                label="Username"
                                placeholder="Enter your username"
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
                                placeholder="Enter your password"
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

                            <Button
                                type="submit"
                                color="primary"
                                className="w-full"
                                isLoading={isLoading}
                            >
                                Login
                            </Button>
                        </div>
                    </form>
                </CardBody>

                <Divider />

                <CardFooter className="justify-center p-4">
                    <p className="text-center text-default-600">
                        Don't have an account?{" "}
                        <Link as={RouterLink} to="/register" color="primary">
                            Register
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default LoginPage;
