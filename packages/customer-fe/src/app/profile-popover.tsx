import { auth } from "@clerk/nextjs"
import {
    Popover,
    PopoverTrigger,
    PopoverContent
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import Link from "next/link"
import { User } from 'lucide-react'
import SignOutButton from "./sign-out-button"

const ProfilePopover = () => {
    const {
        userId
    } = auth();

    if (userId) {
        return (
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="text-foreground/80"
                    >
                        <User />
                    </Button>
                </PopoverTrigger>
                <PopoverContent asChild>
                    <div
                        className="flex flex-col gap-2"
                    >
                        <Link
                            href="/profile"
                        >
                            <Button
                                variant="outline"
                                className="text-gray-300 w-full"
                            >
                                Profile
                            </Button>
                        </Link>
                        <SignOutButton />
                    </div>
                </PopoverContent>
            </Popover>
        );
    }

    return (
        <Link
            href="/sign-in"
        >
            <Button
                variant="outline"
                className="text-foreground/60"
            >
                Sign In
            </Button>
        </Link>
    );
}

export default ProfilePopover;
