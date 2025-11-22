/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { api } from "../../services/api";
import "./ModalCriarMissao.css";
import { X } from "lucide-react";
import { LoadingButton } from "../UI/LoadingButton/LoadingButton";

interface Props {
    open: boolean;
    onClose: () => void;
    onCreated: (missao: any) => void;
    campanhaId: string;
}

export function ModalCriarMissao({ open, onClose, onCreated, campanhaId }: Props) {
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        if (open) {
            setNome("");
            setDescricao("");
            setErro(null);
        }
    }, [open]);

    if (!open) return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErro(null);

        if (!nome.trim()) {
            setErro("O nome da missão não pode ser vazio.");
            return;
        }

        try {
            setLoading(true);

            const response = await api.post("/api/v1/missoes", {
                nome,
                descricao,
                campanhaId
            });

            onCreated(response.data);
            onClose(); 
        } catch (err: any) {
            if (err.response?.status === 409) {
                setErro("Já existe uma missão com esse nome.");
            } else {
                setErro("Erro inesperado ao criar missão.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">

                <button className="modal-close" onClick={onClose}>
                    <X size={22} />
                </button>

                <h2>Criar Missão</h2>

                <form onSubmit={handleSubmit} className="modal-form">
                    <label>
                        Nome da missão
                        <input
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />
                    </label>

                    {erro && (
                        <p className="modal-error">
                            {erro}
                        </p>
                    )}

                    <label>
                        Descrição
                        <textarea
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                        />
                    </label>

                    <LoadingButton
                        type="submit"
                        loading={loading}
                        className="loading-button"
                    >
                        Criar Missão
                    </LoadingButton>
                </form>
            </div>
        </div>
    );
}
