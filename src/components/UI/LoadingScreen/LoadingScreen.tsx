import { Loader2 } from "lucide-react";
import "./LoadingScreen.css";

export function LoadingScreen() {
    return (
        <div className="loading-container">
            <Loader2 className="loading-icon" size={48} />
            <p>Carregando...</p>
        </div>
    );
}
