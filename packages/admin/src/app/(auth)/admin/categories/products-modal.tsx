import {
    Modal,
    Table,
    Button
} from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { api } from '~/utils/api';

export default function ProductsModal({
    isModalOpen,
    handleOk,
    handleCancel,
    categoryId
}: {
    isModalOpen: boolean,
    handleOk: () => void,
    handleCancel: () => void,
    categoryId: number
}) {
    const [isAssigningProducts, setIsAssigningProducts] = useState(false);
    const {
        data,
        isLoading,
        mutate
    } = api.categories.getProducts.useMutation();
    const {
        data: unassignedProductsData,
        isLoading: isUnassignedProductsLoading,
        mutate: getUnassignedProducts
    } = api.categories.getUnassignedProducts.useMutation();

    useEffect(
        () => {
            mutate({
                categoryId
            })
        },
        [categoryId]
    );

    const onAssignProducts = useCallback(() => {
        setIsAssigningProducts(true);
        getUnassignedProducts({
            categoryId
        })
    }, [categoryId])

    const renderAssignProductsTable = () => (
        <Table
            loading={isUnassignedProductsLoading}
            columns={[
                {
                    key: 'id',
                    title: 'ID',
                    dataIndex: 'id'
                },
                {
                    key: 'name',
                    title: 'Name',
                    dataIndex: 'name'
                }
            ]}
            dataSource={unassignedProductsData?.products}
            pagination={{
                pageSize: 10,
                total: unassignedProductsData?.totalCount
            }}
        />
    )

    const renderAssignedProductsTable = () => (
        <>
            <Button
                style={{
                    marginBottom: '1rem'
                }}
                onClick={onAssignProducts}
            >
                Assign products
            </Button>
            <Table
                loading={isLoading}
                columns={[
                    {
                        key: 'id',
                        title: 'ID',
                        dataIndex: 'id'
                    },
                    {
                        key: 'name',
                        title: 'Name',
                        dataIndex: 'name'
                    }
                ]}
                dataSource={data?.products}
                pagination={{
                    pageSize: 10,
                    total: data?.totalCount
                }}
            />
        </>
    )

    return (
        <Modal
            title="Products in category"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            {
                isAssigningProducts
                    ? renderAssignProductsTable()
                    : renderAssignedProductsTable()
            }
        </Modal>
    );
}