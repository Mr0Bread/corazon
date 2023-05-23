'use client';

import Link from 'next/link';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const HeaderNavigation = () => {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem
                    className="text-foreground/60"
                >
                    <Link
                        href="/"
                        legacyBehavior
                        passHref
                    >
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            Home
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger
                        className="text-foreground/60"
                    >
                        Products
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul
                            className='grid w-[400px] gap-3 p-4 grid-cols-2 text-foreground/75'
                        >
                            <li>
                                <Link
                                    href="/products/all"
                                >
                                    <div
                                        className="flex flex-col items-start gap-1 hover:bg-slate-800 transition-all p-2 rounded h-full"
                                    >
                                        <div>
                                            All
                                        </div>
                                        <div
                                            className="text-foreground/60"
                                        >
                                            Discover all available products
                                        </div>
                                    </div>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/products/best-sellers"
                                >
                                    <div
                                        className="flex flex-col items-start gap-1 hover:bg-slate-800 transition-all p-2 rounded h-full"
                                    >
                                        <div>
                                            Best Sellers
                                        </div>
                                        <div
                                            className="text-foreground/60"
                                        >
                                            The hot ones
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
};

export default HeaderNavigation;
