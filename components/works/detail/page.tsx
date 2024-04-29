"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/context/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  CalendarIcon,
  EyeIcon,
  HeartIcon,
  MessageCircleIcon,
  MoreVerticalIcon,
  Pen,
  ThumbsUp,
  Trash,
  UserIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import DeleteModalDetail from "./delete-modal";

interface DataType {
  id: number;
  title: string;
  content: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string;
    username: string;
  };
  Comment: {
    id: number;
    content: string;
    createdAt: string;
    updatedAt: string;
    user: {
      id: string;
      name: string;
      username: string;
    };
  }[];
}

const FormSchema = z.object({
  content: z
    .string({
      required_error: "Comment is required.",
    })

    .min(4, {
      message: "Comment must be at least 4 characters.",
    })
    .max(500, {
      message: "Comment must be at most 500 characters.",
    }),
});

function DetailWork() {
  const params = useParams<{ workId: string }>();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const user = useUser();
  const [data, setData] = useState<DataType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const { workId } = params;
  const router = useRouter();

  async function getData() {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/images/detail/${workId}`
    );
    const data = await response.json();
    if (data.status == "error") {
      setLoading(false);
      setIsError(true);
    } else {
      setData(data.data);
      setLoading(false);
      setLikeCount(data.like);
      if (user) {
        const likedByUser = data.data.Like.some(
          (like: any) => like.userId === user.id
        );
        setLoading(false);
        setIsLiked(likedByUser);
        setCommentCount(data.data.Comment.length);
      }
    }
  }
  useEffect(() => {
    getData();
    return () => {};
  }, []);

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    if (!user) {
      toast.error("Please login first");
      return;
    }
    setIsSending(true);
    const formData = new FormData();

    // Append data to FormData
    formData.append("content", values.content);
    formData.append("userId", user.id);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${workId}`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await response.json();
    if (data.status == "error") {
      toast.error(data.message);
      setIsSending(false);
    } else {
      getData();
      toast.success(data.message);
      form.reset({
        content: "",
      });
      setIsSending(false);
    }
  }

  async function handleDeleteComment(id: number) {
    if (!user) {
      toast.error("Please login first");
      return;
    }
    const formData = new FormData();
    formData.append("userId", user.id);
    formData.append("commentId", `${id}`);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${id}`,
      {
        body: formData,
        method: "DELETE",
      }
    );
    const data = await response.json();
    if (data.status == "error") {
      toast.error(data.message);
    } else {
      getData();
      toast.success(data.message);
    }
  }

  async function handleLike() {
    if (!user) {
      toast.error("Please login first");
      return;
    }
    const formData = new FormData();
    formData.append("userId", user.id);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/like/${workId}`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await response.json();
    if (data.status == "error") {
      toast.error(data.message);
    } else {
      getData();
      toast.success(data.message);
    }
  }

  function handleEdit() {
    router.push(`/works/edit/${workId}`);
  }

  return (
    <main className="px-10 sm:px-20 pt-24">
      {isError && !data && (
        <div className="flex flex-col items-center justify-center h-screen">
          <Image
            alt="404 Not Found"
            className="mb-8 w-full h-1/2 object-contain"
            height={3000}
            width={3000}
            src="/NotFound.png"
          />
          <div className="space-y-4 text-center">
            <h1 className="text-3xl font-bold">Oops! Image not found.</h1>
            <p className="text-gray-500 dark:text-gray-400">
              The image you are looking for does not exist.
            </p>
            <Button asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      )}
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full border-4 border-gray-900 border-t-transparent h-12 w-12 dark:border-gray-50" />
        </div>
      ) : (
        data && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 max-h-[50vh] py-4 content-start">
              <Image
                alt={data.title}
                className="w-full col-span-2 object-contain mb-10 max-h-screen"
                height={200000}
                placeholder="blur"
                blurDataURL={`${process.env.NEXT_PUBLIC_API_URL}/public/images/${data.image}`}
                width={200000}
                src={`${process.env.NEXT_PUBLIC_API_URL}/public/images/${data.image}`}
              />
              <div className="flex flex-col gap-6 border rounded-xl p-8 w-full">
                <div className="flex flex-col gap-5">
                  <div className="flex w-full justify-between">
                    <div className="text-3xl md:text-4xl font-bold w-full  break-all">
                      {data.title}
                    </div>
                    {user && user.id.toString() === data.user.id.toString() && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            className="h-8 w-8"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreVerticalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-primary gap-2"
                            onClick={() => {
                              handleEdit();
                            }}
                          >
                            <Pen className="size-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500 gap-2"
                            onClick={() => {
                              setOpenDeleteModal(true);
                            }}
                          >
                            <Trash className="size-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                  <div className="flex flex-col gap-4">
                    {data.content}
                    <Separator />
                  </div>
                  <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-5 h-5" />
                      <span>{data.user.name}</span>
                    </div>
                    <div className="flex items-center space-x-2 gap-2">
                      <CalendarIcon className="w-5 h-5" />
                      <span>
                        {format(new Date(data.createdAt), "MMMM dd, yyyy")}
                      </span>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-4">
                    <div
                      className="cursor-pointer flex items-center gap-2"
                      onClick={handleLike}
                    >
                      {isLiked ? (
                        <HeartIcon className="w-5 h-5 stroke-red-500 fill-red-500 " />
                      ) : (
                        <HeartIcon className="w-5 h-5" />
                      )}
                      <span>{likeCount} likes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircleIcon className="w-5 h-5" />
                      <span>{commentCount} comments</span>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Comments</h2>
                  <div className="flex flex-col gap-4 w-full">
                    {data.Comment.length > 0 ? (
                      data.Comment.map((item) => (
                        <div className="flex flex-col gap-6" key={item.id}>
                          <div className="flex items-start gap-4">
                            <Avatar>
                              <AvatarImage
                                alt="Avatar"
                                src="/placeholder-avatar.svg"
                              />
                              <AvatarFallback>
                                {`${item.user.name
                                  ?.split(" ")
                                  .map((name) => name[0])
                                  .join("")}
                              `}
                              </AvatarFallback>
                            </Avatar>
                            <div className="space-y-2 w-full">
                              <div className="flex items-center justify-between">
                                <div className="font-medium">
                                  {item.user.name}
                                </div>
                                <div className="flex items-center gap-2 ">
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {format(
                                      new Date(item.createdAt),
                                      "MMMM dd, yyyy"
                                    )}
                                  </div>
                                  {user && user.id === item.user.id && (
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button
                                          className="h-8 w-8"
                                          size="icon"
                                          variant="ghost"
                                        >
                                          <MoreVerticalIcon className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                          className="text-red-500 gap-2"
                                          onClick={() =>
                                            handleDeleteComment(item.id)
                                          }
                                        >
                                          <Trash className="size-4" />
                                          Delete
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  )}
                                </div>
                              </div>
                              <div className="break-words max-w-md">
                                <p>{item.content}</p>
                              </div>
                            </div>
                          </div>
                          <Separator />
                        </div>
                      ))
                    ) : (
                      <>
                        <p>No comments yet</p>
                        <Separator />
                      </>
                    )}
                  </div>
                  <div className="space-y-2 py-2">
                    <h3 className="text-xl font-bold">Leave a Comment</h3>
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full space-y-6"
                      >
                        <FormField
                          control={form.control}
                          name="content"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Textarea
                                  disabled={isSending}
                                  placeholder="Write a comment..."
                                  className="w-full"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" disabled={isSending}>
                          Submit
                        </Button>
                      </form>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
            <DeleteModalDetail
              open={openDeleteModal}
              setOpen={setOpenDeleteModal}
              user={user}
              imageId={`${data.id}`}
              router={router}
            />
          </>
        )
      )}
    </main>
  );
}

export default DetailWork;
