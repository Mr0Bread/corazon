'use client'

import { Typography } from "antd"

export default function PageContent() {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '2rem'
            }}
        >
            <Typography.Title>
                Corazon Admin Dashboard
            </Typography.Title>
        </div>
    );
}