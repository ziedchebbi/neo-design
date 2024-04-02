"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AxiosError, AxiosResponse } from "axios";
import { ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import axios from "axios";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UploadDropzone } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";

axios.defaults.baseURL = process.env.BASE_URL;

// Form Schemas
const addCategoryFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Category name cannot be empty" })
    .max(30, { message: "Character limit reached" }),
});

const addProductFormSchema = z.object({
  name: z
    .string()
    .min(1, "Product name cannot be empty")
    .max(20, { message: "Character limit reached" }),
  description: z.string().max(10000, { message: "Character limit reached" }),
  price: z.coerce.number().gt(0, { message: "Price cannot be less than zero" }),
  image: z.string().min(1, { message: "Image is required" }),
  featured: z.boolean(),
  categories: z.array(z.string()),
});

const addAdminFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Please enter an email first" })
    .email({ message: "Email is not valid" }),
  role: z.enum(["MANAGER", "ADMINISTRATOR"]),
});

const Page = () => {
  useEffect(() => {
    updateCategories();
    updateProducts();
    updateTeam();
  }, []);

  // Auth
  const [IsUserVerified, setIsUserVerified] = useState(false);
  const [IsUserVerifyLoading, setIsUserVerifyLoading] = useState(true);

  const { data: session } = useSession();

  const verifyUser = async () => {
    await axios
      .get("/api/verifyUser", {
        params: { email: session!.user?.email },
      })
      .then((response: AxiosResponse) => {
        if (response.data) {
          // authorized
          setIsUserVerified(true);
          setIsUserVerifyLoading(false);
        } else {
          // unauthorized
          setIsUserVerifyLoading(false);
          signOut();
        }
      })
      .catch((error: AxiosError) => {
        // failed
        console.log(error);
        setIsUserVerifyLoading(false);
        signOut();
      });
  };

  if (!session || !session.user) {
    redirect("/admin/signIn");
  } else {
    verifyUser();
  }

  // Category form
  const [isCategoryFormLoading, setIsCategoryFormLoading] = useState(false);

  const [categories, setCategories] = useState<any[]>([]);
  const updateCategories = async () => {
    await axios
      .get("/api/getAllCategories")
      .then((response: AxiosResponse) => setCategories(response.data))
      .catch((error: AxiosError) => console.log(error));
  };

  // Product form
  const [isProductFormLoading, setIsProductFormLoading] = useState(false);

  // Admin form
  const [isAdminFormLoading, setIsAdminFormLoading] = useState(false);

  // Forms
  const addCategoryForm = useForm<z.infer<typeof addCategoryFormSchema>>({
    resolver: zodResolver(addCategoryFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const addProductForm = useForm<z.infer<typeof addProductFormSchema>>({
    resolver: zodResolver(addProductFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      image: "",
      featured: false,
      categories: [],
    },
  });

  const addAdminForm = useForm<z.infer<typeof addAdminFormSchema>>({
    resolver: zodResolver(addAdminFormSchema),
    defaultValues: {
      email: "",
      role: "ADMINISTRATOR",
    },
  });

  // Form handlers
  const handleAddCategory = async (
    values: z.infer<typeof addCategoryFormSchema>
  ) => {
    setIsCategoryFormLoading(true);

    await axios
      .post("/api/createCategory", values)
      .then(() => updateCategories())
      .catch((error: AxiosError) => console.log(error))
      .finally(() => setIsCategoryFormLoading(false));

    addCategoryForm.reset();
  };

  const handleAddProduct = async (
    values: z.infer<typeof addProductFormSchema>
  ) => {
    setIsProductFormLoading(true);

    await axios
      .post("/api/createProduct", values)
      .then(() => updateProducts())
      .catch((error: AxiosError) => console.log(error))
      .finally(() => setIsProductFormLoading(false));

    addProductForm.reset();
  };

  const handleAddAdmin = async (values: z.infer<typeof addAdminFormSchema>) => {
    setIsAdminFormLoading(true);

    await axios
      .post("/api/addAdmin", values)
      .then(() => updateTeam())
      .catch((error: AxiosError) => console.log(error))
      .finally(() => setIsAdminFormLoading(false));

    addAdminForm.reset();
  };

  // idc anymore its so disorganized wtf

  const handleDeleteCategory = async (id: string) => {
    await axios
      .delete("/api/deleteCategory", { params: { id: id } })
      .then(() => {
        updateCategories();
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });
  };

  const [Products, setProducts] = useState<any[]>([]);
  const updateProducts = async () => {
    await axios
      .get("/api/getAllProducts")
      .then((response: AxiosResponse) => setProducts(response.data))
      .catch((error: AxiosError) => {
        console.log(error);
      });
  };

  const handleDeleteProduct = async (id: string) => {
    await axios
      .delete("/api/deleteProduct", { params: { id: id } })
      .then(() => updateProducts())
      .catch((error: AxiosError) => console.log(error));
  };

  const [Team, setTeam] = useState<any[]>([]);
  const updateTeam = async () => {
    await axios
      .get("/api/getAllTeam")
      .then((response: AxiosResponse) => setTeam(response.data))
      .catch((error: AxiosError) => {
        console.log(error);
      });
  };

  const handleDeleteTeam = async (id: string) => {
    await axios
      .delete("/api/deleteTeam", { params: { id: id } })
      .then(() => updateTeam())
      .catch((error: AxiosError) => console.log(error));
  };

  if (IsUserVerified && !IsUserVerifyLoading) {
    return (
      <main className="flex flex-col items-center w-full h-full bg-slate-100 pb-10">
        <div className="flex items-center justify-end w-full h-20 bg-slate-100 border-b-2">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="mx-4 my-4">
                <AvatarImage src={session.user.image!} />
                <AvatarFallback className="bg-slate-200">A</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-10 mt-1">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Button
                  className="text-red-600"
                  variant="ghost"
                  onClick={() => signOut()}
                >
                  Sign Out
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Category form */}
        <Form {...addCategoryForm}>
          <form
            onSubmit={addCategoryForm.handleSubmit(handleAddCategory)}
            className="w-11/12 mt-10"
          >
            <Card>
              <CardHeader>
                <CardTitle>Create new category</CardTitle>
                <CardDescription>
                  Keep your store organized with categories for a better buyer
                  experience
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 w-1/3">
                <FormField
                  control={addCategoryForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-80">
                      <FormControl>
                        <Input placeholder="Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="submit" disabled={isCategoryFormLoading}>
                  Deploy
                </Button>

                <Dialog>
                  <DialogTrigger className="text-sm font-light mr-2">
                    View categories
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Your categories</DialogTitle>
                      <DialogDescription>
                        You can see all your categories here
                      </DialogDescription>
                    </DialogHeader>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead className="text-end">Delete</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {categories.map((category) => (
                          <TableRow key={category.id}>
                            <TableCell>{category.name}</TableCell>
                            <TableCell className="flex justify-end">
                              <Button
                                size="icon"
                                variant={"destructive"}
                                onClick={() =>
                                  handleDeleteCategory(category.id)
                                }
                              >
                                <Trash2 width={15} height={15} />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          </form>
        </Form>

        {/* Product form */}
        <Form {...addProductForm}>
          <form
            onSubmit={addProductForm.handleSubmit(handleAddProduct)}
            className="w-11/12 mt-10"
          >
            <Card>
              <CardHeader>
                <CardTitle>Create new product</CardTitle>
                <CardDescription>
                  Get your products live in a few clicks
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 w-1/3">
                <FormField
                  control={addProductForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-80">
                      <FormControl>
                        <Input placeholder="Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addProductForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="w-80">
                      <FormControl>
                        <Input placeholder="Description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addProductForm.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="w-80">
                      <FormControl>
                        <Input placeholder="Price" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Popover>
                  <PopoverTrigger className="relative text-slate-500 text-sm border rounded-md py-2 px-4 w-80">
                    <span>Categories</span>
                    <ChevronsUpDown
                      size={20}
                      className="absolute right-1 top-1/4"
                    />
                  </PopoverTrigger>
                  <PopoverContent>
                    <Command>
                      <CommandInput placeholder="Search..." />
                      <CommandEmpty>Nothing found</CommandEmpty>
                      <CommandList>
                        <CommandGroup>
                          {categories.map((category) => (
                            <CommandItem key={category.name}>
                              <FormField
                                control={addProductForm.control}
                                name="categories"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(
                                          category.name
                                        )}
                                        onCheckedChange={(checked) =>
                                          checked
                                            ? field.onChange([
                                                ...field.value,
                                                category.name,
                                              ])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) =>
                                                    value != category.name
                                                )
                                              )
                                        }
                                      />
                                    </FormControl>
                                    <FormLabel className="ml-2">
                                      {category.name}
                                    </FormLabel>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                <FormField
                  control={addProductForm.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="w-80 py-2">
                      <FormLabel className="text-lg">
                        Feature product on homepage
                      </FormLabel>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="float-end"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addProductForm.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem className="w-80 py-2">
                      <FormControl>
                        <UploadDropzone
                          endpoint="imageUploader"
                          onClientUploadComplete={(res) =>
                            addProductForm.setValue("image", res[0].url)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="submit" disabled={isProductFormLoading}>
                  Deploy
                </Button>

                <Dialog>
                  <DialogTrigger className="text-sm font-light mr-2">
                    View products
                  </DialogTrigger>
                  <DialogContent className="h-4/5 overflow-auto">
                    <DialogHeader>
                      <DialogTitle>Your products</DialogTitle>
                      <DialogDescription>
                        You can see all your products here
                      </DialogDescription>
                    </DialogHeader>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead className="text-end">Delete</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Products.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>{product.name}</TableCell>
                            <TableCell className="flex justify-end">
                              <Button
                                size="icon"
                                variant={"destructive"}
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 width={15} height={15} />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          </form>
        </Form>

        {/* Admin form */}
        <Form {...addAdminForm}>
          <form
            onSubmit={addAdminForm.handleSubmit(handleAddAdmin)}
            className="w-11/12 mt-10"
          >
            <Card>
              <CardHeader>
                <CardTitle>Add a new website admin</CardTitle>
                <CardDescription>Expand your team quickly</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 w-1/3">
                <FormField
                  control={addAdminForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-80">
                      <FormControl>
                        <Input placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addAdminForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="w-80">
                      <FormLabel className="text-lg font-bold">
                        Administrator role
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-row gap-2"
                        >
                          <FormItem>
                            <FormControl>
                              <RadioGroupItem value="MANAGER" />
                            </FormControl>
                            <FormLabel className="ml-2">Team manager</FormLabel>
                          </FormItem>
                          <FormItem>
                            <FormControl>
                              <RadioGroupItem value="ADMINISTRATOR" />
                            </FormControl>
                            <FormLabel className="ml-2">
                              Website administrator
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="submit" disabled={isAdminFormLoading}>
                  Add
                </Button>

                <Dialog>
                  <DialogTrigger className="text-sm font-light mr-2">
                    View Administrators
                  </DialogTrigger>
                  <DialogContent className="max-h-[80%] overflow-auto">
                    <DialogHeader>
                      <DialogTitle>Your Team</DialogTitle>
                      <DialogDescription>
                        You can see all your team members here
                      </DialogDescription>
                    </DialogHeader>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead className="text-end">Delete</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Team.map((member) => (
                          <TableRow key={member.id}>
                            <TableCell>{member.email}</TableCell>
                            <TableCell>{member.role}</TableCell>
                            <TableCell className="flex justify-end">
                              <Button
                                size="icon"
                                variant={"destructive"}
                                onClick={() => handleDeleteTeam(member.id)}
                              >
                                <Trash2 width={15} height={15} />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </main>
    );
  }
  if (!IsUserVerified && !IsUserVerifyLoading) {
    return (
      <main className="flex flex-col items-center w-full h-screen bg-slate-100 py-10">
        <span className="text-3xl font-bold">Not allowed</span>
      </main>
    );
  }

  if (IsUserVerifyLoading) {
    return (
      <main className="flex flex-col items-center w-full h-screen bg-slate-100 py-10">
        <span className="text-3xl font-bold">Loading...</span>
      </main>
    );
  }
};

export default Page;
