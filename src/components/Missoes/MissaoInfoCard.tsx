/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pencil, X, Eye, EyeOff } from "lucide-react";
import { LoadingButton } from "../UI/LoadingButton/LoadingButton";
import { CancelButton } from "../UI/CancelButton/CancelButton";

import "./MissaoInfoCard.css";

interface Props {
    missao: any;
    isMestre: boolean;

    isEditing: boolean;
    setIsEditing: (v: boolean) => void;

    saving: boolean;
    formNome: string;
    formDescricao: string;

    setFormNome: (v: string) => void;
    setFormDescricao: (v: string) => void;

    listaPersonagens: any[];

    censurar: boolean;
    setCensurar: () => void;

    handleSubmitMissao: (e: React.FormEvent) => Promise<void>;
}

export function MissaoInfoCard(props: Props) {
    const {
        missao,
        isMestre,
        isEditing,
        setIsEditing,
        saving,
        formNome,
        formDescricao,
        setFormNome,
        setFormDescricao,
        listaPersonagens,
        censurar,
        setCensurar,
        handleSubmitMissao
    } = props;

    return (
        <section className={`missao-info-card ${isEditing ? "scroll" : ""}`}>

            <div className="missao-info-header">
                <h2>Informações da Missão</h2>

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
                <form className="missao-form-edicao" onSubmit={handleSubmitMissao}>
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
                <div className="missao-info-view">
                    <p>
                        <strong>Nome:</strong> {missao.nome}
                    </p>

                    <p className="descricao-missao">
                        <strong>Descrição:</strong> {missao.descricao}
                    </p>
                </div>
            )}

            <hr className="missao-divider" />

            <div className="missao-personagens-header">
                <h2>Personagens</h2>

                {isMestre && (
                    <button
                        type="button"
                        className="btn-link"
                        onClick={() => setCensurar()}
                    >
                        {censurar ? <EyeOff size={22} /> : <Eye size={22} />}
                    </button>
                )}
            </div>

            <ul className="missao-personagens-lista">
                {listaPersonagens.length ? (
                    listaPersonagens.map((p: any) => {
                        const censurado = !isMestre && censurar && !p.isDoUsuarioAtual;

                        return (
                            <li
                                key={p.id}
                                className={`missao-personagem-item ${censurado ? "censurado" : ""}`}
                            >
                                <span className="personagem-nome">
                                    {censurado ? "••••••••••" : p.nome}
                                </span>

                                <span className="personagem-player">
                                    {censurado ? "(••••••••)" : `( ${p.jogadorNome} )`}
                                </span>
                            </li>
                        );
                    })
                ) : (
                    <li className="missao-personagem-item vazio">
                        Nenhum personagem criado pelos players.
                    </li>
                )}
            </ul>
        </section>
    );
}
