import CartButton from './cart-button';
import HeaderNavigation from './header-navigation';
import ProfilePopover from './profile-popover';
import MenuButton from './menu-button';

const Header: React.FC = () => {
  return (
    <header
      className="sticky flex flex-row items-center justify-center py-4 w-full z-50 top-0 bg-background/90 backdrop-blur-sm"
    >
      <div
        className="hidden md:block max-w-7xl w-full px-6"
      >
        <div
          className="flex flex-row items-center justify-between gap-6"
        >
          <div
            className="pl-4"
          >
            <HeaderNavigation />
          </div>
          <div
            className='flex gap-2 pr-4'
          >
            <ProfilePopover />
            <CartButton />
          </div>
        </div>
      </div>
      <div
        className="md:hidden flex flex-1"
      >
        <div
          className="flex flex-row items-center justify-between gap-6 flex-1"
        >
          <div
            className="pl-4"
          >
            <MenuButton />
          </div>
          <div
            className='flex gap-2 pr-4'
          >
            <ProfilePopover />
            <CartButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;