import React from "react";
import { useForm } from "react-hook-form";
import "./UserForm.css"; // Import the CSS file

interface UserFormProps {
  onSubmit: (data: any) => void;
  defaultValues?: any;
  onClose: () => void; // Function to close the modal
}

const UserForm: React.FC<UserFormProps> = ({ onSubmit, defaultValues, onClose }) => {
  const { register, handleSubmit } = useForm({ defaultValues });

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <form onSubmit={handleSubmit(onSubmit)} className="user-form">
          <input
            {...register("name")}
            placeholder="Name"
            required
          />
          <input
            {...register("email")}
            placeholder="Email"
            required
            type="email"
          />
          <select {...register("role")}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit">Save</button>
          <button
            type="button"
            onClick={onClose}
            style={{
              backgroundColor: "#ccc",
              color: "#333",
              marginTop: "10px",
            }}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
