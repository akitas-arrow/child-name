"use client";

import { Label } from "@radix-ui/react-label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";

type Submitter = {
  id: string;
  name: string;
  kana_name: string;
  user_id?: string;
};

type Props = {
  submitters: Submitter[];
};

const schema = z.object({
  name: z
    .string()
    .min(1, "名前は必須です")
    .max(1, "名前は1文字で入力してください"),
  reading: z
    .string()
    .min(1, "読み方は必須です")
    .regex(
      /^[あ-ん・、]+$/,
      "ひらがな、もしくは「・」「、」のみで入力してください"
    ),
  gender: z.enum(["male", "female", "unisex"], "性別を選択してください"),
  meaning: z
    .string()
    .max(500, "理由・由来は500文字以内で入力してください")
    .optional(),
  submitter_id: z.string().min(1, "提案者は必須です"),
});

type FormValues = z.infer<typeof schema>;

export const NameSubmissionForm = ({ submitters }: Props) => {
  const supabase = createClient();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      reading: "",
      gender: undefined,
      meaning: "",
      submitter_id: "",
    },
  });

  const onSubmit: (data: FormValues) => Promise<void> = async (data) => {
    const { error } = await supabase.from("name_suggestions").insert(data);
    if (error) {
      alert("名前の提案に失敗しました。もう一度お試しください。");
    } else {
      reset();
      router.refresh(); // フォーム送信成功時にRSCを再取得
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>名前を提案する</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label htmlFor="name">名前</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="例：心"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="reading">読み方（ひらがなのみ）</Label>
            <Input
              id="reading"
              {...register("reading")}
              placeholder="例：こころ"
              className={errors.reading ? "border-red-500" : ""}
            />
            {errors.reading && (
              <p className="text-sm text-red-500 mt-1">
                {errors.reading.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="gender">性別</Label>
            <Select
              value={watch("gender")}
              onValueChange={(val) =>
                setValue("gender", val as "male" | "female" | "unisex", {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger
                className={errors.gender ? "w-full border-red-500" : "w-full"}
              >
                <SelectValue placeholder="性別を選択してください" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">男の子</SelectItem>
                <SelectItem value="female">女の子</SelectItem>
                <SelectItem value="unisex">どちらでも</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && (
              <p className="text-sm text-red-500 mt-1">
                {errors.gender.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="submitter_id">提案者の名前</Label>
            <Select
              value={watch("submitter_id")}
              onValueChange={(val) =>
                setValue("submitter_id", val, { shouldValidate: true })
              }
            >
              <SelectTrigger
                className={
                  errors.submitter_id ? "w-full border-red-500" : "w-full"
                }
              >
                <SelectValue placeholder="提案者を選択してください" />
              </SelectTrigger>
              <SelectContent>
                {submitters.map((submitter) => (
                  <SelectItem key={submitter.id} value={submitter.id}>
                    {submitter.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.submitter_id && (
              <p className="text-sm text-red-500 mt-1">
                {errors.submitter_id.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="meaning">理由・由来（任意）</Label>
            <Textarea
              id="meaning"
              {...register("meaning")}
              placeholder="この名前を提案する理由や由来があれば教えてください"
              rows={3}
              className={errors.meaning ? "border-red-500" : ""}
            />
            {errors.meaning && (
              <p className="text-sm text-red-500 mt-1">
                {errors.meaning.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2Icon className="animate-spin" />}
            名前を提案する
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
