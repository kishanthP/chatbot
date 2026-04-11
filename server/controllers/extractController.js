const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

const extractController = async (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).send("No file uploaded");
  }

  const file = req.files.file;
  const ext = file.name.split(".").pop().toLowerCase();

  try {
    if (ext === "pdf") {
      const data = await pdfParse(file.data);
      res.json({ text: data.text });
    } else if (ext === "docx") {
      const result = await mammoth.extractRawText({ buffer: file.data });
      res.json({ text: result.value });
    } else {
      res.status(400).send("Unsupported file type");
    }
  } catch (err) {
    console.error("Extract Error:", err);
    res.status(500).send("Error extracting text");
  }
};

module.exports = { extractController };
