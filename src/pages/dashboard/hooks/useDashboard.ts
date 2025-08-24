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
    addUser,
    updateUser,
    deleteUser,
  } = useUsers();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const loadUsers = useCallback(
    async (page: number) => {
      setLoading(true);
      try {
        const response = await usersService.getUsers(page);
        setUsers(response.data.map(({ ...user }) => user));
        setTotalPages(response.total_pages);
      } catch (error) {
        console.error("Failed to load users:", error);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setUsers, setTotalPages]
  );

  useEffect(() => {
    void loadUsers(currentPage);
  }, [currentPage, loadUsers]);

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleCreateUser = async (userData: Omit<IUser, "id">) => {
    console.log("handleCreateUser")
    setFormLoading(true);
    try {
      await usersService.createUser(userData);
      addUser(userData);
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
    } catch (error) {
      console.error("Failed to update user:", error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await usersService.deleteUser(id); // simulado
      deleteUser(id);
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
