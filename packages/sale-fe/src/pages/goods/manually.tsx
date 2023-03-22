import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Text,
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    FormHelperText,
    VStack,
    InputGroup,
    InputLeftAddon,
    Textarea,
    FormErrorMessage,
    useToast,
    useBreakpointValue,
    ToastPosition,
} from "@chakra-ui/react";
import Head from "next/head";
import Link from "next/link";
import DefaultLayout from "~/layouts/default";
import { DollarSign } from 'lucide-react'
import { useForm, Resolver } from "react-hook-form";
import { api } from "~/utils/api";
import { useRouter } from "next/router";

type FormData = {
    name: string;
    description: string;
    price: string;
    quantity: string;
}

export default function Manually() {
    const { push } = useRouter();
    const toast = useToast();
    const toastPosition = useBreakpointValue<ToastPosition>({
        base: 'bottom',
        md: 'top-right'
    },
    {
        fallback: 'top-right'
    }
    )
    const {
        register,
        handleSubmit,
        formState: {
            isSubmitting,
            errors,
        }
    } = useForm<FormData>();
    const {
        mutateAsync: createProduct,
    } = api.products.create.useMutation();

    const onSubmit = async (data: FormData) => {
        await createProduct({
            data: {
                name: data.name,
                description: data.description,
                price: Number(data.price),
                quantity: Number(data.quantity),
                status: 'pending'
            }
        });

        toast({
            title: "Product created",
            description: "Your product has been successfully added to the system",
            status: "success",
            duration: 3000,
            isClosable: true,
            position: toastPosition
        })

        push('/goods');
    }

    return (
        <DefaultLayout>
            <Head>
                <title>Manually | Corazon Sail</title>
            </Head>
            <Text
                fontSize="3xl"
                fontWeight="bold"
                color="gray.200"
            >
                Manually
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
                <BreadcrumbItem>
                    <BreadcrumbLink
                        as={Link}
                        href="/goods/manually"
                    >
                        Manually
                    </BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            <Box
                mt={4}
                pb={{ base: 8, md: 0 }}
            >
                <form
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <VStack
                        spacing={6}
                    >
                        <FormControl
                            isInvalid={!!errors.name}
                        >
                            <FormLabel
                                htmlFor="name"
                            >
                                Product name
                            </FormLabel>
                            <Input
                                type="text"
                                id="name"
                                {...register("name", {
                                    required: "This field is required.",
                                })}
                            />
                            <FormErrorMessage>
                                {errors.name && errors.name.message}
                            </FormErrorMessage>
                            <FormHelperText>
                                This is the name of the product that will be displayed to the customer.
                            </FormHelperText>
                        </FormControl>
                        <FormControl
                            isInvalid={!!errors.description}
                        >
                            <FormLabel
                                htmlFor="description"
                            >
                                Product description
                            </FormLabel>
                            <Textarea
                                id="description"
                                {...register("description", {
                                    required: "This field is required.",
                                })}
                            />
                            <FormErrorMessage>
                                {errors.description && errors.description.message}
                            </FormErrorMessage>
                            <FormHelperText>
                                This is the description of the product that will be displayed to the customer.
                            </FormHelperText>
                        </FormControl>
                        <FormControl
                            isInvalid={!!errors.price}
                        >
                            <FormLabel
                                htmlFor="price"
                            >
                                Product price
                            </FormLabel>
                            <InputGroup>
                                <InputLeftAddon
                                >
                                    <DollarSign />
                                </InputLeftAddon>
                                <Input
                                    type="number"
                                    id="price"
                                    {...register("price", {
                                        required: "This field is required.",
                                    })}
                                />
                            </InputGroup>
                            <FormErrorMessage>
                                {errors.price && errors.price.message}
                            </FormErrorMessage>
                            <FormHelperText>
                                This is the price of the product that will be displayed to the customer.
                            </FormHelperText>
                        </FormControl>
                        <FormControl
                            isInvalid={!!errors.quantity}
                        >
                            <FormLabel
                                htmlFor="quantity"
                            >
                                Product quantity
                            </FormLabel>
                            <Input
                                type="number"
                                id="quantity"
                                {...register("quantity", {
                                    required: "This field is required.",
                                })}
                            />
                            <FormErrorMessage>
                                {errors.quantity && errors.quantity.message}
                            </FormErrorMessage>
                            <FormHelperText>
                                This is the quantity of the product that will be available for sale.
                            </FormHelperText>
                        </FormControl>
                    </VStack>
                    <Button
                        mt={4}
                        colorScheme="blue"
                        type="submit"
                        isLoading={isSubmitting}
                    >
                        Submit
                    </Button>
                </form>
            </Box>
        </DefaultLayout>
    )
}