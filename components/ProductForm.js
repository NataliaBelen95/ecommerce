import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  category: existingCategroy,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [goToProducts, setGoToProducts] = useState("");
  const [images, setImages] = useState(existingImages || []);
  const [isUploading, setIsUploading] = useState(false);
  const [category, setCategory] = useState("" || existingCategroy);
  const [categories, setCategories] = useState([]);

  const router = useRouter();
  async function saveProduct(ev) {
    const data = { title, description, price, images, category };
    ev.preventDefault();
    if (_id) {
      //update

      await axios.put("/api/products", { ...data, _id });
    } else {
      //create

      await axios.post("/api/products", data);
    }
    setGoToProducts(true);
  }
  if (goToProducts) {
    router.push("/products");
  }

  useEffect(() => {
    axios.get("/api/categories").then((result) => {
      result.data;
    });
  }, []);

  async function uploadImage(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
        const res = await axios.post("/api/upload", data);
        setImages((oldImage) => {
          return [...oldImage, ...res.data.links];
        });
      }
      setIsUploading(false);
    }
  }

  function updateImgsOrder(images) {
    setImages(images);
  }

  return (
    <form onSubmit={saveProduct}>
      <label>Nombre del producto</label>
      <input
        type="text"
        placeholder="nombre del producto"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
        className=""
      />
      <label>Categoria</label>
      <select value={category} onChange={(ev) => setCategory(ev.target.value)}>
        <option value="">Sin categoría</option>
        {categories.length > 0 &&
          categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
      </select>
      <label>Foto </label>
      <div className="mb-2 flex flex-wrap gap-1">
        <ReactSortable
          list={images}
          setList={updateImgsOrder}
          className="flex flex-wrap gap-1"
        >
          {!!images.length &&
            images.map((link) => (
              <div key={link} className="h-24">
                <img src={link} alt="" className="rounded-lg" />
              </div>
            ))}
        </ReactSortable>

        {isUploading && (
          <div className="h-24 p-1 bg-gray-200 flex items-center">
            <Spinner />
          </div>
        )}

        <label className="cursor-pointer w-24 h-24 border text-center flex items-center justify-center text-sm gap-1 text-gray-500 bg-gray-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <div>Cargar</div>
          <input type="file" className="hidden" onChange={uploadImage} />
        </label>
      </div>

      <label>Descripción</label>
      <textarea
        placeholder="descripcion"
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
      ></textarea>
      <label>Precio</label>
      <input
        type="text"
        placeholder="precio"
        value={price}
        onChange={(ev) => {
          setPrice(ev.target.value);
        }}
        className=""
      />
      <button type="submit" className="btn_primary bg-orange-500">
        Añadir
      </button>
    </form>
  );
}
