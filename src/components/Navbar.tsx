import Link, { type LinkProps } from "next/link";
import type { ReactNode } from "react";
import { Icons } from "@/components";
import { cn, btnVariants } from "@/lib/cva";

interface ListLink {
  children: ReactNode;
  href: LinkProps["href"];
}
const ListLink = ({ children, href }: ListLink) => {
  return (
    <li className={cn(btnVariants({ variant: "outline" }), "h-12 w-12 ")}>
      <Link href={href} className=" ">
        {children}
      </Link>
    </li>
  );
};

const Navbar = () => {
  return (
    <header className=" fixed left-0 top-0 flex w-full justify-center   ">
      <ul className="flex w-full max-w-screen-xsm items-center justify-between bg-white p-4 text-primary  shadow dark:bg-black">
        <ListLink href="/">
          <Icons.news />
        </ListLink>
        <ListLink href="/drafts">
          <Icons.drafts />
        </ListLink>
        <ListLink href="/profile">
          <Icons.userIcon />
        </ListLink>
        <ListLink href="/setting">
          <Icons.settings />
        </ListLink>
      </ul>
    </header>
  );
};

export default Navbar;
