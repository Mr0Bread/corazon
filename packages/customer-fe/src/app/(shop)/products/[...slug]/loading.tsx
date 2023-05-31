import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
    return (
        <div
            className="rounded h-screen w-full"
        >
            <Skeleton
                className="w-full h-full"
            />
        </div>
    );
}