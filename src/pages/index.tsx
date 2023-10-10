import { ClerkSignIn } from "@/components/setting";
import { cn, variants } from "@/lib/cva";
import { useUser } from "@clerk/nextjs";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

const NotSignedIn = () => {
	const { isSignedIn } = useUser();
	const [open, setOpen] = useState(!isSignedIn);
	return (
		<>
			<Head>
				<meta color="var(--theme)" />
			</Head>
			{open == true && isSignedIn == false && (
				<section className="fixed flex justify-center items-center flex-col   inset-0 z-50 bg-theme">
					<div className=" flex flex-col   items-center  gap-2">
						<ClerkSignIn />
						<Link
							href={"/home"}
							onClick={() => setOpen(false)}
							className={cn(
								" px-4 py-2  capitalize ",
								variants({ variant: "outline" })
							)}
						>
							continue as guest
						</Link>
					</div>
				</section>
			)}
		</>
	);
};

export default NotSignedIn;
