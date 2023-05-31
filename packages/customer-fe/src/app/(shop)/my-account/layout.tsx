import Sidebar from "./sidebar"

export default function Layout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div
            className="max-w-7xl w-full px-10 mt-10"
        >
            <div
                className="grid grid-cols-[1fr_3fr] gap-5"
            >
                <Sidebar />
                <div>
                    {children}
                </div>
            </div>
        </div>
    );
}