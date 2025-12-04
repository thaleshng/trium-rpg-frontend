/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../services/api";

import "./LocaisPage.css";

import { BackButton } from "../../components/UI/BackButton/BackButton";
import { LoadingScreen } from "../../components/UI/LoadingScreen/LoadingScreen";
import { FeedbackModal } from "../../components/UI/FeedbackModal/FeedbackModal";
import { ConfirmModal } from "../../components/UI/ConfirmModal/ConfirmModal";

import { MissaoLocaisCard } from "../../components/Locais/MissaoLocaisCard";
import { ModalCriarLocal } from "../../components/Locais/ModalCriarLocal";

import { useAuth } from "../../context/auth/useAuth";

export function LocaisPage() {
    const { id: missaoId } = useParams<{ id: string }>();
    const { user } = useAuth();

    const isMestre = user?.tipo === "MESTRE";

    const [locais, setLocais] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [modalCreateOpen, setModalCreateOpen] = useState(false);
    const [deleteLocalId, setDeleteLocalId] = useState<string | null>(null);

    const [feedback, setFeedback] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        load();
    }, []);

    useEffect(() => {
        if (isMestre) return;

        const interval = setInterval(() => {
            load();
        }, 3000);

        return () => clearInterval(interval);
    }, [isMestre, missaoId]);

    useEffect(() => {
        if (missaoId) load();
    }, [missaoId]);

    useEffect(() => {
        if (!feedback) return;
        const t = setTimeout(() => setFeedback(null), 2000);
        return () => clearTimeout(t);
    }, [feedback]);

    useEffect(() => {
        if (!error) return;
        const t = setTimeout(() => setError(null), 2500);
        return () => clearTimeout(t);
    }, [error]);

    async function load() {
        try {
            const res = await api.get(`/api/v1/locais/missao/${missaoId}`);
            setLocais(res.data);
        } catch {
            setError("Erro ao carregar locais.");
        } finally {
            setLoading(false);
        }
    }

    function handleCreatedLocal(novo: any) {
        setFeedback("Local criado!");
        setLocais((prev) => [...prev, novo]);
    }

    async function excluirLocal() {
        if (!deleteLocalId) return;

        try {
            await api.delete(`/api/v1/locais/${deleteLocalId}`);
            setLocais((prev) => prev.filter((l) => l.id !== deleteLocalId));
            setFeedback("Local removido!");
        } catch {
            setError("Erro ao remover local.");
        } finally {
            setDeleteLocalId(null);
        }
    }

    async function toggleVisibilidadeLocal(id: string, atual: boolean) {
        try {
            await api.patch(`/api/v1/locais/${id}`, {
                visivel: !atual
            });

            setLocais((old) =>
                old.map((l) =>
                    l.id === id ? { ...l, visivel: !atual } : l
                )
            );

            setFeedback(
                !atual ? "Local agora é visível para players." : "Local oculto dos players."
            );
        } catch {
            setError("Erro ao alterar visibilidade.");
        }
    }

    if (loading) return <LoadingScreen />;

    return (
        <div className="locais-container">

            <div className="locais-header">
                <BackButton />
                <h1 className="locais-title">Locais da Missão</h1>
            </div>

            <FeedbackModal open={!!feedback} type="success" message={feedback ?? ""} />
            <FeedbackModal open={!!error} type="error" message={error ?? ""} />

            <div className="locais-grid">
                <MissaoLocaisCard
                    locais={locais}
                    isMestre={isMestre}
                    onCreateLocal={() => setModalCreateOpen(true)}
                    onDelete={(id) => setDeleteLocalId(id)}
                    onToggleVisibilidade={toggleVisibilidadeLocal}
                />
            </div>

            <ModalCriarLocal
                open={modalCreateOpen}
                onClose={() => setModalCreateOpen(false)}
                missaoId={missaoId!}
                onCreated={handleCreatedLocal}
            />

            <ConfirmModal
                open={!!deleteLocalId}
                title="Excluir Local?"
                message="Esta ação não pode ser desfeita."
                confirmText="Excluir"
                cancelText="Cancelar"
                onConfirm={excluirLocal}
                onCancel={() => setDeleteLocalId(null)}
            />

        </div>
    );
}
