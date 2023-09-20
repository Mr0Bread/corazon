'use client';

import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Link from "next/link";
import { ProductsSelectSchema } from '@/server/schema';
import { api } from "~/utils/api";
import { useRouter } from "next/navigation";

const GoodsTable: React.FC<{ goods: Omit<ProductsSelectSchema, 'images'>[] }> = ({ goods }) => {
    const router = useRouter()

    const {
        isLoading,
        mutate: deleteProduct
    } = api.products.delete.useMutation({
        onSuccess() {
            router.refresh()
        }
    })

    const table = useReactTable({
        columns: [
            {
                header: "ID",
                accessorKey: "id",
            },
            {
                header: "Name",
                accessorKey: "name",
            },
            {
                header: "Price",
                cell: ({ row: { original: { finalPrice } } }) => (
                    <div>
                        {`${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(finalPrice / 100)}$`}
                    </div>
                )
            },
            {
                header: "Quantity",
                accessorKey: "quantity",
            },
            {
                header: "Actions",
                cell: ({ row: { original } }) => (
                    <div className="flex gap-2">
                        <Link
                            href={`/dashboard/goods/${original.id}`}
                        >
                            <Button
                                variant="secondary"
                                size="sm"
                            >
                                Edit
                            </Button>
                        </Link>
                        <Button
                            variant="destructive"
                            className="bg-red-500"
                            size="sm"
                            onClick={() => {
                                deleteProduct({
                                    id: original.id
                                })
                            }}
                        >
                            Delete
                        </Button>
                    </div>
                )
            }
        ],
        data: goods,
        getCoreRowModel: getCoreRowModel()
    });

    return (
        <div>
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

export default GoodsTable;
