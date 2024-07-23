"use client";

import {
  Link,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Navbar as NextUINavbar,
} from "@nextui-org/react";
import React, { useCallback, useMemo } from "react";

import { AvatarMenu } from "./AvatarMenu";
import { ConnectButton } from "./ConnectButton";
import { GiAlienFire } from "react-icons/gi";
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
    <NextUINavbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <div className="flex gap-3 items-center">
            <GiAlienFire size={28} />
            <Link href="/" className="font-bold text-inherit">
              HEHE
            </Link>
          </div>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {navbarItems.map((item, index) => {
          const isActive = checkElementActive(item.link);
          return (
            <NavbarItem key={`${item.name}-${index}`} className="mx-3">
              <Link
                color={isActive ? "secondary" : "foreground"}
                href={item.link}
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
          <AvatarMenu />
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
                size="lg"
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
