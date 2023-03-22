import Head from "next/head";
import MyAccountLayout from "~/layouts/my-account";

export default function MyAccountGeneral() {
    return (
        <MyAccountLayout>
            <Head>
                <title>My Account General | Corazon Sail</title>
            </Head>
            <div>My Account General</div>
        </MyAccountLayout>
    );
}