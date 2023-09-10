import Layout from "@/components/layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

export default function DeleteProduct() {
  const router = useRouter();
  const { id } = router.query;
  const [productInfo, setProductInfo] = useState();
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/api/products?id=" + id).then((response) => {
      setProductInfo(response.data);
    });
  }, [id]);

  function goBack() {
    router.push("/products");
  }

  async function DeleteProduct() {
    await axios.delete("/api/products?id=" + id);
    goBack();
  }

  return (
    <Layout>
      <h2 className="text-center mb-1">
        {" "}
        Estas seguro de eliminar &nbsp; {productInfo?.title} ?{" "}
      </h2>
      <div className="flex gap-2 justify-center">
        <button className="btn-red" onClick={DeleteProduct}>
          YES?
        </button>
        <button className="btn-default" onClick={goBack}>
          NO?
        </button>
      </div>
    </Layout>
  );
}
