'use client';
import { UploadDropzone } from "@uploadthing/react";
import { OurFileRouter } from "~/app/api/uploadthing/core";

export default function CsvDropzone() {
    return (
        <UploadDropzone<OurFileRouter>
            endpoint="csvUploader"
        />
    );
}