'use client';

import { usePathname, useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faHouse,
  faBox,
  faUsers,
  faDollarSign,
  faCartShopping,
  faGear,
  faEnvelope,
  faBell,
  faCircleInfo,
  faNewspaper,
  faTicketAlt,
  faTags,
  faPalette,
} from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

type SidebarProps = {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
};

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { label: 'Trang chủ', href: '/dashboard', icon: faHouse },
    { label: 'Người dùng', href: '/users', icon: faUsers },
    { label: 'Sản phẩm', href: '/products', icon: faBox },
    { label: 'Tin tức & Ưu đãi', href: '/news', icon: faNewspaper},
    { label: 'Voucher', href: '/vouchers', icon: faTags   },
    // { label: 'Đơn hàng', href: '/orders', icon: faCartShopping },
    { label: 'Thiết lập giao diện', href: '/themes', icon: faPalette  },
    { label: 'Cài đặt', href: '/settings', icon: faGear },
    // { label: 'Thông báo', href: '/notifications', icon: faBell },
    // { label: 'Hỗ trợ', href: '/help', icon: faCircleInfo },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-screen
        flex flex-col
        transition-all duration-300
        ${collapsed ? 'w-14' : 'w-64'}
        bg-[#1c4273] text-white
      `}
    >
      {/* Top: toggle + logo */}
      <div className={`relative px-4 ${collapsed ? 'py-4' : 'py-6'}`}>
        {/* Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute right-4 top-4 text-white/70 hover:text-white transition"
          aria-label="Toggle sidebar"
        >
          <FontAwesomeIcon icon={faBars} className="h-5 w-5" />
        </button>

        {/* Logo */}
        {!collapsed && (
          <div className="mt-5 -mb-5 flex justify-center">
            <Image
              src="/images/logo.png"
              alt="Tutimi Coffee & Tea"
              width={180}
              height={180}
              className="transition-all duration-300"
            />
          </div>
        )}
      </div>

      {/* Menu */}
      <nav className="mt-4 space-y-3 px-2 text-base flex-1">
        {menuItems.map((item) => {
          const active = pathname.startsWith(item.href);

          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              title={collapsed ? item.label : undefined}
              className={`flex w-full items-center gap-3 px-3 py-2 rounded-lg transition
                ${active ? 'bg-white/15' : 'hover:bg-white/5'}
              `}
            >
              <FontAwesomeIcon
                icon={item.icon}
                className={`h-4 w-4 ${
                  active ? 'text-white' : 'text-white/70'
                }`}
              />

              {!collapsed && (
                <span
                  className={`${
                    active ? 'text-white' : 'text-white/80'
                  }`}
                >
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
