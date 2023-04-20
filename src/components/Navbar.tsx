import Link, { type LinkProps } from "next/link";
import type { ReactNode } from "react";
import { Icons } from "@/components";
import { cn, btnVariants } from "@/lib/cva";
import { useUser } from "@clerk/nextjs";

interface ListLink {
  children: ReactNode;
  href: LinkProps["href"];
  disabled?: boolean;
}
const ListLink = ({ children, href, disabled = false }: ListLink) => {
  return (
    <li
      className={cn(
        btnVariants({
          variant: "outline",
          disable: disabled ? "link" : "default",
        }),
        "h-12 w-12 "
      )}
    >
      <Link className={disabled ? " cursor-auto" : ""} href={href}>
        {children}
      </Link>
    </li>
  );
};

const Navbar = () => {
  const { isSignedIn } = useUser();
  return (
    <header className=" fixed left-0 top-0 flex w-full justify-center   ">
      <ul className="flex w-full max-w-screen-xsm items-center justify-between bg-white p-4 text-primary  shadow dark:bg-black">
        <ListLink href="/">
          <Icons.news />
        </ListLink>
        <ListLink disabled={!isSignedIn} href="/drafts">
          <Icons.drafts />
        </ListLink>
        <ListLink disabled={!isSignedIn} href="/profile">
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
