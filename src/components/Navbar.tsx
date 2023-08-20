import { Icons } from "@/components";
import Link, { type LinkProps } from "next/link";
import type { ReactNode } from "react";

interface ListLink {
  children: ReactNode;
  href: LinkProps["href"];
}
const ListLink = ({ children, href }: ListLink) => {
  return (
    <li className={"h-10 w-10 "}>
      <Link href={href}>{children}</Link>
    </li>
  );
};

const Navbar = () => {
  return (
    <header className=" fixed left-0 top-0 z-40 flex w-full justify-center   ">
      <ul className="flex w-full max-w-screen-xsm items-center justify-between bg-white p-6 text-primary  shadow dark:bg-black">
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
