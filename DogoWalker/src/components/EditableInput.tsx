import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";

interface EditableFieldProps {
  id: string;
  label: string;
  initialValue: any;
  onSave: (value: any) => Promise<void>;
  placeholder?: string;
}

const EditableField: React.FC<EditableFieldProps> = ({
  id,
  label,
  initialValue,
  onSave,
  placeholder = "Click to edit",
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(initialValue);
  const [oldValue, setOldValue] = useState(initialValue);
  console.log("EditableField component rendered with id: ", id, " rendered");

  const handleSave = async () => {
    if (currentValue === oldValue) {
      setIsEditing(false);
      return;
    }

    try {
      await onSave(currentValue);
      console.log("currentValue", currentValue);
    } catch (err) {
      console.error("Editable field with id: ", id, "error: ", err);
      // Reset to original value on error
      setCurrentValue(oldValue);
      setIsEditing(false);
      throw err;
    } finally {
      setOldValue(currentValue);
      setIsEditing(false);
    }
  };

  return (
    <div
      onClick={() => setIsEditing(true)}
      className="w-full md: flex flex-col p-2 inset-shadow-background-primary-light border-1 transition-all duration-300 cursor-pointer
      hover:inset-shadow-xs hover:bg-background-primary hover:text-black
      focus:bg-white focus:text-black
      active:bg-white active:text-black"
    >
      <label htmlFor={id} className="text-sm font-medium mb-1 cursor-pointer">
        {label}
      </label>

      {isEditing ? (
        <input
          id={id}
          type="text"
          value={currentValue}
          onChange={e => setCurrentValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={e => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") {
              setIsEditing(false);
              setCurrentValue(oldValue);
            }
          }}
          className=" text-inherit  px-2 py-1 border-b
           bg-background-primary  border-gray-300 
           hover:bg-gray-500/40
           focus:outline-none focus:border-primary"
          autoFocus
        />
      ) : (
        <div
          className="text-inherit flex inset-shadow-black/30
        hover:bg-gray-100/50 hover:inset-shadow-2xs  "
        >
          <p
            id={id}
            className="w-full   px-2 py-1 overflow-hidden text-inherit rounded border-b-1 border-transparent "
          >
            {currentValue || placeholder}
          </p>
          <EditIcon className="inline mx-1 mt-1" />
        </div>
      )}
    </div>
  );
};
export default EditableField;
