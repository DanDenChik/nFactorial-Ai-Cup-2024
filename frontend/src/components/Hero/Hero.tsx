import React from "react";
import Link from "next/link";

const Hero = () => {
	return (
		<div className="100wh" >
			<div className="text-center">
				<div className="w-100%">
					<h1 className="color-mainDark mb-5 text-5xl font-bold">Проблемы с ведением бизнеса?</h1>
					<p className="mb-5"><span className="color-mainDark font-semibold">InSightGram</span> - ИИ аналитик инстаграм аккаунтов готов помочь вам с этой проблемой</p>
					<Link href={{ pathname: '/auth/login', }}>
						<button className="btn btn-primary">Начать</button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Hero;
