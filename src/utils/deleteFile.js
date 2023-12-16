const { uploadDir } = require("./multer");

async function deleteFiles(fileNames) {
  try {
    // Loop through each file and delete it
    for (const fileName of fileNames) {
      await fs.unlink(`${uploadDir}/${fileName}`);
    }
    console.log("Files deleted successfully");
  } catch (error) {
    console.error("Error deleting files:", error.message);
    throw new ErrorResponse("Error deleting files", 500);
  }
}
module.exports = { deleteFiles };
