"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/context/user";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadCloudIcon } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ZodType, z } from "zod";

const imageSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().min(1, {
    message: "Content is required",
  }),
});

type FormValues = z.infer<typeof imageSchema>;
function EditWorkPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const user = useUser();
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState<any>();

  const form = useForm<FormValues>({
    resolver: zodResolver(imageSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });
  const router = useRouter();
  const params = useParams<{ workId: string }>();

  useEffect(() => {
    setLoading(false);

    async function getData() {
      if (!user) {
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/images/edit/${params.workId}/${user.id}`,
        {
          method: "GET",
        }
      );
      const responseData = await response.json();
      console.log(responseData);
      if (responseData.status == "error") {
        toast.error(responseData.message);
        setIsError(true);
        setLoading(false);
      } else {
        setIsError(false);
        setLoading(false);
        form.reset({
          title: responseData.data.title,
          content: responseData.data.content,
        });
        setData(responseData.data);
      }
    }
    getData();

    return () => {};
  }, [user, params.workId]);

  const onSubmit = async (values: FormValues) => {
    // Create new FormData object
    const formData = new FormData();

    // Append data to FormData
    formData.append("title", values.title);
    formData.append("content", values.content);
    // formData.append("image", image as File);
    formData.append("userId", user?.id as string);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/images/${params.workId}`,
      {
        method: "PATCH",
        body: formData,
      }
    );

    const data = await response.json();
    console.log(data);
    if (data.status == "error") {
      toast.error(data.message);
    } else {
      toast.success(data.message);
      router.push(`/works/${data.data.id}`);
    }
  };
  return (
    <div className="pt-20">
      <main className="container px-4 md:px-6 py-12 md:py-24">
        {isError ? (
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold">Error</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Something went wrong.
            </p>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold">Loading...</h1>
          </div>
        ) : !isError && !loading ? (
          <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold">Edit an Work</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Edit an Work to your account.
            </p>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn("w-full space-y-5 flex flex-col justify-center")}
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Title <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="w-full"
                          type="text"
                          placeholder="Title..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Content <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          className="w-full"
                          placeholder="Content..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {data?.image && (
                  <>
                    <p className="text-md font-medium leading-none text-muted-foreground">
                      You can&apos;t change the image.
                    </p>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}/public/images/${data?.image}`}
                      alt="image"
                      className="h-full w-full"
                      width={1000}
                      height={1000}
                    />
                  </>
                )}

                <Button className="w-full" type="submit">
                  Upload Image
                </Button>
              </form>
            </Form>
          </div>
        ) : null}
      </main>
    </div>
  );
}

export default EditWorkPage;
