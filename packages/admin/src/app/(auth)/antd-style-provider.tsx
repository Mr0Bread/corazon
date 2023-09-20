'use client';

import { PropsWithChildren } from 'react';
import { theme } from 'antd';
import ConfigProvider from 'antd/es/config-provider';
import { AntdProvider } from './antd-provider';

export function AntdStyleProvider({ children }: PropsWithChildren) {
    return (
        <ConfigProvider
            theme={{
                algorithm: theme.darkAlgorithm
            }}
        >
            <AntdProvider>
                {children}
            </AntdProvider>
        </ConfigProvider>
    );
}