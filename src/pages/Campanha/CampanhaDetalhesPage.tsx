/* eslint-disable @typescript-eslint/no-explicit-any */
import "./CampanhaDetalhesPage.css";
import "./CampanhasPage.css";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../services/api";

import { useAuth } from "../../context/auth/useAuth";
import { useThemeContext } from "../../context/useThemeContext";

import type { Campanha, Missao, SistemaRPG } from "../../types/Campanha";

import { LoadingScreen } from "../../components/UI/LoadingScreen/LoadingScreen";
import { FeedbackModal } from "../../components/UI/FeedbackModal/FeedbackModal";
import { mapErrorMessage } from "../../utils/errorMapper";

import { CampanhaInfoCard } from "../../components/Campanhas/CampanhaInfoCard";
import { CampanhaMissoesCard } from "../../components/Campanhas/CampanhaMissoesCard";
import { ModalCriarMissao } from "../../components/Missoes/ModalCriarMissao";
import { ConfirmModal } from "../../components/UI/ConfirmModal/ConfirmModal";
import { BackButton } from "../../components/UI/BackButton/BackButton";

export function CampanhaDetalhesPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { setSystem } = useThemeContext();

    const [campanha, setCampanha] = useState<Campanha | null>(null);
    const [missoes, setMissoes] = useState<Missao[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteMissaoId, setDeleteMissaoId] = useState<string | null>(null);

    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [modalMissaoOpen, setModalMissaoOpen] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<string | null>(null);

    const [playersDisponiveis, setPlayersDisponiveis] = useState([]);
    const [managingPlayers, setManagingPlayers] = useState(false);

    const [formNome, setFormNome] = useState("");
    const [formDescricao, setFormDescricao] = useState("");
    const [formSistema, setFormSistema] = useState<SistemaRPG>("ORDEM_PARANORMAL");

    const isMestre = user?.tipo === "MESTRE";

    async function reloadCampanhaAndMissoes(campId: string) {
        try {
            const [campRes, missoesRes] = await Promise.all([
                api.get(`/api/v1/campanhas/${campId}`),
                api.get(`/api/v1/missoes/campanha/${campId}`)
            ]);

            setCampanha(campRes.data);
            setMissoes(missoesRes.data);

            setFormNome(campRes.data.nome);
            setFormDescricao(campRes.data.descricao ?? "");
            setFormSistema(campRes.data.sistema);

            setSystem(campRes.data.sistema);
        } catch (err: any) {
            setError(mapErrorMessage(err));
            if (err?.response?.status === 404) navigate("/campanhas");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (id) reloadCampanhaAndMissoes(id);
    }, [id]);

    useEffect(() => {
        if (!feedback) return;
        const t = setTimeout(() => setFeedback(null), 2000);
        return () => clearTimeout(t);
    }, [feedback]);

    useEffect(() => {
        if (!error) return;
        const t = setTimeout(() => setError(null), 2000);
        return () => clearTimeout(t);
    }, [error]);

    async function loadPlayersDisponiveis() {
        try {
            const res = await api.get("/api/v1/usuarios?tipo=PLAYER");

            const jaParticipam = campanha?.participantes.map((p) => p.usuarioId) ?? [];

            setPlayersDisponiveis(
                res.data.filter((u: any) => !jaParticipam.includes(u.id))
            );
        } catch (err) {
            setError(mapErrorMessage(err));
        }
    }

    useEffect(() => {
        if (managingPlayers && campanha) loadPlayersDisponiveis();
    }, [managingPlayers, campanha]);

    if (loading) return <LoadingScreen />;
    if (!campanha) return <p>Campanha não encontrada.</p>;

    async function handleSubmitCampanha(e: React.FormEvent) {
        e.preventDefault();
        if (!isMestre) return;

        try {
            setSaving(true);

            await api.patch(`/api/v1/campanhas/${campanha.id}`, {
                nome: formNome,
                descricao: formDescricao,
                sistema: formSistema
            });

            setFeedback("Campanha atualizada com sucesso.");
            await reloadCampanhaAndMissoes(campanha.id);
            setIsEditing(false);
        } catch (err: any) {
            setError(mapErrorMessage(err));
        } finally {
            setSaving(false);
        }
    }

    async function handleAddPlayer(id: string) {
        try {
            setSaving(true);

            await api.post(`/api/v1/campanhas/${campanha.id}/participantes`, { playerId: id });

            setFeedback("Player adicionado!");
            await reloadCampanhaAndMissoes(campanha.id);
            await loadPlayersDisponiveis();
        } catch (err: any) {
            setError(mapErrorMessage(err));
        } finally {
            setSaving(false);
        }
    }

    async function handleRemovePlayer(id: string) {
        try {
            setSaving(true);

            await api.delete(`/api/v1/campanhas/${campanha.id}/participantes/${id}`);

            setFeedback("Player removido.");
            await reloadCampanhaAndMissoes(campanha.id);
            await loadPlayersDisponiveis();
        } catch (err: any) {
            setError(mapErrorMessage(err));
        } finally {
            setSaving(false);
        }
    }

    async function excluirMissao() {
        if (!deleteMissaoId) return;

        try {
            await api.delete(`/api/v1/missoes/${deleteMissaoId}`);

            setMissoes((prev) => prev.filter((m) => m.id !== deleteMissaoId));
            setFeedback("Missão excluída com sucesso.");
        } catch (err: any) {
            setError(mapErrorMessage(err));
        } finally {
            setDeleteMissaoId(null);
        }
    }

    return (
        <div className="campanhas-container campanha-detalhes-container">
            <div className="campanha-detalhes-header">
                <BackButton />

                <h1 className="campanhas-title">{campanha.nome}</h1>
            </div>

            <FeedbackModal open={!!feedback} type="success" message={feedback ?? ""} />
            <FeedbackModal open={!!error} type="error" message={error ?? ""} />

            <div className="campanha-detalhes-grid">
                <CampanhaInfoCard
                    campanha={campanha}
                    isMestre={isMestre}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    saving={saving}
                    formNome={formNome}
                    formDescricao={formDescricao}
                    formSistema={formSistema}
                    setFormNome={setFormNome}
                    setFormDescricao={setFormDescricao}
                    playersDisponiveis={playersDisponiveis}
                    managingPlayers={managingPlayers}
                    setManagingPlayers={setManagingPlayers}
                    handleSubmitCampanha={handleSubmitCampanha}
                    handleAddPlayer={handleAddPlayer}
                    handleRemovePlayer={handleRemovePlayer}
                />

                <CampanhaMissoesCard missoes={missoes} isMestre={isMestre} onCreateMissao={() => setModalMissaoOpen(true)} onDelete={(id) => setDeleteMissaoId(id)} />
            </div>

            <ModalCriarMissao
                open={modalMissaoOpen}
                onClose={() => setModalMissaoOpen(false)}
                campanhaId={campanha.id}
                onCreated={(nova) => {
                    setFeedback("Missão criada!");
                    setMissoes((old) => [...old, nova]);
                }}
            />

            <ConfirmModal
                open={!!deleteMissaoId}
                title="Excluir missão?"
                message="Esta ação não pode ser desfeita."
                confirmText="Excluir"
                cancelText="Cancelar"
                onConfirm={excluirMissao}
                onCancel={() => setDeleteMissaoId(null)}
            />
        </div>
    );
}
