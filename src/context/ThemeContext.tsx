import {
    createContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import { useLocation } from "react-router-dom";
import { applyTheme, systemThemes } from "../theme/themes";
import type { SystemThemeKey } from "../theme/themes";

interface ThemeContextValue {
    system: SystemThemeKey;
    setSystem: (system: SystemThemeKey) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const location = useLocation();

    const isHome = location.pathname === "/" || location.pathname === "/login";

    const saved = localStorage.getItem("theme_system") as SystemThemeKey | null;

    const [system, setSystem] = useState<SystemThemeKey>(() => {
        if (isHome) {
            return "neutral";
        }

        if (saved && saved !== "neutral") {
            return saved;
        }

        return "ORDEM_PARANORMAL";
    });

    useEffect(() => {
        applyTheme(systemThemes[system]);
        localStorage.setItem("theme_system", system);
    }, [system]);

    function changeSystem(theme: SystemThemeKey) {
        setSystem(theme);
    }

    return (
        <ThemeContext.Provider value={{ system, setSystem: changeSystem }}>
            {children}
        </ThemeContext.Provider>
    );
}
