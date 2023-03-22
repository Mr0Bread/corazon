import { Box, Button, Container, Text } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import { BsPersonCircle } from "react-icons/bs";
import { useAuth } from '@clerk/nextjs';
import Link from "next/link";
import ProfilePopover from "~/components/profile-popover";

const DefaultLayout: React.FC<PropsWithChildren> = ({ children }) => {
    const { isSignedIn, isLoaded } = useAuth();

    return (
        <Box
            minH="100vh"
            display="flex"
            flexDir="column"
            pb={8}
        >
            <Box
                boxShadow="base"
                position="sticky"
            >
                <Container
                    maxW="container.xl"
                    py={4}
                    display="flex"
                    justifyContent="space-between"
                >
                    <Link
                        href="/"
                    >
                        <Box
                            display="flex"
                            columnGap={4}
                            flexDir={{ base: "column", md: "row" }}
                        >
                            <Text
                                fontSize="2xl"
                                fontWeight="bold"
                                color="cyan.300"
                            >
                                CORAZON
                            </Text>
                            <Text
                                fontSize="2xl"
                                fontWeight="bold"
                                color="purple.300"
                            >
                                SAIL
                            </Text>
                        </Box>
                    </Link>
                    {
                        !isLoaded && (
                            <Button
                                variant="ghost"
                                isLoading
                            >
                                <BsPersonCircle size={28} />
                            </Button>
                        )
                    }
                    {
                        (isLoaded && isSignedIn) && (
                            <div>
                                <Link
                                    href="/dashboard"
                                    passHref
                                >
                                    <Button
                                        variant="outline"
                                    >
                                        Dashboard
                                    </Button>
                                </Link>
                                <ProfilePopover />
                            </div>
                        )
                    }
                    {
                        (isLoaded && !isSignedIn) && (
                            <Link href="/sign-in">
                                <Button>
                                    Sign In
                                </Button>
                            </Link>
                        )
                    }
                </Container>
            </Box>
            <Container
                maxW="container.xl"
                pt={4}
                flex={1}
                display="flex"
                flexDirection="column"
            >
                {children}
            </Container>
        </Box>
    )
}

export default DefaultLayout;
