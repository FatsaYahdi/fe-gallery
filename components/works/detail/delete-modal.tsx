import { Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { toast } from "sonner";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

function DeleteModalDetail({
  open,
  setOpen,
  user,
  imageId,
  router,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  user: any;
  imageId: string;
  router: AppRouterInstance;
}) {
  const handleDelete = async () => {
    if (!user) {
      toast.error("Please login first");
      return;
    }
    const formData = new FormData();
    formData.append("id", `${imageId}`);
    formData.append("userId", user.id);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/images`,
      {
        method: "DELETE",
        body: formData,
      }
    );
    const data = await response.json();
    if (data.status == "error") {
      toast.error(data.message);
    } else {
      toast.success(data.message);
      router.push("/");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Are you sure you want to permanently
            delete this file from our servers?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" variant="destructive" onClick={handleDelete}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteModalDetail;
