import { Box, Button, Grid, GridItem, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { PropsWithChildren } from "react";
import DefaultLayout from "../default";
import { FaHome, FaSignOutAlt } from 'react-icons/fa'
import { BsFillGearFill, BsFillPersonFill } from 'react-icons/bs'
import { useRouter } from "next/router";
import { useClerk } from "@clerk/nextjs";

export const MyAccountLayout: React.FC<PropsWithChildren> = ({ children }) => {
    const { pathname } = useRouter();
    const { signOut } = useClerk()
    const menuItems = [
        {
            label: 'Home',
            href: '/my-account/general',
            icon: <FaHome size={22} />
        },
        {
            label: 'Personal information',
            href: '/my-account/personal-information',
            icon: <BsFillPersonFill size={22} />
        },
        {
            label: 'Settings',
            href: '/my-account/settings',
            icon: <BsFillGearFill size={22} />
        }
    ];

    return (
        <DefaultLayout>
            <Box
                pt={8}
            >
                <Grid
                    templateColumns="20% 80%"
                    gap={6}
                >
                    <GridItem>
                        <VStack
                            align="stretch"
                        >
                            {
                                menuItems
                                    .map(
                                        (item) => (
                                            <Link
                                                href={item.href}
                                                key={item.href}
                                            >
                                                <Button
                                                    variant="ghost"
                                                    w="full"
                                                    justifyContent="flex-start"
                                                    leftIcon={item.icon}
                                                    bgColor={pathname === item.href ? 'gray.700' : 'unset'}
                                                >
                                                    <Box
                                                        color="gray.400"
                                                    >
                                                        {item.label}
                                                    </Box>
                                                </Button>
                                            </Link>
                                        )
                                    )
                            }
                            <Button
                                variant="ghost"
                                w="full"
                                justifyContent="flex-start"
                                colorScheme="red"
                                leftIcon={<FaSignOutAlt size={22} />}
                                onClick={() => signOut()}
                            >
                                Sign Out
                            </Button>
                        </VStack>
                    </GridItem>
                    <GridItem>
                        {children}
                    </GridItem>
                </Grid>
            </Box>
        </DefaultLayout>
    );
};

export default MyAccountLayout;