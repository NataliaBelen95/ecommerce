import Layout from "@/components/layout";
import { useReducer, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import ProductForm from "@/components/ProductForm";

export default function NewProduct() {
  return (
    <Layout>
      <h1>Nuevo Producto</h1>
      <ProductForm></ProductForm>
    </Layout>
  );
}
