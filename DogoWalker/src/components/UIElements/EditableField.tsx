import React, { useState } from "react";

interface EditableFieldProps {
  id: string;
  label?: string;
  initialValue: string;
  onSave: (value: string) => Promise<void>;
  containerClassName?: string;
  inputClassName?: string;
  placeholder?: string;
  textClassName?: string;
}

export const EditableField: React.FC<EditableFieldProps> = ({
  id,
  label,
  initialValue,
  onSave,
  containerClassName = "mb-4 profile-form-input active:bg-white ",
  inputClassName = "block p-1 bg-background-primary-light border-b border-gray-300 focus:outline-none focus:border-primary w-full ",
  placeholder = "",
  textClassName = "cursor-pointer hover:bg-gray-100 p-1  rounded border-b border-transparent",
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(initialValue);

  const handleSave = async () => {
    try {
      await onSave(currentValue);
      setIsEditing(false);
    } catch (error) {
      console.error("Editable field with id: ",id ,"error: ", error);
      // Reset to original value on error
      setCurrentValue(initialValue);
      setIsEditing(false);
    }
  };

  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium mb-1">
          {label}
        </label>
      )}
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
              setCurrentValue(initialValue);
            }
          }}
          className={inputClassName}
          autoFocus
        />
      ) : (
        <p id={id} onClick={() => setIsEditing(true)} className={textClassName}>
          {initialValue || placeholder || "Click to edit"}
        </p>
      )}
    </div>
  );
};
