import RootLayout from "~/layouts/root";

export default function Index() {
    return (
        <RootLayout>
            <div
                className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8"
            >
                <div className="flex text-7xl justify-start">
                    <div>
                        CO
                    </div>
                    <div>
                        RA
                    </div>
                    <div>
                        ZON
                    </div>
                </div>
                <div className="flex justify-start text-4xl mt-12">
                    At the heart of the market
                </div>
            </div>
        </RootLayout>
    );
}