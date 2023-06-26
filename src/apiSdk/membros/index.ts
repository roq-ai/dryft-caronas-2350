import axios from 'axios';
import queryString from 'query-string';
import { MembroInterface, MembroGetQueryInterface } from 'interfaces/membro';
import { GetQueryInterface } from '../../interfaces';

export const getMembros = async (query?: MembroGetQueryInterface) => {
  const response = await axios.get(`/api/membros${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createMembro = async (membro: MembroInterface) => {
  const response = await axios.post('/api/membros', membro);
  return response.data;
};

export const updateMembroById = async (id: string, membro: MembroInterface) => {
  const response = await axios.put(`/api/membros/${id}`, membro);
  return response.data;
};

export const getMembroById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/membros/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteMembroById = async (id: string) => {
  const response = await axios.delete(`/api/membros/${id}`);
  return response.data;
};
