import { LoaderCircle } from "lucide-react";
import React from "react";

function Loading() {
  return (
    <div className="flex items-center justify-center w-full h-screen">
      <LoaderCircle className="animate-spin h-12 w-12" />
    </div>
  );
}

export default Loading;
