'use client';

import { usePathname, useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faHouse,
  faBox,
  faUsers,
  faGear,
  faNewspaper,
  faTags,
  faPalette,
  faBoxOpen,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

import { useAdminUI } from '@/app/store/adminUI';

type SidebarProps = {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
};

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const { sidebarOpen, closeSidebar } = useAdminUI();

  const menuItems = [
    { label: 'Trang chủ', href: '/dashboard', icon: faHouse },
    { label: 'Người dùng', href: '/users', icon: faUsers },
    { label: 'Sản phẩm', href: '/products', icon: faBox },
    { label: 'Tồn kho', href: '/inventory', icon: faBoxOpen },
    { label: 'Tin tức & Ưu đãi', href: '/news', icon: faNewspaper },
    { label: 'Voucher', href: '/vouchers', icon: faTags },
    { label: 'Thiết lập giao diện', href: '/themes', icon: faPalette },
    { label: 'Cài đặt', href: '/settings', icon: faGear },
  ];

  const handleNavigate = (href: string) => {
    router.push(href);
    closeSidebar(); // mobile drawer auto-close
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50 h-screen flex flex-col
          transition-all duration-300
          bg-[#1c4273] text-white

          ${collapsed ? 'lg:w-14' : 'lg:w-64'}
          w-64

          lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Top: toggle + logo */}
        <div className={`relative px-4 ${collapsed ? 'py-4' : 'py-6'}`}>
          {/* Desktop toggle collapse */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:block absolute right-4 top-4 text-white/70 hover:text-white transition"
            aria-label="Toggle sidebar (desktop)"
          >
            <FontAwesomeIcon icon={faBars} className="h-5 w-5" />
          </button>

          {/* Mobile close button */}
          <button
            onClick={closeSidebar}
            className="lg:hidden absolute right-4 top-4 text-white/70 hover:text-white transition"
            aria-label="Close sidebar (mobile)"
          >
            <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
          </button>

          {/* Logo */}
          <div className="mt-5 -mb-5 flex justify-center">
            {/* Mobile/tablet: always show */}
            <div className="lg:hidden">
              <Image
                src="/images/logo.png"
                alt="Tutimi Coffee & Tea"
                width={180}
                height={180}
                className="transition-all duration-300"
                priority
              />
            </div>

            {/* Desktop: show only when not collapsed */}
            {!collapsed && (
              <div className="hidden lg:block">
                <Image
                  src="/images/logo.png"
                  alt="Tutimi Coffee & Tea"
                  width={180}
                  height={180}
                  className="transition-all duration-300"
                  priority
                />
              </div>
            )}
          </div>
        </div>

        {/* Menu */}
        <nav className="mt-4 space-y-3 px-2 text-base flex-1">
          {menuItems.map((item) => {
            const active = pathname.startsWith(item.href);

            return (
              <button
                key={item.href}
                onClick={() => handleNavigate(item.href)}
                title={collapsed ? item.label : undefined}
                className={`flex w-full items-center gap-3 px-3 py-2 rounded-lg transition
                  ${active ? 'bg-white/15' : 'hover:bg-white/5'}
                `}
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  className={`h-4 w-4 ${active ? 'text-white' : 'text-white/70'}`}
                />

                {/* Hide label on desktop collapsed only */}
                <span
                  className={`
                    ${active ? 'text-white' : 'text-white/80'}
                    ${collapsed ? 'lg:hidden' : ''}
                  `}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
