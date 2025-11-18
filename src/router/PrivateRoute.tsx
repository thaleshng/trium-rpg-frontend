// src/router/PrivateRoute.tsx

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/auth/useAuth";
import type { JSX } from "react";

export function PrivateRoute({ children }: { children: JSX.Element }) {
	const { user, loading } = useAuth();

	if (loading) return <div>Carregando sessão...</div>;

	if (!user) return <Navigate to="/" replace />;

	return children;
}
