import {
    Box,
    Button,
    Spinner,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Flex,
    useBreakpointValue,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
    Text
} from "@chakra-ui/react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import DashboardLayout from "~/layouts/dashboard";
import { api } from "~/utils/api";
import { useTable } from 'react-table';
import { useEffect, useMemo } from "react";
import { PlusCircle, SlidersHorizontal, ChevronDown } from "lucide-react";
import { NextPageWithLayout } from "../_app";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const Goods: NextPageWithLayout = () => {
    const filterMode = useBreakpointValue({
        base: 'mobile',
        md: 'desktop'
    }, {
        fallback: 'desktop'
    });
    const {
        isOpen,
        onOpen,
        onClose
    } = useDisclosure();
    const { userId, isLoaded } = useAuth()
    const {
        data,
        refetch
    } = api.products.findMany.useQuery(
        {
            where: {
                userId: userId as string
            },
            take: 20
        },
        {
            enabled: false
        }
    )
    const products = useMemo(() => data, [data]);
    const columns = useMemo(() => [
        {
            Header: 'Name',
            accessor: 'name',
        },
        {
            Header: 'Price',
            accessor: 'price',
        },
        {
            Header: 'Quantity',
            accessor: 'quantity',
        },
        {
            Header: 'Status',
            accessor: 'status',
        }
    ], []);
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        // TODO: Fix this
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        columns,
        data: products || [],
    });

    useEffect(() => {
        if (isLoaded) {
            refetch();
        }
    }, [isLoaded, refetch]);


    if (!isLoaded) {
        return (
            <Spinner />
        );
    }

    return (
        <>
            {
                !data && (
                    <Box
                        display="flex"
                        justifyContent="center"
                    >
                        <Spinner />
                    </Box>
                )
            }
            {
                data && !!data.length && (
                    <Flex
                        flexDir="column"
                        rowGap={4}
                    >
                        {
                            filterMode === 'desktop' && (
                                <Collapsible>
                                    <Flex
                                        justifyContent={{ base: "space-between", md: "flex-start" }}
                                    >
                                        <Link
                                            href="/goods/new"
                                            passHref
                                        >
                                            <Button
                                                fontSize="md"
                                                rightIcon={<PlusCircle size={20} />}
                                                colorScheme="blue"
                                            >
                                                Add Product
                                            </Button>
                                        </Link>
                                        <CollapsibleTrigger
                                            asChild
                                        >
                                            <Button>
                                                <SlidersHorizontal size={20} />
                                            </Button>
                                        </CollapsibleTrigger>
                                    </Flex>
                                    <CollapsibleContent
                                        className="CollapsibleContent"
                                    >
                                        Content
                                    </CollapsibleContent>
                                </Collapsible>
                            )
                        }
                        {
                            filterMode === 'mobile' && (
                                <>
                                    <Flex
                                        justifyContent={{ base: "space-between", md: "flex-start" }}
                                    >
                                        <Link
                                            href="/goods/new"
                                            passHref
                                        >
                                            <Button
                                                fontSize="md"
                                                rightIcon={<PlusCircle size={20} />}
                                                colorScheme="blue"
                                            >
                                                Add Product
                                            </Button>
                                        </Link>
                                        <Button
                                            onClick={onOpen}
                                        >
                                            <SlidersHorizontal size={20} />
                                        </Button>
                                    </Flex>
                                    <Modal
                                        isOpen={isOpen}
                                        onClose={onClose}
                                        size="xl"
                                    >
                                        <ModalOverlay />
                                        <ModalContent>
                                            <ModalHeader>Set product filters</ModalHeader>
                                            <ModalCloseButton />
                                            <ModalBody>
                                                <Flex>
                                                    <Menu>
                                                        <MenuButton
                                                            as={Button}
                                                            rightIcon={<ChevronDown size={20} />}
                                                        >
                                                            Per page: 10
                                                        </MenuButton>
                                                        <MenuList>
                                                            <MenuOptionGroup
                                                                defaultValue="10"
                                                            >
                                                                <MenuItemOption
                                                                    value="10"
                                                                >
                                                                    10
                                                                </MenuItemOption>
                                                                <MenuItemOption
                                                                    value="20"
                                                                >
                                                                    20
                                                                </MenuItemOption>
                                                                <MenuItemOption
                                                                    value="50"
                                                                >
                                                                    50
                                                                </MenuItemOption>
                                                                <MenuItemOption
                                                                    value="100"
                                                                >
                                                                    100
                                                                </MenuItemOption>
                                                                <MenuItemOption
                                                                    value="200"
                                                                >
                                                                    200
                                                                </MenuItemOption>
                                                            </MenuOptionGroup>
                                                        </MenuList>
                                                    </Menu>
                                                </Flex>
                                            </ModalBody>
                                        </ModalContent>
                                    </Modal>
                                </>
                            )
                        }
                        <TableContainer
                            border="1px"
                            borderRadius="md"
                            borderColor="gray.600"
                        >
                            <Table
                                variant="simple"
                                {...getTableProps()}
                            >
                                <Thead>
                                    {
                                        headerGroups.map((headerGroup) => (
                                            // eslint-disable-next-line react/jsx-key
                                            <Tr {...headerGroup.getHeaderGroupProps()}>
                                                {
                                                    headerGroup.headers.map((column) => (
                                                        // eslint-disable-next-line react/jsx-key
                                                        <Th {...column.getHeaderProps()}>
                                                            {column.render('Header')}
                                                        </Th>
                                                    ))
                                                }
                                            </Tr>
                                        ))
                                    }
                                </Thead>
                                <Tbody {...getTableBodyProps()}>
                                    {
                                        rows.map((row) => {
                                            prepareRow(row);
                                            return (
                                                // eslint-disable-next-line react/jsx-key
                                                <Tr {...row.getRowProps()}>
                                                    {
                                                        row.cells.map((cell) => {
                                                            return (
                                                                // eslint-disable-next-line react/jsx-key
                                                                <Td {...cell.getCellProps()}>
                                                                    {cell.render('Cell')}
                                                                </Td>
                                                            );
                                                        })
                                                    }
                                                </Tr>
                                            );
                                        })
                                    }
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </Flex>
                )
            }
            {
                data && !data.length && (
                    <Box
                        display="flex"
                        justifyContent="center"
                        fontSize="2xl"
                        flexDirection="column"
                        alignItems="center"
                        rowGap={4}
                        mt={10}
                    >
                        <div>
                            You do not have any products yet.
                        </div>
                        <Link
                            href="/goods/new"
                            passHref
                        >
                            <Button
                                fontSize="xl"
                                rightIcon={<PlusCircle size={20} />}
                                colorScheme="teal"
                            >
                                Add new
                            </Button>
                        </Link>
                    </Box>
                )
            }
        </>
    );
}

Goods.getLayout = function getLayout(page) {
    return (
        <DashboardLayout>
            {page}
        </DashboardLayout>
    )
}

export default Goods;
