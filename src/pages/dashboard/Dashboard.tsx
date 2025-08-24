import type React from "react";
import UserCard from "./components/UserCard";
import UserForm from "./components/UserForm";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import type { IUser } from "../../interfaces/IUser";
import Pagination from "../../components/Pagination";
import { useDashboard } from "./hooks/useDashboard";

const Dashboard: React.FC = () => {
  const {
    currentUser,
    users,
    currentPage,
    totalPages,
    loading,
    editingUser,
    formLoading,
    isCreateModalOpen,
    isEditModalOpen,
    setIsCreateModalOpen,
    setIsEditModalOpen,
    setEditingUser,
    handlePageChange,
    handleCreateUser,
    handleEditUser,
    handleUpdateUser,
    handleDeleteUser,
    handleLogout,
  } = useDashboard();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-card-foreground">
                User Management Dashboard
              </h1>
              <p className="text-muted-foreground">
                Welcome back, {currentUser?.first_name}!
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="secondary" onClick={handleLogout}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Actions */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Users</h2>
              <p className="text-muted-foreground">
                Manage your users (6 per page)
              </p>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              Add New User
            </Button>
          </div>

          {/* Users Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-muted-foreground">Loading users...</div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((user: IUser, index) => {
                  if (index < 6)
                    return (
                      <UserCard
                        key={user.id}
                        user={user}
                        onEdit={handleEditUser}
                        onDelete={handleDeleteUser}
                      />
                    );
                })}
              </div>

              {users.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No users found.</p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center pt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}

          {/* Info Card */}
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> Changes are simulated client-side only.
              Refresh the page to reset to original data from the server.
            </p>
          </div>
        </div>
      </main>

      {/* Create User Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New User"
      >
        <UserForm
          onSubmit={handleCreateUser}
          onCancel={() => setIsCreateModalOpen(false)}
          loading={formLoading}
        />
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit User"
      >
        <UserForm
          user={editingUser}
          onSubmit={(data) => handleUpdateUser(data)}
          onCancel={() => {
            setIsEditModalOpen(false);
            setEditingUser(null);
          }}
          loading={formLoading}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;
