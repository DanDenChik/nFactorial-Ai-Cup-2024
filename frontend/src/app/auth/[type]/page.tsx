import { redirect } from "next/navigation";

import Login from "@routes/login/login";
import Register from "@routes/register/register";

export default function page({ params }: { params: { type: "login" | "register" } }) {
	if (params.type === "login") return <Login />;
	if (params.type === "register") return <Register />;
	else redirect("/");
}
