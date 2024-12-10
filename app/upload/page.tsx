"use client";

import {
  useForm,
  SubmitHandler,
  Control,
  Controller,
  UseFormWatch,
} from "react-hook-form";
import { useState } from "react";
import Image from "next/image";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema, Schema } from "./schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function UploadPage() {
  const [img, setImg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  });
  const onSubmit: SubmitHandler<Schema> = (data) => console.log(data);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImg(URL.createObjectURL(file));
    } else {
      setImg(null);
    }
  };

  console.log(watch("name"));

  return (
    <main className="h-screen w-full flex justify-center items-start pt-[3rem]">
      <Card className="w-full md:w-1/2 lg:w-1/3">
        <CardHeader>
          <CardTitle>Upload to the Gallery Platform</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col justify-center gap-5"
          >
            <div>
              <Label htmlFor="name">Photograph Title</Label>
              <Input {...register("name")} id="name" placeholder="name" />
            </div>

            <div>
              <Label htmlFor="author">Author</Label>
              <Input
                {...register("author", { required: true })}
                id="author"
                placeholder="author"
              />
              {errors.author && <span>This field is required</span>}
            </div>

            <div>
              <Label htmlFor="picture">Picture</Label>
              <Input id="picture" type="file" onChange={handleFileChange} />
            </div>

            {img && (
              <div className="relative w-full">
                <Image
                  src={img}
                  alt="selected image"
                  width={50}
                  height={0}
                  sizes="90vw"
                  className="rounded w-full h-auto"
                />
              </div>
            )}

            <Tags control={control} watch={watch} />

            <Button type="submit">Submit</Button>
          </form>
        </CardContent>
      </Card>
      <DevTool control={control} />
    </main>
  );
}

function Tags({
  control,
  watch,
}: {
  control: Control<Schema>;
  watch: UseFormWatch<Schema>;
}) {
  const tags = watch("tags", ""); // Watch the "tags" field with an empty string as the default

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor="tags">Tags</Label>
      <Controller
        name="tags"
        control={control}
        rules={{ required: "Tags are required" }}
        render={({ field, fieldState: { error } }) => (
          <>
            <Input
              id="tags"
              type="text"
              placeholder="tags"
              value={field.value || ""}
              onChange={(e) => field.onChange(e.target.value)}
            />
            {error && (
              <span className="text-red-500 text-sm">{error.message}</span>
            )}
          </>
        )}
      />
      <aside className="flex gap-1 flex-wrap mt-2">
        {tags
          ?.split(" ")
          .filter((tag) => tag.trim() !== "")
          .map((tag, idx) => (
            <Badge key={idx} variant="secondary">
              {tag.trim()}
            </Badge>
          ))}
      </aside>
    </div>
  );
}
