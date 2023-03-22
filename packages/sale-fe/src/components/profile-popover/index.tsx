import {
    Button,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger
} from "@chakra-ui/react";
import { BsPersonCircle } from "react-icons/bs";
import { useUser, useClerk } from '@clerk/nextjs';
import Link from "next/link";

export const ProfilePopover: React.FC = () => {
    const { isLoaded, isSignedIn, user } = useUser();
    const { signOut } = useClerk();

    if (!isLoaded || !isSignedIn) {
        return null
    }

    return (
        <Popover>
            <PopoverTrigger>
                <Button
                    variant="ghost"
                >
                    <BsPersonCircle size={28} />
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>
                    { user.fullName }
                </PopoverHeader>
                <PopoverBody
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-between"
                >
                    <Link href="/my-account/general">
                        <Button>
                            Go to profile
                        </Button>
                    </Link>
                    <Button
                        colorScheme="red"
                        onClick={() => signOut()}
                    >
                        Sign Out
                    </Button>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    )
}

export default ProfilePopover
