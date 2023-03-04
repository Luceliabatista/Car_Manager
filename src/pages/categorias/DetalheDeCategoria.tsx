import { useEffect, useState } from "react";
import { Box, Grid, LinearProgress, Paper, Typography } from "@mui/material";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import * as yup from "yup";

import { CategoriasService } from "../../shared/services/api/CategoriasServices";
import { VTextField, VForm, useVForm, IVFormErrors } from "../../shared/forms";
import { FerramentasDeDetalhe } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { VCheckbox } from "../../shared/forms/VCheckbox";

interface IFormData {
  name: string;
  description: string;
  limitRequest: number;
  valueVariation: number;
  allowQuantityVariation?: boolean;
  hasShipping?: boolean;
  limitRequestsPerMonth?: boolean;
  validateClient?: boolean;
  allowValueVariation?: boolean;
}
const formValidationSchema: yup.Schema<IFormData> = yup.object().shape({
  name: yup.string().required("Campo obrigatório.").min(3),
  allowQuantityVariation: yup.boolean(),
  description: yup.string().required("Campo obrigatório."),
  hasShipping: yup.boolean(),
  limitRequest: yup.number().required("Campo obrigatório."),
  limitRequestsPerMonth: yup.boolean(),
  validateClient: yup.boolean(),
  valueVariation: yup.number().required("Campo obrigatório."),
  allowValueVariation: yup.boolean(),
});

export const DetalheDeCategorias: React.FC = () => {
  const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();
  const { id = "nova" } = useParams<"id">();
  const navigate = useNavigate();
  const { state } = useLocation();

  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    if (state?.id) {
      setName(state.name);
      formRef.current?.setData(state);
    } else {
      formRef.current?.setData({
        name: "",
      });
    }
  }, [state]);

  const handleSave = (dados: IFormData) => {
    formValidationSchema
      .validate(dados, { abortEarly: false })
      .then((dadosValidados) => {
        setIsLoading(true);
        if (id === "nova") {
          CategoriasService.create(dadosValidados).then((result) => {
            setIsLoading(false);

            if (result instanceof Error) {
              alert(result.message);
            } else {
              navigate("/categorias");
            }
          });
        } else {
          CategoriasService.updateById(Number(id), {
            id: Number(id),
            ...dadosValidados,
          }).then((result) => {
            setIsLoading(false);

            if (result instanceof Error) {
              alert(result.message);
            } else {
              if (isSaveAndClose()) {
                navigate("/categorias");
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
    if (/*confirm*/ "Realmente deseja apagar?") {
      CategoriasService.deleteById(id).then((result) => {
        if (result instanceof Error) {
          alert(result.message);
        } else {
          alert("Registro apagado com sucesso!");
          navigate("/categorias");
        }
      });
    }
  };

  return (
    <LayoutBaseDePagina
      titulo={id === "nova" ? "Nova Categoria" : name}
      barraDeFerramentas={
        <FerramentasDeDetalhe
          textoBotaoNovo="Nova"
          mostrarBotaoSalvarEFechar
          mostrarBotaoNovo={id !== "nova"}
          mostrarBotaoApagar={id !== "nova"}
          aoClicarEmSalvar={save}
          aoClicarEmSalvarEFechar={saveAndClose}
          aoClicarEmVoltar={() => navigate("/categorias")}
          aoClicarEmApagar={() => handleDelete(Number(id))}
          aoClicarEmNovo={() => navigate("/categorias/detalhe/nova")}
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
                  label="name"
                  disabled={isLoading}
                  onChange={(e) => setName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  name="description"
                  label="description"
                  disabled={isLoading}
                  // onChange={(e) => setDescription(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  type="number"
                  name="limitRequest"
                  label="limitRequest"
                  disabled={isLoading}
                  // onChange={(e) => setLimitRequest(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  type="number"
                  name="valueVariation"
                  label="valueVariation"
                  disabled={isLoading}
                  // onChange={(e) => setValueVariation(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VCheckbox
                  label="allowQuantityVariation"
                  name="allowQuantityVariation"
                  disabled={isLoading}
                  // onChange={(e) => setAllowQuantityVariation(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VCheckbox
                  label="hasShipping"
                  name="hasShipping"
                  disabled={isLoading}
                  // onChange={(e) => setHasShipping(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VCheckbox
                  label="limitRequestsPerMonth"
                  name="limitRequestsPerMonth"
                  disabled={isLoading}
                  // onChange={(e) => setLimitRequestsPerMonth(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VCheckbox
                  label="validateClient"
                  name="validateClient"
                  disabled={isLoading}
                  // onChange={(e) => setValidateClient(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VCheckbox
                  label="allowValueVariation"
                  name="allowValueVariation"
                  disabled={isLoading}
                  // onChange={(e) => setAllowValueVariation(e.target.value)}
                />
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </VForm>
    </LayoutBaseDePagina>
  );
};
