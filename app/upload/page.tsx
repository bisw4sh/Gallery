"use client";

import {
  useForm,
  type SubmitHandler,
  type Control,
  Controller,
  type UseFormWatch,
  type FieldErrors,
} from "react-hook-form";
import { useEffect, useState } from "react";
import Image from "next/image";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema, type Schema } from "./schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/utils/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { ErrorMessage } from "@hookform/error-message";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

let supabase: ReturnType<typeof createClient>;

export default function UploadPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  useEffect(() => {
    supabase = createClient();
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  });
  const router = useRouter();

  const onSubmit: SubmitHandler<Schema> = async (data) => {
    if (supabase) {
      try {
        const file = data.picture[0];
        const fileName = uuidv4();

        const { error: uploadError } = await supabase.storage
          .from("imgsrc")
          .upload(fileName, file, {
            cacheControl: "3600",
            upsert: true,
          });

        if (uploadError) {
          console.error("Upload error:", uploadError.message);
          return;
        }

        toast("Image uploaded successfully!");
        const { data: publicUrlData } = supabase.storage
          .from("imgsrc")
          .getPublicUrl(fileName);

        const imageUrl = publicUrlData.publicUrl;
        console.log("Image URL:", imageUrl);

        const { error: insertError } = await supabase
          .from("temp_images")
          .insert([
            {
              title: data.title,
              author: data.author,
              tags: data?.tags?.split(" "),
              link: imageUrl,
            },
          ]);

        if (insertError) {
          toast(`Database entry was unsuccessful : ${insertError.message}`);
          return;
        }

        toast("Database entry was successful");
        router.push("/");
      } catch (error) {
        console.error("An error occurred:", error);
      }
    }
  };

  const imgPreview = watch("picture");
  useEffect(() => {
    if (imgPreview && imgPreview.length > 0) {
      const file = imgPreview[0];
      const url = URL.createObjectURL(file);
      setImageUrl(url);

      return () => URL.revokeObjectURL(url);
    }
  }, [imgPreview]);

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
              <Input {...register("title")} id="name" placeholder="name" />
              <ErrorMessage errors={errors} name="title" />
            </div>

            <div>
              <Label htmlFor="author">Author</Label>
              <Input
                {...register("author", { required: true })}
                id="author"
                placeholder="author"
              />
              <ErrorMessage errors={errors} name="author" />
            </div>

            <div>
              <Label htmlFor="picture">Picture</Label>
              <Input
                id="picture"
                type="file"
                {...register("picture", { required: true })}
              />
              <ErrorMessage errors={errors} name="picture" />
            </div>

            {imageUrl && (
              <div className="relative w-full">
                <Image
                  src={imageUrl}
                  alt="selected image"
                  width={50}
                  height={0}
                  sizes="90vw"
                  className="rounded w-full h-auto"
                />
              </div>
            )}

            <Tags control={control} watch={watch} errors={errors} />

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
  errors,
}: {
  control: Control<Schema>;
  watch: UseFormWatch<Schema>;
  errors: FieldErrors<Schema>;
}) {
  const tags = watch("tags", "");

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor="tags">Tags</Label>
      <Controller
        name="tags"
        control={control}
        rules={{ required: "Tags are required" }}
        render={({ field }) => (
          <>
            <Input
              id="tags"
              type="text"
              placeholder="space separated tags"
              value={field.value || ""}
              onChange={(e) => field.onChange(e.target.value)}
            />
            <ErrorMessage errors={errors} name="tags" />
          </>
        )}
      />
      <aside className="flex gap-1 flex-wrap mt-2">
        {tags
          ?.split(" ")
          .filter((tag) => tag.trim() !== "")
          .map((tag, idx) => (
            <Badge key={idx + tag} variant="secondary">
              {tag.trim()}
            </Badge>
          ))}
      </aside>
    </div>
  );
}
