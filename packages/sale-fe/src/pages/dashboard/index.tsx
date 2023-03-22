import { ReactElement } from "react";
import { DashboardLayout } from "~/layouts/dashboard";
import { NextPageWithLayout } from "../_app";

export const Dashboard: NextPageWithLayout = () => {
    return (
        <>
            Dashboard
        </>
    );
}

Dashboard.getLayout = function getLayout(page: ReactElement) {
    return (
        <DashboardLayout>
            {page}
        </DashboardLayout>
    )
}

export default Dashboard;
