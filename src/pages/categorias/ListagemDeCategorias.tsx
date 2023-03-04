import { useEffect, useMemo, useState } from "react";
import {
  Icon,
  IconButton,
  LinearProgress,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  CategoriasService,
  IDetalheCategoria,
} from "../../shared/services/api/CategoriasServices";
import { FerramentasDaListagem } from "../../shared/components/ferramentas-da-listagem/FerramentasDaListagem";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { Environment } from "../../shared/environment";
import { useDebounce } from "../../shared/hooks";

export const ListagemDeCategorias: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce();
  const navigate = useNavigate();

  const [rows, setRows] = useState<IDetalheCategoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const busca = useMemo(() => {
    return searchParams.get("busca") || "";
  }, [searchParams]);

  const pagina = useMemo(() => {
    return Number(searchParams.get("pagina") || "1");
  }, [searchParams]);

  useEffect(() => {
    setIsLoading(true);

    debounce(() => {
      CategoriasService.getAll().then((result) => {
        setIsLoading(false);

        if (result instanceof Error) {
          alert(result.message);
        } else {
          console.log(result);

          setTotalCount(result.totalCount);
          setRows(result.data);
        }
      });
    });
  }, []);

  const handleDelete = (id: number) => {
    if (/*confirm*/ "Realmente deseja apagar?") {
      CategoriasService.deleteById(id).then((result) => {
        if (result instanceof Error) {
          alert(result.message);
        } else {
          setRows((oldRows) => [
            ...oldRows.filter((oldRow) => oldRow.id !== id),
          ]);
          alert("Registro apagado com sucesso!");
        }
      });
    }
  };

  return (
    <LayoutBaseDePagina
      titulo="Lista de Categorias"
      barraDeFerramentas={
        <FerramentasDaListagem
          mostrarInputBusca
          textoDaBusca={busca}
          textoBotaoNovo="Nova"
          aoClicarEmNovo={() => navigate("/categorias/detalhe/nova")}
          aoMudarTextoDeBusca={(texto) =>
            setSearchParams({ busca: texto, pagina: "1" }, { replace: true })
          }
        />
      }
    >
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{ m: 1, width: "auto" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width={100}>Ações</TableCell>
              <TableCell>Nome</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .filter((item) => item.name.includes(busca))
              .map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(row.id)}
                    >
                      <Icon>delete</Icon>
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() =>
                        navigate(`/categorias/detalhe/${row.id}`, {
                          state: row,
                        })
                      }
                    >
                      <Icon>edit</Icon>
                    </IconButton>
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                </TableRow>
              ))}
          </TableBody>

          {totalCount === 0 && !isLoading && (
            <caption>{Environment.LISTAGEM_VAZIA}</caption>
          )}

          <TableFooter>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={3}>
                  <LinearProgress variant="indeterminate" />
                </TableCell>
              </TableRow>
            )}
            {totalCount > 0 && totalCount > Environment.LIMITE_DE_LINHAS && (
              <TableRow>
                <TableCell colSpan={3}>
                  <Pagination
                    page={pagina}
                    count={Math.ceil(totalCount / Environment.LIMITE_DE_LINHAS)}
                    onChange={(_, newPage) =>
                      setSearchParams(
                        { busca, pagina: newPage.toString() },
                        { replace: true }
                      )
                    }
                  />
                </TableCell>
              </TableRow>
            )}
          </TableFooter>
        </Table>
      </TableContainer>
    </LayoutBaseDePagina>
  );
};
