import React, { useState, useEffect } from "react";
import AddAPhoto from "@mui/icons-material/AddAPhoto";
import { useAuth } from "../AuthContext";
import { SupportedPhotoFileFormat } from "../../types/fileTypes";

interface EditablePhotoProps {
  id: string;
  onSave: (value: File | undefined) => Promise<void>;
  photoURLSource: string | null | undefined;
  containerClassName?: string;
  inputClassName?: string;
  placeholder?: string;
  photoClassName?: string;
  buttonCalssName?: string;
}

const EditablePhoto: React.FC<EditablePhotoProps> = ({
  id,
  onSave,
  photoURLSource,
  containerClassName = "flex flex-col justify-center aspect-square place-items-center ",
  inputClassName = "profile-form-input my-2",
  photoClassName = "w-full aspect-square object-cover rounded-full cursor-pointer hover:bg-gray-100 p-1 rounded border-b border-transparent",
  buttonCalssName = "profile-form-input",
}) => {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [photoURL, setPhotoURL] = useState(photoURLSource);
  const [currentFile, setCurrentFile] = useState<File>();
  const [orginFileName, setOrginFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const initialPhotoURL = photoURL;

  const handleSave = async () => {
    if (currentFile) {
      setIsUploading(true);
      try {
        await onSave(currentFile);
        setIsEditing(false);
      } catch (error) {
        console.error("Editable photo with id:", id, "error:", error);
        // Reset to original value on error
        setPhotoURL(initialPhotoURL);
        setIsEditing(false);
      } finally {
        setIsUploading(false);
      }
    } else {
      alert("No new file has been selected.");
    }
  };

  const handleAbort = () => {
    setIsEditing(false);
  };

  const handleFile = e => {
    const file = e.target.files[0];
    if (!file) return;
    setCurrentFile(file);
    setOrginFileName(file.name);
    let fileName: string = `userProfile`;

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
        <>
          {isUploading ? (
            <div className="flex flex-col items-center justify-center h-screen space-y-4">
              <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-l-2 border-b-1 border-emerald-300"></div>
              <p className="text-emerald-300">Uploading...</p>
            </div>
          ) : (
            <>
              <label
                htmlFor={`${id}-input`}
                className={
                  currentFile
                    ? "profile-form-input text-center font-bold border-none"
                    : "profile-form-input text-center"
                }
              >
                {currentFile ? orginFileName : "Chose new photo"}
              </label>
              <input
                id={`${id}-input`}
                type="file"
                accept="image/png,image/jpeg,image/gif,image/jpg"
                onChange={handleFile}
                className="hidden"
              />
              <div className="grid grid-cols-2 gap-0.5 w-full">
                <button id={`${id}-button`} onClick={handleSave} className={buttonCalssName}>
                  Send
                </button>
                <button id={`${id}-abort-button`} onClick={handleAbort} className={buttonCalssName}>
                  Abort
                </button>
              </div>
            </>
          )}
        </>
      ) : (
        currentUser && (
          <div
            onClick={() => setIsEditing(true)}
            className="aspect-square w-full  rounded-full bg-gray-300 flex items-center justify-center mb-5 "
          >
            {currentUser.firebaseUser.photoURL ? (
              <>
                {!isImageLoaded && (
                  <div className="animate-spin rounded-full w-full aspect-square border-t-4 border-l-2 border-b-1 border-b-amber-800"></div>
                )}
                <img
                  id={`${id}-image`}
                  src={currentUser.firebaseUser.photoURL || undefined}
                  alt={`${currentUser.firebaseUser.displayName || "User"}'s profile photo`}
                  className={photoClassName}
                  onLoad={() => setIsImageLoaded(true)}
                  onError={() => setIsImageLoaded(false)}
                  style={{ display: isImageLoaded ? "block" : "none" }}
                />
              </>
            ) : (
              <AddAPhoto></AddAPhoto>
            )}
          </div>
        )
      )}
    </div>
  );
};
export default EditablePhoto;
