import React, { useState, useEffect } from "react";
import AddAPhoto from "@mui/icons-material/AddAPhoto";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useAuth } from "../services/AuthFeatures/AuthContext";
import { SupportedPhotoFileFormat } from "../types/fileTypes";
import showToast from "../utils/showToast";
import convertImage from "../utils/convertImage";


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
  containerClassName = "flex flex-col justify-center w-full h-full place-items-center w-max ",
  photoClassName = "w-full aspect-square object-cover  cursor-pointer hover:bg-gray-100 p-1 rounded border-b border-transparent",
  buttonCalssName = "profile-form-input",
}) => {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [photoURL, setPhotoURL] = useState(photoURLSource);
  const [currentFile, setCurrentFile] = useState<File>();
  const [orginFileName, setOrginFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
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
      showToast("No new file has been selected :(", "error");
    }
  };

  const handleAbort = () => {
    setIsEditing(false);
    setCurrentFile(undefined);
    if (previewURL) {                   // Clean up the preview URL
      URL.revokeObjectURL(previewURL);
      setPreviewURL(null);
    }
  };

  const handleOnMouseEnter = () => {
    if (!isToastVisible) {
      showToast("Click Your photo to change it! :D", "info");
      setIsToastVisible(true);
      const bolckToast = setTimeout(() => {
        setIsToastVisible(false);
        clearTimeout(bolckToast);
      }, 4500);
    }
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create preview URL immediately
    let objectURL ;
    
    try{
      const optimizedBlob = await convertImage(file, 500, 500, 0.8); // Smaller size for preview
      URL.revokeObjectURL(objectURL); // Clean up the original URL
      objectURL = URL.createObjectURL(optimizedBlob);
      setPreviewURL(objectURL);
      console.log("Preview converted successfully");
    }catch(err){
      console.error("Error optimizing preview:", err);
      objectURL = URL.createObjectURL(file);
      setPreviewURL(objectURL);
    }

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
      showToast(
        "Unsupported image type. Please add file with .jpeg, .png. .gif or .jpg type",
        "error"
      );
      setCurrentFile(undefined);
      setPreviewURL(null); // Clear preview on error
      URL.revokeObjectURL(objectURL); // Clean up the URL
      return;
    }

    fileName = fileName + fileExtension;

    const renamedFile = new File([file], fileName, {
      type: file.type,
    });

    setCurrentFile(renamedFile);
    if (currentFile) console.log("File added to sender limbo: ", currentFile.type, " Waiting for user confimation");
  };

  // Cleanup for the preview URL
  useEffect(() => {
    return () => {
      if (previewURL) {
        URL.revokeObjectURL(previewURL);
      }
    };
  }, [previewURL]);

  return (
    <div id={id} className={containerClassName}>
      {isEditing ? (
        <>
          {isUploading ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-l-2 border-b-1 border-emerald-300"></div>
              <p className="text-emerald-300">Uploading...</p>
            </div>
          ) : (
            <div className=" flex flex-col items-center justify-center space-y-4  w-full h-full">
              
              <label
                htmlFor={`${id}-input`}
                className={
                  currentFile
                    ? "profile-form-input text-center font-bold border-none w-full "
                    : "profile-form-input text-center font-bold  w-full aspect-square place-content-center"
                }
              >         
                {/* Photo Preview */}
                {previewURL && (
                  <div className="w-full aspect-square mb-2 border rounded overflow-hidden">
                    <img 
                      src={previewURL} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <p>{currentFile ? orginFileName.slice(0, 30) : "Chose new photo file"}</p>
              </label>
              <input
                id={`${id}-input`}
                type="file"
                accept="image/png,image/jpeg,image/gif,image/jpg"
                onChange={handleFile}
                className="hidden"
              />
              <div className="grid grid-cols-2 gap-0.5 w-full">
                <p className="text-center col-span-2">{currentFile ? "Accept change?" : ""}</p>
                <button
                  id={`${id}-button`}
                  onClick={handleSave}
                  className={
                    buttonCalssName +
                    " bg-emerald-200/40 hover:text-gray-400 hover:bg-emerald-300 hover:animate-pulse"
                  }
                >
                  <CheckCircleIcon />
                </button>

                <button
                  id={`${id}-abort-button`}
                  onClick={handleAbort}
                  className={buttonCalssName + " bg-rose-200/40"}
                >
                  <CancelIcon />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        currentUser && (
          <div
            onClick={() => setIsEditing(true)}
            className="aspect-square w-full  bg-gray-300 flex items-center justify-center"
            onMouseEnter={handleOnMouseEnter}
          >
            {!currentUser.firebaseUser.photoURL ? (
              <AddAPhoto fontSize="large"></AddAPhoto>
            ) : (
              <div>
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
                  title="Click photo to change it"
                />
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
};
export default EditablePhoto;
