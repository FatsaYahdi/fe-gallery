import Image from "next/image";
import Link from "next/link";
import NotFoundImage from "@/public/NotFound.png";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="h-screen w-screen flex items-center justify-center flex-col">
      <Image
        src={NotFoundImage}
        alt="404"
        width={750}
        height={750}
        className="h-auto"
      />
      <h4 className="text-lg">
        <span className="font-bold text-[#10d3ff]">I</span>con by{" "}
        <Link
          href={"https://twitter.com/sawaratsuki1004"}
          className="underline"
          target="_blank"
        >
          <span className="text-[#10d3ff]">@</span>sawaratsuki1004
        </Link>
      </h4>
      <Button
        asChild
        variant={"default"}
        className="mt-10 bg-[#0cd5ff] hover:bg-[#0cd5ff]/80"
      >
        <Link href={"/"}>Go To Home</Link>
      </Button>
    </div>
  );
}
