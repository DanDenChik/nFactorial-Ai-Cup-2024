import axios, { AxiosRequestConfig } from "axios";
import { MainConfig } from "@config/main";

export function Axios(params: AxiosRequestConfig) {
	return axios({
		baseURL: MainConfig.BACKEND_HOST,
		...params,
	});
}
