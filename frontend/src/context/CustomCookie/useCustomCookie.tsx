"use client";
import { createContext, ReactNode, useContext } from "react";
import { useCookies } from "react-cookie";
import { CookieSerializeOptions } from "cookie";

type TCookie = "access" | "refresh";
interface CustomCookieContextProps {
	cookie: Partial<Record<TCookie, string>>;
	setCookie: (name: TCookie, value: string, options?: CookieSerializeOptions) => void;
	removeCookie: (name: TCookie, options?: CookieSerializeOptions) => void;
}

const CustomCookieContext = createContext<CustomCookieContextProps>({} as CustomCookieContextProps);

export function useCustomCookie(): CustomCookieContextProps {
	return useContext(CustomCookieContext);
}

export function CustomCookieProvider({ children }: { children: ReactNode }) {
	const [cookie, setCookie, removeCookie] = useCookies([] as TCookie[]);

	const values: CustomCookieContextProps = {
		cookie,
		setCookie,
		removeCookie,
	};
	return <CustomCookieContext.Provider value={values}>{children}</CustomCookieContext.Provider>;
}
