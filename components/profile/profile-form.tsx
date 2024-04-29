"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useUser } from "@/context/user";
import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { useRouter } from "next/navigation";

const profileFormSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
  const [userData, setUserData] = useState<any>(null);
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    setUserData(user);
  }, [user]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: { name: userData?.name ?? "asd" },
  });

  useEffect(() => {
    console.log(userData);
    form.setValue("name", userData?.name);
  }, [form, userData]);

  const { handleSubmit } = form;

  async function onSubmit(values: ProfileFormValues) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/update-profile`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          userId: `${userData?.id}`,
        }),
      }
    );
    const data = await response.json();
    if (data.status == "error") {
      toast.error(data);
    } else {
      toast.success(data.message);
      localStorage.setItem("token", data.data.token);
      router.refresh();
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Label>Name</Label>
        <div className="flex">
          <span className="rounded-e-0 inline-flex items-center rounded-s-md border border-e-0 border-gray-300 bg-gray-200 px-3 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-400">
            @
          </span>
          <Input
            placeholder="name"
            defaultValue={userData?.username}
            disabled
            className="border-s-0 rounded-s-none"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Your username is used to identify you. Your username cannot be
          changed.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={() => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input placeholder="..." {...form.register("name")} />
                </FormControl>
                <FormDescription>
                  Your display name is publicly visible.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Update profile</Button>
        </form>
      </Form>
    </div>
  );
}
