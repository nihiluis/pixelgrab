export function getFileExtension(filename: string) {
  // Use the lastIndexOf and substring methods to extract the file extension
  const lastIndex = filename.lastIndexOf(".")
  if (lastIndex === -1) {
    // File name does not contain a dot, so there's no extension
    return ""
  } else {
    // Extract the substring after the last dot
    return filename.substring(lastIndex + 1)
  }
}
