import { Environment } from "../../environment";
import { Api } from "../api/axios-config";
import { IDetalheCategoria } from "./CategoriasServices";

export interface IDetalheCarro {
  id: number;
  categoryId: number;
  description: string;
  icmsTax: number;
  ipiTax: number;
  isAvailable?: boolean;
  isWarehouse?: boolean;
  minPuchaseQuantity: number;
  name: string;
  productCategory: {
    name: string;
  };
}

type TCarrosComTotalCount = {
  data: IDetalheCarro[];
  totalCount: number;
};

const getAll = async (): Promise<TCarrosComTotalCount | Error> => {
  try {
    const urlRelativa = `/Product`;

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
  dados: Omit<IDetalheCarro, "id">
): Promise<number | Error> => {
  try {
    const { data } = await Api.post<IDetalheCarro>("/Product", dados);

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
  dados: IDetalheCarro
): Promise<void | Error> => {
  try {
    await Api.put(`/Product/${id}`, dados);
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Erro ao atualizar o registro."
    );
  }
};

const deleteById = async (id: number): Promise<void | Error> => {
  try {
    await Api.delete(`/Product/${id}`);
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Erro ao apagar o registro."
    );
  }
};

export const CarrosServices = {
  getAll,
  create,
  updateById,
  deleteById,
};
