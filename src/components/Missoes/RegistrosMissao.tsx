import { useNavigate } from "react-router-dom";
import "./RegistrosMissao.css";

export function MissaoAcessoCard({ missaoId }: { missaoId: string }) {
    const navigate = useNavigate();

    return (
        <section className="missao-acesso-card">
            <div className="missao-acesso-header">
                <h2>Registros da Missão</h2>
            </div>

            <button
                className="missao-acesso-item"
                onClick={() => navigate(`/missao/${missaoId}/locais`)}
            >
                Locais
            </button>

            <button
                className="missao-acesso-item"
                // onClick={() => navigate(`/missao/${missaoId}/monstros`)}
            >
                Monstros
            </button>

            <button
                className="missao-acesso-item"
                // onClick={() => navigate(`/missao/${missaoId}/personagens`)}
            >
                Personagens
            </button>
        </section>
    );
}
