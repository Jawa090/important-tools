import sharp from "sharp";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const formData = await req.formData(); 
    const image = formData.get("image");

    if (!image) {
      return new Response(JSON.stringify({ error: "No image provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }


    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, image.name);
    const writeStream = fs.createWriteStream(filePath);
    const imageStream = image.stream();

    await new Promise((resolve, reject) => {
      imageStream.pipe(writeStream);
      imageStream.on("end", resolve);
      imageStream.on("error", reject);
    });

    const convertedImagePath = filePath.replace(path.extname(filePath), ".png");
    await sharp(filePath).toFile(convertedImagePath);

  
    return new Response(
      JSON.stringify({ url: `/uploads/${path.basename(convertedImagePath)}` }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Image conversion error:", error);
    return new Response(
      JSON.stringify({ error: "Image conversion failed" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}  