import { ReactNode } from "react";

import Header from "@components/Header/Header";

import { AuthProvider } from "@context/Auth/useAuth";
import { CustomCookieProvider } from "@context/CustomCookie/useCustomCookie";

import { useUser } from "@hooks/user/useUser";

export default async function Layout({ children }: { children: ReactNode }) {
	const { user } = await useUser();

	return (
		<>
			<CustomCookieProvider>
				<AuthProvider>
					<Header user={user} />
				</AuthProvider>
			</CustomCookieProvider>
			<main
				className={
					"flex flex-1 items-center justify-center bg-white"
				}
			>
				{children}
			</main>
		</>
	);
}
