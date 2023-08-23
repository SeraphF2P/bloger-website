import type { User } from "@clerk/nextjs/dist/api";

export const filterUser = (
  user:
    | User
    | {
        id: string;
        gender: string;
        firstName: string | null;
        lastName: string | null;
        username: string | null;
        profileImageUrl: string | null;
      }
) => {
  const { gender, id, firstName, lastName, profileImageUrl, username } = user;
  const userInfo = {
    id: id,
    gender: gender,
    firstName: firstName,
    lastName: lastName,
    username: username || `${firstName || "user"} ${lastName || ""}`,
    profileImageUrl: profileImageUrl ?? "/male-avatar.webp",
  };
  return userInfo;
};
