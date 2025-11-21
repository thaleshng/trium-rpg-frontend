import { useState, useEffect } from "react";
import { api } from "../../services/api";
import type { Campanha, SistemaRPG } from "../../types/Campanha";
import "./Campanhas.css";
import { X } from "lucide-react";
import type { SystemThemeKey } from "../../theme/themes";
import { LoadingButton } from "../UI/LoadingButton/LoadingButton";

interface Props {
    open: boolean;
    onClose: () => void;
    onCreated: (campanha: Campanha) => void;
    sistemaBloqueado: SystemThemeKey;
}

export function ModalCriarCampanha({ open, onClose, onCreated, sistemaBloqueado }: Props) {

    const defaultSistema: SistemaRPG =
        sistemaBloqueado === "ORDEM_PARANORMAL" ? "ORDEM_PARANORMAL" :
        sistemaBloqueado === "DND" ? "DND" :
        "ORDEM_PARANORMAL";

    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [loading, setLoading] = useState(false);
    const [sistema, setSistema] = useState<SistemaRPG>(defaultSistema);

    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        setSistema(
            sistemaBloqueado === "ORDEM_PARANORMAL" ? "ORDEM_PARANORMAL" :
            sistemaBloqueado === "DND" ? "DND" :
            "ORDEM_PARANORMAL"
        );
    }, [sistemaBloqueado]);

    if (!open) return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErro(null);

        if (!nome.trim()) {
            setErro("O nome da campanha não pode ser vazio.");
            return;
        }

        setLoading(true);

        try {
            const response = await api.post("/api/v1/campanhas", {
                nome,
                descricao,
                sistema,
            });

            onCreated(response.data);
            onClose();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error("Erro ao criar campanha:", err);

            if (err.response?.status === 409) {
                setErro("Já existe uma campanha com esse nome.");
            } else {
                setErro("Erro inesperado ao criar campanha.");
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

                <h2>Criar Nova Campanha</h2>

                <form onSubmit={handleSubmit} className="modal-form">
                    <label>
                        Nome da campanha
                        <input
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />
                    </label>

                    {erro && (
                        <p style={{ color: "#ff6b6b", fontSize: "14px", marginTop: "-10px" }}>
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

                    <label>
                        Sistema
                        <input 
                            value={
                                sistema === "ORDEM_PARANORMAL"
                                    ? "Ordem Paranormal"
                                    : "D&D"
                            }
                            disabled
                        />
                    </label>

                    <LoadingButton
                        type="submit"
                        loading={loading}
                        className="modal-submit"
                    >
                        Criar Campanha
                    </LoadingButton>
                </form>
            </div>
        </div>
    );
}
