import Layout from "@/components/layout";
import { useState, useEffect } from "react";
import { withSwal } from "react-sweetalert2";

import axios from "axios";

function CategoriesPage({ swal }) {
  const [name, setName] = useState("");
  const [editedCategory, setEditedCategory] = useState(null);
  const [parentCategory, setParentCategory] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  };

  async function saveCategory(ev) {
    ev.preventDefault();

    if (editedCategory) {
      const data = { name, parentCategory };
      data._id = editedCategory._id;
      try {
        await axios.put("/api/categories", data);
        setEditedCategory(null);
      } catch (e) {
        console.log(e);
      }
    } else {
      const data = { name, parentCategory };
      await axios.post("/api/categories", data);
    }
    setName("");
    fetchCategories();
  }

  const editCategory = (category) => {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
  };

  const deleteCategory = (category) => {
    swal
      .fire({
        title: "Eliminar",
        text: `¿Estás seguro de eliminar ${category.name} ?`,
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Eliminar",
        confirmButtonColor: "#d55",
        reverseButtons: true,
      })
      .then((result) => {
        console.log({ result });
        const { _id } = category;
        if (result.isConfirmed) {
          axios.delete("/api/categories?_id=" + _id);
          fetchCategories();
        } else {
        }
      });
  };

  return (
    <Layout>
      <h1>Categorias</h1>
      <label>
        {editedCategory
          ? `Editar categoria ${editedCategory.name}`
          : "Crear nueva categoria"}
      </label>
      <form onSubmit={saveCategory} className="flex gap-1">
        <input
          type="text"
          placeholder={""}
          onChange={(ev) => setName(ev.target.value)}
          value={name}
        />
        <select
          className="mb-0"
          onChange={(ev) => setParentCategory(ev.target.value)}
          value={parentCategory}
        >
          <option value="">Sin categoria principal</option>
          {categories.length > 0 &&
            categories.map((category) => (
              <option key={category.name} value={category._id}>
                {category.name}
              </option>
            ))}
        </select>
        <button type="submit" className="btn_primary bg-orange-500 py-1">
          Guardar
        </button>
      </form>
      <table className="basic mt-4">
        <thead>
          <tr>
            <td>Categoria</td>
            <td>Categoria Principal</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 &&
            categories.map((category) => (
              <tr key={category._id}>
                <td>{category.name}</td>
                <td>{category?.parent?.name}</td>
                <td>
                  <button
                    onClick={() => editCategory(category)}
                    className="btn_primary mr-1"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => deleteCategory(category)}
                    className="btn_primary"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}

export default withSwal(({ swal }, ref) => <CategoriesPage swal={swal} />);
