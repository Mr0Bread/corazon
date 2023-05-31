'use client';

import { useAuth } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'

const SignOutButton = () => {
    const { signOut } = useAuth();
    return (
        <Button
            onClick={() => {
                signOut();
            }}
            variant="destructive"
            className='text-gray-200'
        >
            Sign Out
        </Button>
    );
}

export default SignOutButton;