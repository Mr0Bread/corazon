import { env } from "~/env.mjs"
import { prisma } from "~/server/db"

import { NextApiRequest, NextApiResponse } from "next"

export default async function generate(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({
            message: "Method Not Allowed",
        })
    }

    const authorizationHeader = req.headers["Authorization"]

    if (!authorizationHeader) {
        return res.status(401).json({
            message: "Unauthorized",
        })
    }

    if (Array.isArray(authorizationHeader)) {
        return res.status(401).json({
            message: "Unauthorized",
        })
    }

    const [, token] = authorizationHeader.split(" ") as [string, string]

    if (token !== env.API_TOKEN) {
        return res.status(401).json({
            message: "Unauthorized",
        })
    }

    if (!req.body["productId"]) {
        return res.status(400).json({
            message: "Missing product ID",
        })
    }

    const productId = req.body["productId"] as string

    const product = await prisma.product.findUnique({
        where: {
            id: productId,
        },
        select: {
            slug: true,
        }
    })

    if (!product) {
        return res.status(404).json({
            message: "Product not found",
        })
    }

    await res.revalidate(`/products/${ product.slug }`)

    return res.json({
        message: "OK",
    })
}