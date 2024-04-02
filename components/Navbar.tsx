"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import Logo from "@/components/Logo";
import { useEffect, useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

axios.defaults.baseURL = process.env.BASE_URL;

const Navbar = () => {
  useEffect(() => {
    fetchCategories();
  }, []);

  const [Categories, setCategories] = useState<any[]>([]);
  const fetchCategories = async () => {
    await axios
      .get("/api/getAllCategories")
      .then((response: AxiosResponse) => setCategories(response.data))
      .catch((error: AxiosError) => console.log(error));
  };

  const [SearchQuery, setSearchQuery] = useState("");
  const [SearchResult, setSearchResult] = useState<any[]>([]);
  const [IsResultCardOpen, setIsResultCardOpen] = useState(false);
  useEffect(() => {
    findProduct();
  }, [SearchQuery]);

  const findProduct = async () => {
    await axios
      .get("/api/findProduct", { params: { query: SearchQuery } })
      .then((response: AxiosResponse) => setSearchResult(response.data))
      .catch((error: AxiosError) => console.log(error));
  };

  const hideSearchPannel = () => {
    setTimeout(() => setIsResultCardOpen(false), 65);
  };

  return (
    <header className="w-full py-2 border-b-2 z-10">
      <div className="max-w-[1440px] mx-auto relative flex flex-row items-center justify-center mt-2">
        <Link href="/" className="absolute left-10 top-1">
          <Logo />
        </Link>

        <div className="w-[40rem] relative">
          <Input
            placeholder="Search..."
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsResultCardOpen(true)}
            onBlur={() => hideSearchPannel()}
          />

          <Card
            className={cn(
              `absolute z-20 w-full mt-2 ${
                !IsResultCardOpen ? "hidden" : "block"
              }`
            )}
          >
            <CardHeader>
              <CardTitle>
                {SearchResult.length === 0 ? "Nothing found" : "Search result"}
              </CardTitle>
              <CardDescription>{`${SearchResult.length} results found`}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {SearchResult.map((result) => (
                <Link href={`/product/${result.id}`} key={result.id}>
                  {result.name}
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex items-center justify-center mt-2 gap-2">
        {Categories.map((category) => (
          <Link
            href={`/categories/${category.name}`}
            key={category.id}
            className="px-4 py-2 rounded-md hover:bg-black/5"
          >
            <span>{category.name}</span>
          </Link>
        ))}
      </div>
    </header>
  );
};

export default Navbar;
