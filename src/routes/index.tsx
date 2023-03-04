import { Routes, Route, Navigate } from "react-router-dom";
import { useDrawerContext } from "../shared/contexts";
import { useEffect } from "react";
import {
  Dashboard,
  DetalheDeCarros,
  DetalheDeCategorias,
  ListagemDeCarros,
  ListagemDeCategorias,
} from "../pages";

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
      <Route path="/categorias" element={<ListagemDeCategorias />} />
      <Route
        path="/categorias/detalhe/nova"
        element={<DetalheDeCategorias />}
      />
      <Route path="/categorias/detalhe/:id" element={<DetalheDeCategorias />} />
      <Route path="/carros" element={<ListagemDeCarros />} />
      <Route path="/carros/detalhe/nova" element={<DetalheDeCarros />} />
      <Route path="/carros/detalhe/:id" element={<DetalheDeCarros />} />
      <Route path="*" element={<Navigate to="/pagina-inicial" />} />
    </Routes>
  );
};
