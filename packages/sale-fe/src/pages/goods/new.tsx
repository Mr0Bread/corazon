import Head from "next/head";
import DefaultLayout from "~/layouts/default";
import { Card, CardBody, Flex, Text, Box, BreadcrumbItem, BreadcrumbLink, Breadcrumb } from "@chakra-ui/react";
import { BsFiletypeCsv } from 'react-icons/bs'
import { FaArrowRight, FaHandSparkles, FaCloudUploadAlt } from "react-icons/fa";
import Link from "next/link";

export default function NewGoods() {
    return (
        <DefaultLayout>
            <Head>
                <title>New Goods | Corazon Sail</title>
            </Head>
            <Text
                fontSize="3xl"
                fontWeight="bold"
                color="gray.200"
            >
                New Goods
            </Text>
            <Breadcrumb
                mt={4}
            >
                <BreadcrumbItem>
                    <BreadcrumbLink
                        as={Link}
                        href="/goods/new"
                    >
                        Method selection
                    </BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            <Flex
                mt={12}
                flexDirection="column"
                maxW="container.sm"
                rowGap={8}
                paddingBottom={{ base: 8, md: 0 }}
            >
                <Link
                    href="/goods/import-csv"
                    passHref
                >
                    <Card
                        bg="gray.800"
                        border="1px"
                        borderColor="gray.700"
                        _hover={{
                            cursor: "pointer",
                            borderColor: "gray.600",
                            bgColor: "gray.900"
                        }}
                    >
                        <CardBody>
                            <Flex
                                justifyContent="space-between"
                                alignContent="center"
                            >
                                <BsFiletypeCsv size={32} />
                                <FaArrowRight size={24} />
                            </Flex>
                            <Box
                                fontSize="xl"
                                mt={6}
                            >
                                Import from CSV
                            </Box>
                            <Box
                                fontSize="md"
                                mt={2}
                                color="gray.400"
                            >
                                Import your goods from a CSV file
                            </Box>
                        </CardBody>
                    </Card>
                </Link>
                <Link
                    href="/goods/manually"
                >
                    <Card
                        bg="gray.800"
                        border="1px"
                        borderColor="gray.700"
                        _hover={{
                            cursor: "pointer",
                            borderColor: "gray.600",
                            bgColor: "gray.900"
                        }}
                    >
                        <CardBody>
                            <Flex
                                justifyContent="space-between"
                                alignContent="center"
                            >
                                <FaHandSparkles size={32} />
                                <FaArrowRight size={24} />
                            </Flex>
                            <Box
                                fontSize="xl"
                                mt={6}
                            >
                                Add manually
                            </Box>
                            <Box
                                fontSize="md"
                                mt={2}
                                color="gray.400"
                            >
                                Manually enter all the data of your goods
                            </Box>
                        </CardBody>
                    </Card>
                </Link>
                <Link
                    href="/guides/third-party-integration"
                >
                    <Card
                        bg="gray.800"
                        border="1px"
                        borderColor="gray.700"
                        _hover={{
                            cursor: "pointer",
                            borderColor: "gray.600",
                            bgColor: "gray.900"
                        }}
                    >
                        <CardBody>
                            <Flex
                                justifyContent="space-between"
                                alignContent="center"
                            >
                                <FaCloudUploadAlt size={32} />
                                <FaArrowRight size={24} />
                            </Flex>
                            <Box
                                fontSize="xl"
                                mt={6}
                            >
                                Integrate your store with Corazon Sail
                            </Box>
                            <Box
                                fontSize="md"
                                mt={2}
                                color="gray.400"
                            >
                                Learn how to integrate your store with Corazon Sail using our API
                            </Box>
                        </CardBody>
                    </Card>
                </Link>
            </Flex>
        </DefaultLayout>
    );
}
