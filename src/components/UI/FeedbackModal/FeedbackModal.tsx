import { CheckCircle, XCircle } from "lucide-react";
import "./FeedbackModal.css";

interface FeedbackModalProps {
    open: boolean;
    type?: "success" | "error";
    message: string;
}

export function FeedbackModal({
    open,
    type = "success",
    message,
}: FeedbackModalProps) {
    if (!open) return null;

    const Icon = type === "success" ? CheckCircle : XCircle;

    return (
        <div className="feedback-overlay">
            <div className={`feedback-content ${type}`}>
                <Icon size={36} className="feedback-icon" />
                <p>{message}</p>
            </div>
        </div>
    );
}
