import {
    Box,
    Button,
    Grid,
    GridItem,
    VStack,
    Text,
    Accordion,
    AccordionButton,
    AccordionItem,
    AccordionPanel,
    AccordionIcon
} from "@chakra-ui/react";
import Link from "next/link";
import { PropsWithChildren } from "react";
import DefaultLayout from "../default";
import { FaHome, FaSignOutAlt } from 'react-icons/fa'
import { FiPackage } from 'react-icons/fi'
import { BsFillGearFill, BsFillBoxFill } from 'react-icons/bs'
import { useRouter } from "next/router";
import { useClerk } from "@clerk/nextjs";
import Head from "next/head";

const menuItems = [
    {
        label: 'Dashboard',
        href: '/dashboard',
        icon: <FaHome size={22} />
    },
    {
        label: 'Goods',
        href: '/goods',
        icon: <BsFillBoxFill size={22} />
    },
    {
        label: 'Orders',
        href: '/orders',
        icon: <FiPackage size={22} />
    },
    {
        label: 'Settings',
        href: '/settings',
        icon: <BsFillGearFill size={22} />
    }
];

const pathsToLabels: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/goods': 'Goods',
}

export const DashboardLayout: React.FC<PropsWithChildren> = ({ children }) => {
    const { pathname } = useRouter();
    const { signOut } = useClerk()

    return (
        <DefaultLayout>
            <Head>
                <title>{pathsToLabels[pathname]} | Corazon Sail</title>
            </Head>
            <Box
                pt={6}
            >
                <Text
                    fontSize="2xl"
                    fontWeight="bold"
                >
                    {pathsToLabels[pathname]}
                </Text>
            </Box>
            <Box
                pt={8}
            >
                <Grid
                    templateColumns={{ base: '100%', md: '20% 80%' }}
                    templateRows="auto"
                    gap={6}
                >
                    <GridItem>
                        <Accordion
                            allowMultiple
                            display={{ base: 'block', md: 'none' }}
                            border="1px"
                            borderColor="gray.900"
                            borderRadius="md"
                        >
                            <AccordionItem>
                                <AccordionButton
                                    fontWeight="bold"
                                    color="gray.300"
                                    display="flex"
                                    justifyContent="space-between"
                                >
                                    {pathsToLabels[pathname]}
                                    <AccordionIcon />
                                </AccordionButton>
                                <AccordionPanel>
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
                                </AccordionPanel>
                            </AccordionItem>
                        </Accordion>
                        <VStack
                            align="stretch"
                            display={{ base: 'none', md: 'grid' }}
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

export default DashboardLayout;
