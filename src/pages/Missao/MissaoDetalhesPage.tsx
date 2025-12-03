/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../services/api";

import "./MissaoDetalhesPage.css";

import { BackButton } from "../../components/UI/BackButton/BackButton";
import { LoadingScreen } from "../../components/UI/LoadingScreen/LoadingScreen";
import { FeedbackModal } from "../../components/UI/FeedbackModal/FeedbackModal";

import { MissaoInfoCard } from "../../components/Missoes/MissaoInfoCard";
import { MissaoAcessoCard } from "../../components/Missoes/RegistrosMissao";

import { useAuth } from "../../context/auth/useAuth";
import { useThemeContext } from "../../context/useThemeContext";

import type { MissaoDetalhada } from "../../types/Missao";

export function MissaoDetalhesPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { setSystem } = useThemeContext();

    const isMestre = user?.tipo === "MESTRE";

    const [missao, setMissao] = useState<MissaoDetalhada | null>(null);
    const [loading, setLoading] = useState(true);

    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    const [feedback, setFeedback] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [formNome, setFormNome] = useState("");
    const [formDescricao, setFormDescricao] = useState("");

    const [censurar, setCensurar] = useState(true);

    async function load() {
        try {
            const res = await api.get(`/api/v1/missoes/${id}`);
            const m = res.data;

            setMissao(m);
            setFormNome(m.nome);
            setFormDescricao(m.descricao ?? "");
            setCensurar(!m.visibilidadePersonagens);

            if (m.campanha?.sistema) setSystem(m.campanha.sistema);

        } catch {
            navigate("/campanhas");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (isMestre) return;

        const interval = setInterval(() => {
            load();
        }, 3000);

        return () => clearInterval(interval);
    }, [isMestre]);

    useEffect(() => {
        if (id) load();
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

    async function handleSubmitMissao(e: React.FormEvent) {
        e.preventDefault();
        if (!isMestre || !missao) return;

        try {
            setSaving(true);

            await api.patch(`/api/v1/missoes/${missao.id}`, {
                nome: formNome,
                descricao: formDescricao
            });

            setFeedback("Missão atualizada com sucesso.");
            await load();
            setIsEditing(false);

        } catch {
            setError("Erro ao salvar missão.");
        } finally {
            setSaving(false);
        }
    }

    const personagensFormatados =
        missao && missao.personagens
            ? missao.personagens.map((p: any) => {
                const participante =
                    missao.campanha?.participantes?.find(
                        (part: any) => part.usuarioId === p.usuarioId
                    );

                return {
                    id: p.id,
                    nome: p.nome,
                    jogadorNome: participante?.usuario?.nome ?? "Desconhecido",
                    isDoUsuarioAtual: participante?.usuarioId === user?.id
                };
            })
            : [];
    
    async function toggleVisibilidade() {
        if (!missao || !isMestre) return;

        try {
            const novaVis = !missao.visibilidadePersonagens;

            await api.patch(`/api/v1/missoes/${missao.id}/visibilidade`, {
                visivel: novaVis
            });

            setMissao({ ...missao, visibilidadePersonagens: novaVis });
            setCensurar(!novaVis);

            setFeedback("Visibilidade atualizada.");

        } catch {
            setError("Erro ao alterar visibilidade.");
        }
    }


    if (loading) return <LoadingScreen />;
    if (!missao) return <p>Missão não encontrada.</p>;

    return (
        <div className="missao-container campanha-detalhes-container">

            <div className="missao-header campanha-detalhes-header">
                <BackButton />
                <h1 className="missao-title campanhas-title">{missao.nome}</h1>
            </div>

            <FeedbackModal open={!!feedback} type="success" message={feedback ?? ""} />
            <FeedbackModal open={!!error} type="error" message={error ?? ""} />

            <div className="missao-grid campanha-detalhes-grid">

                <MissaoInfoCard
                    missao={missao}
                    isMestre={isMestre}

                    isEditing={isEditing}
                    setIsEditing={setIsEditing}

                    saving={saving}
                    formNome={formNome}
                    formDescricao={formDescricao}

                    setFormNome={setFormNome}
                    setFormDescricao={setFormDescricao}

                    listaPersonagens={personagensFormatados}

                    censurar={censurar}
                    setCensurar={toggleVisibilidade}

                    handleSubmitMissao={handleSubmitMissao}
                />

                <MissaoAcessoCard missaoId={missao.id} />
            </div>
        </div>
    );
}