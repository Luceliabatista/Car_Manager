import { useEffect, useState } from "react";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";

import { FerramentasDaListagem } from "../../shared/components/ferramentas-da-listagem/FerramentasDaListagem";
import { LayoutBaseDePagina } from "../../shared/layouts/LayoutBaseDePagina";

export const Dashboard = () => {
  const [isLoadingCategorias, setIsLoadingCategorias] = useState(true);
  const [isLoadingCarros, setIsLoadingCarros] = useState(true);
  const [totalCountCategorias, setTotalCountCategorias] = useState(0);
  const [totalCountCarros, setTotalCountCarros] = useState(0);

  useEffect(() => {
    setIsLoadingCategorias(true);
    setIsLoadingCarros(true);
  }, []);

  return (
    <LayoutBaseDePagina
      titulo="Página inicial"
      barraDeFerramentas={<FerramentasDaListagem mostrarBotaoNovo={false} />}
    >
      <Box width="100%" display="flex">
        <Grid container margin={2}>
          <Grid item container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
              <Card>
                <CardContent>
                  <Typography variant="h5" align="center">
                    Total de Carros
                  </Typography>

                  <Box
                    padding={6}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    {!isLoadingCarros && (
                      <Typography variant="h1">{totalCountCarros}</Typography>
                    )}
                    {isLoadingCarros && (
                      <Typography variant="h6">Carregando...</Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
              <Card>
                <CardContent>
                  <Typography variant="h5" align="center">
                    Total de Categorias
                  </Typography>

                  <Box
                    padding={6}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    {!isLoadingCategorias && (
                      <Typography variant="h1">
                        {totalCountCategorias}
                      </Typography>
                    )}
                    {isLoadingCategorias && (
                      <Typography variant="h6">Carregando...</Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </LayoutBaseDePagina>
  );
};
