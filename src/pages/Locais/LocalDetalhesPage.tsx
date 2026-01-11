import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import "./LocalDetalhesPage.css";
import { api } from "../../services/api";
import { useAuth } from "../../context/auth/useAuth";
import { MapToolbar } from "../../components/Map/MapToolbar";
import type { Local } from "../../types/Local";
import type { PontoInteresse } from "../../types/PontoInteresse";
import { PontosInteresseModal } from "../../components/Map/PontosInteresseModal";
import { LocalInfoModal } from "../../components/Map/LocalInfoModal";
import { FeedbackModal } from "../../components/UI/FeedbackModal/FeedbackModal";
import { BackButton } from "../../components/UI/BackButton/BackButton";
import { LoadingScreen } from "../../components/UI/LoadingScreen/LoadingScreen";
import { PontoMarker } from "../../components/Map/PontoMarker";

export function LocalDetalhesPage() {
	const { localId } = useParams<{ localId: string }>();
	const { user } = useAuth();
	const isMestre = user?.tipo === "MESTRE";

	const [local, setLocal] = useState<Local | null>(null);
	const [loading, setLoading] = useState(true);

	const viewportRef = useRef<HTMLDivElement>(null);
	const imageRef = useRef<HTMLImageElement>(null);

	const [scale, setScale] = useState(1);
	const [scaleInicial, setScaleInicial] = useState(1);
	const [offset, setOffset] = useState({ x: 0, y: 0 });
	const [dragging, setDragging] = useState(false);
	const dragStart = useRef({ x: 0, y: 0 });
	const [openInfo, setOpenInfo] = useState(false);

	const [feedback, setFeedback] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isMobile, setIsMobile] = useState(false);

	const [pontos, setPontos] = useState<PontoInteresse[]>([]);
	const [openPontos, setOpenPontos] = useState(false);
	const [editingPontoId, setEditingPontoId] = useState<string | null>(null);
	const [draftPonto, setDraftPonto] = useState<PontoInteresse | null>(null);
	const [panLocked, setPanLocked] = useState(false);

	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		async function carregarLocal() {
			try {
				const { data } = await api.get(`/api/v1/locais/${localId}`);
				setLocal(data);
			} finally {
				setLoading(false);
			}
		}

		if (localId) carregarLocal();
	}, [localId]);

	useEffect(() => {
		if (!localId) return;

		api.get(`/api/v1/pontos/local/${localId}`)
			.then((res) => setPontos(res.data))
			.catch(() => {});
	}, [localId]);

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

	useEffect(() => {
		const el = viewportRef.current;
		if (!el) return;

		const handler = (e: WheelEvent) => {
			if (openInfo || editingPontoId) return;

			e.preventDefault();

			setScale((prev) => {
				const step = 0.08;
				const min = scaleInicial * 0.5;
				const max = scaleInicial * 2;

				const novo = Math.min(
					Math.max(prev + (e.deltaY > 0 ? -step : step), min),
					max
				);

				setOffset((o) => limitarPan(o.x, o.y));
				return novo;
			});
		};

		el.addEventListener("wheel", handler, { passive: false });

		return () => {
			el.removeEventListener("wheel", handler);
		};
	}, [openInfo, scaleInicial]);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 700);
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);

		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	async function handleSalvarInfo(data: {
		nome: string;
		descricao: string | null;
	}) {
		if (!localId) return;

		try {
			const { data: updated } = await api.patch(
				`/api/v1/locais/${localId}`,
				data
			);

			setLocal(updated);
			setFeedback("Informações do local atualizadas!");
		} catch {
			setError("Erro ao salvar informações do local.");
			throw new Error();
		}
	}

	function ajustarMapa() {
		if (!viewportRef.current || !imageRef.current) return;

		const vw = viewportRef.current.clientWidth;
		const vh = viewportRef.current.clientHeight;

		const iw = imageRef.current.naturalWidth;
		const ih = imageRef.current.naturalHeight;

		const scaleX = vw / iw;
		const scaleY = vh / ih;

		const inicial = Math.max(scaleX, scaleY);

		setScale(inicial);
		setScaleInicial(inicial);
		setOffset({ x: 0, y: 0 });
	}

	function limitarPan(x: number, y: number) {
		if (!viewportRef.current || !imageRef.current) return { x, y };

		const vw = viewportRef.current.clientWidth;
		const vh = viewportRef.current.clientHeight;

		const iw = imageRef.current.naturalWidth * scale;
		const ih = imageRef.current.naturalHeight * scale;

		const limiteX = Math.max(0, (iw - vw) / 2);
		const limiteY = Math.max(0, (ih - vh) / 2);

		return {
			x: Math.max(-limiteX, Math.min(limiteX, x)),
			y: Math.max(-limiteY, Math.min(limiteY, y))
		};
	}

	function onMouseDown(e: React.MouseEvent) {
		if (openInfo || panLocked) return;
		setDragging(true);
		dragStart.current = {
			x: e.clientX - offset.x,
			y: e.clientY - offset.y
		};
	}

	function onMouseMove(e: React.MouseEvent) {
		if (!dragging) return;

		const x = e.clientX - dragStart.current.x;
		const y = e.clientY - dragStart.current.y;

		setOffset(limitarPan(x, y));
	}

	function pararDrag() {
		setDragging(false);
	}

	async function handleUploadMapa(file: File) {
		if (!localId) return;

		const formData = new FormData();
		formData.append("mapa", file);

		const { data } = await api.post(
			`/api/v1/locais/${localId}/mapa`,
			formData,
			{ headers: { "Content-Type": "multipart/form-data" } }
		);

		setLocal(data);
		setFeedback("Mapa atualizado com sucesso!");
	}

	async function handleRemoverMapa() {
		if (!localId) return;

		try {
			const { data } = await api.delete(`/api/v1/locais/${localId}/mapa`);

			setLocal(data);
			setFeedback("Mapa removido com sucesso!");
		} catch {
			setError("Erro ao remover mapa.");
		}
	}

	function onCliqueUpload() {
		if (!isMestre) return;
		fileInputRef.current?.click();
	}

	if (loading) {
		return <LoadingScreen />;
	}

	if (!local) {
		return null;
	}

	if (isMobile) {
		return (
			<div className="local-mobile-block">
				<BackButton />

				<div className="local-mobile-message">
					<p>
						O mapa interativo deste local foi projetado para uso em
						telas maiores.
					</p>
					<p>
						Para uma melhor experiência, acesse pelo computador ou
						tablet em modo paisagem.
					</p>
				</div>
			</div>
		);
	}

	async function handleCreatePonto(
		data: {
			nome: string;
			descricao?: string | null;
			localId: string;
			x: number;
			y: number;
			size: number;
		},
		file?: File
	) {
		const { data: ponto } = await api.post("/api/v1/pontos", {
			nome: data.nome,
			descricao: data.descricao,
			localId: data.localId,
			x: data.x,
			y: data.y,
			size: data.size,
			rotation: 0
		});

		if (file) {
			const formData = new FormData();
			formData.append("imagem", file);

			const { data: atualizado } = await api.post(
				`/api/v1/pontos/${ponto.id}/imagem`,
				formData,
				{ headers: { "Content-Type": "multipart/form-data" } }
			);

			setPontos((prev) => [...prev, atualizado]);
			return atualizado;
		}

		setPontos((prev) => [...prev, ponto]);
		return ponto;
	}

	async function handleDeletePonto(id: string) {
		await api.delete(`/api/v1/pontos/${id}`);
		setPontos((prev) => prev.filter((p) => p.id !== id));
	}

	async function handleConfirmPonto() {
		if (!draftPonto) return;

		const { id, x, y, size, rotation } = draftPonto;

		await api.patch(`/api/v1/pontos/${id}`, {
			x,
			y,
			size,
			rotation
		});

		setPontos((prev) => prev.map((p) => (p.id === id ? draftPonto : p)));

		setEditingPontoId(null);
		setDraftPonto(null);
		setFeedback("Posição do ponto de interesse salva!");
	}

	return (
		<div
			className={`local-detalhes-page ${
				local.mapaUrl ? "com-mapa" : "sem-mapa"
			} ${openInfo ? "modal-open" : ""}`}
		>
			<FeedbackModal
				open={!!feedback}
				type="success"
				message={feedback ?? ""}
			/>

			<FeedbackModal open={!!error} type="error" message={error ?? ""} />

			<div ref={viewportRef} className="mapa-viewport">
				<BackButton />
				<MapToolbar
					onOpenInfo={() => setOpenInfo(true)}
					onOpenPontos={() => setOpenPontos(true)}
				/>

				{local.mapaUrl ? (
					<div
						className="mapa-canvas"
						onMouseDown={onMouseDown}
						onMouseMove={onMouseMove}
						onMouseUp={pararDrag}
						onMouseLeave={pararDrag}
						style={{
							transform: `
                                translate(-50%, -50%)
                                translate(${offset.x}px, ${offset.y}px)
                                scale(${scale})
                            `
						}}
					>
						<div className="mapa-conteudo">
							<img
								ref={imageRef}
								src={local.mapaUrl}
								alt={`Mapa do local ${local.nome}`}
								className="mapa-imagem"
								onLoad={ajustarMapa}
								draggable={false}
							/>

							<div className="mapa-pontos-layer">
								{pontos.map((ponto) => {
									const isEditing =
										isMestre && ponto.id === editingPontoId;

									const x = isEditing
										? draftPonto?.x
										: ponto.x;
									const y = isEditing
										? draftPonto?.y
										: ponto.y;
									const size = isEditing
										? draftPonto?.size
										: ponto.size;
									const rotation = isEditing
										? draftPonto?.rotation
										: ponto.rotation;

									if (
										x === undefined ||
										y === undefined ||
										size === undefined
									) {
										return null;
									}

									return (
										<PontoMarker
											key={ponto.id}
											nome={ponto.nome}
											x={x}
											y={y}
											size={size}
											rotation={rotation ?? 0}
											imagemUrl={ponto.imagemUrl}
											editing={isEditing}
											onChange={(data) => {
												setDraftPonto((prev) => {
													if (!prev) return prev;
													return { ...prev, ...data };
												});
											}}
											onConfirm={handleConfirmPonto}
											onCancel={() => {
												setEditingPontoId(null);
												setDraftPonto(null);
											}}
											onClick={() => {
												if (!isMestre) return;
												setEditingPontoId(ponto.id);
												setDraftPonto({ ...ponto });
											}}
											onStartInteraction={() =>
												setPanLocked(true)
											}
											onEndInteraction={() =>
												setPanLocked(false)
											}
										/>
									);
								})}
							</div>
						</div>
					</div>
				) : (
					<p className="local-mapa-vazio">
						Esse local ainda não tem um mapa carregado,{" "}
						{isMestre ? (
							<span
								className="local-detalhes-link"
								onClick={onCliqueUpload}
							>
								clique aqui
							</span>
						) : (
							<span>clique aqui</span>
						)}{" "}
						pra criar
					</p>
				)}

				{isMestre && (
					<input
						ref={fileInputRef}
						type="file"
						accept="image/*"
						hidden
						onChange={(e) => {
							const file = e.target.files?.[0];
							if (file) handleUploadMapa(file);
						}}
					/>
				)}
				<LocalInfoModal
					open={openInfo}
					onClose={() => setOpenInfo(false)}
					local={local}
					isMestre={isMestre}
					onSalvarInfo={handleSalvarInfo}
					onTrocarMapa={handleUploadMapa}
					onRemoverMapa={handleRemoverMapa}
				/>

				<PontosInteresseModal
					open={openPontos}
					onClose={() => setOpenPontos(false)}
					localId={local.id}
					pontos={pontos}
					isMestre={isMestre}
					onCreate={handleCreatePonto}
					onDelete={handleDeletePonto}
					onCreatedAndEdit={(id) => {
						const ponto = pontos.find((p) => p.id === id);
						if (!ponto) return;

						setEditingPontoId(id);
						setDraftPonto({ ...ponto });
					}}
				/>
			</div>
		</div>
	);
}
