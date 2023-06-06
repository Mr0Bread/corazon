'use client';

import { type ProductsSelectSchema } from "~/server/schema";
import { ColumnDef, useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table"
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

const columns: ColumnDef<Omit<ProductsSelectSchema, 'images'>>[] = [
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
        accessorKey: "price",
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
                >
                    Delete
                </Button>
            </div>
        )
    }
];

const GoodsTable: React.FC<{ goods: Omit<ProductsSelectSchema, 'images'>[] }> = ({ goods }) => {
    const table = useReactTable({
        columns,
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
                            <TableCell colSpan={columns.length} className="h-24 text-center">
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
