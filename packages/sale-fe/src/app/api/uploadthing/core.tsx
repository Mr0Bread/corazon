/** app/api/uploadthing/core.ts */
import { createUploadthing, type FileRouter } from "uploadthing/next";
const f = createUploadthing();


// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  // imageUploader: f
  //   // Set permissions and file types for this FileRoute
  //   .fileTypes(["image"])
  //   .maxSize("16MB")
  //   .onUploadComplete(async ({ metadata, file}) => {
  //     console.log("file url", file.url);
  //   })
  imageUploader: f({
    image: {
      maxFileSize: "16MB",
      maxFileCount: 10
    }
  })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("file url", file.url);
    }
    ),
  csvUploader: f({
    "text/csv": {
      maxFileSize: "16MB",
      maxFileCount: 1,
    }
  })
    .onUploadComplete(async ({ metadata, file }) => {
      // once CSV file is uploaded, start creating the products
      console.log("file url", file.url);
    }
    )
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
