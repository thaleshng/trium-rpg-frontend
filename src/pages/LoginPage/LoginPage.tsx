import { useState } from "react";
import { useEffect } from "react";
import type { FormEvent } from "react";

import { useThemeContext } from "../../context/useThemeContext";
import { useAuth } from "../../context/auth/useAuth";
import { useNavigate } from "react-router-dom";

import type { SystemThemeKey } from "../../theme/themes";

import Logo from "../../assets/logo.png";
import { LoadingButton } from "../../components/UI/LoadingButton/LoadingButton";

type UserType = "MESTRE" | "PLAYER";

export function LoginPage() {
	const { setSystem } = useThemeContext();
	const { login, user, logout } = useAuth();
	const navigate = useNavigate();
	const [selectedSystem, setSelectedSystem] = useState<SystemThemeKey | null>(
		null
	);

	const [userType, setUserType] = useState<UserType | null>(null);
	const [email, setEmail] = useState("");
	const [senha, setSenha] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!user) {
			setSystem("neutral");
		}
	}, [user]);

	useEffect(() => {
		if (user) {
			logout();
		}
		setSystem("neutral");
	}, []);

	function handleSystemChange(event: React.ChangeEvent<HTMLSelectElement>) {
		const systemKey = event.target.value as SystemThemeKey;
		setSelectedSystem(systemKey);
		setSystem(systemKey);
	}

	async function handleSubmit(event: FormEvent) {
		event.preventDefault();
		setError(null);

		if (!userType) {
			setError("Selecione Entrar como MESTRE ou Entrar como PLAYER.");
			return;
		}

		if (!selectedSystem) {
			setError("Selecione um sistema para continuar.");
			return;
		}

		setIsSubmitting(true);

		try {
			const loggedUser = await login(email, senha);

			if (loggedUser.tipo !== userType) {
				if (loggedUser.tipo === "MESTRE") {
					setError(
						"Este usuário está cadastrado como MESTRE. Acesse utilizando a opção 'Entrar como MESTRE'."
					);
				} else {
					setError(
						"Este usuário está cadastrado como PLAYER. Não é possível acessar como Mestre."
					);
				}

				return;
			}

			navigate("/campanhas");

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			if (err?.response?.status === 401) {
				setError("Erro ao fazer login. Verifique suas credenciais.");
			} else if (err?.response?.data?.message) {
				setError(err.response.data.message);
			} else {
				setError("Erro ao fazer login. Tente novamente.");
			}
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<div className="login-page">
			<div className="login-card">
				<img
					src={Logo}
					alt="Logo do Sistema RPG"
					className="login-logo"
				/>

				<div className="login-user-type">
					<label className="radio-option">
						<input
							type="radio"
							name="userType"
							value="MESTRE"
							checked={userType === "MESTRE"}
							onChange={() => setUserType("MESTRE")}
						/>
						<span>
							Entrar como{" "}
							<span className="type-color">MESTRE</span>
						</span>
					</label>

					<label className="radio-option">
						<input
							type="radio"
							name="userType"
							value="PLAYER"
							checked={userType === "PLAYER"}
							onChange={() => setUserType("PLAYER")}
						/>
						<span>
							Entrar como{" "}
							<span className="type-color">PLAYER</span>
						</span>
					</label>
				</div>

				<form className="login-form" onSubmit={handleSubmit}>
					<div className="form-group">
						<label htmlFor="system">Selecione o sistema:</label>
						<select
							id="system"
							className="input"
							defaultValue=""
							onChange={handleSystemChange}
						>
							<option value="" disabled></option>

							<option value="ORDEM_PARANORMAL">
								Ordem Paranormal
							</option>

							<option value="DND">
								Dungeons & Dragons (D&D)
							</option>
						</select>
					</div>

					<div className="form-group">
						<label htmlFor="email">E-mail:</label>
						<input
							id="email"
							type="email"
							className="input"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							autoComplete="email"
							required
						/>
					</div>

					<div className="form-group">
						<label htmlFor="senha">Senha:</label>
						<input
							id="senha"
							type="password"
							className="input"
							value={senha}
							onChange={(e) => setSenha(e.target.value)}
							autoComplete="current-password"
							required
						/>
					</div>

					{error && <p className="error-text">{error}</p>}

					<LoadingButton
						type="submit"
						loading={isSubmitting}
						className="primary-button"
					>
						ENTRAR
					</LoadingButton>
				</form>

				<p className="login-footer">© RPG SYSTEM — 2025</p>
			</div>
		</div>
	);
}
