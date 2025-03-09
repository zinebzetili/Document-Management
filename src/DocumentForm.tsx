import React from "react";
import { useForm } from "react-hook-form";
import "./DocumentForm.css"; // Import the CSS file

interface DocumentFormProps {
  onSubmit: (data: any) => void;
  defaultValues?: any;
  onClose: () => void; // Function to close the modal
}

const DocumentForm: React.FC<DocumentFormProps> = ({ onSubmit, defaultValues, onClose }) => {
  const { register, handleSubmit, setValue } = useForm({ defaultValues });

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("file", file); // Set the file in the form data
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <form onSubmit={handleSubmit(onSubmit)} className="document-form">
          <input
            {...register("title", { required: true })}
            placeholder="Title"
            required
          />
          <input
            {...register("author", { required: true })}
            placeholder="Author"
            required
          />
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
            required={!defaultValues} // Required only for new documents
          />
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

export default DocumentForm;