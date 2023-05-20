"use client";
import { useForm } from "react-hook-form";
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { api } from "~/utils/api";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    name: z.string().min(1).max(120),
    description: z.string().min(1).max(520),
    price: z.string().min(1).max(120),
    quantity: z.string().min(1).max(120)
})

export default function ProductForm() {
    const router = useRouter();

    const {
        mutateAsync: createProduct,
    } = api.products.create.useMutation();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })
    const {
        formState: {
            isSubmitting
        }
    } = form

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        await createProduct({
            data: {
                name: data.name,
                description: data.description,
                price: Number(data.price),
                quantity: Number(data.quantity)
            }
        });

        router.push("/dashboard/goods");
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel
                                className="text-gray-200"
                            >
                                Name
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="Product name" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is the name of the product
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel
                                className="text-gray-200"
                            >
                                Description
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="Product description" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is the description of the product
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel
                                className="text-gray-200"
                            >
                                Price
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="Product price" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is the price of the product
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel
                                className="text-gray-200"
                            >
                                Quantity
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="Product quantity" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is the quantity of the product
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    className="mt-4"
                    disabled={isSubmitting}
                >
                    Submit
                </Button>
            </form>
        </Form>
    );
}