import Link from 'next/link';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription
} from '~/components/ui/card';

export default function Page() {
    return (
        <div
            className="flex flex-col"
        >
            <h2 className="scroll-m-20 border-b pb-2 text-gray-200 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                New Goods
            </h2>
            <div
                className="mt-8 flex flex-col gap-4"
            >
                <Link
                    href="/dashboard/goods/import-csv"
                >
                    <Card
                        className="hover:bg-slate-800 transition-colors border-slate-800"
                    >
                        <CardHeader>
                            <CardTitle>
                                <div
                                    className="flex items-center gap-4 text-foreground/90"
                                >
                                    Import from CSV
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                Import goods from CSV file
                            </CardDescription>
                        </CardContent>
                    </Card>
                </Link>
                <Link
                    href="/dashboard/goods/manually"
                >
                    <Card
                        className="hover:bg-slate-800 transition-colors border-slate-800"
                    >
                        <CardHeader>
                            <CardTitle>
                                <div
                                    className="flex items-center gap-4 text-foreground/90"
                                >
                                    Manually
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                Add goods manually
                            </CardDescription>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
