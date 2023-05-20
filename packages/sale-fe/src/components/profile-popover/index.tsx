"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { BsPersonCircle } from "react-icons/bs";
import Link from "next/link";
import { useClerk } from "@clerk/nextjs";

export const ProfilePopover: React.FC = () => {
    const { signOut } = useClerk();

    return (
      <Popover>
        <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="text-gray-200"
            >
              <BsPersonCircle size={28} />
            </Button>
        </PopoverTrigger>
        <PopoverContent asChild>
          <div className="bg-slate-900 border-0 flex flex-col gap-4">
            <Link href="/my-account/general">
              <Button variant="outline" className="w-full">
                Go to profile
              </Button>
            </Link>
            <Button variant="destructive" onClick={() => signOut()}>
              Sign out
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    );
}

export default ProfilePopover
