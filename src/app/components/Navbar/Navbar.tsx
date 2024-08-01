"use client";

import {
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Navbar as NextUINavbar,
} from "@nextui-org/react";
import React, { useCallback } from "react";

import { AvatarMenu } from "./AvatarMenu";
import { CoinBalanceAndChain } from "./CoinBalanceAndChain";
import { ConnectButton } from "./ConnectButton";
import { GiAlienFire } from "react-icons/gi";
import Link from "next/link";
import { navbarItems } from "@/app/constants";
import { usePathname } from "next/navigation";
import { useWalletProvider } from "../../hooks";

export const Navbar = () => {
  const { selectedWallet, selectedAccount } = useWalletProvider();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const currentPath = usePathname();

  const checkElementActive = useCallback(
    (link: string) => {
      return currentPath.includes(link) || currentPath.startsWith(`${link}/`);
    },
    [currentPath],
  );

  return (
    <NextUINavbar
      onMenuOpenChange={setIsMenuOpen}
      classNames={{
        wrapper: "max-w-[95vw]",
      }}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link href="/" className="flex items-center gap-3">
            <GiAlienFire size={28} />
            <p className="hidden font-bold text-inherit md:block">HEHE</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden gap-4 sm:flex" justify="center">
        {navbarItems.map((item, index) => {
          const isActive = checkElementActive(item.link);
          return (
            <NavbarItem key={`${item.name}-${index}`} className="mx-3">
              <Link
                color={isActive ? "secondary" : "foreground"}
                href={`/${item.link}`}
                className={`text-lg font-medium ${isActive ? "text-secondary" : "text-foreground"}`}
              >
                {item.name}
              </Link>
            </NavbarItem>
          );
        })}
      </NavbarContent>
      <NavbarContent justify="end">
        {!!selectedWallet && !!selectedAccount ? (
          <div className="flex items-center gap-3">
            <CoinBalanceAndChain />
            <AvatarMenu />
          </div>
        ) : (
          <NavbarItem>
            <ConnectButton />
          </NavbarItem>
        )}
      </NavbarContent>
      <NavbarMenu>
        {navbarItems.map((item, index) => {
          const isActive = checkElementActive(item.link);
          return (
            <NavbarMenuItem key={`${item.name}-${index}`}>
              <Link
                color={isActive ? "secondary" : "foreground"}
                className={`w-full ${isActive ? "text-secondary" : "text-foreground"}`}
                href={item.link}
              >
                {item.name}
              </Link>
            </NavbarMenuItem>
          );
        })}
      </NavbarMenu>
    </NextUINavbar>
  );
};
