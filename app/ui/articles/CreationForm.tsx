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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  slug: z.string().min(4).max(40),
  title: z.string().min(4).max(40),
  coverUrl: z.string().url(),
  introduction: z.string().min(50).max(120),
  author: z.string().min(1).max(20),
  read: z.string().min(1).max(2),
  topic: z.string().min(4),
  origin: z.string().min(1),
  content: z.string().min(1),
});

export function CreationForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slug: "",
      title: "",
      coverUrl: "",
      introduction: "",
      author: "",
      read: "",
      topic: "",
      origin: "",
      content: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log(values);
    try {
      const response = await fetch("http://localhost:4000/admin/articles", {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          read: Number(values.read),
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
        toast({ description: `成功添加文章《${json.title}》` });
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
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="Slug" {...field} />
              </FormControl>
              <FormDescription>
                e.g., 《怎样致富》的slug是how-to-get-rich
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>标题</FormLabel>
              <FormControl>
                <Input placeholder="标题" {...field} />
              </FormControl>
              <FormDescription>40字以内</FormDescription>
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
          name="introduction"
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
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>作者</FormLabel>
              <FormControl>
                <Input placeholder="作者" {...field} />
              </FormControl>
              <FormDescription>20字以内</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="read"
          render={({ field }) => (
            <FormItem>
              <FormLabel>阅读时间（分钟）</FormLabel>
              <FormControl>
                <Input type="number" placeholder="阅读时间" {...field} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>话题分类</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="话题" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="个人成长">个人成长</SelectItem>
                    <SelectItem value="商业财经">商业财经</SelectItem>
                    <SelectItem value="科技前沿">科技前沿</SelectItem>
                    <SelectItem value="人文社科">人文社科</SelectItem>
                    <SelectItem value="职场专题">职场专题</SelectItem>
                    <SelectItem value="校园学习专题">校园学习专题</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="origin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>文章来源</FormLabel>
              <FormControl>
                <Input placeholder="文章来源" {...field} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>文章内容</FormLabel>
              <FormControl>
                <Textarea {...field} className="h-96" />
              </FormControl>
              <FormDescription>不包含标题！markdown格式！</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
