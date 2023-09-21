import { BlogPost } from "../../components";
import { api } from "../../utils/api";
import {
	Container,
	ContentInput,
	Icons,
	Loading,
	NextImage,
	StyledToggleBtn,
} from "@/ui";
import { type NextPage } from "next";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";

const Search: NextPage = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const searchFilter = searchParams.get("search-filter") || "user";
	const content = searchParams.get("search-content") || "";
	const filter = z.enum(["user", "post"]).parse(searchFilter);
	type filterType = typeof filter;
	const {
		data,
		mutate,
		isLoading: isValidating,
	} = api.search.search.useMutation({
		mutationKey: [`${filter}-${content}`],
	});
	const pushQuery = ({
		filter,
		content,
	}: {
		filter: filterType;
		content: string;
	}) => {
		if (content == "") return;
		router.replace(`?search-filter=${filter}&search-content=${content}`);
		mutate({ filter, content });
	};

	return (
		<Container className="pb-0">
			<div className=" flex flex-col gap-4">
				<ContentInput
					className=" relative w-full"
					placeholder="search"
					resetOnSubmit={false}
					isValidating={isValidating}
					mutate={(content) => {
						pushQuery({ filter, content });
					}}
				/>
				<StyledToggleBtn
					defaultValue={filter}
					fn={(filter: filterType) => pushQuery({ filter, content })}
					toggleValues={[
						{ name: "user", component: <Icons.userIcon className="h-6 w-6" /> },
						{
							name: "post",
							component: <Icons.news className="h-6 w-6" />,
						},
					]}
				/>
			</div>
			<section className=" flex flex-col gap-4 min-h-full pb-24  relative ">
				{isValidating && <Loading.Mesh />}
				{filter == "user" &&
					data?.users &&
					data?.users.map((user) => {
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
				{filter == "post" &&
					data?.posts &&
					data?.posts.map((post) => {
						return (
							<BlogPost
								key={post.id}
								{...post}
								// className=" bg-sky-500 relative flex-shrink-0 flex flex-col gap-2 items-center justify-center rounded h-60"
							/>
						);
					})}
			</section>
		</Container>
	);
};

export default Search;
