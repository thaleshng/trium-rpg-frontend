import { useParams } from "react-router-dom";
import "./LocaisPage.css"

export function LocaisPage() {
    const { id } = useParams();

    return (
        <div style={{ padding: 20 }} className="locais-container">
            <h1>Locais da Missão</h1>
            <p>Missão ID: {id}</p>

            <p>Em breve será implementado 🚧</p>
        </div>
    );
}
