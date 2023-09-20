'use client'

import type { ProductModel } from '@corazon/sale-fe/src/server/schema'
import {
    Typography,
    Space,
    Table,
    Dropdown,
    Button
} from 'antd'
import Link from 'next/link'

export default function PageContent({
    products
}: {
    products: ProductModel[]
}) {
    return (
        <div
            style={{
                marginLeft: '28px',
                marginRight: '28px'
            }}
        >
            <Typography.Title>
                Products
            </Typography.Title>
            <Table
                dataSource={products}
                columns={[
                    {
                        title: 'ID',
                        dataIndex: 'id',
                        key: 'id',
                    },
                    {
                        title: 'Name',
                        dataIndex: 'name',
                        key: 'name',
                    },
                    {
                        title: 'Price',
                        dataIndex: 'price',
                        key: 'price',
                    },
                    {
                        title: 'Quantity',
                        dataIndex: 'quantity',
                        key: 'quantity',
                    },
                    {
                        title: 'User ID',
                        dataIndex: 'userId',
                        key: 'user_id',
                    },
                    {
                        title: 'Actions',
                        key: 'actions',
                        render: (_, { id }) => (
                            <Dropdown
                                menu={{
                                    items: [
                                        {
                                            key: 'edit',
                                            label: <Link
                                                href={`/admin/products/${id}`}
                                            >
                                                <Button
                                                    style={{
                                                        width: '100%'
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                            </Link>
                                        },
                                        {
                                            key: 'delete',
                                            label: <Button danger>Delete</Button>
                                        }
                                    ]
                                }}
                                trigger={['click']}
                            >
                                <Button>
                                    Actions
                                </Button>
                            </Dropdown>
                        )
                    }
                ]}
                pagination={{
                    pageSize: 20
                }}
            />
        </div>
    )
}