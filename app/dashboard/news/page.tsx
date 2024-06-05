"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";

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
import { useToast } from "@/components/ui/use-toast";
import { HOST } from "@/lib/url";

type News = {
  content: string[];
};

const formSchema = z.object({
  content: z.string().array().optional(),
});

export default function NewsForm() {
  const { toast } = useToast();
  const [news, setNews] = useState<News>();
  useEffect(() => {
    const getNews = async () => {
      let url = `http://${HOST}/admin/news`;
      const response = await fetch(url, {
        credentials: "include",
        cache: "no-store",
      });
      const json = await response.json();
      setNews(json);
      form.reset({ content: json.content });
    };
    getNews();
  }, []);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: news?.content,
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "content",
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // console.log(values);
    try {
      const response = await fetch(`http://${HOST}/admin/news`, {
        credentials: "include",
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: values.content,
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
        toast({ description: `成功修改通知` });
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
        {fields.map((field, index) => (
          <FormField
            key={field.id}
            control={form.control}
            name={`content.${index}`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>通知 {index + 1}</FormLabel>
                <FormControl>
                  <div className="flex items-center">
                    <Input placeholder="通知内容" {...field} />
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
          + 添加通知
        </Button>
        <Button type="submit" className="block mx-auto">
          提交
        </Button>
      </form>
    </Form>
  );
}
