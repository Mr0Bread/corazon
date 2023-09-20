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
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { api } from "~/utils/api";
import { useRouter } from "next/navigation";
import { cn } from "~/lib/utils";
import { Check, Loader2, Percent } from 'lucide-react';
import Loader from "~/components/ui/loader";
import { generateReactHelpers } from "@uploadthing/react/hooks";
import { OurFileRouter } from "~/app/api/uploadthing/core";
import {
    useDropzone
} from 'react-dropzone'
import { useCallback, useState } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "~/components/ui/accordion";
import { Checkbox } from "~/components/ui/checkbox";
import type { CategoriesSelectSchema } from "~/server/schema";

const { useUploadThing } = generateReactHelpers<OurFileRouter>();

const formSchema = z.object({
    name: z.string().min(1).max(120),
    description: z.string().min(1).max(520),
    basePrice: z.string().min(1).max(120),
    quantity: z.string().min(1).max(120),
    categories: z.array(z.string()),
    images: z.array(z.string()),
    discount: z.object({
        type: z.enum(['percentage', 'fixed']),
        value: z.string().optional().transform(val => Number(val))
    })
})

export default function ProductForm({
    categories
}: {
    categories: CategoriesSelectSchema[]
}) {
    const router = useRouter();
    const [images, setImages] = useState<File[]>([]);
    const [loadingMessage, setLoadingMessage] = useState<string>('');

    const {
        mutateAsync: createProduct,
    } = api.products.create.useMutation();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            categories: [],
            images: [],
            discount: {
                type: 'fixed',
                value: undefined
            }
        }
    })

    const {
        startUpload
    } = useUploadThing(
        "imageUploader",
        {
            onClientUploadComplete: (res) => {
                console.log(res);
    
                res?.forEach((file) => {
                    form.setValue("images", [
                        ...form.getValues("images"),
                        file.url
                    ])
                })
            }
        }
    );

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setImages(acceptedFiles);
    }, []);

    const { getInputProps, getRootProps, isDragActive } = useDropzone({
        maxSize: 1024 * 1024 * 16,
        accept: {
            'image/jpeg': [],
            'image/png': []
        },
        onDrop
    });

    const {
        formState: {
            isSubmitting,
        }
    } = form

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            setLoadingMessage('Uploading images...');

            const imagesRes = await startUpload(images);

            setLoadingMessage('Creating product...');

            const imagesUrls = imagesRes ? imagesRes.map((file) => file.fileUrl) : [];

            console.log(data);

            const {
                discount: {
                    value: discountValue,
                    type: discountType
                }
            } = data;

            await createProduct({
                data: {
                    name: data.name,
                    description: data.description,
                    basePrice: Number(data.basePrice),
                    quantity: Number(data.quantity),
                    categories: data.categories,
                    images: imagesUrls,
                    discount: discountValue ? {
                        type: discountType,
                        value: discountValue
                    } : undefined
                }
            });

            router.push("/dashboard/goods");
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 max-w-[700px] relative"
            >
                {
                    (isSubmitting) && (
                        <div
                            className="absolute w-full h-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center"
                        >
                            <Loader
                                message={loadingMessage}
                            />
                        </div>
                    )
                }
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
                    name="basePrice"
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
                                This is the base price of the product
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
                <FormField
                    control={form.control}
                    name="categories"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel
                                className="text-gray-200"
                            >
                                Categories
                            </FormLabel>
                            <FormControl>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="text-gray-300 w-full"
                                        >
                                            Select categories
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent asChild>
                                        <Command>
                                            <CommandInput
                                                placeholder="Search categories..."
                                            />
                                            <CommandEmpty>
                                                No categories found
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {categories.map((category) => {
                                                    return (
                                                        <CommandItem
                                                            key={category.id}
                                                            value={String(category.id)}
                                                            className={
                                                                cn(
                                                                    "text-gray-300 w-full justify-start hover:bg-slate-700",
                                                                )
                                                            }
                                                            onSelect={() => {
                                                                // if category is already selected
                                                                if (field.value.includes(String(category.id))) {
                                                                    // remove it from the list
                                                                    field.onChange(field.value.filter((v) => v !== String(category.id)))
                                                                }
                                                                // if category is not selected
                                                                else {
                                                                    // add it to the list
                                                                    field.onChange([...field.value, String(category.id)])
                                                                }
                                                            }}
                                                        >
                                                            <Check
                                                                className={
                                                                    cn(
                                                                        field.value.includes(String(category.id)) ? "opacity-100" : "opacity-0",
                                                                    )
                                                                }
                                                            />
                                                            {category.name}
                                                        </CommandItem>
                                                    );
                                                })}
                                            </CommandGroup>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </FormControl>
                            <FormDescription>
                                This is the categories of the product
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    {
                        isDragActive ?
                            <p>Drop the files here ...</p> :
                            <div
                                className="border border-dashed border-foreground/90 p-3 text-foreground/90 rounded"
                            >
                                Drag and drop some files here, or click to select files
                            </div>
                    }
                    {
                        images.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {
                                    images.map((file) => (
                                        <div
                                            key={file.name}
                                            className="w-24 h-24 relative"
                                        >
                                            <img
                                                src={URL.createObjectURL(file)}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))
                                }
                            </div>
                        )
                    }
                </div>
                <Accordion
                    type="single"
                    collapsible
                >
                    <AccordionItem
                        value="advanced"
                        className="text-foreground"
                    >
                        <AccordionTrigger>
                            Advanced
                        </AccordionTrigger>
                        <AccordionContent
                            className="space-y-4"
                            asChild
                        >
                            <FormField
                                control={form.control}
                                name="discount.type"
                                render={({ field }) => (
                                    <FormItem
                                        className="space-y-0 flex items-start justify-start gap-3"
                                    >
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value === 'percentage'}
                                                onCheckedChange={
                                                    (checked) => {
                                                        field.onChange(checked ? 'percentage' : 'fixed')
                                                    }
                                                }
                                                className="hidden"
                                            />
                                        </FormControl>
                                        <div
                                            role="button"
                                            tabIndex={0}
                                            onKeyUp={
                                                (e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        field.onChange(field.value === 'percentage' ? 'fixed' : 'percentage')
                                                    }
                                                }}
                                            onClick={() => {
                                                field.onChange(field.value === 'percentage' ? 'fixed' : 'percentage')
                                            }}
                                            className={cn(
                                                "relative transition-colors w-11 h-6 bg-gray-200 rounded-full dark:bg-gray-700 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 hover:cursor-pointer",
                                                field.value === 'percentage' ? 'after:translate-x-full after:border-white bg-blue-600 dark:bg-orange-400' : ''
                                            )}></div>
                                        <div>
                                            <FormLabel
                                                className="text-gray-200"
                                            >
                                                Discount as percent
                                            </FormLabel>
                                            <FormDescription>
                                                If checked, amount entered below will be treated as percentage
                                            </FormDescription>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="discount.value"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel
                                            className="text-gray-200"
                                        >
                                            Discount amount
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="0" {...field} 
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Amount of discount to apply to base price
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                >
                    {
                        isSubmitting && (
                            <Loader2
                                className="mr-2 h-4 w-4 animate-spin"
                            />
                        )
                    }
                    Submit
                </Button>
            </form>
        </Form>
    );
}