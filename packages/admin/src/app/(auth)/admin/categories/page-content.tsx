'use client'

import type { CategoryModel } from '@corazon/sale-fe/src/server/schema'
import {
    Typography,
    Space,
    Tree,
    Col,
    Row,
    Form,
    Input,
    Button,
    Select
} from 'antd'
import { useState } from 'react'
import { api } from '~/utils/api'
import { DownOutlined } from '@ant-design/icons';
import CategoryForm from './category-form'

interface DataNode {
    title: string;
    key: string;
    children?: DataNode[];
}

export default function PageContent({
    rootCategory,
    categories
}: {
    rootCategory: CategoryModel,
    categories: CategoryModel[]
}) {
    const [treeData, setTreeData] = useState<DataNode[]>([{
        title: rootCategory.name,
        key: String(rootCategory.id)
    }])
    const [selectedCategory, setSelectedCategory] = useState<CategoryModel>(rootCategory)
    const [isAddingNew, setIsAddingNew] = useState(false)
    const [form] = Form.useForm()

    const updateTreeData = (
        list: DataNode[],
        key: React.Key,
        children: DataNode[]): DataNode[] => list.map(node => {
            if (node.key === key) {
                return {
                    ...node,
                    children,
                };
            }

            if (node.children) {
                return {
                    ...node,
                    children: updateTreeData(node.children, key, children),
                };
            }

            return node;
        });

    const {
        mutateAsync: getChildren,
    } = api.categories.getDirectChildren.useMutation({
        onSuccess(data, variables, context) {
            const { categories } = data;
            const { parentId } = variables;

            setTreeData(origin =>
                updateTreeData(origin, String(parentId), categories.map(category => ({
                    title: category.name,
                    key: String(category.id)
                })))
            );
        },
    })
    const {
        mutate: getCategory,
    } = api.categories.getCategory.useMutation({
        onSuccess(data, variables, context) {
            const { category } = data;

            setSelectedCategory(category)
            setIsAddingNew(false)
            form.setFieldsValue({
                name: category.name,
                slug: category.slug,
                parentId: category.parentId,
                description: category.description
            })
        }
    })
    const onAddNewClick = () => {
        setIsAddingNew(true)

        form.setFieldsValue({
            name: '',
            slug: '',
            parentId: selectedCategory.id,
            description: ''
        })
    }

    return (
        <div
            style={{
                marginLeft: '28px',
                marginTop: '2rem',
            }}
        >
            <Row>
                <Col>
                    <Typography.Title>
                        {`Categories`}
                    </Typography.Title>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button
                        onClick={onAddNewClick}
                    >
                        Add category
                    </Button>
                </Col>
            </Row>
            <Row
                style={{
                    marginTop: '2rem'
                }}
            >
                <Col
                    span={6}
                    style={{
                        marginRight: '3rem',
                        display: 'flex'
                    }}
                >
                    <Space
                        direction='vertical'
                        style={{
                            width: '100%',
                        }}
                    >
                        <Tree
                            treeData={treeData}
                            loadData={async ({ key, children }) => {
                                if (children) {
                                    return;
                                }

                                await getChildren({
                                    parentId: Number(key)
                                })
                            }}
                            onSelect={(selectedKeys) => {
                                const selectedId = Number(selectedKeys[0])

                                getCategory({
                                    id: selectedId
                                })
                            }}
                            switcherIcon={<DownOutlined />}
                            style={{
                                overflowY: 'auto',
                                paddingRight: '2rem',
                                paddingTop: '0.25rem',
                                paddingBottom: '0.25rem',
                                paddingLeft: '0.5rem'
                            }}
                        />
                    </Space>
                </Col>
                <Col
                    span={12}
                >
                    {
                        isAddingNew ? (
                            <CategoryForm
                                category={selectedCategory}
                                form={form}
                                isNew
                            />
                        )
                            : (
                                <CategoryForm
                                    category={selectedCategory}
                                    form={form}
                                    isNew={false}
                                />
                            )
                    }
                </Col>
            </Row>
        </div>
    )
}