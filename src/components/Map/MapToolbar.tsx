import { Info } from "lucide-react";
import "./MapToolbar.css";

type Props = {
	onOpenInfo: () => void;
};

export function MapToolbar({ onOpenInfo }: Props) {
	return (
		<div className="map-toolbar">
			<button
				type="button"
				className="map-toolbar-btn"
				onClick={onOpenInfo}
				title="Informações do local"
			>
				<Info size={18} />
			</button>
		</div>
	);
}
