import { useEffect, useState, useCallback } from "react";
import { useUsers } from "../../../context/UsersContext";
import { useSession } from "../../../context/SessionContext";
import { usersService } from "../../../services/usersService";
import type { IUser } from "../../../interfaces/IUser";

export function useDashboard() {
  const { user: currentUser, logout } = useSession();
  const {
    users,
    currentPage,
    totalPages,
    loading,
    setUsers,
    setCurrentPage,
    setTotalPages,
    setLoading,
    updateUser,
    deleteUser,
  } = useUsers();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [usersCache, setUsersCache] = useState<Record<number, IUser[]>>({});
  // Armazena o total de usuários da última resposta da API
  const [apiTotal, setApiTotal] = useState<number>(0);

  const USERS_PER_PAGE = 6; 

  const loadUsers = useCallback(
    async (page: number) => {
      if (usersCache[page]) {
        setUsers(usersCache[page]);
        return;
      }
      setLoading(true);
      try {
        const response = await usersService.getUsers(page);
        setUsers(response.data);
        setUsersCache((prev) => ({ ...prev, [page]: response.data }));
        setTotalPages(response.total_pages);
        setApiTotal(response.total); // Salva o total real da API
      } catch (error) {
        console.error("Failed to load users:", error);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setUsers, setTotalPages, usersCache]
  );

  useEffect(() => {
    void loadUsers(currentPage);
  }, [currentPage, loadUsers]);

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleCreateUser = async (userData: Omit<IUser, "id">) => {
    setFormLoading(true);
    try {
      const newId = apiTotal + 1;
      const createdUser = { ...userData, id: newId };
      let updatedUsers = [createdUser, ...users];
      let updatedCache = { ...usersCache };
      const newTotal = apiTotal + 1;
      let newTotalPages = Math.ceil(newTotal / USERS_PER_PAGE);
      if (updatedUsers.length > USERS_PER_PAGE) {
        const overflowUser = updatedUsers.pop();
        const nextPage = totalPages + 1; 
        updatedCache[nextPage] = updatedCache[nextPage]
          ? [overflowUser!, ...updatedCache[nextPage]]
          : [overflowUser!];
        newTotalPages = nextPage;
      }
      updatedCache[currentPage] = updatedUsers;
      setUsers(updatedUsers);
      setUsersCache(updatedCache);
      setTotalPages(newTotalPages);
      setApiTotal(newTotal);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Failed to create user:", error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditUser = (user: IUser) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async (userData: IUser) => {
    if (!editingUser) return;
    setFormLoading(true);
    try {
      await usersService.updateUser(editingUser.id, userData);
      updateUser(editingUser.id, userData);
      setIsEditModalOpen(false);
      setEditingUser(null);
      setUsersCache({});
    } catch (error) {
      console.error("Failed to update user:", error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await usersService.deleteUser(id);
      deleteUser(id);
      setUsersCache({});
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const handleLogout = () => logout();

  return {
    // data
    currentUser,
    users,
    currentPage,
    totalPages,
    loading,
    editingUser,
    formLoading,
    // ui state
    isCreateModalOpen,
    isEditModalOpen,
    isSettingsModalOpen,
    // actions
    setIsCreateModalOpen,
    setIsEditModalOpen,
    setIsSettingsModalOpen,
    setEditingUser,
    handlePageChange,
    handleCreateUser,
    handleEditUser,
    handleUpdateUser,
    handleDeleteUser,
    handleLogout,
  };
}

export type UseDashboardReturn = ReturnType<typeof useDashboard>;
