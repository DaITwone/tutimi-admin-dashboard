'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faBell, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '../lib/supabase';

const getPageTitle = (pathname: string) => {
  if (pathname.startsWith('/dashboard')) return 'Admin Dashboard';
  if (pathname.startsWith('/products')) return 'QUẢN LÝ SẢN PHẨM';
  if (pathname.startsWith('/users')) return 'QUẢN LÝ NGƯỜI DÙNG';
  if (pathname.startsWith('/orders')) return 'Orders';
  if (pathname.startsWith('/vouchers')) return 'VOUCHERS';
  if (pathname.startsWith('/themes')) return 'THIẾT LẬP GIAO DIỆN';
  if (pathname.startsWith('/news')) return 'TIN TỨC & ƯU ĐÃI';
  return 'Admin';
};

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  // click outside để đóng menu
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="z-30 px-8 pt-6 flex items-center justify-between">
      {/* Left */}
      <h1 className="text-2xl rounded-xl font-bold text-[#1c4273]">
        {getPageTitle(pathname)}
      </h1>

      {/* Right */}
      <div ref={ref} className="relative flex items-center gap-6">
        {/* Notification */}
        <button className="relative text-[#1c4273] hover:text-[#1b4f94]">
          <FontAwesomeIcon icon={faBell} className="h-5 w-5" />
          {/* badge */}
          <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        {/* Avatar */}
        <button onClick={() => setOpen(!open)} className="flex items-center gap-2">
          <div className="relative">
            <Image src="/images/avt.png" alt="Avatar" width={40} height={40} className="rounded-full object-cover ring-2 ring-[#1b4f94]" />
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white" />
          </div>
          <span className="font-bold text-[#1c4273]">Admin</span>
          <FontAwesomeIcon icon={faChevronDown} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 top-full mt-6 w-56 rounded-2xl bg-white shadow-xl p-3">
            {/* <button className="flex w-full items-center font-bold gap-3 rounded-lg px-2 py-2 text-[#1c4273] hover:bg-gray-100">
              👤 Thông tin cá nhân
            </button>

            <button className="flex w-full items-center font-bold gap-3 rounded-lg px-2 py-2 text-[#1c4273] hover:bg-gray-100">
              📝 Công việc
            </button> */}

            <div className="mt-3">
              <button onClick={handleLogout} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1b4f94] py-2 text-white hover:bg-blue-700">
                <FontAwesomeIcon icon={faArrowRightFromBracket} className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>

    </header>
  );
}
