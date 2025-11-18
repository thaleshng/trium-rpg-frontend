// src/context/AuthContext.tsx

import { createContext, useEffect, useState, type ReactNode } from "react";
import { api } from "../../services/api";
import type { User } from "../../types/User";

interface AuthContextValue {
	user: User | null;
	token: string | null;
	loading: boolean;
	login: (email: string, senha: string) => Promise<User>; // <-- retorna User
	logout: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue | undefined>(
	undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [token, setToken] = useState<string | null>(() => {
		return localStorage.getItem("auth_token");
	});

	const [user, setUser] = useState<User | null>(() => {
		const saved = localStorage.getItem("auth_user");
		return saved ? JSON.parse(saved) : null;
	});

	// loading é derivado
	const loading = token === null && user === null;

	useEffect(() => {
		if (token) {
			api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
		} else {
			delete api.defaults.headers.common["Authorization"];
		}
	}, [token]);

	// -------- LOGIN --------
	async function login(email: string, senha: string): Promise<User> {
		const response = await api.post("/api/v1/auth/login", {
			email,
			senha
		});

		const { token, user } = response.data;

		setToken(token);
		setUser(user);

		localStorage.setItem("auth_token", token);
		localStorage.setItem("auth_user", JSON.stringify(user));

		api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

		return user; // <-- AQUI ESTÁ A MÁGICA
	}

	// -------- LOGOUT --------
	function logout() {
		setToken(null);
		setUser(null);
		localStorage.removeItem("auth_token");
		localStorage.removeItem("auth_user");
		delete api.defaults.headers.common["Authorization"];
	}

	return (
		<AuthContext.Provider
			value={{
				user,
				token,
				loading,
				login,
				logout
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
