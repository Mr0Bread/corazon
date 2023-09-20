'use client';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormDescription,
    FormMessage
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "~/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '~/components/ui/popover'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "~/components/ui/button";
import * as z from "zod";
import { useForm, useWatch } from "react-hook-form";
import { Loader2, CreditCard } from "lucide-react";
import { cn } from "~/lib/utils";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";
import { atom, useAtom } from "jotai";

export const shipmentPriceAtom = atom(0);

const formSchema = z.object({
    country: z.string(),
    shippingMethod: z.string(),
    shippingAddress: z.object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        postcode: z.string().optional(),
        country: z.string().optional(),
        phoneNumber: z.string().optional(),
    })
});

const addressSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    address: z.string(),
    city: z.string(),
    postcode: z.string(),
    country: z.string(),
    phoneNumber: z.string(),
});

type ParcelMachine = {
    id: number;
    name: string;
    address: string;
    city: string;
    postcode: string;
}

export default function CheckoutForm({
    countries
}: {
    countries: {
        name: string;
        code: string;
    }[]
}) {
    const { user, isLoaded } = useUser();

    if (!isLoaded) {
        return (
            <div
                className="flex items-center justify-center"
            >
                <Loader2
                    size={32}
                    className="text-foreground animate-spin"
                />
            </div>
        );
    }

    if (!user) return null

    const { firstName, lastName } = user;
    const {
        mutate,
        isLoading: isProceedingToPayment
    } = api.checkout.proceedToPayment.useMutation({
        onSuccess: (data) => {
            const { redirectUrl } = data;

            window.location.href = redirectUrl;
        }
    });
    const {
        data: shippingMethodsData,
        mutate: getShippingMethods,
        isLoading: isShippingMethodsLoading
    } = api.checkout.getShippingMethods.useMutation();

    const form = useForm<z.infer<typeof formSchema>>({
        defaultValues: {
            shippingAddress: {
                firstName: firstName as string,
                lastName: lastName as string,
            }
        }
    });
    const watchedCountry = useWatch({
        control: form.control,
        name: 'country'
    });
    const watchedShippingMethod = useWatch({
        control: form.control,
        name: 'shippingMethod'
    });

    const {
        refetch: fetchParcelLocations,
        data: parcelLocationsData,
        isLoading: isParcelLocationsLoading
    } = api.checkout.getParcelLocations.useQuery({
        country: countries.find(({ name }) => name === watchedCountry)?.code as string
    }, {
        enabled: false
    })

    const [, setShipmentPrice] = useAtom(shipmentPriceAtom);

    const [isCountrySelectOpen, setIsCountrySelectOpen] = useState(false);
    const [isParcelSelectOpen, setIsParcelSelectOpen] = useState(false);
    const [parcelMachine, setParcelMachine] = useState<ParcelMachine | null>(null);

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        const selectedShippingMethod = shippingMethodsData?.shippingMethods.find(({ code }) => code === data.shippingMethod);

        if (!selectedShippingMethod) {
            return;
        }

        mutate({
            shipmentPrice: selectedShippingMethod.price,
            shippingMethod: data.shippingMethod,
            shippingAddress: data.shippingAddress as z.infer<typeof addressSchema>,
        });
    };

    const renderParcelSelect = () => {
        if (isParcelLocationsLoading) {
            return (
                <div>
                    <FormLabel
                        className="text-gray-200 text-md"
                    >
                        Parcel machine
                    </FormLabel>
                    <div
                        className="flex justify-center items-center mt-6"
                    >
                        <Loader2
                            className="animate-spin text-foreground/80"
                        />
                    </div>
                </div>
            );
        }

        const { parcelLocations = [] } = parcelLocationsData || {};

        return (
            <FormField
                control={form.control}
                name="shippingAddress"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel
                            className="text-gray-200 text-md"
                        >
                            Parcel machine
                        </FormLabel>
                        <FormControl>
                            <Popover
                                open={isParcelSelectOpen}
                                onOpenChange={setIsParcelSelectOpen}
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="text-gray-300 w-full"
                                    >
                                        {
                                            parcelMachine ? (
                                                `${watchedCountry}, ${parcelMachine?.city}, ${parcelMachine?.address}, ${parcelMachine?.postcode}`
                                            ) : (
                                                'Select parcel machine'
                                            )
                                        }
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent asChild>
                                    <Command>
                                        <CommandInput
                                            placeholder="Search parcel machines..."
                                        />
                                        <CommandEmpty>
                                            No parcel machine found
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {parcelLocations.map((machine) => {
                                                return (
                                                    <CommandItem
                                                        key={machine.id}
                                                        value={String(machine.id)}
                                                        className={
                                                            cn(
                                                                "text-gray-300 w-full justify-start hover:bg-slate-700",
                                                            )
                                                        }
                                                        onSelect={() => {
                                                            setParcelMachine(machine);
                                                            form.setValue('shippingAddress.address', machine.address);
                                                            form.setValue('shippingAddress.city', machine.city);
                                                            form.setValue('shippingAddress.postcode', machine.postcode);
                                                            setIsParcelSelectOpen(false);
                                                        }}
                                                    >
                                                        {machine.name}
                                                    </CommandItem>
                                                );
                                            })}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </FormControl>
                        <FormDescription>
                            This is the parcel machine where your order will be delivered to
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        );
    }

    const renderShippingMethodFields = () => {
        if (watchedShippingMethod.includes('parcel')) {
            return renderParcelSelect();
        }

        return (
            <>
                <FormField
                    control={form.control}
                    name="shippingAddress.address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel
                                className="text-gray-200 text-md"
                            >
                                Address
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="Address"
                                    className="text-gray-300 w-full"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Your address will be used to deliver your order
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="shippingAddress.city"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel
                                className="text-gray-200 text-md"
                            >
                                City
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="City"
                                    className="text-gray-300 w-full"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Your city will be used to deliver your order
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="shippingAddress.postcode"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel
                                className="text-gray-200 text-md"
                            >
                                Postcode
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="Postcode"
                                    className="text-gray-300 w-full"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Your postcode will be used to deliver your order
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </>
        );
    }

    const renderPhoneNumberField = () => (
        <FormField
            control={form.control}
            name="shippingAddress.phoneNumber"
            render={({ field }) => (
                <FormItem>
                    <FormLabel
                        className="text-gray-200 text-md"
                    >
                        Phone number
                    </FormLabel>
                    <FormControl>
                        <Input
                            type="text"
                            placeholder="Phone number"
                            className="text-gray-300 w-full"
                            {...field}
                        />
                    </FormControl>
                    <FormDescription>
                        Your phone number will be used to contact you
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    );

    const renderSubmitButton = () => {
        const { success } = addressSchema.safeParse(form.getValues('shippingAddress'));

        if (!success) {
            return null;
        }

        return (
            <Button
                type="submit"
                className="w-full"
            >
                <CreditCard
                    size={24}
                    className="mr-2"
                />
                Continue to payment
            </Button>
        );
    }

    const renderShippingMethodSelect = () => {
        if (isShippingMethodsLoading) {
            return (
                <div>
                    <FormLabel
                        className="text-gray-200 text-md"
                    >
                        Select shipping method
                    </FormLabel>
                    <div
                        className="flex justify-center items-center mt-6"
                    >
                        <Loader2
                            className="animate-spin text-foreground/80"
                        />
                    </div>
                </div>
            );
        }

        const { shippingMethods = [] } = shippingMethodsData || {};

        return (
            <FormField
                control={form.control}
                name="shippingMethod"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel
                            className="text-gray-200 text-md"
                        >
                            Select shipping method
                        </FormLabel>
                        <FormControl>
                            <RadioGroup
                                onValueChange={(event) => {
                                    if (event.includes('parcel')) {
                                        fetchParcelLocations();
                                    }

                                    field.onChange(event)

                                    const selectedShippingMethod = shippingMethods.find(({ code }) => code === event);

                                    if (!selectedShippingMethod) {
                                        // should never happen
                                        return;
                                    }

                                    setShipmentPrice(selectedShippingMethod.price);
                                }}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                            >
                                {
                                    shippingMethods
                                        .map(
                                            ({ code, name, price, estimatedShippingTime }) => (
                                                <FormItem
                                                    className="flex items-center space-x-0 space-y-0 relative"
                                                    key={code}
                                                >
                                                    <FormControl
                                                        className="absolute left-3"
                                                    >
                                                        <RadioGroupItem value={code} />
                                                    </FormControl>
                                                    <FormLabel
                                                        className="flex flex-col gap-2 font-normal text-foreground/90 rounded border px-2 pl-10 py-3 flex-grow hover:cursor-pointer hover:bg-slate-800 transition-colors"
                                                    >
                                                        <div
                                                            className="flex justify-between w-full text-base"
                                                        >
                                                            <div>
                                                                {name}
                                                            </div>
                                                            <div>
                                                                {(price / 100).toFixed(2)}$
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="text-foreground/80"
                                                        >
                                                            {`Estimated shipping time: ${estimatedShippingTime}`}
                                                        </div>
                                                    </FormLabel>
                                                </FormItem>
                                            )
                                        )
                                }
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        );
    }

    return (
        <div
            className="relative"
        >
            {
                isProceedingToPayment && (
                    <div
                        className="fixed w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center rounded top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
                    >
                        <div
                            className="flex flex-col items-center justify-center"
                        >
                            <Loader2
                                size={32}
                                className="animate-spin text-foreground/80 z-10"
                            />
                            <div
                                className="text-foreground/90"
                            >
                                Proceeding to Stripe
                            </div>
                        </div>
                    </div>
                )
            }
            <h3
                className="text-foreground/90 scroll-m-20 text-2xl font-semibold tracking-tight mb-6"
            >
                Shipping information
            </h3>
            <Form {...form}>
                <form
                    className="space-y-6"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel
                                    className="text-gray-200 text-md"
                                >
                                    Country
                                </FormLabel>
                                <FormControl>
                                    <Popover
                                        open={isCountrySelectOpen}
                                        onOpenChange={setIsCountrySelectOpen}
                                    >
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="text-gray-300 w-full"
                                            >
                                                {
                                                    form.watch('country') ? (
                                                        form.getValues('country')
                                                    ) : (
                                                        'Select country'
                                                    )
                                                }
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent asChild>
                                            <Command>
                                                <CommandInput
                                                    placeholder="Search countries..."
                                                />
                                                <CommandEmpty>
                                                    No country found
                                                </CommandEmpty>
                                                <CommandGroup>
                                                    {countries.map((country) => {
                                                        return (
                                                            <CommandItem
                                                                key={country.code}
                                                                value={String(country.code)}
                                                                className={
                                                                    cn(
                                                                        "text-gray-300 w-full justify-start hover:bg-slate-700",
                                                                    )
                                                                }
                                                                onSelect={() => {
                                                                    form.setValue('country', country.name);
                                                                    form.setValue('shippingAddress.country', country.code);
                                                                    setIsCountrySelectOpen(false);
                                                                    getShippingMethods({
                                                                        country: country.code
                                                                    });
                                                                }}
                                                            >
                                                                {country.name}
                                                            </CommandItem>
                                                        );
                                                    })}
                                                </CommandGroup>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </FormControl>
                                <FormDescription>
                                    This is the country you want to ship to
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {
                        !!watchedCountry && renderShippingMethodSelect()
                    }
                    {
                        !!watchedShippingMethod && (
                            <>
                                {renderPhoneNumberField()}
                                {renderShippingMethodFields()}
                            </>
                        )
                    }
                    {renderSubmitButton()}
                </form>
            </Form>
        </div>
    );
}