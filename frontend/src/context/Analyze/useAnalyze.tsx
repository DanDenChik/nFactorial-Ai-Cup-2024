"use client";
import { createContext, ReactNode, useContext, useEffect } from "react";
import type { AxiosResponse } from "axios";

import { Axios } from "@lib/axios/axios";

import { useCustomCookie } from "@context/CustomCookie/useCustomCookie";

import type { ISignIn, ISignUp, TTokens } from "@context/Auth/types";
import { useRouter } from "next/navigation";

interface AuthContextProps {
	signUp: ({ email, name, user_type, phone, password }: ISignUp) => Promise<void>;
	signIn: ({ email, password }: ISignIn) => Promise<void>;
	logOut: () => void;
}

const AuthContext = createContext({} as AuthContextProps);

export function useAuth(): AuthContextProps {
	return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const { push } = useRouter();
	const { cookie, setCookie, removeCookie } = useCustomCookie();

	async function signUp({ email, name, user_type, password, phone }: ISignUp) {
		return await Axios({
			method: "POST",
			url: `/auth/register/`,
			data: {
				email,
				name,
				user_type,
				password,
				phone,
			} satisfies ISignUp,
		}).then(async () => {
			await signIn({
				email,
				password,
			});
		});
	}

	async function signIn({ email, password }: ISignIn) {
		return await Axios({
			method: "POST",
			url: `/auth/login/`,
			data: {
				email,
				password,
			} satisfies ISignIn,
		}).then((response: AxiosResponse<TTokens>) => {
			if (!response.data.access || !response.data.refresh) return;

			setCookie("access", response.data.access, {
				path: "/",
			});

			setCookie("refresh", response.data.refresh, {
				path: "/",
			});

			push("/");
		});
	}
	async function refreshTokens(refresh: string) {
		if (!cookie.access) return;

		return await Axios({
			method: "POST",
			url: `/auth/login/refresh/`,
			headers: {
				Authorization: `Bearer ${cookie.access}`
			},
			data: {
				refresh,
			},
		}).then((response: AxiosResponse<TTokens>) => {
			if (!response.data.refresh || !response.data.access) return;

			setCookie("access", response.data.access, {
				path: "/",
			});

			setCookie("refresh", response.data.refresh, {
				path: "/",
			})
		});
	}
	function logOut() {
		removeCookie("access");
		removeCookie("refresh");

		window.location.reload();
	}

	useEffect(() => {
		const refresh = cookie.refresh;
		if (!refresh) return;

		setTimeout(async () => {
			await refreshTokens(refresh);
		}, 1000 * 60 * 5);
	}, []);

	const values: AuthContextProps = {
		signUp,
		signIn,
		logOut,
	};

	return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}
