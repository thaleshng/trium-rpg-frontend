import { Loader2 } from "lucide-react";
import "./LoadingButton.css";

interface LoadingButtonProps {
    loading: boolean;
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit";
    className?: string;
    disabled?: boolean;
}

export function LoadingButton({
    loading,
    children,
    onClick,
    type = "button",
    className = "",
    disabled = false,
}: LoadingButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`loading-btn ${className}`}
        >
            {loading ? (
                <Loader2 className="loading-btn-spinner" size={18} />
            ) : (
                children
            )}
        </button>
    );
}
