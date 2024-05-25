'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { useAuth } from '@context/Auth/useAuth';

import type { TUser } from '@hooks/user/types';

import { logo, menu } from '@public/assets/index';

import NavLink from '@ui/NavLink/NavLink';

export default function Header({ user }: { user: TUser | null }) {
  const { logOut } = useAuth();

  const [toggle, setToggle] = useState<boolean>(false);
  const [isOpen, setOpen] = useState<boolean>(false);

  return (
    <nav className="fontInter w-full bg-mainDark px-16 flex py-2 justify-between items-center navbar">
      <div className="flex bg-mainDark w-[100%] justify-between px-16">
        <Link
          href="/"
          className="flex justify-center space-x-4 items-center cursor-pointer">
          <Image src={logo} alt="InSightGram" className=" h-[60px] w-[60px]" />
        </Link>

        <ul
          className="list-none sm:flex hidden justify-end items-center gap-6"
          style={{
            display: user ? 'none' : 'flex',
          }}>
          <NavLink
            href={{
              pathname: '/auth/register',
            }}>
            Регистрация
          </NavLink>
          <NavLink
            href={{
              pathname: '/auth/login',
            }}>
            Вход в аккаунт
          </NavLink>
        </ul>
      </div>
      <div
        className="flex items-center gap-2 relative cursor-pointer"
        onClick={() => {
          setOpen(prevState => !prevState);
          console.log(isOpen);
        }}
        style={{ display: user ? 'flex' : 'none' }}>
        <p className="font-poppins text-white dropDown-menu-active cursor-pointer">
          Профиль
        </p>

        <div
          className="dropDown h-56 w-48 rounded-2xl bg-gradient-linearDropDown flex flex-col justify-start items-center z-10"
          style={{
            display: isOpen ? 'flex' : 'none',
          }}>
          <div className="flex flex-row h-20 justify-between items-center gap-3">
            <Link
              href={'/'}
              className="flex justify-center space-x-4 items-center cursor-pointer ">
              <Image src={logo} alt="InSightGram" className="h-[60px]" />
              <p className="font-poppins font-semibold text-[20px] text-white">
                Úles
              </p>
            </Link>
          </div>
          <div className="w-full h-28 border-t-[1px] border-b-[1px] flex flex-col items-center justify-center gap-4">
            <Link href={'/profile'}>
              <button className="fontInter w-32 h-8 rounded-3xl bg-white text-sm">
                Профиль
              </button>
            </Link>
            <button
              className="fontInter w-32 h-8 rounded-3xl bg-white text-sm"
              type={'button'}
              onClick={() => {
                logOut();
              }}>
              Выйти
            </button>
          </div>
        </div>
      </div>
      <div className="sm:hidden flex flex-1 justify-end items-center">
        <Image
          src={toggle ? close : menu}
          alt="menu"
          className="w-[28px] h-[28px] object-contain"
          onClick={() => setToggle(prevState => !prevState)}
        />

        <div
          className={`${!toggle ? 'hidden' : 'flex'
            } p-6 bg-black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] rounded-xl sidebar`}>
          <ul
            className="list-none flex justify-end items-start flex-1 flex-col"
            style={{
              display: user ? 'none' : 'flex',
            }}>
            <NavLink // create a new component for navbar if there are not any other way to implement design for mobile phones
              href={{
                pathname: '/auth/register',
              }}>
              Регистрация
            </NavLink>
            <NavLink
              href={{
                pathname: '/auth/login',
              }}>
              Вход в аккаунт
            </NavLink>
          </ul>
        </div>
      </div>
    </nav>
  );
}
