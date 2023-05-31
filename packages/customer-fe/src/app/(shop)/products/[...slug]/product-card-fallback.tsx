import { Skeleton } from "~/components/ui/skeleton";

export default function ProductCardFallback() {
    return (
        <div>
            <Skeleton
                className="w-full h-[400px]"
            />
        </div>
    );
}