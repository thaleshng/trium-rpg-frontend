import { useEffect, useRef, useState } from "react";
import { MapPin, Check, X, RotateCw } from "lucide-react";
import "./PontoMarker.css";

type Props = {
	nome: string;
	x: number;
	y: number;
	size: number;
	rotation?: number;
	imagemUrl?: string | null;

	editing?: boolean;

	onClick?: () => void;
	onChange?: (data: {
		x: number;
		y: number;
		size: number;
		rotation?: number;
	}) => void;
	onConfirm?: () => void;
	onCancel?: () => void;
	onStartInteraction?: () => void;
	onEndInteraction?: () => void;
};

function snapAngle(angle: number, snap = 6) {
	const targets = [0, 90, 180, 270, 360];

	for (const t of targets) {
		if (Math.abs(angle - t) <= snap) {
			return t % 360;
		}
	}

	return angle;
}

export function PontoMarker({
	nome,
	x,
	y,
	size,
	rotation = 0,
	imagemUrl,
	editing = false,
	onClick,
	onChange,
	onConfirm,
	onCancel,
	onStartInteraction,
	onEndInteraction
}: Props) {
	const markerRef = useRef<HTMLDivElement>(null);

	const [dragging, setDragging] = useState(false);
	const [resizing, setResizing] = useState(false);
	const [rotating, setRotating] = useState(false);

	const dragStart = useRef({ x: 0, y: 0 });

	const startAngle = useRef(0);
	const startRotation = useRef(0);

	function onMouseDown(e: React.MouseEvent) {
		if (!editing || resizing || rotating) {
			onClick?.();
			return;
		}

		e.stopPropagation();
		onStartInteraction?.();
		setDragging(true);
		dragStart.current = { x: e.clientX, y: e.clientY };
	}

	useEffect(() => {
		if (!dragging) return;

		function onMove(e: MouseEvent) {
			if (!markerRef.current || !onChange) return;

			const parent = markerRef.current.parentElement;
			if (!parent) return;

			const rect = parent.getBoundingClientRect();

			const dx = e.clientX - dragStart.current.x;
			const dy = e.clientY - dragStart.current.y;

			const newX = ((rect.width * (x / 100) + dx) / rect.width) * 100;
			const newY = ((rect.height * (y / 100) + dy) / rect.height) * 100;

			onChange({
				x: Math.max(0, Math.min(100, newX)),
				y: Math.max(0, Math.min(100, newY)),
				size,
				rotation
			});

			dragStart.current = { x: e.clientX, y: e.clientY };
		}

		function stop() {
			setDragging(false);
			onEndInteraction?.();
		}

		window.addEventListener("mousemove", onMove);
		window.addEventListener("mouseup", stop);
		return () => {
			window.removeEventListener("mousemove", onMove);
			window.removeEventListener("mouseup", stop);
		};
	}, [dragging, x, y, size, rotation, onChange]);

	useEffect(() => {
		if (!resizing) return;

		function onResize(e: MouseEvent) {
			if (!onChange) return;

			const dx = e.clientX - dragStart.current.x;
			const dy = e.clientY - dragStart.current.y;

			const threshold = 6;
			if (Math.abs(dx) < threshold || Math.abs(dy) < threshold) return;

			const delta =
				Math.sign(dx + dy) * Math.min(Math.abs(dx), Math.abs(dy));

			const newSize = Math.max(24, Math.min(2000, size + delta));

			onChange({
				x,
				y,
				size: newSize,
				rotation
			});

			dragStart.current = { x: e.clientX, y: e.clientY };
		}

		function stop() {
			setResizing(false);
		}

		window.addEventListener("mousemove", onResize);
		window.addEventListener("mouseup", stop);
		return () => {
			window.removeEventListener("mousemove", onResize);
			window.removeEventListener("mouseup", stop);
		};
	}, [resizing, size, x, y, rotation, onChange]);

	useEffect(() => {
		if (!rotating) return;

		function onRotate(e: MouseEvent) {
			if (!markerRef.current || !onChange) return;

			const rect = markerRef.current.getBoundingClientRect();
			const cx = rect.left + rect.width / 2;
			const cy = rect.top + rect.height / 2;

			const currentAngle =
				(Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI;

			let delta = currentAngle - startAngle.current;

			// evita salto -180 ↔ 180
			if (delta > 180) delta -= 360;
			if (delta < -180) delta += 360;

			let newRotation = startRotation.current + delta;
			newRotation = (newRotation + 360) % 360;
			newRotation = snapAngle(newRotation);

			onChange({
				x,
				y,
				size,
				rotation: newRotation
			});
		}

		function stop() {
			setRotating(false);
		}

		window.addEventListener("mousemove", onRotate);
		window.addEventListener("mouseup", stop);
		return () => {
			window.removeEventListener("mousemove", onRotate);
			window.removeEventListener("mouseup", stop);
		};
	}, [rotating, x, y, size, onChange]);

	return (
		<div
			ref={markerRef}
			className={`ponto-marker ${editing ? "editing" : ""}`}
			style={{
				left: `${x}%`,
				top: `${y}%`,
				width: size,
				height: size,
				transform: `translate(-50%, -100%)`
			}}
			title={`${nome} (${Math.round(rotation)}°)`}
			onMouseDown={onMouseDown}
		>
			<div
				className="ponto-visual"
				style={{
					transform: `rotate(${rotation}deg)`
				}}
			>
				{imagemUrl ? (
					<img
						src={imagemUrl}
						alt={nome}
						className="ponto-marker-img"
						draggable={false}
					/>
				) : (
					<MapPin size={size} />
				)}
			</div>

			{editing && (
				<>
					<div
						className="ponto-rotate-handle"
						onMouseDown={(e) => {
							e.preventDefault();
							e.stopPropagation();

							const rect =
								markerRef.current!.getBoundingClientRect();
							const cx = rect.left + rect.width / 2;
							const cy = rect.top + rect.height / 2;

							startAngle.current =
								(Math.atan2(e.clientY - cy, e.clientX - cx) *
									180) /
								Math.PI;

							startRotation.current = rotation;
							setRotating(true);
						}}
					>
						<RotateCw size={18} />
					</div>

					<div
						className="ponto-resize-handle"
						onMouseDown={(e) => {
							e.preventDefault();
							e.stopPropagation();
							setResizing(true);
							dragStart.current = { x: e.clientX, y: e.clientY };
						}}
					/>

					<div className="ponto-actions">
						<button
							className="ponto-btn confirm"
							onClick={(e) => {
								e.stopPropagation();
								onConfirm?.();
							}}
						>
							<Check size={50} />
						</button>
						<button
							className="ponto-btn cancel"
							onClick={(e) => {
								e.stopPropagation();
								onCancel?.();
							}}
						>
							<X size={50} />
						</button>
					</div>
				</>
			)}
		</div>
	);
}
