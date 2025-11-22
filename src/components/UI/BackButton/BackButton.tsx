import { ArrowLeft } from "lucide-react";
import "./BackButton.css";
import { useNavigate } from "react-router-dom";

export function BackButton() {
    const navigate = useNavigate();

    function handleBack() {
        if (window.history.length > 2) {
            navigate(-1);
        } else {
            navigate("/");
        }
    }

    return (
        <button className="back-button" onClick={handleBack}>
            <ArrowLeft size={18} />
            Voltar
        </button>
    );
}
