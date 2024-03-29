"use client";

import { toast } from "@/lib/myToast";
import { Btn, Container, Icons, Modale } from "@/ui";
import { api } from "@/utils/api";
import { useUser } from "@clerk/nextjs";
import { type ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";

type formValuesType = { title: string; content: string };

const CreateDraft = () => {
	const auth = useUser();

	const [open, setopen] = useState(false);
	const { register, handleSubmit, reset } = useForm<formValuesType>({
		defaultValues: {
			title:
				(typeof window !== "undefined" &&
					localStorage.getItem("draft-title")) ||
				"",
			content:
				(typeof window !== "undefined" &&
					localStorage.getItem("draft-content")) ||
				"",
		},
	});
	const { mutate, isLoading: isValidating } = api.post.publish.useMutation({
		onSuccess: () => {
			reset();
			localStorage.setItem("draft-title", "");
			localStorage.setItem("draft-content", ""),
				toast({ type: "success", message: "post created successfully" });
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
			<Modale.Btn className=" relative  rounded px-8 py-4 gap-x-4 text-xl capitalize ">
				write a new post
				<Icons.drafts className=" w-10 h-10" />
			</Modale.Btn>

			<Modale.Content>
				<Container className=" bg-card  ">
					<form
						// eslint-disable-next-line @typescript-eslint/no-misused-promises
						onSubmit={handleSubmit(onSubmit)}
						className=" space-y-4 "
					>
						<input
							className=" form-input w-full placeholder:text-revert-theme bg-card/70 rounded border-0 "
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
							className=" form-input placeholder:text-revert-theme min-h-[240px]  resize-none w-full rounded border-0 bg-card/70 "
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
