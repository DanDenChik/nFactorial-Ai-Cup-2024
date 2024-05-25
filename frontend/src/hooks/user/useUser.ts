import { AxiosResponse } from "axios";
import { cookies } from "next/headers";

import { Axios } from "@lib/axios/axios";

import { TUser } from "@hooks/user/types";

interface useUserProps {
	user: TUser | null;
}

export async function useUser(): Promise<useUserProps> {
	const accessToken = cookies().get("access")?.value;

	async function getMe() {
		return await Axios({
			url: "/profile/get/",
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		})
			.then((response: AxiosResponse<TUser>) => {
				return response.data;
			})
			.catch(() => {
				return null;
			});
	}

	const user: TUser | null = await getMe();
	return {
		user,
	};
}
