import multiparty from "multiparty"; //leer el file
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from "fs";
import mime from "mime-types";
const bucketName = "nextjs--ecommerce";

//multipart/form-data es un tipo de codificación de datos utilizado en formularios HTML para enviar archivos binarios, como imágenes, audio o video, junto con otros datos de formulario.

const handle = async (req, res) => {
  const form = new multiparty.Form();
  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });

  console.log("length:", files.file.length);

  const client = new S3Client({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });

  const links = [];
  for (const file of files.file) {
    const ext = file.originalFilename.split(".").pop();
    console.log(file.originalFilename, "original");

    const newFileName = Date.now() + "." + ext;
    console.log("newfilename", newFileName);
    console.log({ ext, file });
    await client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: newFileName,
        Body: fs.readFileSync(file.path), // leer el archivo desde su ubicación en el sistema.
        ACL: "public-read",
        ContentType: mime.lookup(file.path),
      })
    );
    console.log(file.path);

    const link = `https://${bucketName}.s3.amazonaws.com/${newFileName}`;
    links.push(link);
    console.log(links);
  }

  return res.json({ links });
};

export const config = {
  api: { bodyParser: false },
};

export default handle;
