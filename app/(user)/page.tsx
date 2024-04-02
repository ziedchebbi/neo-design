import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import prisma from "@/lib/prismadb";
import Image from "next/image";
import Link from "next/link";

const Home = async () => {
  const featuredProducts = await prisma.product.findMany({
    where: { featured: true },
  });

  const newProducts = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  return (
    <main className="overflow-hidden">
      <div className="bg-slate-900 flex justify-center w-full">
        <div className="w-[90%] max-lg:w-full">
          <Carousel opts={{ loop: true }}>
            <CarouselContent>
              {featuredProducts.map((product) => (
                <CarouselItem
                  key={product.id}
                  className="h-[40rem] max-xl:h-[36rem] max-lg:h-[28rem] max-md:h-[20rem] max-sm:h-[12rem]"
                >
                  <Link
                    href={`/product/${product.id}`}
                    className="h-full w-full absolute"
                  >
                    <Image
                      src={product.image}
                      alt="featured product"
                      fill
                      priority
                      className="object-contain"
                    />
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="bg-transparent text-white border-none" />
            <CarouselNext className="bg-transparent text-white border-none" />
          </Carousel>
        </div>
      </div>

      <div className="w-full py-20">
        <span className="ml-10 text-2xl font-bold">Newest items</span>
        <div className="flex justify-center mt-10">
          <Carousel
            opts={{
              align: "start",
              dragFree: true,
            }}
            className="w-full max-w-screen-xl"
          >
            <CarouselContent className="-ml-1">
              {newProducts.map((product) => (
                <CarouselItem
                  key={product.id}
                  className="h-48 w-fit rounded-lg overflow-hidden flex items-center justify-center relative p-0 ml-2 basis-[26%]"
                >
                  <Link
                    href={`/product/${product.id}`}
                    className="h-full w-full relative"
                  >
                    <Image
                      src={product.image}
                      alt="new product"
                      // height={10000}
                      // width={10000}
                      fill
                      sizes="100%"
                      className="object-cover"
                    />
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="bg-transparent text-black border-none" />
            <CarouselNext className="bg-transparent text-black border-none" />
          </Carousel>
        </div>
      </div>
    </main>
  );
};

export default Home;
