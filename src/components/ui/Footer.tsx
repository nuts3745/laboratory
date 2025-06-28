import type React from "react";

export const Footer: React.FC = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer>
			<small>
				Copyright © 2019-{currentYear} nuts3745 All rights reserved.
			</small>
		</footer>
	);
};
