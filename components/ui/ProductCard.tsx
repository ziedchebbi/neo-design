import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Euro } from "lucide-react";
import Link from "next/link";

interface ProductCardProps {
  title: string;
  imageUrl: string;
  price: number;
  productUrl: string;
}

const ProductCard = ({
  title,
  imageUrl,
  price,
  productUrl,
}: ProductCardProps) => {
  return (
    <Card className="w-80 h-80 border-2">
      <Link href={productUrl}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="bg-slate-200 h-48 flex items-center justify-center overflow-hidde relative">
            <Image
              src={imageUrl}
              alt="product"
              width={10000}
              height={10000}
              className="w-auto h-full object-contain"
            />
          </div>
        </CardContent>
        <CardFooter className="mt-2">
          {price}
          <Euro width={15} height={15} />
        </CardFooter>
      </Link>
    </Card>
  );
};

export default ProductCard;
