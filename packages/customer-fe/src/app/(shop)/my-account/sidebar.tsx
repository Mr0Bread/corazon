import { User, Package, MapPin } from 'lucide-react'
import Link from 'next/link';
import { Button } from '~/components/ui/button';

const links = [
    {
        label: 'Profile',
        href: '/my-account/profile',
        icon: <User className='mr-2' />
    },
    {
        label: 'Orders',
        href: '/my-account/orders',
        icon: <Package className='mr-2' />
    },
    {
        label: 'Addresses',
        href: '/my-account/addresses',
        icon: <MapPin className='mr-2' />
    }
];

export default function Sidebar() {
    return (
        <div
            className="flex flex-col gap-4"
        >
            {
                links.map(({ href, icon, label }) => (
                    <Link
                        key={href}
                        href={href}
                    >
                        <Button
                            variant="outline"
                            className="w-full text-foreground/90 justify-start"
                        >
                            { icon }
                            { label }    
                        </Button>  
                    </Link>
                ))
            }
        </div>
    );
}