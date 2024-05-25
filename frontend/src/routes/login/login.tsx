"use client";

import Link from "next/link";
import { useRef } from "react";

import { useAuth } from "@context/Auth/useAuth";

import styles from "../../style";

export default function Login() {
	const { signIn } = useAuth();

	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);

	return (
		<div className={`${styles.flexStart}`}>
			<div className={`${styles.boxWidth}`}>
				<div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0 mt-8 mb-8">
					<div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
						<div className="p-6 space-y-4 md:space-y-6 sm:p-8">
							<h2
								className="text-xl font-bold leading-tight tracking-tight 
                              text-gray-900 md:text-2xl text-center"
							>
								Войти
							</h2>

							<form
								className="space-y-4 md:space-y-6"
								action="#"
								onSubmit={async (event) => {
									event.preventDefault();
									if (!emailRef.current) return;
									if (!passwordRef.current) return;

									await signIn({
										email: emailRef.current.value,
										password: passwordRef.current.value,
									}).then(() => {
										window.location.reload();
									});
								}}
							>
								<div>
									<label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
										Ваша эл-почта
									</label>
									<input
										type="text"
										name="email"
										id="email"
										className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-64 p-2.5"
										placeholder="name@email.com"
										ref={emailRef}
									/>
								</div>
								<div>
									<label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
										Пароль
									</label>
									<input
										type="password"
										name="password"
										id="password"
										placeholder="••••••••"
										className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-64 p-2.5"
										ref={passwordRef}
									/>
								</div>

								<button
									type="submit"
									className="w-full text-white bg-mainBlack 
                                 hover:bg-primary-700 focus:ring-4 focus:outline-none 
                                 focus:ring-primary-300 font-medium rounded-lg 
                                 text-sm h-10
                                 text-center"
								>
									Войти
								</button>
								<p className="text-sm font-light text-gray-500">
									Нет аккаунта?{" "}
									<Link href={"/auth/register"} className="font-medium text-primary-600 hover:underline">
										Зарегистрироватся
									</Link>
								</p>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
