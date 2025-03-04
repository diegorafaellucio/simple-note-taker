'use client';

import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { useAuth } from '../../hooks/useAuth';

export function UserMenu() {
    const { logout, userEmail, userId } = useAuth();

    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-full bg-buttonBackground p-2 text-white hover:bg-[#6B3A1A] transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                </Menu.Button>
            </div>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                        <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                            <div>{userEmail}</div>
                            <div className="text-xs text-gray-400">ID: {userId}</div>
                        </div>
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    onClick={logout}
                                    className={`${
                                        active ? 'bg-gray-100' : ''
                                    } block w-full px-4 py-2 text-left text-sm text-gray-700`}
                                >
                                    Log out
                                </button>
                            )}
                        </Menu.Item>
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
}
