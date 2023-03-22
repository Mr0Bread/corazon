import { User, Menu, Search, Heart, Box } from 'lucide-react'
import Link from 'next/link'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"


export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <header className="bg-gray-900 dark:bg-slate-900 text-gray-100 dark:text-gray-300">
                <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <Link
                      href="/"
                      passHref
                    >
                      <h1 className="text-lg font-bold uppercase">Corazon</h1>
                    </Link>
                    <nav className="hidden md:block">
                        <ul className="flex space-x-4">
                            <li>
                                <Link
                                    href="/products/all"
                                    className="text-gray-100 hover:text-gray-200 dark:hover:text-gray-400 transition-colors duration-300"
                                >
                                    Products
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="https://corazon-sail.vercel.app/"
                                    className="text-gray-100 hover:text-gray-200 dark:hover:text-gray-400 transition-colors duration-300"
                                    target="_blank"
                                >
                                    Become a sailor
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/products/best-sellers"
                                    className="text-gray-100 hover:text-gray-200 dark:hover:text-gray-400 transition-colors duration-300"
                                >
                                    Best sellers
                                </Link>
                            </li>
                        </ul>
                    </nav>
                    <div className="md:hidden flex flex-row gap-4 items-center">
                        <div>
                            <Link
                                href="/account/dashboard"
                                className="text-gray-100 hover:text-gray-200 dark:hover:text-gray-400 transition-colors duration-300"
                            >
                                <User size={24} />
                            </Link>
                        </div>
                        <Dialog>
                            <DialogTrigger>
                                <Menu />
                            </DialogTrigger>
                            <DialogContent>
                                <div
                                    className="dark:text-gray-100 mt-2"
                                >
                                    <div
                                      className="mt-6 flex flex-col gap-4"
                                    >
                                      <div
                                        className="flex flex-row gap-2 px-3 py-2 bg-slate-800 rounded text-gray-200"
                                      >
                                        <Search />
                                        Search
                                      </div>
                                      <div
                                        className="flex flex-row gap-2 px-3 py-2 bg-slate-800 rounded text-gray-200"
                                      >
                                        <Box />
                                        Products
                                      </div>
                                      <div
                                        className="flex flex-row gap-2 px-3 py-2 bg-slate-800 rounded text-gray-200"
                                      >
                                        <Heart />
                                        Wishlist
                                      </div>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </header>
            {children}
        </>
    )
}
