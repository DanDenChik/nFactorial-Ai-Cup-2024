import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { CustomCookieProvider } from "@context/CustomCookie/useCustomCookie";
import { AuthProvider } from "@context/Auth/useAuth";

import Layout from "@components/Layout/Layout";
import { useUser } from "@hooks/user/useUser";

export default async function layout({ children }: { children: ReactNode }) {
	const { user } = await useUser();
	if (user) return redirect("/");

	return (
		<CustomCookieProvider>
			<AuthProvider>
				<Layout>{children}</Layout>
			</AuthProvider>
		</CustomCookieProvider>
	);
}
