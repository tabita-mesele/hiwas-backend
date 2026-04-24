const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Newsletter = require("../models/Newsletter");
const auth = require("../middleware/auth"); // 🔐 SECURITY MIDDLEWARE

// ================= STORAGE =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

/* =========================================================
   CREATE (ADMIN ONLY)
========================================================= */
router.post(
  "/upload",
  auth,
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, category, content } = req.body;

      const newItem = new Newsletter({
        title,
        category,
        content,
        cover: req.files?.cover
          ? "/uploads/" + req.files.cover[0].filename
          : "",
        filePath: req.files?.file
          ? "/uploads/" + req.files.file[0].filename
          : "",
      });

      await newItem.save();

      res.status(201).json({
        message: "Uploaded successfully",
        newItem,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

/* =========================================================
   UPDATE (ADMIN ONLY)
========================================================= */
router.put(
  "/:id",
  auth,
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const item = await Newsletter.findById(req.params.id);
      if (!item) {
        return res.status(404).json({ message: "Not found" });
      }

      const { title, category, content } = req.body;

      if (title) item.title = title;
      if (category) item.category = category;
      if (content) item.content = content;

      // replace cover
      if (req.files?.cover) {
        if (item.cover) {
          const oldCover = path.join(__dirname, "..", item.cover);
          if (fs.existsSync(oldCover)) fs.unlinkSync(oldCover);
        }
        item.cover = "/uploads/" + req.files.cover[0].filename;
      }

      // replace file
      if (req.files?.file) {
        if (item.filePath) {
          const oldFile = path.join(__dirname, "..", item.filePath);
          if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile);
        }
        item.filePath = "/uploads/" + req.files.file[0].filename;
      }

      await item.save();

      res.json({
        message: "Updated successfully",
        item,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Update failed" });
    }
  }
);

/* =========================================================
   DELETE (ADMIN ONLY)
========================================================= */
router.delete("/:id", auth, async (req, res) => {
  try {
    const item = await Newsletter.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Not found" });
    }

    // delete cover
    if (item.cover) {
      const coverPath = path.join(__dirname, "..", item.cover);
      if (fs.existsSync(coverPath)) fs.unlinkSync(coverPath);
    }

    // delete file
    if (item.filePath) {
      const filePath = path.join(__dirname, "..", item.filePath);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await Newsletter.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
});

/* =========================================================
   GET ALL (PUBLIC)
========================================================= */
router.get("/", async (req, res) => {
  try {
    const data = await Newsletter.find().sort({ _id: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed" });
  }
});

module.exports = router;