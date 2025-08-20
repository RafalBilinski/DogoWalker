import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";

interface EditableFieldProps {
  id: string;
  label: string;
  initialValue: any;
  onSave: (value: any) => Promise<void>;
  placeholder?: string;
  addedClassName?: string;
  charLimit?: number;
}

const EditableField: React.FC<EditableFieldProps> = ({
  id,
  label,
  initialValue="",
  onSave,
  placeholder = "Click to edit",
  addedClassName,
  charLimit = 500,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(initialValue);
  const [oldValue, setOldValue] = useState(initialValue);
  const [charCounter, setCharCounter] = useState(initialValue.length);
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
      className={`flex relative flex-col p-2 inset-shadow-background-primary-light border-1 transition-all duration-300 cursor-pointer
      hover:inset-shadow-xs hover:bg-background-primary hover:text-black
      focus:bg-white focus:text-black
      active:bg-white active:text-black ${addedClassName || ""}`}
    >
      <label htmlFor={id} className="text-sm font-medium pb-1 cursor-pointer">
        {label}
      </label>
      <p className="absolute right-2 ">{charCounter}/{charLimit}</p>

      {isEditing ? (
        <div className="">
          
          <textarea
            id={`${id}-editable-element`}
            rows={6}
            placeholder={placeholder}          
            value={currentValue}
            onChange={e => {
              setCharCounter(e.target.value.length);
              setCurrentValue(e.target.value)
            }}
            onBlur={handleSave}
            onKeyDown={e => {
              if (e.key === "Enter" && e.shiftKey) {
                e.preventDefault(); // Prevent default form submission
                  // Insert a new line at cursor position
                const cursorPosition = e.currentTarget.selectionStart;
                const textBeforeCursor = currentValue.substring(0, cursorPosition);
                const textAfterCursor = currentValue.substring(cursorPosition);
                  
                setCurrentValue(textBeforeCursor + "\n" + textAfterCursor);
                setCharCounter(charCounter + 1);  
                  // Move cursor after the new line (needs setTimeout to work properly)
                setTimeout(() => {
                  e.currentTarget.selectionStart = cursorPosition + 1;
                  e.currentTarget.selectionEnd = cursorPosition + 1;
                }, 0);
                  
                return;
              }

              if (e.key === "Escape") {
                setIsEditing(false);
                setCurrentValue(oldValue);
              }

              if (e.key === "Enter") handleSave();
            }}
            className="w-full text-inherit text-wrap px-2 py-1 border-b h-[160px]
            inline-shadow-black/30 inline-shadow-[2]
            bg-background-primary  border-gray-300 
            hover:bg-gray-500/40
            focus:outline-none focus:border-primary"
            autoFocus
            maxLength={charLimit}
          />
        </div>
      ) : (
        <div
          className="w-full text-inherit flex inset-shadow-black/30 outline outline-gray-100/20
        hover:bg-gray-100/50 hover:inset-shadow-2xs  "
        >
          <p
            id={`${id}-shown-element`}
            className="w-full h-[160px] px-2 py-1 overflow-hidden text-inherit text-wrap rounded border-b border-transparent whitespace-pre-wrap"
          >
            {currentValue || placeholder}
          </p>
          <EditIcon className="inline mx-1  my-auto  h-full" />
        </div>
      )}
    </div>
  );
};
export default EditableField;
