import { Environment } from "../../environment";
import { Api } from "../api/axios-config";

export interface IListagemCarros {
  id: number;
  //   email: string;
  //   cidadeId: number;
  //   nomeCompleto: string;
}

export interface IDetalheCarro {
  id: number;
  //   email: string;
  //   cidadeId: number;
  //   nomeCompleto: string;
}

type TCarrosComTotalCount = {
  data: IListagemCarros[];
  totalCount: number;
};

const getAll = async (
  page = 1,
  filter = ""
): Promise<TCarrosComTotalCount | Error> => {
  try {
    const urlRelativa = `/carros?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nomeCompleto_like=${filter}`;

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

const getById = async (id: number): Promise<IDetalheCarro | Error> => {
  try {
    const { data } = await Api.get(`/carros/${id}`);

    if (data) {
      return data;
    }

    return new Error("Erro ao consultar o registro.");
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Erro ao consultar o registro."
    );
  }
};

const create = async (
  dados: Omit<IDetalheCarro, "id">
): Promise<number | Error> => {
  try {
    const { data } = await Api.post<IDetalheCarro>("/carros", dados);

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
    await Api.put(`/carros/${id}`, dados);
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Erro ao atualizar o registro."
    );
  }
};

const deleteById = async (id: number): Promise<void | Error> => {
  try {
    await Api.delete(`/carros/${id}`);
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
  getById,
  updateById,
  deleteById,
};
