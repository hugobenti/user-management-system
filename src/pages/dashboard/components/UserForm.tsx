import type React from "react";
import { useEffect } from "react";
import { useFormValidation } from "../../../hooks/useFormValidation";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import type { IUser } from "../../../interfaces/IUser";

interface UserFormProps {
  user?: IUser | null;
  onSubmit: (userData: Omit<IUser, "id"> & { id: number }) => void;
  onCancel: () => void;
  loading?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({
  user,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const { values, errors, isValid, register, setValue, reset } =
    useFormValidation({
      first_name: [{ required: true }],
      last_name: [{ required: true }],
      email: [{ required: true, email: true }],
    });

  useEffect(() => {
    if (user) {
      setValue("first_name", user.first_name);
      setValue("last_name", user.last_name);
      setValue("email", user.email);
    } else {
      reset();
    }
  }, [user, setValue, reset]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    const userData = {
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      id: user?.id ?? -1,
    };

    onSubmit(userData);
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          id="first_name"
          data-testid="first-name-input"
          label="First Name"
          type="text"
          error={errors.first_name}
          {...register("first_name", [{ required: true }])}
        />
        <Input
          id="last_name"
          data-testid="last-name-input"
          label="Last Name"
          type="text"
          error={errors.last_name}
          {...register("last_name", [{ required: true }])}
        />
      </div>

      <Input
        id="email"
        data-testid="user-email-input"
        label="Email Address"
        type="email"
        error={errors.email}
        {...register("email", [{ required: true, email: true }])}
      />
      <div className="flex space-x-3 pt-4">
        <Button
          type="submit"
          data-testid="submit-user-btn"
          loading={loading}
          disabled={!isValid}
          className="flex-1"
        >
          {user ? "Update User" : "Create User"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
