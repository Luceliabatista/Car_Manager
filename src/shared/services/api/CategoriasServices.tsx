import { Environment } from "../../environment";
import { Api } from "../api/axios-config";

export interface IDetalheCategoria {
  id: number;
  allowQuantityVariation?: boolean;
  description: string;
  hasShipping?: boolean;
  limitRequest: number;
  limitRequestsPerMonth?: boolean;
  name: string;
  validateClient?: boolean;
  valueVariation: number;
  allowValueVariation?: boolean;
}

type TCategoriasComTotalCount = {
  data: IDetalheCategoria[];
  totalCount: number;
};

const getAll = async (): Promise<TCategoriasComTotalCount | Error> => {
  try {
    const urlRelativa = `/ProductCategory`;

    const { data, headers } = await Api.get(urlRelativa);

    if (data) {
      return {
        data,
        totalCount: Number(
          headers["x-total-count"] || Environment.LIMITE_DE_LINHAS
        ),
      };
    }

    return new Error("Erro ao listar os registros.");
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Erro ao listar os registros."
    );
  }
};

const create = async (
  dados: Omit<IDetalheCategoria, "id">
): Promise<number | Error> => {
  try {
    const { data } = await Api.post<IDetalheCategoria>(
      "/ProductCategory",
      dados
    );

    if (data) {
      return data.id;
    }

    return new Error("Erro ao criar o registro.");
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Erro ao criar o registro."
    );
  }
};

const updateById = async (
  id: number,
  dados: IDetalheCategoria
): Promise<void | Error> => {
  try {
    await Api.put(`/ProductCategory/${id}`, dados);
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Erro ao atualizar o registro."
    );
  }
};

const deleteById = async (id: number): Promise<void | Error> => {
  try {
    await Api.delete(`/ProductCategory/${id}`);
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Erro ao apagar o registro."
    );
  }
};

export const CategoriasService = {
  getAll,
  create,
  updateById,
  deleteById,
};
