import express from "express";
import morgan from "morgan";
import cors from "cors";
import multer from "multer";
import { authenticateApiKey } from "./utiles/apikey-auth.mjs"
import { storage, fileFilter } from "./utiles/UploadImage.mjs";
import { queryData } from "./services/dbconnection.mjs";
import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

const upload = multer({ storage, fileFilter });

app.use(express.json());
app.use(morgan("dev"));
app.use(
    cors({
        origin: "*",
    })
);
app.use("/uploads", express.static("uploads"));
app.use('/getimages', authenticateApiKey);
app.use('/upload', authenticateApiKey);

app.get("/", async (req, res) => {
    //   await queryData("");
    res.send("Server is working");
});

app.get("/getimages", async (req, res) => {
    if (req.query.startIndex > req.query.endIndex)
        return res
            .status(400)
            .json({ error: "Bad Request startindex must be less than endIndex." });

    let startIndex = 0;
    let endIndex = 100;
    if (req.query.startIndex !== undefined && req.query.endIndex !== undefined) {
        startIndex = req.query.startIndex;
        endIndex = req.query.endIndex;
    }

    const query = `select * from images i where i.image_id between ${startIndex} AND ${endIndex};`;
    let response = await queryData(query);
    res.json({ data: response });
});

// Create a POST route for uploading images
app.post(
    "/upload",
    upload.fields([{ name: "p_image_url" }, { name: "sm_image_url" }]),
    async (req, res) => {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "No files uploaded." });
        } else if (
            req.body.title === undefined ||
            req.body.rewritten_title === undefined ||
            req.body.description === undefined ||
            req.body.rewritten_description === undefined
        )
            return res.status(400).json({ error: "Bad request." });

        const query = `INSERT INTO images (
                    sm_image_url,
                    p_image_url,
                    Title,
                    rewritten_title,
                    description,
                    rewritten_description,
                    is_archive
                ) VALUES (
                    '${process.env.BASE_URL}${process.env.PORT}/uploads/${req.files["sm_image_url"][0].filename}',
                    '${process.env.BASE_URL}${process.env.PORT}/uploads/${req.files["p_image_url"][0].filename}',
                    '${req.body.title}',
                    '${req.body.rewritten_title}',
                    '${req.body.description}',
                    '${req.body.rewritten_description}',
                    0
                );`;
        await queryData(query);
        res.json({ message: "Files uploaded successfully." });
    }
);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
