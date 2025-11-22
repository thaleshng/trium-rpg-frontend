import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { useAuth } from "../../context/auth/useAuth";
import { CampanhaCard } from "../../components/Campanhas/CampanhaCard";
import { Plus } from "lucide-react";
import { ModalCriarCampanha } from "../../components/Campanhas/ModalCriarCampanha";

import "./CampanhasPage.css";
import type { Campanha } from "../../types/Campanha";
import { useThemeContext } from "../../context/useThemeContext";
import { ConfirmModal } from "../../components/UI/ConfirmModal/ConfirmModal";
import { LoadingScreen } from "../../components/UI/LoadingScreen/LoadingScreen";
import { CreateButton } from "../../components/UI/CreateButton/CreateButton";

export function CampanhasPage() {
	const { user } = useAuth();
	const { system } = useThemeContext();

	const [campanhas, setCampanhas] = useState<Campanha[]>([]);
	const [loading, setLoading] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [deleteId, setDeleteId] = useState<string | null>(null);

	useEffect(() => {
		async function carregar() {
			try {
				const response = await api.get("/api/v1/campanhas");
				setCampanhas(response.data);
			} catch (err) {
				console.error("Erro ao carregar campanhas", err);
			} finally {
				setLoading(false);
			}
		}
		carregar();
	}, []);

	async function excluirCampanha() {
		if (!deleteId) return;
		try {
			await api.delete(`/api/v1/campanhas/${deleteId}`);
			setCampanhas((prev) => prev.filter((c) => c.id !== deleteId));
		} finally {
			setDeleteId(null);
		}
	}

	if (loading) {
		return <LoadingScreen />;
	}

	const campanhasFiltradas = campanhas.filter((c) => c.sistema === system);

	return (
		<div className="campanhas-container">
			<h1 className="campanhas-title">Campanhas</h1>

			{user?.tipo === "MESTRE" && (
				<CreateButton onClick={() => setIsModalOpen(true)} className=".btn-criar">
					<Plus size={18} />
					Criar Nova Campanha
				</CreateButton>
			)}

			{!loading && campanhasFiltradas.length === 0 && (
				<p className="campanhas-empty-message">
					{user?.tipo === "MESTRE"
						? "Este sistema não possui campanhas."
						: "Este sistema não possui campanhas ou você não participa de nenhuma."}
				</p>
			)}

			<div className="campanhas-grid">
				{campanhasFiltradas.map((c) => (
					<CampanhaCard
						key={c.id}
						campanha={c}
						userType={user?.tipo}
						onDelete={(id) => setDeleteId(id)}
					/>
				))}
			</div>

			{isModalOpen && (
				<ModalCriarCampanha
					open={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					onCreated={(novaCampanha) =>
						setCampanhas((prev) => [novaCampanha, ...prev])
					}
					sistemaBloqueado={system}
				/>
			)}

			<ConfirmModal
				open={!!deleteId}
				title="Excluir campanha?"
				message="Esta ação não pode ser desfeita."
				confirmText="Excluir"
				cancelText="Cancelar"
				onConfirm={excluirCampanha}
				onCancel={() => setDeleteId(null)}
			/>
		</div>
	);
}
