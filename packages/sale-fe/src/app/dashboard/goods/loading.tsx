import { Skeleton } from "@/components/ui/skeleton"

const Loading: React.FC = () => {
    return (
        <div
            className="flex items-center justify-center"
        >
            <Skeleton
                className="w-full h-96"
            />
        </div>
    );
};

export default Loading;
