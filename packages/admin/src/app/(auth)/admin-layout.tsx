'use client'

import { Layout, Menu } from "antd"
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const { Header, Content, Sider } = Layout

const pathToKey: Record<string, string> = {
    '/admin/products': 'catalog-products',
    '/admin/categories': 'catalog-categories',
    '/admin/orders': 'orders',
    '/admin/customers': 'customers',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const [selectedKeys, setSelectedKeys] = useState(pathToKey[pathname] ? [pathToKey[pathname] as string] : undefined)

    useEffect(
        () => {
            setSelectedKeys(pathToKey[pathname] ? [pathToKey[pathname] as string] : undefined)
        },
        [pathname]
    )

    return (
        <Layout
            style={{
                minHeight: '100vh',
            }}
        >
            <Header>Header</Header>
            <Layout
                hasSider
            >
                <Sider>
                    <Menu
                        mode="inline"
                        style={{ height: '100%', borderRight: 0 }}
                        defaultSelectedKeys={selectedKeys}
                        selectedKeys={selectedKeys}
                        items={[
                            {
                                key: 'catalog',
                                label: 'Catalog',
                                children: [
                                    {
                                        key: 'catalog-products',
                                        label: 'Products',
                                        onClick: () => router.push('/admin/products')
                                    },
                                    {
                                        key: 'catalog-categories',
                                        label: 'Categories',
                                        onClick: () => router.push('/admin/categories')
                                    },
                                ]
                            },
                            {
                                key: 'sales',
                                label: 'Sales',
                                children: [
                                    {
                                        key: 'sales-orders',
                                        label: 'Orders',
                                        onClick: () => router.push('/admin/orders')
                                    },
                                    {
                                        key: 'sales-sellers',
                                        label: 'Sellers',
                                        onClick: () => router.push('/admin/sellers')
                                    },
                                ]
                            },
                            {
                                key: 'customers',
                                label: 'Customers',
                                onClick: () => router.push('/admin/customers')
                            },
                            {
                                key: 'content',
                                label: 'Content',
                                children: [
                                    {
                                        key: 'menus',
                                        label: 'Menus',
                                        onClick: () => router.push('/admin/menus')
                                    }
                                ]
                            }
                        ]}
                    />
                </Sider>
                <Content
                    style={{
                        backgroundColor: '#0a0a0a'
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
}