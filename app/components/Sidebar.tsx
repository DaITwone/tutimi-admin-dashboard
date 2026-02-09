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
    closeSidebar();
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
          fixed left-0 top-0 z-50 h-dvh flex flex-col
          transition-all duration-300
          bg-[#1c4273] text-white w-64 
          ${collapsed ? 'lg:w-14' : 'lg:w-64'} 
          lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className={`relative px-4 ${collapsed ? 'py-4' : 'py-6'}`}>
          {/* Desktop toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:block absolute right-4 top-4 text-white/70 hover:text-white transition"
            aria-label="Toggle sidebar"
          >
            <FontAwesomeIcon icon={faBars} style={{ width: '1.25rem' }} />
          </button>

          {/* Mobile close */}
          <button
            onClick={closeSidebar}
            className="lg:hidden absolute right-4 top-4 text-white/70 hover:text-white transition"
            aria-label="Close sidebar"
          >
            <FontAwesomeIcon icon={faXmark} style={{ width: '1.25rem' }} />
          </button>

          {/* Logo Section - Đã fix cảnh báo Image */}
          <div className="mt-5 -mb-5 flex justify-center">
            {/* Mobile/Tablet logo */}
            <div className="lg:hidden">
              <Image
                src="/images/logo.png"
                alt="Tutimi Coffee & Tea"
                width={180}
                height={50}
                className="w-auto h-auto" // Đảm bảo tỉ lệ luôn đúng
                priority
              />
            </div>

            {/* Desktop logo */}
            {!collapsed && (
              <div className="hidden lg:block">
                <Image
                  src="/images/logo.png"
                  alt="Tutimi Coffee & Tea"
                  width={180}
                  height={180}
                  className="w-auto h-auto" // Fix lỗi width/height modified
                  priority
                />
              </div>
            )}
          </div>
        </div>

        {/* Menu */}
        <nav className="mt-4 space-y-3 px-2 text-base flex-1 overflow-y-auto overscroll-contain pb-6">
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
                {/* Fix SVG width bằng style để tránh nhảy Layout */}
                <div className="flex items-center justify-center w-5">
                  <FontAwesomeIcon
                    icon={item.icon}
                    style={{ width: '1rem' }} 
                    className={active ? 'text-white' : 'text-white/70'}
                  />
                </div>

                <span
                  className={`
                    whitespace-nowrap
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