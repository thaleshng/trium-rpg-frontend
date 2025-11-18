// src/App.tsx

import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage/LoginPage";
import { PrivateRoute } from "./router/PrivateRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route
        path="/mestre"
        element={
          <PrivateRoute>
            <div>Painel do Mestre</div>
          </PrivateRoute>
        }
      />

      <Route
        path="/player"
        element={
          <PrivateRoute>
            <div>Painel do Player</div>
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
