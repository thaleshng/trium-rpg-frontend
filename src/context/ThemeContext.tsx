import {
    createContext,
    useEffect,
    useState,
    type ReactNode
} from "react";

import { applyTheme, systemThemes } from "../theme/themes";
import type { SystemThemeKey } from "../theme/themes";

interface ThemeContextValue {
    system: SystemThemeKey;
    setSystem: (system: SystemThemeKey) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [system, setSystem] = useState<SystemThemeKey>("neutral");

    useEffect(() => {
        applyTheme(systemThemes[system]);
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
