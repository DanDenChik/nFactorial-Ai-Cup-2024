export interface ISignUp {
	email: string;
	name: string;
	user_type: number;
	password: string;
	phone: string;
}

export interface ISignIn {
	email: string;
	password: string;
}

export type TTokens = {
	access?: string;
	refresh?: string;
};
