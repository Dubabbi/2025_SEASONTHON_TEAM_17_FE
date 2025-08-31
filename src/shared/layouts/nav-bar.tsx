import DiaryIcon from '@assets/icons/book.svg?react';
import HomeIcon from '@assets/icons/home.svg?react';
import ProfileIcon from '@assets/icons/profile.svg?react';
import { Link, useLocation } from 'react-router-dom';

export default function NavigationBar() {
  const { pathname } = useLocation();
  const normalize = (p: string) => (p !== '/' && p.endsWith('/') ? p.slice(0, -1) : p);

  const isActivePath = (current: string, target: string) => {
    const cur = normalize(current);
    const tgt = normalize(target);
    if (tgt === '/') return cur === '/';
    return cur === tgt || cur.startsWith(`${tgt}/`);
  };

  const iconStyle = 'size-[2.8rem]';

  const menuList = [
    {
      title: '홈',
      to: '/',
      icon: <HomeIcon className={iconStyle} />,
    },
    {
      title: '일기',
      to: '/diary',
      icon: <DiaryIcon className={iconStyle} />,
    },
    {
      title: '내 정보',
      to: '/mypage',
      icon: <ProfileIcon className={iconStyle} />,
    },
  ];

  return (
    <div className="sticky bottom-0 z-[var(--z-bottom-nav)] flex min-h-[8rem] w-full items-center justify-around rounded-t-[2.4rem] bg-gray-50 px-[0.5rem] shadow-md">
      {menuList.map((menu) => {
        const isActive = isActivePath(pathname, menu.to);
        return (
          <Link
            key={menu.to}
            to={menu.to}
            title={menu.title}
            className="flex-col-center gap-[0.2rem]"
          >
            <span className={`${isActive ? 'text-primary-600' : 'text-gray-600'}`}>
              {menu.icon}
            </span>
            <span className={`ct4 ${isActive ? 'text-primary-600' : 'text-gray-600'}`}>
              {menu.title}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
