import { Skeleton } from "~/components/ui/skeleton"

export default function Loading() {
    return (
        <div
            className="max-w-7xl px-10 mt-8"
        >
            <Skeleton
                className="h-[45px] w-full"
            />
            <div
                className="grid grid-cols-2 mt-6 gap-5"
            >
                <Skeleton
                    className="w-full h-[400px]"
                />
                <Skeleton 
                    className="w-full h-[400px]"
                />
            </div>
        </div>
    )
}