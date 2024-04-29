"use client";

import { Loader2, ZoomInIcon } from "lucide-react";
import Link from "next/link";
import { Suspense, useContext, useEffect, useState } from "react";

import NotFoundImage from "@/public/NotFound.png";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ImageType {
  id: number;
  title: string;
  content: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  user: {
    name: string;
    username: string;
  };
}

export default function HomePage() {
  const [data, setData] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState(false);
  async function getImages() {
    setLoading(true);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/images`,
      {
        method: "GET",
      }
    );

    const data = await response.json();
    setData(data.data);
    setLoading(false);
  }

  useEffect(() => {
    getImages();
    return () => {};
  }, []);

  return (
    <main
      className={cn("flex w-full px-4", data.length > 0 ? "pt-24" : "pt-0")}
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : data.length > 0 ? (
        <div className="grid w-full gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8 4xl:grid-cols-9 5xl:grid-cols-10 6xl:grid-cols-12 ">
          {data.map((image) => (
            <Link
              className="group relative overflow-hidden rounded-lg"
              href={`/works/${image.id}`}
              key={image.id}
            >
              <Suspense fallback={<Loader2 className="size-4 animate-spin" />}>
                <Image
                  alt={image.title}
                  className="aspect-square object-cover w-full transition-all group-hover:scale-110"
                  height={10000}
                  width={10000}
                  src={`${process.env.NEXT_PUBLIC_API_URL}/public/images/${image.image}`}
                />
              </Suspense>
              <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomInIcon className="text-white h-8 w-8" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <section className="flex flex-col items-center justify-center h-screen w-full px-4 md:px-6">
          <div className="mt-8 max-w-[600px] text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Unleash Your Creativity
            </h1>
            <p className="mt-4 text-gray-500 dark:text-gray-400 md:text-xl">
              Explore the world of digital art and create your own artworks.
            </p>
            <Button className="mt-6" asChild>
              <Link href={"/works/new"}>Create Artwork</Link>
            </Button>
          </div>
        </section>
      )}
    </main>
  );
}
