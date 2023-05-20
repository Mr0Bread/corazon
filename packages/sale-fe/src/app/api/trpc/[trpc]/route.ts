import {
    fetchRequestHandler,
} from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/api/root";
import { auth } from "@clerk/nextjs";

const handler = async (request: Request) => {
    console.log(`incoming request ${request.url}`);
    const authData = auth();
    return fetchRequestHandler({
        endpoint: "/api/trpc",
        req: request,
        router: appRouter,
        createContext: function () {
            return {
                auth: authData
            };
        }
    });
};

export { handler as GET, handler as POST };
