import type React from "react";
import { createContext, useContext, useState } from "react";
import type { IUser } from "../interfaces/IUser";

interface UsersContextType {
  users: IUser[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  loading: boolean;
  setUsers: (users: IUser[]) => void;
  setCurrentPage: (page: number) => void;
  setTotalPages: (pages: number) => void;
  setLoading: (loading: boolean) => void;
  addUser: (user: Omit<IUser, "id">) => void;
  updateUser: (id: number, user: Partial<IUser>) => void;
  deleteUser: (id: number) => void;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error("useUsers must be used within a UsersProvider");
  }
  return context;
};

interface UsersProviderProps {
  children: React.ReactNode;
}

export const UsersProvider: React.FC<UsersProviderProps> = ({ children }) => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const pageSize = 6;

  const addUser = (userData: Omit<IUser, "id">) => {
    console.log("addUser")
    setLoading(true);
    const newUser: IUser = {
      ...userData,
      id: Math.max(...users.map((u) => u.id), 0) + 1,
    };
    setUsers((prev) => [newUser, ...prev]);
    setLoading(false);
  };

  const updateUser = (id: number, userData: Partial<IUser>) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === id ? { ...user, ...userData } : user))
    );
  };

  const deleteUser = (id: number) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  return (
    <UsersContext.Provider
      value={{
        users,
        currentPage,
        totalPages,
        pageSize,
        loading,
        setUsers,
        setCurrentPage,
        setTotalPages,
        setLoading,
        addUser,
        updateUser,
        deleteUser,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};
