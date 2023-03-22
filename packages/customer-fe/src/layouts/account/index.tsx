import { PropsWithChildren, useState } from "react";
import RootLayout from "../root";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import clsx from 'clsx';

const AccountLayout: React.FC<PropsWithChildren> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <RootLayout>
            <div
                className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8"
            >
                <Collapsible
                    className="w-full rounded bg-blue-100 p-2 dark:bg-slate-800"
                    open={isOpen}
                    onOpenChange={setIsOpen}
                >
                    <CollapsibleTrigger
                        className="w-full pl-2"
                    >
                        <div className="flex justify-between items-center">
                            <div className="text-lg text-gray-900 dark:text-gray-100">
                                Dashboard
                            </div>
                            <ChevronDown
                                className={clsx("transition-transform duration-300 dark:stroke-gray-100", { "transform rotate-180": isOpen })}
                                size={24}
                            />
                        </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent
                        className="CollapsibleContent w-full mt-3"
                    >
                        <div className="flex justify-between items-start flex-col w-full gap-3">
                            <div className="text-lg text-gray-900 dark:text-gray-100 rounded p-1 px-2 border-2 border-blue-200 dark:border-sky-500 w-full">
                                Preferences
                            </div>
                            <div className="text-lg text-gray-900 dark:text-gray-100 rounded p-1 px-2 border-2 border-blue-200 dark:border-sky-500 w-full">
                                Orders
                            </div>
                            <div className="text-lg text-gray-900 dark:text-gray-100 rounded p-1 px-2 border-2 border-blue-200 dark:border-sky-500 w-full">
                                Wishlist
                            </div>
                            <div className="text-lg rounded p-1 px-2 border-2 text-red-400 border-red-400 w-full">
                                Sign out
                            </div>
                        </div>
                    </CollapsibleContent>
                </Collapsible>
                {children}
            </div>
        </RootLayout>
    );
};

export default AccountLayout;
