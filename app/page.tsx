"use client";

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

const formSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(5).max(20),
});

export default function Page() {
  const { isAuthenticated, login } = useAuthContext();
  console.log(isAuthenticated);
  const router = useRouter();
  if (isAuthenticated) {
    router.push("/dashboard");
  }
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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
        }),
      });
      const json = await response.json();
      if (!response.ok) {
        console.log(json.error);
      }
      if (response.ok) {
        login();
        console.log(json);
        // save the user to local storage
        // localStorage.setItem('user', JSON.stringify(json))
      }
    } catch (error) {
      console.log(error);
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
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field} />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </main>
  );
}
