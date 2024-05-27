"use client";

import { useEffect } from "react";
import { useAuthContext } from "@/lib/AuthContextProvider";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(5).max(20),
});

export default function Page() {
  const { toast } = useToast();
  const { isAuthenticated, login } = useAuthContext();
  const router = useRouter();
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log(values);
    try {
      const response = await fetch("http://localhost:4000/admin/auth/login", {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
        }),
      });
      const json = await response.json();
      if (!response.ok) {
        toast({
          variant: "destructive",
          description: `出错啦！错误信息：${json.error}`,
        });
      }
      if (response.ok) {
        login();
        toast({ description: `欢迎 ${json.admin} 来到觉意阅读后台！` });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: `出错啦！错误信息：${error}`,
      });
    }
  }
  return (
    <main className="min-h-screen flex">
      <div className="w-1/2 bg-stone-950 text-white relative">
        <div className="absolute bottom-10 p-6 font-light tracking-wider space-y-4">
          <p className="text-xl">
            &quot;The url of the system must be kept secret. Registration is
            closed.&quot;
          </p>
          <p className="">Root</p>
        </div>
      </div>
      <div className="w-1/2 flex justify-center items-center">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>用户名</FormLabel>
                  <FormControl>
                    <Input placeholder="用户名" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>密码</FormLabel>
                  <FormControl>
                    <Input placeholder="密码" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">登录</Button>
          </form>
        </Form>
      </div>
    </main>
  );
}
