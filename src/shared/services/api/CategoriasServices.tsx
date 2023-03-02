import { Environment } from "../../environment";
import { Api } from "../api/axios-config";

export interface IListagemCategoria {
  id: number;
  nome: string;
}

export interface IDetalheCategoria {
  id: number;
  nome: string;
}

type TCategoriasComTotalCount = {
  data: IListagemCategoria[];
  totalCount: number;
};

const getAll = async (
  page = 1,
  filter = "",
  id = ""
): Promise<TCategoriasComTotalCount | Error> => {
  try {
    const urlRelativa = `/categorias?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}&id_like=${id}`;

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

const getById = async (id: number): Promise<IDetalheCategoria | Error> => {
  try {
    const { data } = await Api.get(`/categorias/${id}`);

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
  dados: Omit<IDetalheCategoria, "id">
): Promise<number | Error> => {
  try {
    const { data } = await Api.post<IDetalheCategoria>("/Categorias", dados);

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
    await Api.put(`/categorias/${id}`, dados);
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Erro ao atualizar o registro."
    );
  }
};

const deleteById = async (id: number): Promise<void | Error> => {
  try {
    await Api.delete(`/categorias/${id}`);
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
  getById,
  updateById,
  deleteById,
};
