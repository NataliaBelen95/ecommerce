import mongooseConnect from "@/lib/mongoose";
import { Category } from "@/models/Category";

const handle = async (req, res) => {
  const { method } = req;
  await mongooseConnect();

  if (method === "GET") {
    res.json(await Category.find().populate("parent"));
  }

  if (method === "PUT") {
    const { name, parentCategory, _id } = req.body;
    const editCategory = await Category.updateOne(
      { _id },
      { name, parent: parentCategory }
    );
    res.json(editCategory);
  }

  if (method === "DELETE") {
    const { _id } = req.query;
    await Category.deleteOne({ _id });
    res.json("deleted");
  }

  if (method === "POST") {
    const { name, parentCategory } = req.body;
    const newCategoryDoc = await Category.create({
      name,
      parent: parentCategory,
    });
    res.json(newCategoryDoc);
  }
};

export default handle;
