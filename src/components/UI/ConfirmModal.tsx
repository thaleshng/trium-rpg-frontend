import { X } from "lucide-react";
import "./ConfirmModal.css";

interface Props {
    open: boolean;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmModal({
    open,
    title = "Confirmar ação",
    message = "Tem certeza que deseja continuar?",
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    onConfirm,
    onCancel
}: Props) {

    if (!open) return null;

    return (
        <div className="confirm-overlay">
            <div className="confirm-content">

                <button className="confirm-close" onClick={onCancel}>
                    <X size={20} />
                </button>

                <h3>{title}</h3>
                <p>{message}</p>

                <div className="confirm-buttons">
                    <button className="cancel-btn" onClick={onCancel}>
                        {cancelText}
                    </button>

                    <button className="confirm-btn" onClick={onConfirm}>
                        {confirmText}
                    </button>
                </div>

            </div>
        </div>
    );
}
