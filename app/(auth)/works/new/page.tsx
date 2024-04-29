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
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ZodType, z } from "zod";

const imageSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().min(1, {
    message: "Content is required",
  }),
  image:
    typeof window === "undefined"
      ? z.any()
      : z.instanceof(File, {
          message: "Image must be a file",
        }),
});

type FormValues = z.infer<typeof imageSchema>;

function CreatePage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const user = useUser();
  const [image, setImage] = useState<File | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(imageSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });
  const router = useRouter();
  const onSubmit = async (values: FormValues) => {
    // Create new FormData object
    const formData = new FormData();

    // Append data to FormData
    formData.append("title", values.title);
    formData.append("content", values.content);
    formData.append("image", image as File);
    formData.append("userId", user?.id as string);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/images/`,
      {
        method: "POST",
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
        <div className="max-w-2xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold">Upload an Work</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Upload an image to your profile to showcase your work.
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
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Image <span className="text-red-500">*</span>
                    </FormLabel>
                    <div
                      className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-12 flex flex-col items-center justify-center space-y-4 cursor-pointer"
                      onClick={() => {
                        inputRef.current?.click();
                      }}
                    >
                      {image ? (
                        <Image
                          src={URL.createObjectURL(image)}
                          alt="image"
                          className="h-full w-full"
                          width={1000}
                          height={1000}
                        />
                      ) : (
                        <>
                          <UploadCloudIcon className="h-12 w-12 text-gray-500 dark:text-gray-400" />
                          <p className="text-gray-500 dark:text-gray-400">
                            Click to select an image file to upload.
                          </p>
                        </>
                      )}
                    </div>
                    <Input
                      ref={inputRef}
                      type="file"
                      onChange={(e) => {
                        if (e.target.files) {
                          setImage(e.target.files[0]);
                          form.setValue("image", e.target.files[0] as any);
                          form.clearErrors("image");
                        }
                      }}
                      className="sr-only hidden"
                      accept="image/*"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className="w-full" type="submit">
                Upload Image
              </Button>
            </form>
          </Form>
          {/* <div className="space-y-2">
            <h1 className="text-3xl font-bold">Upload an Image</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Upload an image to your account and share it with the world.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Enter a title for your image" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter a description for your image"
            />
          </div>
          <div
            onClick={() => {
              inputRef.current?.click();
            }}
            className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-12 flex flex-col items-center justify-center space-y-4 cursor-pointer"
          >
            {image ? (
              <Image
                src={URL.createObjectURL(image)}
                alt="image"
                className="h-full w-full"
                width={1000}
                height={1000}
              />
            ) : (
              <>
                <UploadCloudIcon className="h-12 w-12 text-gray-500 dark:text-gray-400" />
                <p className="text-gray-500 dark:text-gray-400">
                  Click to select an image file to upload.
                </p>
              </>
            )}
          </div> */}
        </div>
      </main>
    </div>
  );
}

export default CreatePage;
