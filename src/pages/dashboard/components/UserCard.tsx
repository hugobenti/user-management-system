import type React from "react";
import Button from "../../../components/Button";
import type { IUser } from "../../../interfaces/IUser";

interface UserCardProps {
  user: IUser;
  onEdit: (user: IUser) => void;
  onDelete: (id: number) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onEdit, onDelete }) => {
  return (
    <div
      className="bg-card border border-border rounded-lg p-6 space-y-4"
      data-testid={`user-card-${user.id}`}
    >
      <div className="flex items-center space-x-4">
        {user.avatar && (
          <img
            src={
              user.avatar ||
              `/placeholder.svg?height=64&width=64&query=user avatar for ${user.first_name}`
            }
            alt={`${user.first_name} ${user.last_name}`}
            className="w-16 h-16 rounded-full object-cover"
          />
        )}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-card-foreground">
            {user.first_name} {user.last_name}
          </h3>
          <p
            className="text-muted-foreground"
            data-testid={`user-${user.id}-email`}
          >
            {user.email}
          </p>
          <p className="text-sm text-muted-foreground">ID: {user.id}</p>
        </div>
      </div>

      <div className="flex space-x-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onEdit(user)}
          className="flex-1"
        >
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(user.id)}
          className="flex-1"
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default UserCard;
