"use client";

import { toast } from "@/lib/myToast";
import { Btn, Container, Icons, Modale } from "@/ui";
import { api } from "@/utils/api";
import { useUser } from "@clerk/nextjs";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";

type formValuesType = { title: string; content: string };

const CreateDraft = () => {
	const auth = useUser();
	const [open, setopen] = useState(false);
	const { register, handleSubmit, reset } = useForm<formValuesType>({
		defaultValues: {
			title: localStorage.getItem("draft-title") || "",
			content: localStorage.getItem("draft-content") || "",
		},
	});
	const { mutate, isLoading: isValidating } = api.post.publish.useMutation({
		onSuccess: () => {
			reset();
			toast({ type: "success", message: "new draft has been created" });
		},
		onError: (e) => {
			const errorMessage = e.data?.zodError?.fieldErrors[0] || [
				"somthing went wrong",
			];
			toast({
				type: "error",
				message: errorMessage[0],
			});
		},
		onSettled: () => {
			setopen(false);
		},
	});

	const onSubmit = (data: formValuesType) => {
		mutate(data);
	};
	const changeHandler = (fn: (val: string) => void) => {
		return (e: ChangeEvent<HTMLInputElement>) => fn(e.target.value);
	};
	if (!auth.isSignedIn) return null;
	return (
		<Modale open={open} onOpenChange={setopen}>
			<Modale.Btn className="  rounded px-8 py-4 gap-x-4 text-xl capitalize md:left-[60%]">
				write a new post
				<Icons.drafts className=" w-10 h-10" />
			</Modale.Btn>

			<Modale.Content>
				<Container className=" bg-slate-200  dark:bg-gray-800  ">
					<form
						// eslint-disable-next-line @typescript-eslint/no-misused-promises
						onSubmit={handleSubmit(onSubmit)}
						className=" space-y-4 "
					>
						<input
							className=" placeholder:text-revert-theme bg-slate-100  dark:bg-gray-900 w-full rounded border-0 "
							type="text"
							placeholder="title"
							{...register("title", {
								onChange: changeHandler((val) =>
									localStorage.setItem("draft-title", val)
								),
								required: "title is required",
								minLength: {
									message: "min title is 3 charcter",
									value: 3,
								},

								maxLength: {
									message: "max title is 24 charcter",
									value: 24,
								},
							})}
						/>
						<textarea
							className=" placeholder:text-revert-theme min-h-[240px]  resize-none w-full rounded border-0 bg-slate-100  dark:bg-gray-900 "
							placeholder="content"
							{...register("content", {
								onChange: changeHandler((val) =>
									localStorage.setItem("draft-content", val)
								),
								required: "content is required",
								minLength: {
									message: "min content is 3 charcter",
									value: 3,
								},
								maxLength: {
									message: "max content is 500 charcter",
									value: 500,
								},
							})}
						/>
						<div className=" w-full px-4 flex justify-between">
							<Modale.Close
								variant="outline"
								className=" origin-right  px-4 py-2 "
							>
								close
							</Modale.Close>

							<Btn
								type="submit"
								disabled={isValidating}
								className="  px-4 py-2 "
							>
								submit
							</Btn>
						</div>
					</form>
				</Container>
			</Modale.Content>
		</Modale>
	);
};

export default CreateDraft;
