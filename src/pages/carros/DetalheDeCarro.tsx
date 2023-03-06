import { useEffect, useState, ChangeEvent } from "react";
import {
  Box,
  Grid,
  LinearProgress,
  Paper,
  Typography,
  MenuItem,
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";

import { CarrosServices } from "../../shared/services/api/CarrosServices";
import {
  VTextField,
  VForm,
  useVForm,
  IVFormErrors,
  VSelect,
} from "../../shared/forms";
import { FerramentasDeDetalhe } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { VCheckbox } from "../../shared/forms/VCheckbox";
import {
  CategoriasService,
  IDetalheCategoria,
} from "../../shared/services/api/CategoriasServices";

import { formValidationSchema as formValidationCategorySchema } from "../categorias/DetalheDeCategoria";

interface IFormData {
  categoryId: number;
  description: string;
  icmsTax: number;
  ipiTax: number;
  isAvailable?: boolean;
  isWarehouse?: boolean;
  minPuchaseQuantity: number;
  name: string;
  productCategory: {
    name?: string;
  };
}
const formValidationSchema: yup.Schema<IFormData> = yup.object().shape({
  categoryId: yup
    .number()
    .nullable()
    .typeError("Campo obrigatório.")
    .required("Campo obrigatório."),
  name: yup.string().required("Campo obrigatório.").min(3),
  description: yup.string().required("Campo obrigatório."),
  icmsTax: yup.number().required("Campo obrigatório."),
  ipiTax: yup.number().required("Campo obrigatório."),
  isAvailable: yup.boolean(),
  isWarehouse: yup.boolean(),
  minPuchaseQuantity: yup.number().required("Campo obrigatório."),
  productCategory: yup.object().shape({
    name: yup.string(),
  }),
});

export const DetalheDeCarros: React.FC = () => {
  const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();
  const { id = "nova" } = useParams<"id">();
  const navigate = useNavigate();
  const { state } = useLocation();

  const [categories, setCategories] = useState<IDetalheCategoria[]>([]);
  const [productCategory, setProductCategory] = useState<IDetalheCategoria>(
    {} as IDetalheCategoria
  );
  const [isLoading, setIsLoading] = useState(false);
  const [name, setname] = useState("");

  useEffect(() => {
    if (state?.id) {
      setname(state.name);
      formRef.current?.setData(state);
    } else {
      formRef.current?.setData({
        name: "",
        categoryId: null,
      });
    }
  }, [state]);

  useEffect(() => {
    setIsLoading(true);
    CategoriasService.getAll().then((result) => {
      setIsLoading(false);

      if (result instanceof Error) {
        alert(result.message);
      } else {
        setCategories(result.data);
      }
    });
  }, []);

  const handleSave = (dados: IFormData) => {
    formValidationSchema
      .validate({ ...dados, productCategory }, { abortEarly: false })
      .then((dadosValidados) => {
        setIsLoading(true);

        if (id === "nova") {
          CarrosServices.create({ ...dadosValidados, productCategory }).then(
            (result) => {
              setIsLoading(false);

              if (result instanceof Error) {
                alert(result.message);
              } else {
                navigate(`/carros`);
              }
            }
          );
        } else {
          CarrosServices.updateById(Number(id), {
            ...dadosValidados,
            id: Number(id),
            productCategory,
          }).then((result) => {
            setIsLoading(false);

            if (result instanceof Error) {
              alert(result.message);
            } else {
              if (isSaveAndClose()) {
                navigate("/carros");
              }
            }
          });
        }
      })
      .catch((errors: yup.ValidationError) => {
        const validationErrors: IVFormErrors = {};

        errors.inner.forEach((error) => {
          if (!error.path) return;

          validationErrors[error.path] = error.message;
        });

        formRef.current?.setErrors(validationErrors);
      });
  };

  const handleDelete = (id: number) => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Realmente deseja apagar?")) {
      CarrosServices.deleteById(id).then((result) => {
        if (result instanceof Error) {
          alert(result.message);
        } else {
          alert("Registro apagado com sucesso!");
          navigate("/carros");
        }
      });
    }
  };

  const handleCategory = (event: ChangeEvent<HTMLInputElement>) => {
    const categoryId = Number(event.target.value);
    const item = categories.find((category) => category.id === categoryId);
    setProductCategory(item as IDetalheCategoria);
  };

  return (
    <LayoutBaseDePagina
      titulo={id === "nova" ? "Novo Carro" : name}
      barraDeFerramentas={
        <FerramentasDeDetalhe
          textoBotaoNovo="Nova"
          mostrarBotaoSalvarEFechar
          mostrarBotaoNovo={id !== "nova"}
          mostrarBotaoApagar={id !== "nova"}
          aoClicarEmSalvar={save}
          aoClicarEmSalvarEFechar={saveAndClose}
          aoClicarEmVoltar={() => navigate("/carros")}
          aoClicarEmApagar={() => handleDelete(Number(id))}
          aoClicarEmNovo={() => navigate("/carros/detalhe/nova")}
        />
      }
    >
      <VForm ref={formRef} onSubmit={handleSave}>
        <Box
          margin={1}
          display="flex"
          flexDirection="column"
          component={Paper}
          variant="outlined"
        >
          <Grid container direction="column" padding={2} spacing={2}>
            {isLoading && (
              <Grid item>
                <LinearProgress variant="indeterminate" />
              </Grid>
            )}

            <Grid item>
              <Typography variant="h6">Geral</Typography>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  name="name"
                  disabled={isLoading}
                  label="Nome"
                  onChange={(e) => setname(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  name="description"
                  label="Descrição"
                  disabled={isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  name="icmsTax"
                  label="Taxa ICMS"
                  disabled={isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  name="ipiTax"
                  label="Taxa IPI"
                  disabled={isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  name="minPuchaseQuantity"
                  label="Quantidade mínima de compra"
                  disabled={isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VSelect
                  fullWidth
                  label="Categoria"
                  name="categoryId"
                  variant="outlined"
                  disabled={isLoading}
                  onChange={handleCategory}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </VSelect>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VCheckbox
                  name="isWarehouse"
                  label="Em Estoque"
                  disabled={isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VCheckbox
                  name="isAvailable"
                  label="Disponível"
                  disabled={isLoading}
                />
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </VForm>
    </LayoutBaseDePagina>
  );
};
