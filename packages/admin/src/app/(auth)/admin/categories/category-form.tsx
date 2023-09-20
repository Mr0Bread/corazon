'use client'

import type { CategoryModel } from '@corazon/sale-fe/src/server/schema'
import {
    Button,
    Form,
    Input,
    Typography,
    type FormInstance,
    Row,
    Col
} from 'antd';
import { useState } from 'react';
import ProductsModal from './products-modal';
import { api } from '~/utils/api';

export default function CategoryForm({
    category,
    form,
    isNew
}: {
    category: CategoryModel,
    form: FormInstance,
    isNew: boolean
}) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const {
        mutate: createCategory,
        isLoading: isCreatingCategory
    } = api.categories.create.useMutation();

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onFinish = (values: {
        name: string,
        slug: string,
        parentId: string,
        description: string
    }) => {
        if (isNew) {
            createCategory({
                name: values.name,
                parentId: Number(values.parentId),
                slug: values.slug,
                description: values.description
            })
        }
    }

    return (
        <>
            <div
                style={{
                    border: '1px solid #1e293b',
                    borderTopLeftRadius: '10px',
                    borderTopRightRadius: '10px',
                    paddingLeft: '1rem',
                    paddingTop: '0.5rem'
                }}
            >
                <Typography.Title
                    level={2}
                >
                    {isNew ? 'New Category' : category.name}
                </Typography.Title>
            </div>
            <div
                style={{
                    border: '1px solid #1e293b',
                    paddingTop: '1rem',
                    borderTop: 'none',
                    paddingRight: '1rem',
                    borderBottomLeftRadius: '10px',
                    borderBottomRightRadius: '10px'
                }}
            >
                <Form
                    initialValues={
                        isNew ? {
                            parentId: category.id
                        } : {
                            name: category.name,
                            slug: category.slug,
                            parentId: category.parentId,
                            description: category.description
                        }
                    }
                    form={form}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    onFinish={onFinish}
                    disabled={isCreatingCategory}
                >
                    <Form.Item
                        label='Name'
                        name="name"
                        rules={[{ required: true, message: 'Please input category name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label='Slug'
                        name="slug"
                        rules={[{ required: true, message: 'Please input category slug!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label='Description'
                        name="description"
                        rules={[{ required: true, message: 'Please input category description!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Row>
                        <Col
                            span={8}
                        />
                        <Col
                            span={16}
                        >
                            <Button
                                onClick={showModal}
                                style={{
                                    marginBottom: '1rem'
                                }}
                            >
                                Manage Products
                            </Button>
                        </Col>
                    </Row>
                    <ProductsModal
                        handleCancel={handleCancel}
                        handleOk={handleOk}
                        isModalOpen={isModalOpen}
                        categoryId={category.id}
                    />
                    <Form.Item
                        name="parentId"
                        hidden
                    >
                        <Input
                            type='hidden'
                        />
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{ offset: 8, span: 16 }}
                    >
                        <Button
                            type="primary"
                            htmlType="submit"
                        >
                            Save
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
}