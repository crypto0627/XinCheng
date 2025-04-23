'use client'

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';

export default function Navbar() {
    const { isLoggedIn } = useAuthStore()
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    
    const items_list = [
        {name: 'dashboard', link: '/'},
        {name: 'order-list', link: '/order-list'},
        {name: 'report', link: '/report'},
        {name: 'settings', link: '/settings'}
    ];

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className='bg-white shadow-md'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex justify-between h-16'>
                    <div className='flex items-center'>
                        <div className='text-orange-500 font-bold text-xl'>星橙輕食餐盒管理系統</div>
                    </div>
                    
                    {/* Desktop menu */}
                    {isLoggedIn && (
                        <div className='hidden md:flex items-center space-x-4'>
                            {items_list.map((item) => (
                                <Link 
                                    key={item.name} 
                                    href={item.link}
                                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                                        pathname === item.link 
                                            ? 'bg-orange-500 text-white' 
                                            : 'text-orange-500 hover:bg-orange-100'
                                    }`}
                                >
                                    {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                                </Link>
                            ))}
                        </div>
                    )}
                    
                    {/* Mobile menu button */}
                    {isLoggedIn && (
                        <div className='md:hidden flex items-center'>
                            <button 
                                onClick={toggleMenu}
                                className='inline-flex items-center justify-center p-2 rounded-md text-orange-500 hover:text-white hover:bg-orange-500 focus:outline-none'
                            >
                                <span className='sr-only'>Open main menu</span>
                                {/* Icon when menu is closed */}
                                <svg
                                    className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    stroke='currentColor'
                                    aria-hidden='true'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth='2'
                                        d='M4 6h16M4 12h16M4 18h16'
                                    />
                                </svg>
                                {/* Icon when menu is open */}
                                <svg
                                    className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    stroke='currentColor'
                                    aria-hidden='true'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth='2'
                                        d='M6 18L18 6M6 6l12 12'
                                    />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Mobile menu, show/hide based on menu state */}
            {isLoggedIn && (
                <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
                    <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3 transform transition-all duration-300 ease-in-out'>
                        {items_list.map((item) => (
                            <Link
                                key={item.name}
                                href={item.link}
                                className={`block px-3 py-2 rounded-md text-base font-medium ${
                                    pathname === item.link
                                        ? 'bg-orange-500 text-white'
                                        : 'text-orange-500 hover:bg-orange-100'
                                }`}
                                onClick={() => setIsOpen(false)}
                            >
                                {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}