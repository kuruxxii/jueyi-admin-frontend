"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
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
import { HOST } from "@/lib/url";

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
  description: z.string().min(100).max(400),
  vol: z.coerce.number().nonnegative(),
  articles: z.string().array().optional(),
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
      articles: journal.articles,
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "articles",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log(values);
    try {
      const response = await fetch(
        `http://${HOST}/admin/journals/${journal.vol}`,
        {
          credentials: "include",
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...values,
            vol: Number(values.vol),
            articles: values.articles,
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
              <FormDescription>100-400字</FormDescription>
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
                  disabled
                  type="number"
                  placeholder="期数 Vol."
                  {...field}
                />
              </FormControl>
              <FormDescription>{"期数 >= 0"}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {fields.map((field, index) => (
          <FormField
            key={field.id}
            control={form.control}
            name={`articles.${index}`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>文章 {index + 1}</FormLabel>
                <FormControl>
                  <div className="flex items-center">
                    <Input placeholder="文章的Slug" {...field} />
                    <Button
                      type="button"
                      onClick={() => remove(index)}
                      className="ml-2 bg-blue-600 transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                      删除
                    </Button>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        ))}
        <Button
          type="button"
          onClick={() => append("")}
          className="bg-blue-600 transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
          + 添加文章
        </Button>
        <Button type="submit" className="block mx-auto">
          提交
        </Button>
      </form>
    </Form>
  );
}
