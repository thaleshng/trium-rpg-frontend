import { Plus, Trash2 } from "lucide-react";
import type { Missao } from "../../types/Campanha";
import "./CampanhaMissoesCard.css";
import { CreateButton } from "../UI/CreateButton/CreateButton";
import { useNavigate } from "react-router-dom";

interface Props {
    missoes: Missao[];
    isMestre: boolean;
    onCreateMissao: () => void;
    onDelete: (id: string) => void;
}

export function CampanhaMissoesCard({ missoes, isMestre, onCreateMissao, onDelete }: Props) {
    const navigate = useNavigate();

    function handleClickMissao(id: string) {
        navigate(`/missao/${id}`);
    }

    return (
        <section className="campanha-missoes-card">
            <div className="campanha-missoes-header">
                <h2>Missões da Campanha</h2>

                {isMestre && (
                    <CreateButton onClick={onCreateMissao} className="btn-criar-missao">
                        <Plus size={18} />
                        Nova Missão
                    </CreateButton>
                )}
            </div>

            {missoes.length === 0 ? (
                <p className="campanha-missoes-vazio">Nenhuma missão cadastrada.</p>
            ) : (
                <ul className="campanha-missoes-lista">
                    {missoes.map((m) => (
                        <li
                            key={m.id}
                            className="campanha-missao-item"
                            onClick={() => handleClickMissao(m.id)}
                        >
                            {/* Conteúdo principal */}
                            <div className="campanha-missao-info">
                                <h3>{m.nome}</h3>
                                {m.descricao && <p>{m.descricao}</p>}
                            </div>

                            {isMestre && (
                                <div className="card-actions">
                                    <button
                                        className="action-btn delete"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(m.id);
                                        }}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
