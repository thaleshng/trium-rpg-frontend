import type { ReactNode } from "react";
import { AppHeader } from "../components/AppHeader";
import "./AppLayout.css"

interface AppLayoutProps {
	children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
	return (
		<div>
			<AppHeader />
			<main className="main-content">{children}</main>
		</div>
	);
}
