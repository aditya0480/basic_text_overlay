import express from "express";
import dotenv from "dotenv";
import { createCanvas, loadImage, registerFont } from "canvas";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
app.use(express.json());

// For ES modules path handling
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set default environment variables if not provided
const FONT_PATH = process.env.FONT_PATH || "fonts/TiroDevanagariMarathi-Italic.ttf";
const IMAGE_PATH = process.env.IMAGE_PATH || "public/images";
const DOMAIN = process.env.DOMAIN || "http://localhost:5500";

// Load custom font
const fontPath = path.join(__dirname, FONT_PATH);
try {
  registerFont(fontPath, { family: "CustomFont" });
  console.log(`Font loaded successfully from: ${fontPath}`);
} catch (error) {
  console.warn(`Warning: Could not load font from ${fontPath}. Using default font.`);
}

const fullImagePath = path.join(__dirname, IMAGE_PATH);

// Make sure /public/images exists
if (!fs.existsSync(fullImagePath)) {
  fs.mkdirSync(fullImagePath, { recursive: true });
}

// Serve static files (generated images)
app.use("/images", express.static(fullImagePath));

// Configure multer for uploads
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, fullImagePath);
  },
  filename: function (_req, file, cb) {
    const ext = path.extname(file.originalname) || ".bin";
    const safeBase = path.basename(file.originalname, path.extname(file.originalname)).replace(/[^a-zA-Z0-9-_\.]/g, "_");
    cb(null, `${safeBase}_${Date.now()}${ext}`);
  }
});

const fileFilter = (_req, file, cb) => {
  // Allow common image MIME types
  const allowed = ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter
});

// Upload endpoint
app.post("/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const publicUrl = `${DOMAIN}/images/${req.file.filename}`;
    return res.json({
      success: true,
      fileName: req.file.filename,
      mimeType: req.file.mimetype,
      size: req.file.size,
      imageUrl: publicUrl
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "File upload failed" });
  }
});

app.post("/generate", async (req, res) => {
  try {
    const { imageUrl, text } = req.body;
    if (!imageUrl || !text) {
      return res.status(400).json({ error: "imageUrl and text are required" });
    }

    const bgImage = await loadImage(imageUrl);

    // Create canvas
    const canvas = createCanvas(bgImage.width, bgImage.height);
    const ctx = canvas.getContext("2d");

    // Draw background
    ctx.drawImage(bgImage, 0, 0);

    // Add black overlay with 30% opacity
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add centered text with line breaks support
    ctx.font = `50px "CustomFont"`;
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    // Split text by line breaks and render each line
    const lines = text.split('\n');
    const lineHeight = 60; // Space between lines
    const totalHeight = lines.length * lineHeight;
    const startY = (canvas.height - totalHeight) / 2 + lineHeight / 2;
    
    lines.forEach((line, index) => {
      const y = startY + (index * lineHeight);
      ctx.fillText(line, canvas.width / 2, y);
    });

    // Save image
    const fileName = `image_${Date.now()}.png`;
    const filePath = path.join(fullImagePath, fileName);
    const out = fs.createWriteStream(filePath);
    const stream = canvas.createPNGStream();
    stream.pipe(out);

    out.on("finish", () => {
      const publicUrl = `${DOMAIN}/images/${fileName}`;
      res.json({ imageUrl: publicUrl });
    });

    out.on("error", (error) => {
      console.error("Error writing file:", error);
      res.status(500).json({ error: "Failed to save image" });
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Image generation failed" });
  }
});

app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 5500;

// Add error handling to prevent server from crashing
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Don't exit the process, just log the error
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit the process, just log the error
});

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Server is ready to accept requests...');
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please try a different port.`);
  } else {
    console.error('Server error:', error);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});
