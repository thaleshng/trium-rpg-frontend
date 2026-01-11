import { Info, MapPin } from "lucide-react";
import "./MapToolbar.css";

type Props = { 
	onOpenInfo: () => void; 
	onOpenPontos: () => void 
};

export function MapToolbar({ onOpenInfo, onOpenPontos }: Props) {
	return (
		<div className="map-toolbar">
			{" "}
			<button
				type="button"
				className="map-toolbar-btn"
				onClick={onOpenPontos}
				title="Pontos de Interesse"
			>
				{" "}
				<MapPin size={18} />{" "}
			</button>{" "}
			<button
				type="button"
				className="map-toolbar-btn"
				onClick={onOpenInfo}
				title="Informações do local"
			>
				{" "}
				<Info size={18} />{" "}
			</button>{" "}
		</div>
	);
}
