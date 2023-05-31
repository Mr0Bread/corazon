export default function Layout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
        <div
            className="flex flex-col items-start justify-start w-full px-10 max-w-7xl"
        >
            {children}
        </div>
    );
}