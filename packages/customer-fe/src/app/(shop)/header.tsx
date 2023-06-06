import CartButton from './cart-button';
import HeaderNavigation from './header-navigation';
import ProfilePopover from './profile-popover';

const Header: React.FC = () => {
  return (
    <header
      className="sticky flex flex-row items-center justify-center py-4 w-full z-50"
    >
      <div
        className="max-w-7xl w-full px-6"
      >
        <div
          className="flex flex-row items-center justify-between gap-6"
        >
          <div>
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
    </header>
  );
};

export default Header;