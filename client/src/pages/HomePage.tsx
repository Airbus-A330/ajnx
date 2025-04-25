import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Card, CardBody, Button } from "@heroui/react";
import { Icon } from "@iconify/react";

const HomePage: React.FC = () => {
    return (
        <div className="container mx-auto max-w-3xl">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold mb-4">
                    Welcome to AJNX Banking
                </h1>
                <p className="text-xl text-default-600 max-w-2xl mx-auto">
                    Simple, secure, and reliable banking for everyone.
                </p>
            </div>

            <Card className="mb-12">
                <CardBody className="text-center p-8">
                    <h2 className="text-2xl font-bold mb-4">
                        Your Money, Your Control
                    </h2>
                    <p className="text-default-600 mb-6">
                        AJNX Banking provides you with the tools to manage your
                        finances with ease. Check balances, transfer funds, and
                        track your spending all in one place.
                    </p>
                    <div className="flex justify-center flex-wrap gap-4">
                        <Button
                            as={RouterLink}
                            to="/login"
                            color="primary"
                            variant="solid"
                            startContent={<Icon icon="lucide:log-in" />}
                        >
                            Login
                        </Button>
                        <Button
                            as={RouterLink}
                            to="/register"
                            color="secondary"
                            variant="flat"
                            startContent={<Icon icon="lucide:user-plus" />}
                        >
                            Register
                        </Button>
                    </div>
                </CardBody>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                <Card>
                    <CardBody className="text-center p-6">
                        <div className="flex justify-center mb-4">
                            <Icon
                                icon="lucide:shield"
                                width={40}
                                height={40}
                                className="text-primary"
                            />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Secure</h3>
                        <p className="text-default-600">
                            Bank with confidence knowing your data is protected.
                        </p>
                    </CardBody>
                </Card>

                <Card>
                    <CardBody className="text-center p-6">
                        <div className="flex justify-center mb-4">
                            <Icon
                                icon="lucide:zap"
                                width={40}
                                height={40}
                                className="text-primary"
                            />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Fast</h3>
                        <p className="text-default-600">
                            Quick transactions and real-time updates.
                        </p>
                    </CardBody>
                </Card>

                <Card>
                    <CardBody className="text-center p-6">
                        <div className="flex justify-center mb-4">
                            <Icon
                                icon="lucide:smartphone"
                                width={40}
                                height={40}
                                className="text-primary"
                            />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Convenient</h3>
                        <p className="text-default-600">
                            Bank anytime, anywhere with our easy-to-use
                            platform.
                        </p>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default HomePage;
