export type SystemThemeKey = "neutral" | "ORDEM_PARANORMAL" | "DND";

import NeutralBackground from "../assets/themes/neutral-bg.jpg";
import ParanormalOrderBackground from "../assets/themes/paranormal-order-bg.jpg";
import DnDBackground from "../assets/themes/ded-bg.jpg";

export interface SystemTheme {
    name: string;
    colors: {
        background: string;
        cardBackground: string;
        primary: string;
        border: string;
        text: string;
        mutedText: string;
        accent: string;
    };
}

export const systemThemes: Record<SystemThemeKey, SystemTheme> = {
    neutral: {
        name: "Neutro",
        colors: {
        background: NeutralBackground,
        cardBackground: "#151a2c",
        primary: "#f5f5f5",
        border: "#353b4f",
        text: "#f5f5f5",
        mutedText: "#9ca3af",
        accent: "#6366f1",
        },
    },
    ORDEM_PARANORMAL: {
        name: "Ordem Paranormal",
        colors: {
        background: ParanormalOrderBackground,
        cardBackground: "#101018",
        primary: "#f97373",
        border: "#27272f",
        text: "#f9fafb",
        mutedText: "#9ca3af",
        accent: "#ef4444",
        },
    },
    DND: {
        name: "Dungeons & Dragons",
        colors: {
        background: DnDBackground,
        cardBackground: "#1b0907",
        primary: "#f97316",
        border: "#4b1e16",
        text: "#fefce8",
        mutedText: "#fed7aa",
        accent: "#f97316",
        },
    },
};

export function applyTheme(theme: SystemTheme) {
    const root = document.documentElement;

    if (theme.colors.background.includes(".jpg") || theme.colors.background.includes(".png")) {
        root.style.setProperty("--bg-image", `url(${theme.colors.background})`);
        root.style.setProperty("--bg-color", "transparent");
    } else {
        root.style.setProperty("--bg-image", "none");
        root.style.setProperty("--bg-color", theme.colors.background);
    }

    root.style.setProperty("--card-bg-color", theme.colors.cardBackground);
    root.style.setProperty("--primary-color", theme.colors.primary);
    root.style.setProperty("--border-color", theme.colors.border);
    root.style.setProperty("--text-color", theme.colors.text);
    root.style.setProperty("--muted-text-color", theme.colors.mutedText);
    root.style.setProperty("--accent-color", theme.colors.accent);
}
