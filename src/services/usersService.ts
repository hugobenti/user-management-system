import axios, { type AxiosInstance } from "axios";
import { useSession } from "../context/SessionContext";

export interface ApiUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export interface UsersResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: ApiUser[];
}

const token = localStorage.getItem("authToken");

const api: AxiosInstance = axios.create({
  baseURL: "https://reqres.in/api",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": token,
  },
  timeout: 15_000,
});

class UsersService {
  async getUsers(page = 1): Promise<UsersResponse> {
    const { data } = await api.get<UsersResponse>(`/users`, {
      params: { page, per_page: 6 },
    });
    return data;
  }

  async getUser(id: number): Promise<ApiUser> {
    const { data } = await api.get<{ data: ApiUser }>(`/users/${id}`);
    return data.data;
  }

  async createUser(userData: Omit<ApiUser, "id">): Promise<ApiUser> {
    const { data } = await api.post<{ id?: number }>(`/users`, userData);
    return {
      ...userData,
      id: data.id ?? Math.floor(Math.random() * 10_000),
    };
  }

  async updateUser(id: number, userData: Partial<ApiUser>): Promise<ApiUser> {
    const { data } = await api.put<Partial<ApiUser>>(`/users/${id}`, userData);
    return {
      id,
      email: "",
      first_name: "",
      last_name: "",
      ...data,
    } as ApiUser;
  }

  async deleteUser(id: number): Promise<void> {
    await api.delete(`/users/${id}`);
  }
}

export const usersService = new UsersService();
