import React from "react";
import prisma from "@/lib/prismadb";
import Image from "next/image";
import { Euro } from "lucide-react";

const Page = async ({ params }: { params: { id: string } }) => {
  const product = await prisma.product.findUnique({
    where: {
      id: params.id,
    },
  });

  return (
    <main className="w-full">
      <h1 className="text-center py-10 text-2xl font-bold">{product?.name}</h1>

      <div className="w-full px-10 relative flex justify-center">
        <Image
          src={product?.image!}
          alt="product"
          priority
          width={10000}
          height={10000}
          className="object-contain h-full w-auto rounded-lg max-h-[100rem]"
        />
      </div>

      <div className="w-full py-10 px-20">{product?.description}</div>

      <div className="mb-20 ml-20 flex flex-row">
        <span className="text-xl">{product?.price}</span>
        <Euro width={15} height={15} />
      </div>
    </main>
  );
};

export default Page;
