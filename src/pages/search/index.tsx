import { api } from "../../utils/api";
import { Container, ContentInput, Loading, NextImage } from "@/ui";
import { type NextPage } from "next";
import Link from "next/link";

const Search: NextPage = () => {
	const {
		data,
		mutate,
		isLoading: isValidating,
	} = api.user.searchUser.useMutation();
	return (
		<Container className="">
			<ContentInput
				className=" relative w-full"
				placeholder="search"
				resetOnSubmit={false}
				isValidating={isValidating}
				mutate={mutate}
			/>
			{isValidating && <Loading.Mesh />}
			{data &&
				data.map((user) => {
					return (
						<div
							key={user.id}
							className=" crystal relative flex-shrink-0 flex flex-col gap-2 items-center justify-center rounded h-60"
						>
							<NextImage
								className=" rounded-full overflow-hidden h-24 w-24"
								src={user.profileImageUrl}
								alt={user.username}
							/>
							<Link
								className="  absolute inset-0"
								href={`/profile/${user.id}`}
							/>
							<h3>{`${user.firstName || ""} ${user.lastName || ""}`}</h3>
							<p>{user.username}</p>
						</div>
					);
				})}
		</Container>
	);
};

export default Search;
