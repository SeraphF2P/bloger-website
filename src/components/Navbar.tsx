import { Icons } from "@/ui";
import { motion as m } from "framer-motion";
import Link, { type LinkProps } from "next/link";
import { useRouter } from "next/router";
import type { ReactNode } from "react";

interface ListLink {
  children: ReactNode;
  href: LinkProps["href"];
}
const ListLink = ({ children, href }: ListLink) => {
  const { pathname } = useRouter();
  const isActive = pathname == href;
  return (
    <li className={" relative  flex-[1_1_40px] p-4 "}>
      <Link href={href}>{children}</Link>
      <span className="sr-only">{href.toString()}</span>
      {isActive && (
        <m.span
          layoutId="nav-underline"
          className=" bg-primary rounded-t-md h-1.5  left-2 right-2 absolute   bottom-0"
        />
      )}
    </li>
  );
};

const Navbar = () => {
  return (
    <header className=" fixed left-0 top-0 z-40 flex w-full justify-center   ">
      <ul className="flex w-full bg-theme text-revert-theme max-w-screen-xsm items-center justify-between shadow-sm  shadow-revert-theme ">
        <ListLink href="/">
          <Icons.news />
        </ListLink>
        <ListLink href="/drafts">
          <Icons.drafts />
        </ListLink>
        <ListLink href="/profile">
          <Icons.userIcon />
        </ListLink>
        <ListLink href="/search">
          <Icons.search />
        </ListLink>
        <ListLink href="/setting">
          <Icons.settings />
        </ListLink>
      </ul>
    </header>
  );
};

export default Navbar;
