/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useRef, useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import "./PontosInteresseModal.css";
import type { PontoInteresse } from "../../types/PontoInteresse";
import { LoadingButton } from "../UI/LoadingButton/LoadingButton";
import { CancelButton } from "../UI/CancelButton/CancelButton";
import { FeedbackModal } from "../UI/FeedbackModal/FeedbackModal";

type CreatePayload = {
	nome: string;
	descricao?: string | null;
	imagemUrl?: string | null;
	localId: string;

	x: number;
	y: number;
	size: number;
};

type Props = {
	open: boolean;
	onClose: () => void;

	localId: string;
	pontos: PontoInteresse[];
	isMestre: boolean;

	onCreate: (
		data: CreatePayload,
		file?: File
	) => Promise<PontoInteresse | void>;
	onDelete?: (id: string) => Promise<void>;

	onCreatedAndEdit?: (pontoId: string) => void;
};

export function PontosInteresseModal({
	open,
	onClose,
	localId,
	pontos,
	isMestre,
	onCreate,
	onDelete,
	onCreatedAndEdit
}: Props) {
	const [nome, setNome] = useState("");
	const [descricao, setDescricao] = useState<string>("");
	const [saving, setSaving] = useState(false);

	const [file, setFile] = useState<File | null>(null);
	const fileRef = useRef<HTMLInputElement>(null);

	const [feedback, setFeedback] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

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

	useEffect(() => {
		if (!open) return;

		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);

	useEffect(() => {
		if (!open) return;
		setNome("");
		setDescricao("");
		setFile(null);
		if (fileRef.current) fileRef.current.value = "";
	}, [open]);

	const pontosOrdenados = useMemo(() => {
		return [...pontos].sort((a, b) => a.nome.localeCompare(b.nome));
	}, [pontos]);

	if (!open) return null;

	async function handleCreate(e: React.FormEvent) {
		e.preventDefault();
		if (!isMestre) return;
		if (nome.trim().length < 2) return;

		try {
			setSaving(true);

			const payload: CreatePayload = {
				nome: nome.trim(),
				descricao: descricao.trim() ? descricao.trim() : null,
				imagemUrl: null,
				localId,
				x: 50,
				y: 50,
				size: 800
			};

			const created = await onCreate(payload, file ?? undefined);

			onClose();

			const createdId = (created as any)?.id ?? null;
			if (createdId) {
				onCreatedAndEdit?.(createdId);
			}
		} catch {
			setError("Erro ao criar ponto de interesse.");
		} finally {
			setSaving(false);
		}
	}

	async function handleDelete(id: string) {
		if (!onDelete) return;
		if (!isMestre) return;

		try {
			setSaving(true);
			await onDelete(id);
			setFeedback("Ponto de interesse removido com sucesso.");
		} catch {
			setError("Erro ao remover ponto.");
		} finally {
			setSaving(false);
		}
	}

	return (
		<>
			<FeedbackModal
				open={!!feedback}
				type="success"
				message={feedback ?? ""}
			/>

			<FeedbackModal
				open={!!error}
				type="error"
				message={error ?? ""}
			/>
			<div className="pontos-overlay">
				<div className="pontos-modal">
					<header className="pontos-header">
						<h2>Pontos de Interesse</h2>

						<button
							className="pontos-close"
							onClick={onClose}
							type="button"
						>
							<X size={22} />
						</button>
					</header>

					<div className="pontos-content">
						{isMestre ? (
							<form
								className="pontos-form"
								onSubmit={handleCreate}
							>
								<div className="pontos-form-row">
									<label>Nome</label>
									<input
										className="pontos-input"
										value={nome}
										onChange={(e) =>
											setNome(e.target.value)
										}
										placeholder="Ex: Sala do necromante"
										disabled={saving}
									/>
								</div>

								<div className="pontos-form-row">
									<label>Descrição</label>
									<textarea
										className="pontos-input"
										value={descricao}
										onChange={(e) =>
											setDescricao(e.target.value)
										}
										placeholder="Descrição do ponto de interesse"
										disabled={saving}
									/>
								</div>

								<div className="pontos-form-row">
									<label>Imagem</label>

									<div className="pontos-file-row">
										<button
											type="button"
											className="pontos-file-btn"
											onClick={() =>
												fileRef.current?.click()
											}
											disabled={saving}
										>
											<Plus size={16} />
											Selecionar imagem
										</button>

										<span className="pontos-file-name">
											{file
												? file.name
												: "Nenhuma imagem selecionada"}
										</span>

										{file && (
											<button
												type="button"
												className="pontos-file-clear"
												onClick={() => {
													setFile(null);
													if (fileRef.current)
														fileRef.current.value =
															"";
												}}
												disabled={saving}
											>
												Limpar
											</button>
										)}
									</div>

									<input
										ref={fileRef}
										type="file"
										accept="image/*"
										hidden
										onChange={(e) => {
											const f =
												e.target.files?.[0] ?? null;
											setFile(f);
										}}
									/>
								</div>

								<div className="pontos-actions">
									<LoadingButton
										loading={saving}
										type="submit"
									>
										Criar Ponto de Interesse
									</LoadingButton>

									<CancelButton
										disabled={saving}
										onClick={onClose}
									>
										Fechar
									</CancelButton>
								</div>
							</form>
						) : (
							<p className="pontos-hint">
								Toque em um ponto de interesse no mapa para ver mais informações e pistas (se houver).
							</p>
						)}

						<div className="pontos-list">
							<h3>Pontos de Interesse no Mapa</h3>

							{pontosOrdenados.length === 0 ? (
								<p className="pontos-empty">
									Nenhum ponto de interesse criado ainda.
								</p>
							) : (
								<ul className="pontos-ul">
									{pontosOrdenados.map((p) => (
										<li key={p.id} className="pontos-item">
											<div className="pontos-item-info">
												<span>{p.nome}</span>
											</div>

											{isMestre && onDelete && (
												<button
													type="button"
													className="pontos-delete"
													title="Remover ponto"
													onClick={() =>
														handleDelete(p.id)
													}
													disabled={saving}
												>
													<Trash2 size={18} />
												</button>
											)}
										</li>
									))}
								</ul>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
