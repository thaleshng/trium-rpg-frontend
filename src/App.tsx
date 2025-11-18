import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage/LoginPage";
import { PrivateRoute } from "./router/PrivateRoute";
import { AppLayout } from "./layout/AppLayout";
import { CampanhasPage } from "./pages/Campanha/CampanhasPage";
import { CampanhaDetalhesPage } from "./pages/Campanha/CampanhaDetalhesPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route
        path="/campanhas"
        element={
          <PrivateRoute>
            <AppLayout>
              <CampanhasPage />
            </AppLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/campanhas/:id"
        element={
          <PrivateRoute>
            <AppLayout>
              <CampanhaDetalhesPage />
            </AppLayout>
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
