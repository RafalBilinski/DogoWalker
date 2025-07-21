import React, { useState } from "react";

interface EditableFieldProps {
  id: string;
  label?: string;
  initialValue: any;
  onSave: (value: any) => Promise<void>;
  containerClassName?: string;
  inputClassName?: string;
  placeholder?: string;
  textClassName?: string;
}

const EditableField: React.FC<EditableFieldProps> = ({
  id,
  label,
  initialValue,
  onSave,
  containerClassName = "mb-4 profile-form-input active:bg-white ",
  inputClassName = "block p-1 bg-background-primary-light border-b border-gray-300 focus:outline-none focus:border-primary w-full ",
  placeholder = "Click to edit",
  textClassName = "block cursor-pointer hover:bg-gray-100 p-1 rounded border-b border-transparent w-full py-1",
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(initialValue);

  const handleSave = async () => {
    try {
      await onSave(currentValue);
      setIsEditing(false);
    } catch (err) {
      console.error("Editable field with id: ", id, "error: ", err);
      // Reset to original value on error
      setCurrentValue(initialValue);
      setIsEditing(false);
      throw err;
    }
  };
  let currentContainerClassName = containerClassName;
  let currentInputClassName = inputClassName;
  const initialLabelClassName = "text-sm font-medium mb-1";
  let currentLabelClassName = initialLabelClassName;
  if (isEditing) {
    currentContainerClassName = "mb-4 profile-form-input bg-white ";
    currentLabelClassName = " text-sm font-medium mb-1 text-secondary";
  } else {
    currentContainerClassName = containerClassName;
  }
  containerClassName = isEditing ? "mb-4 profile-form-input bg-white " : containerClassName;

  return (
    <div className={currentContainerClassName}>
      {label && (
        <label htmlFor={id} className={currentLabelClassName}>
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
          {currentValue || placeholder}
        </p>
      )}
    </div>
  );
};
export default EditableField;
