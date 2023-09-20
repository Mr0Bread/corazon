import {
    fetchRequestHandler,
} from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/api/root";
import { auth } from "@clerk/nextjs";

/**
 * Configure basic CORS headers
 * You should extend this to match your needs
 */
function setCorsHeaders(res: Response) {
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Request-Method", "*");
    res.headers.set("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
    res.headers.set("Access-Control-Allow-Headers", "*");
  }

const handler = async (request: Request) => {
    console.log(`incoming request ${request.url}`);
    const authData = auth();
    const response = await fetchRequestHandler({
        endpoint: "/api/trpc",
        req: request,
        router: appRouter,
        createContext: function () {
            return {
                auth: authData
            };
        }
    });
    setCorsHeaders(response)

    return response;
};

export { handler as GET, handler as POST };
