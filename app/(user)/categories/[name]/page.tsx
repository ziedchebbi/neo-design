"use client";

import ProductCard from "@/components/ui/ProductCard";
import { AxiosError, AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import axios from "axios";
import { redirect } from "next/dist/server/api-utils";

axios.defaults.baseURL = process.env.BASE_URL;

const Page = ({ params }: { params: { name: string } }) => {
  useEffect(() => {
    fethcProducts();
  }, []);

  const [Products, setProducts] = useState<any[]>([]);
  const fethcProducts = async () => {
    await axios
      .get("/api/getProducts", {
        params: { name: params.name.replace("%20", " ") },
      })
      .then((response: AxiosResponse) => setProducts(response.data))
      .catch((error: AxiosError) => console.log(error));
  };

  return (
    <div>
      <h1 className="py-10 text-center text-2xl font-bold">
        {params.name.replace("%20", " ")}
      </h1>

      <div className="flex flex-wrap gap-4 py-10 justify-center">
        {Products.map((product) => (
          <ProductCard
            key={product.id}
            title={product.name}
            imageUrl={product.image}
            price={product.price}
            productUrl={`/product/${product.id}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Page;
