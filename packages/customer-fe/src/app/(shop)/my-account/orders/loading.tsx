import { Skeleton } from "~/components/ui/skeleton"

export default function Loading() {
    return (
        <div>
            <Skeleton
                className="h-[45px] w-full"
            />
            <Skeleton
                className="mt-5 h-[400px] w-full"
            />
        </div>
    )
}