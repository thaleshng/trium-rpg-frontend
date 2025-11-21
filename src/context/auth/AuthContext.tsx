import { createContext, useEffect, useState, type ReactNode } from "react";
import { api } from "../../services/api";
import type { User } from "../../types/User";
import { LoadingScreen } from "../../components/UI/LoadingScreen/LoadingScreen";

interface AuthContextValue {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, senha: string) => Promise<User>;
    logout: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {

    const [loading, setLoading] = useState(true); // <-- loading REAL
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    useEffect(() => {
        const savedToken = localStorage.getItem("auth_token");
        const savedUser = localStorage.getItem("auth_user");

        if (savedToken && savedUser) {
            try {
                const parsed = JSON.parse(savedUser);

                // eslint-disable-next-line react-hooks/set-state-in-effect
                setToken(savedToken);
                setUser(parsed);

                api.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
            } catch {
                localStorage.removeItem("auth_user");
                localStorage.removeItem("auth_token");
            }
        }

        setLoading(false);
    }, []);

    async function login(email: string, senha: string): Promise<User> {
        const response = await api.post("/api/v1/auth/login", { email, senha });

        const { token, user } = response.data;

        setToken(token);
        setUser(user);

        localStorage.setItem("auth_token", token);
        localStorage.setItem("auth_user", JSON.stringify(user));

        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        return user;
    }

    function logout() {
        setToken(null);
        setUser(null);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        delete api.defaults.headers.common["Authorization"];
    }

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
