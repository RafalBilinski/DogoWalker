import { SupportedPhotoFileFormat } from "../types/fileTypes";
function extractFileFormat(photoURL: string) {
  if (!photoURL) return null;
  let format;
  const decodedURL = decodeURIComponent(photoURL);
  const formatRegex = /\.([a-zA-Z0-9]+)(?:\?|#|$)/i;
  const match = decodedURL.match(formatRegex);
  if (match) {
    format = match[1].toLowerCase();
    return SupportedPhotoFileFormat.includes(format) ? format : (format = "");
  }
  return null;
}

export default extractFileFormat;