import "./CancelButton.css";

interface CancelButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit";
    className?: string;
    disabled?: boolean;
}

export function CancelButton({
    children,
    onClick,
    type = "button",
    className = "",
    disabled = false,
}: CancelButtonProps) {
    return (
        <button
            type={type}
            onClick={!disabled ? onClick : undefined}
            disabled={disabled}
            className={`cancel-btn ${className} ${disabled ? "is-disabled" : ""}`}
        >
            {children}
        </button>
    );
}
