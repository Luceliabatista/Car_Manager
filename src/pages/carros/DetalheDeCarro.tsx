import { useEffect, useState } from "react";
import { Box, Grid, LinearProgress, Paper, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";

import { CarrosServices } from "../../shared/services/api/CarrosServices";
import { VTextField, VForm, useVForm, IVFormErrors } from "../../shared/forms";
import { FerramentasDeDetalhe } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";

interface IFormData {
  id: number;
  categoryId: number;
  description: string;
  icmsTax: number;
  ipiTax: number;
  isAvailable: boolean;
  isWarehouse: boolean;
  minPuchaseQuantity: number;
  name: string;
  productCategory: string;
}
const formValidationSchema: yup.Schema<IFormData> = yup.object().shape({
  id: yup.number().required(),
  categoryId: yup.number().required(),
  name: yup.string().required().min(3),
  description: yup.string().required(),
  icmsTax: yup.number().required(),
  ipiTax: yup.number().required(),
  isAvailable: yup.boolean().required(),
  isWarehouse: yup.boolean().required(),
  minPuchaseQuantity: yup.number().required(),
  productCategory: yup.string().required(),
});

export const DetalheDeCarros: React.FC = () => {
  const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();
  const { id = "nova" } = useParams<"id">();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [name, setname] = useState("");

  useEffect(() => {
    if (id !== "nova") {
      setIsLoading(true);

      CarrosServices.getById(Number(id)).then((result) => {
        setIsLoading(false);

        if (result instanceof Error) {
          alert(result.message);
          navigate("/carros");
        } else {
          setname(result.name);
          formRef.current?.setData(result);
        }
      });
    } else {
      formRef.current?.setData({
        name: "",
        categoryId: "",
        description: "",
      });
    }
  }, [id]);

  const handleSave = (dados: IFormData) => {
    formValidationSchema
      .validate(dados, { abortEarly: false })
      .then((dadosValidados) => {
        setIsLoading(true);

        if (id === "nova") {
          CarrosServices.create(dadosValidados).then((result) => {
            setIsLoading(false);

            if (result instanceof Error) {
              alert(result.message);
            } else {
              if (isSaveAndClose()) {
                navigate("/carros");
              } else {
                navigate(`/carros/detalhe/${result}`);
              }
            }
          });
        } else {
          CarrosServices.updateById(Number(id), {
            ...dadosValidados,
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
    if (/*confirm*/ "Realmente deseja apagar?") {
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
                  name="nameCompleto"
                  disabled={isLoading}
                  label="name completo"
                  onChange={(e) => setname(e.target.value)}
                />
              </Grid>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  name="email"
                  label="Email"
                  disabled={isLoading}
                />
              </Grid>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                {/* <AutoCompleteCidade isExternalLoading={isLoading} /> */}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </VForm>
    </LayoutBaseDePagina>
  );
};
