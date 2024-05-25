export interface ISignUp {
	email: string;
	username: string;
	password: string;
}

export interface ISignIn {
	email: string;
	password: string;
}

export type TTokens = {
	access?: string;
	refresh?: string;
};
