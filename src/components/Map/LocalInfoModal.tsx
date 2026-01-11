/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from "react";
import { X, Pencil, ImageOff, ImagePlus } from "lucide-react";
import type { Local } from "../../types/Local";
import "./LocalInfoModal.css";
import { LoadingButton } from "../UI/LoadingButton/LoadingButton";
import { CancelButton } from "../UI/CancelButton/CancelButton";

type Props = {
    open: boolean;
    onClose: () => void;
    local: Local;
    isMestre: boolean;

    onSalvarInfo?: (data: { nome: string; descricao: string | null }) => Promise<void>;
    onTrocarMapa?: (file: File) => Promise<void>;
    onRemoverMapa?: () => Promise<void>;
};

export function LocalInfoModal({
    open,
    onClose,
    local,
    isMestre,
    onSalvarInfo,
    onTrocarMapa,
    onRemoverMapa,
}: Props) {
    const [editing, setEditing] = useState(false);
    const [formNome, setFormNome] = useState(local.nome);
    const [formDescricao, setFormDescricao] = useState(local.descricao);
    const [saving, setSaving] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!open) return;
        setEditing(false);
        setFormNome(local.nome);
        setFormDescricao(local.descricao);
    }, [open, local]);

    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);


    if (!open) return null;

    const nomeArquivoMapa =
        isMestre && local.mapaUrl
            ? formatarNomeArquivo(local.mapaUrl)
            : null;


    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!isMestre || !onSalvarInfo) return;

        try {
            setSaving(true);
            await onSalvarInfo({
                nome: formNome,
                descricao: formDescricao,
            });
            setEditing(false);
        } finally {
            setSaving(false);
        }
    }

    async function handleTrocarMapa(file: File) {
        if (!onTrocarMapa) return;
        try {
            setSaving(true);
            await onTrocarMapa(file);
        } finally {
            setSaving(false);
        }
    }

    async function handleRemoverMapa() {
        if (!onRemoverMapa) return;
        try {
            setSaving(true);
            await onRemoverMapa();
        } finally {
            setSaving(false);
        }
    }

    function formatarNomeArquivo(url: string) {
        const filename = url.split("/").pop() ?? "";

        return filename
            .replace(/-[a-f0-9-]{36}(?=\.)/i, "")
            .replace(/^[a-f0-9]+-|^\d+-/, "")
            .replace(/_/g, " ");
    }



    return (
        <div className="local-info-overlay">
            <div className="local-info-modal">
                {/* HEADER */}
                <header className="local-info-header">
                    <h2>Informações do Local</h2>

                    <button className="close-btn" onClick={onClose}>
                        <X size={22} />
                    </button>
                </header>

                <div className="local-info-content">
                    {!editing && (
                        <div className="local-info-view">
                            <div className="local-info-column">
                                <p><span>Nome:</span> {local.nome}</p>
                                <p><span>Descrição:</span> {local.descricao || "—"}</p>
                            </div>

                            {isMestre && (
                                <button className="edit-btn" onClick={() => setEditing(true)}>
                                    <Pencil size={18} />
                                </button>
                            )}
                        </div>
                    )}

                    {editing && (
                        <form className="local-form-edicao" onSubmit={handleSubmit}>
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
                                    value={formDescricao ?? ""}
                                    onChange={(e) => setFormDescricao(e.target.value)}
                                />
                            </div>

                            <div className="editing-actions">
                                <LoadingButton loading={saving} type="submit">
                                    Salvar
                                </LoadingButton>

                                <CancelButton
                                    disabled={saving}
                                    onClick={() => setEditing(false)}
                                >
                                    Cancelar
                                </CancelButton>
                            </div>
                        </form>
                    )}

                    {/* MAPA */}
                    <div className="local-mapa-section">
                        <h3>Mapa</h3>

                        {local.mapaUrl ? (
                            <>
                                <div className="mapa-preview-wrapper">
                                    <img
                                        src={local.mapaUrl}
                                        alt="Mapa do local"
                                        className="local-mapa-preview"
                                    />

                                    {isMestre && (
                                        <div className="mapa-actions-overlay">
                                            <button
                                                type="button"
                                                className="mapa-action-btn"
                                                title="Trocar mapa"
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                <ImagePlus size={18} />
                                            </button>

                                            <button
                                                type="button"
                                                className="mapa-action-btn danger"
                                                title="Remover mapa"
                                                onClick={handleRemoverMapa}
                                            >
                                                <ImageOff size={18} />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {isMestre && nomeArquivoMapa && (
                                    <p className="mapa-nome-arquivo">
                                        <span>Arquivo:</span> {nomeArquivoMapa}
                                    </p>
                                )}
                            </>
                        ) : (
                            <p className="mapa-vazio">Este local ainda não possui um mapa.</p>
                        )}

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleTrocarMapa(file);
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
