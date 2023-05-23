import { FaHome } from 'react-icons/fa'
import { FiPackage } from 'react-icons/fi'
import { BsFillGearFill, BsFillBoxFill } from 'react-icons/bs'
import { NavLink } from './navlink';

const menuItems = [
    {
        label: 'Dashboard',
        href: '/dashboard',
        icon: <FaHome size={22} />
    },
    {
        label: 'Goods',
        href: '/dashboard/goods',
        icon: <BsFillBoxFill size={22} />
    },
    {
        label: 'Orders',
        href: '/dashboard/orders',
        icon: <FiPackage size={22} />
    },
    {
        label: 'Settings',
        href: '/dashboard/settings',
        icon: <BsFillGearFill size={22} />
    }
];

const pathsToLabels: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/goods': 'Goods',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <>
      <div
        className="grid grid-cols-1 md:grid-cols-[1fr_4fr] gap-8 px-4"
      >
        <div className="flex flex-col gap-4">
          {
            menuItems.map((item, index) => (
              <NavLink
                key={index}
                label={item.label}
                href={item.href}
                icon={item.icon}
              />
            ))
          }
        </div>
        <div>
          {children}
        </div>
      </div>
    </>
  );
}
