import { Metadata } from "next";
import CsvDropzone from "./csv-dropzone";

export const metadata: Metadata = {
    title: "New Goods: Import CSV",
}

export default function Page() {
    return (
        <div
            className="flex flex-col"
        >
            <h2 className="scroll-m-20 border-b pb-2 text-gray-200 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                Import CSV
            </h2>
            <CsvDropzone />
        </div>
    );
}