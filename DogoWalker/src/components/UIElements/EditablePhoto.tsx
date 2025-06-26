import React, { useState, useEffect } from "react";
import AddAPhoto from "@mui/icons-material/AddAPhoto";
import { useAuth } from "../AuthContext";
import { SupportedPhotoFileFormat } from "../../types/fileTypes";

interface EditablePhotoProps {
  id: string;
  onSave: (value: File | undefined) => Promise<void>;
  containerClassName?: string;
  inputClassName?: string;
  placeholder?: string;
  photoClassName?: string;
  buttonCalssName?: string;
}

export const EditablePhoto: React.FC<EditablePhotoProps> = ({
  id,
  onSave,
  containerClassName = "flex flex-col justify-center aspect-square place-items-center ",
  inputClassName = "profile-form-input mb-2",
  photoClassName = "w-full h-full object-cover rounded-full cursor-pointer hover:bg-gray-100 p-1 rounded border-b border-transparent",
  buttonCalssName = "  ",
}) => {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [photoURL, setPhotoURL] = useState(currentUser?.firebaseUser.photoURL);
  const [currentFile, setCurrentFile] = useState<File>();
  const initialPhotoURL = photoURL;

  const handleSave = async () => {
    try {
      await onSave(currentFile);
      setIsEditing(false);
    } catch (error) {
      console.error("Editable photo with id:", id, "error:", error);
      // Reset to original value on error
      setPhotoURL(initialPhotoURL);
      setIsEditing(false);
    }
  };

  const handleFile = e => {
    const file = e.target.files[0];
    if (!file) return;
    setCurrentFile(file);
    let fileName: string = `${currentUser?.firebaseUser.uid}`;

    function convertFileTypeToExtension(fileType): string {
      // Regex to extract part after 'image/'
      const match = fileType.match(/^image\/(\w+)$/);
      if (match && SupportedPhotoFileFormat.includes(match[1])) {
        return "." + match[1].toLowerCase();
      }
      return "";
    }

    const fileExtension = convertFileTypeToExtension(file.type);
    if (!fileExtension) {
      alert("Unsupported image type. Please add file with .jpeg, .png. .gif or .jpg type");
      setCurrentFile(undefined);
      return;
    }

    fileName = fileName + fileExtension;

    const renamedFile = new File([file], fileName, {
      type: file.type,
    });

    setCurrentFile(renamedFile);
    if (currentFile) console.log("file added to sender limbo: ", currentFile.type);
  };

  return (
    <div id={id} className={containerClassName}>
      {isEditing ? (
        <form>
          <label htmlFor={`${id}-input`} className="text-sm font-medium mb-1 w-full">
            {`Chose new photo file`}
          </label>
          <input
            id={`${id}-input`}
            type="file"
            accept="image/png,image/jpeg,image/gif,image/jpg"
            onChange={handleFile}
            className={inputClassName}
            required
          />
          <button
            id={`${id}-button`}
            type="submit"
            onClick={handleSave}
            className="profile-form-input"
          >
            Send new photo
          </button>
        </form>
      ) : (
        currentUser && (
          <div
            onClick={() => setIsEditing(true)}
            className="aspect-square w-full  rounded-full bg-gray-300 flex items-center justify-center mb-5 "
          >
            {currentUser.firebaseUser.photoURL? (
              <img
              id={`${id}-image`}
              src={currentUser.firebaseUser.photoURL || undefined}
              alt={`${currentUser.firebaseUser.displayName || "User"}'s profile photo`}
              className={photoClassName}
            />
            ):(
              <AddAPhoto></AddAPhoto>
            )}
            
          </div>
        )
      )}
    </div>
  );
};
