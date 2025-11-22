/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pencil, X, UserCog, Minus, Plus } from "lucide-react";
import { LoadingButton } from "../UI/LoadingButton/LoadingButton";
import { CancelButton } from "../UI/CancelButton/CancelButton";
import "./CampanhaInfoCard.css";

import type { Campanha, SistemaRPG } from "../../types/Campanha";

interface Props {
    campanha: Campanha;
    isMestre: boolean;

    isEditing: boolean;
    setIsEditing: (v: boolean) => void;

    saving: boolean;
    formNome: string;
    formDescricao: string;
    formSistema: SistemaRPG;

    setFormNome: (v: string) => void;
    setFormDescricao: (v: string) => void;

    playersDisponiveis: any[];
    managingPlayers: boolean;
    setManagingPlayers: (v: boolean) => void;

    handleSubmitCampanha: (e: React.FormEvent) => Promise<void>;
    handleAddPlayer: (id: string) => Promise<void>;
    handleRemovePlayer: (id: string) => Promise<void>;
}

export function CampanhaInfoCard(props: Props) {
    const {
        campanha,
        isMestre,
        isEditing,
        setIsEditing,
        saving,
        formNome,
        formDescricao,
        formSistema,
        setFormNome,
        setFormDescricao,
        playersDisponiveis,
        managingPlayers,
        setManagingPlayers,
        handleSubmitCampanha,
        handleAddPlayer,
        handleRemovePlayer
    } = props;

    return (
        <section className={`campanha-card-detalhes ${isEditing ? "scroll" : ""}`}>
            <div className="campanha-card-header">
                <h2>Informações da Campanha</h2>

                {isMestre && (
                    <button
                        type="button"
                        className="edit-btn"
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        {isEditing ? <X size={22} /> : <Pencil size={18} />}
                    </button>
                )}
            </div>

            {isEditing ? (
                <form className="campanha-form-edicao" onSubmit={handleSubmitCampanha}>
                    <div className="form-group">
                        <label>Nome</label>
                        <input
                            className="input"
                            value={formNome}
                            onChange={(e) => setFormNome(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Descrição</label>
                        <textarea
                            className="input"
                            value={formDescricao}
                            onChange={(e) => setFormDescricao(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Sistema</label>
                        <input
                            disabled
                            className="input sistema-input"
                            value={
                                formSistema === "ORDEM_PARANORMAL"
                                    ? "Ordem Paranormal"
                                    : "D&D"
                            }
                        />
                    </div>

                    <div className="editing-actions">
                        <LoadingButton loading={saving} type="submit" className="loading-button">
                            Salvar
                        </LoadingButton>

                        <CancelButton
                            disabled={saving}
                            onClick={() => setIsEditing(false)}
                            className="cancel-btn"
                        >
                            Cancelar
                        </CancelButton>
                    </div>
                </form>
            ) : (
                <div className="campanha-info-view">
                    <p>
                        <strong>Nome:</strong> {campanha.nome}
                    </p>
                    <p>
                        <strong>Descrição:</strong> {campanha.descricao}
                    </p>
                    <p>
                        <strong>Sistema:</strong>
                        {campanha.sistema === "ORDEM_PARANORMAL"
                            ? "[ Ordem Paranormal ]"
                            : "[ D&D ]"}
                    </p>

                    <p>
                        <strong>Mestre:</strong> {campanha.mestre?.nome}
                    </p>
                </div>
            )}

            <hr className="campanha-divider" />

            <div className="campanha-participantes-header">
                <h2>Players</h2>

                {isMestre && (
                    <button
                        type="button"
                        className="btn-link"
                        onClick={() => setManagingPlayers(!managingPlayers)}
                    >
                        {managingPlayers ? <X size={22} /> : <UserCog size={18} />}
                    </button>
                )}
            </div>

            <ul className="campanha-participantes-lista">
                {campanha.participantes.length ? (
                    campanha.participantes.map((p) => (
                        <li key={p.usuarioId} className="campanha-participante-item">
                            <span>{p.usuario?.nome}</span>

                            {isMestre && managingPlayers && (
                                <button
                                    className="btn-remove-player"
                                    disabled={saving}
                                    onClick={() => handleRemovePlayer(p.usuarioId)}
                                >
                                    <Minus size={20} />
                                </button>
                            )}
                        </li>
                    ))
                ) : (
                    <li className="campanha-participante-item vazio">Nenhum player.</li>
                )}
            </ul>

            {isMestre && managingPlayers && (
                <div className="campanha-card-disponiveis">
                    <h3>Adicionar novos Players</h3>

                    {playersDisponiveis.length === 0 ? (
                        <p className="vazio">Nenhum player disponível.</p>
                    ) : (
                        <ul className="campanha-lista-disponiveis">
                            {playersDisponiveis.map((p: any) => (
                                <li key={p.id} className="campanha-item-disponivel">
                                    <span>{p.nome}</span>

                                    <button
                                        className="btn-add-player"
                                        disabled={saving}
                                        onClick={() => handleAddPlayer(p.id)}
                                    >
                                        <Plus size={20} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </section>
    );
}
