/* eslint-disable @typescript-eslint/no-explicit-any */
import { Trash2, Eye, EyeOff, Plus } from "lucide-react";
import "./MissaoLocaisCard.css";
import { CreateButton } from "../UI/CreateButton/CreateButton";
import { useNavigate, useParams } from "react-router-dom";

interface Props {
    locais: any[];
    isMestre: boolean;
    onCreateLocal: () => void;
    onDelete: (id: string) => void;
    onToggleVisibilidade: (id: string, atual: boolean) => void;
}

export function MissaoLocaisCard({
    locais,
    isMestre,
    onCreateLocal,
    onDelete,
    onToggleVisibilidade
}: Props) {

    const navigate = useNavigate();
    const { id: missaoId } = useParams();

    function handleOpenLocal(localId: string) {
        navigate(`/missao/${missaoId}/locais/${localId}`);
    }

    return (
        <section className="locais-card">
            <div className="locais-card-header">
                <h2>Lista de Locais</h2>

                {isMestre && (
                    <CreateButton onClick={onCreateLocal} className="btn-criar-local">
                        <Plus size={18} />
                        Novo Local
                    </CreateButton>
                )}
            </div>

            {locais.length === 0 ? (
                <p className="locais-vazio">Nenhum local cadastrado.</p>
            ) : (
                <ul className="locais-lista">
                    {locais.map((local: any) => (
                        <li
                            key={local.id}
                            className="local-item"
                            onClick={() => handleOpenLocal(local.id)}
                        >

                            {isMestre && (
                                <button
                                    className="local-vis-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleVisibilidade(local.id, local.visivel);
                                    }}
                                >
                                    {local.visivel ? <Eye size={22} /> : <EyeOff size={22} />}
                                </button>
                            )}

                            <div className="local-info">
                                <h3>{local.nome}</h3>
                                {local.descricao && (
                                    <p className="local-desc">{local.descricao}</p>
                                )}
                            </div>

                            {isMestre && (
                                <div className="local-actions">
                                    <button
                                        className="local-action-btn delete"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(local.id);
                                        }}
                                    >
                                        <Trash2 size={20} />
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
