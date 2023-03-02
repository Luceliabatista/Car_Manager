import { Routes, Route, Navigate } from "react-router-dom";
import { useDrawerContext } from "../shared/contexts";
import { useEffect } from "react";
import { Dashboard } from "../pages";

export const AppRoutes = () => {
  const { setDrawerOptions } = useDrawerContext();

  useEffect(() => {
    setDrawerOptions([
      {
        label: "Página inicial",
        icon: "home",
        path: "/pagina-inicial",
      },
      {
        label: "Categorias",
        icon: "category",
        path: "/categorias",
      },
      {
        label: "Carros",
        icon: "category",
        path: "/carros",
      },
    ]);
  }, []);

  return (
    <Routes>
      <Route path="/pagina-inicial" element={<Dashboard />} />
      {/* <Route path="/categorias" element={<Category />} />
      <Route path="/carros" element={<Cars />} /> */}
      <Route path="*" element={<Navigate to="/pagina-inicial" />} />
    </Routes>
  );
};
