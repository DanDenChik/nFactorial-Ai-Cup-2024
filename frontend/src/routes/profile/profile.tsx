import { redirect } from "next/navigation";

import { useUser } from "@hooks/user/useUser";

export default async function Profile() {
	const { user } = await useUser();

	if (!user) return redirect("/auth/login");

	else return redirect("/profile");
}
