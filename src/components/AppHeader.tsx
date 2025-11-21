import "./AppHeader.css"; // <-- IMPORTANTE
import { useAuth } from "../context/auth/useAuth";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";

export function AppHeader() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	if (!user) return null;

	const handleLogout = () => {
		logout();
		navigate("/");
	};

	return (
		<header className="app-header">
			<div className="app-header-container">
				<img
					src={Logo}
					alt="Logo"
					className="app-header-logo"
					onClick={() => navigate("/campanhas")}
				/>

				<div className="app-header-user">
					<span
						className={
							"app-header-prefix " +
							(user.tipo === "MESTRE" ? "mestre" : "player")
						}
					>
						[{user.tipo}]
					</span>

					<span>{user.nome}</span>

					<button
						className="app-header-logout"
						onClick={handleLogout}
					>
						Logout
					</button>
				</div>
			</div>
		</header>
	);
}
