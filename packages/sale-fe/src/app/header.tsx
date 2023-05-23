import Link from 'next/link'
import { currentUser } from '@clerk/nextjs';
import ProfilePopover from "~/components/profile-popover";

export default async function Header() {
  const user = await currentUser();

  return (
    <div
      className="sticky flex justify-center w-full px-4"
    >
      <div
        className="flex py-4 justify-between w-full max-w-7xl"
      >
        <Link
          href="/"
        >
          <div>
            <div
              className="flex flex-col md:flex-row gap-2"
            >
              <div
                className="text-2xl font-bold text-cyan-300"
              >
                CORAZON
              </div>
              <div
                className="text-2xl font-bold text-purple-300"
              >
                SAIL
              </div>
            </div>
          </div>
        </Link>
        {
          user ? (
            <div
              className='flex gap-2'
            >
              <div>
                <Link
                  href="/dashboard"
                >
                  <div
                    className="flex"
                  >
                    <div
                      className="px-4 py-2 text-gray-300 rounded-md border border-slate-800 hover:bg-slate-800 transition-colors"
                    >
                      Dashboard
                    </div>
                  </div>
                </Link>
              </div>
              <ProfilePopover />
            </div>
          ) : (
            <div>
              <Link
                href="/sign-in"
              >
                <div
                  className="flex"
                >
                  <div
                    className="px-4 py-2 text-gray-900 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Sign In
                  </div>
                </div>
              </Link>
            </div>
          )
        }
      </div>
    </div>
  );
}
