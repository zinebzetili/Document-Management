import React from "react";
import { useForm } from "react-hook-form";

interface UserFormProps {
  onSubmit: (data: any) => void;
  defaultValues?: any;
}

const UserForm: React.FC<UserFormProps> = ({ onSubmit, defaultValues }) => {
  const { register, handleSubmit } = useForm({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name")} placeholder="Name" required />
      <input {...register("email")} placeholder="Email" required type="email" />
      <select {...register("role")}>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit">Save</button>
    </form>
  );
};

export default UserForm;
