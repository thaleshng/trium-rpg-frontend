import { useNavigate } from "react-router-dom";
import type { Campanha } from "../../types/Campanha";
import { Trash2 } from "lucide-react";

import "./Campanhas.css";

interface Props {
    campanha: Campanha;
    userType?: "MESTRE" | "PLAYER";
    onDelete: (id: string) => void;
}

function formatSistema(value: string) {
    return value
        .toLowerCase()
        .split("_")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

export function CampanhaCard({ campanha, userType, onDelete }: Props) {
    const navigate = useNavigate();

    const podeExcluir = userType === "MESTRE";

    return (
        <div
            className="campanha-card"
            onClick={() => navigate(`/campanhas/${campanha.id}`)}
        >
            {podeExcluir && (
                <div className="card-actions">
                    <button
                        className="action-btn delete"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.(campanha.id); 
                        }}
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            )}
            
            <h2>{campanha.nome}</h2>

            {campanha.descricao && (
                <p className="descricao">{campanha.descricao}</p>
            )}

            <p className="sistema">[ {formatSistema(campanha.sistema)} ]</p>

            <p className="mestre-info">
                Mestre: {campanha.mestre?.nome}
            </p>

            <div className="card-info-row">
                <span>N° MIssões: {campanha.missoes?.length ?? 0}</span>
                <span>N° Players: {campanha.participantes?.length ?? 0}</span>
            </div>
        </div>
    );
}
