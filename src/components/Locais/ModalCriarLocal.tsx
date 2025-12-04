/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { api } from "../../services/api";
import { LoadingButton } from "../UI/LoadingButton/LoadingButton";

import "./ModalCriarLocal.css";

interface Props {
    open: boolean;
    onClose: () => void;
    onCreated: (local: any) => void;
    missaoId: string;
}

export function ModalCriarLocal({ open, onClose, onCreated, missaoId }: Props) {
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [visivel, setVisivel] = useState(true);

    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        if (open) {
            setNome("");
            setDescricao("");
            setVisivel(true);
            setErro(null);
        }
    }, [open]);

    if (!open) return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErro(null);

        if (!nome.trim()) {
            setErro("O nome do local não pode ser vazio.");
            return;
        }

        try {
            setLoading(true);

            const res = await api.post("/api/v1/locais", {
                nome,
                descricao,
                visivel,
                missaoId
            });

            onCreated(res.data);
            onClose();
        } catch {
            setErro("Erro ao criar local.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="modal-local-overlay">
            <div className="modal-local-content">

                <button className="modal-local-close" onClick={onClose}>
                    <X size={22} />
                </button>

                <h2 className="modal-local-title">Criar Local</h2>

                <form className="modal-local-form" onSubmit={handleSubmit}>

                    <label className="modal-local-label">
                        Nome do Local
                        <input
                            className="modal-local-input"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />
                    </label>

                    {erro && <p className="modal-local-error">{erro}</p>}

                    <label className="modal-local-label">
                        Descrição
                        <textarea
                            className="modal-local-textarea"
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                        />
                    </label>

                    <div className="modal-local-switch-row">
                        <span className="visible-text">Visível para Players</span>

                        <label className="modal-local-switch">
                            <input
                                type="checkbox"
                                checked={visivel}
                                onChange={() => setVisivel(!visivel)}
                            />
                            <span className="modal-local-slider" />
                        </label>
                    </div>

                    <LoadingButton
                        type="submit"
                        loading={loading}
                        className="modal-local-submit"
                    >
                        Criar Local
                    </LoadingButton>
                </form>
            </div>
        </div>
    );
}
