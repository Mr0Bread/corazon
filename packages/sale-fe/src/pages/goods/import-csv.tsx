import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, FormControl, FormLabel, Input, Text } from "@chakra-ui/react";
import Head from "next/head";
import Link from "next/link";
import DefaultLayout from "~/layouts/default";

export default function ImportCsv() {
    return (
        <DefaultLayout>
            <Head>
                <title>Import CSV | Corazon Sail</title>
            </Head>
            <Text
                fontSize="3xl"
                fontWeight="bold"
                color="gray.200"
            >
                Import from CSV
            </Text>
            <Breadcrumb
                mt={4}
            >
                <BreadcrumbItem>
                    <Link
                        href="/goods/new"
                        passHref
                    >
                        <BreadcrumbLink>
                            Method selection
                        </BreadcrumbLink>
                    </Link>
                </BreadcrumbItem>
                <BreadcrumbItem>
                    <Link
                        href="/goods/import-csv"
                        passHref
                    >
                        <BreadcrumbLink>
                            Import from CSV
                        </BreadcrumbLink>
                    </Link>
                </BreadcrumbItem>
            </Breadcrumb>
            <Box
                mt={8}
            >
                <form>
                    <FormControl>
                        <FormLabel>
                            CSV file
                        </FormLabel>
                        <Input
                            type="file"
                            accept=".csv"
                        />
                    </FormControl>
                </form>
            </Box>
        </DefaultLayout>
    );
}