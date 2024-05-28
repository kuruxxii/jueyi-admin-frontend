"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

type Journal = {
  title: string;
  description: string;
  vol: number;
  coverUrl: string;
  articles: string[];
};

const formSchema = z.object({
  title: z.string().min(4).max(30),
  coverUrl: z.string().url(),
  description: z.string().min(50).max(120),
  vol: z.coerce.number().nonnegative(),
});

export function ModificationForm({ journal }: { journal: Journal }) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: journal.title,
      coverUrl: journal.coverUrl,
      description: journal.description,
      vol: journal.vol,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log(values);
    try {
      const response = await fetch(
        `http://localhost:4000/admin/journals/${journal.vol}`,
        {
          credentials: "include",
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...values,
            vol: Number(values.vol),
          }),
        }
      );
      const json = await response.json();
      if (!response.ok) {
        toast({
          variant: "destructive",
          description: `出错啦！错误信息：${json.error}`,
        });
      }
      if (response.ok) {
        toast({ description: `成功修改周刊` });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: `出错啦！错误信息：${error}`,
      });
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>标题</FormLabel>
              <FormControl>
                <Input placeholder="标题" {...field} />
              </FormControl>
              <FormDescription>30个字符以内</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="coverUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>封面图URL</FormLabel>
              <FormControl>
                <Input placeholder="封面图URL" {...field} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>简介</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormDescription>120字以内</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="vol"
          render={({ field }) => (
            <FormItem>
              <FormLabel>期数 Vol.</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="期数 Vol."
                  disabled
                  {...field}
                />
              </FormControl>
              <FormDescription>{"期数 >= 0"}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">提交</Button>
      </form>
    </Form>
  );
}
