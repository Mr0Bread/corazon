import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { NextPageWithLayout } from "../_app";
import { prisma } from "~/server/db";
import Head from "next/head";

const ProductPage: NextPageWithLayout<InferGetStaticPropsType<typeof getStaticProps>> = (props) => {
    const { product } = props

    if (!product) {
        return (
            <div>
                <h1>Product Not Found</h1>
            </div>
        )
    }

    return (
        <>
            <Head>
                <title>{product.name} | Corazon</title>
            </Head>
            <div
                className="flex flex-col"
            >
                <h2>{product.name}</h2>
                <div>
                    <p>{product.description}</p>
                </div>
            </div>
        </>
    );
}

export const getStaticProps = async (context: GetStaticPropsContext) => {
    const {
        params
    } = context

    if (!params) {
        return {
            props: {},
        }
    }

    const { slug } = params

    if (!slug) {
        return {
            props: {},
        }
    }

    const product = await prisma.product.findUnique({
        where: {
            slug: slug as string
        },
        select: {
            name: true,
            description: true,
            price: true,
            status: true,
        }
    })

    return {
        props: {
            product
        },
    }
}

export default ProductPage
