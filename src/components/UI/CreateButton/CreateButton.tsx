import type { ReactNode } from "react";
import "./CreateButton.css";

interface Props {
    onClick: () => void;
    children: ReactNode;
    className?: string;
}

export function CreateButton({ onClick, children, className = "" }: Props) {
    return (
        <button
            type="button"
            className={`btn-criar ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
}
