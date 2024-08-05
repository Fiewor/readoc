"use client";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
import axios from "axios";
import Image from "next/image";

const ACCEPTED_FILE_TYPES = ["png", "jpg"];

const formSchema = z.object({
  file: (typeof window === "undefined" ? z.any() : z.instanceof(FileList))
    .refine((file) => file?.length == 1, "File is required.")
    .refine((file) => {
      const fileExtension = file[0]?.name?.split(".")?.pop();
      return fileExtension && ACCEPTED_FILE_TYPES.includes(fileExtension);
    }, "Only png and jpg fomats are allowed"),
});

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log("data: ", data);
    const response = await axios.post("/api/read", data);
    console.log("response: ", response);
  }

  // const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {};

  const fileRef = form.register("file");

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-4/8"
        >
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel>File</FormLabel>
                <FormControl>
                  <Input
                    placeholder="file"
                    type="file"
                    className="file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:border-solid file:border-blue-700 file:rounded-md border-blue-600"
                    {...fileRef}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      const file = event.target.files?.[0];
                      console.log("file: ", file);
                      if (file) {
                        field.onChange(file ?? undefined);
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setSelectedFile(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </FormControl>
                <FormDescription>Upload image.</FormDescription>

                {selectedFile && (
                  <div className="mt-2 relative">
                    <Image
                      src={selectedFile}
                      alt="Preview"
                      className="rounded-md"
                      width={200}
                      height={200}
                    />
                  </div>
                )}
                <button
                  onClick={() => setSelectedFile(null)}
                  className="absolute top-0 right-0 bg-red-500 text-white py-1 px-2"
                  aria-label="Remove image"
                >
                  X
                </button>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Convert</Button>
        </form>
      </Form>
    </div>
  );
}
