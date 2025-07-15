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
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

type Submitter = {
  id: string;
  name: string;
  kana_name: string;
  user_id?: string;
};

type Props = {
  submitters: Submitter[];
};

export const NameSubmissionForm = ({ submitters }: Props) => {
  const supabase = createClient();
  const [name, setName] = useState("");
  const [reading, setReading] = useState("");
  const [gender, setGender] = useState("");
  const [meaning, setMeaning] = useState("");
  const [submitterId, setSubmitterId] = useState("");

  const onSubmit = async (data: {
    name: string;
    reading: string;
    meaning: string;
    gender: string;
    submitter_id: string;
  }) => {
    const { error } = await supabase.from("name_suggestions").insert(data);
    if (error) {
      alert("名前の提案に失敗しました。もう一度お試しください。");
    }
  };

  // ひらがなのみを許可する関数
  const isHiragana = (str: string): boolean => {
    return /^[あ-ん]*$/.test(str);
  };

  const handleReadingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // すべての文字の入力を許可
    setReading(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      name.trim() &&
      reading.trim() &&
      gender &&
      submitterId &&
      isHiragana(reading.trim())
    ) {
      onSubmit({
        name: name.trim(),
        reading: reading.trim(),
        gender,
        meaning: meaning.trim(),
        submitter_id: submitterId,
      });
      setName("");
      setReading("");
      setGender("");
      setMeaning("");
      setSubmitterId("");
    }
  };

  const isReadingValid = reading === "" || isHiragana(reading);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>名前を提案する</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="name">名前</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例：礼、葉、心"
              required
            />
          </div>

          <div>
            <Label htmlFor="reading">読み方（ひらがなのみ）</Label>
            <Input
              id="reading"
              value={reading}
              onChange={handleReadingChange}
              placeholder="例：たろう、はなこ"
              required
              className={!isReadingValid ? "border-red-500" : ""}
            />
            {!isReadingValid && (
              <p className="text-sm text-red-500 mt-1">
                ひらがなのみで入力してください
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="gender">性別</Label>
            <Select value={gender} onValueChange={setGender} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="性別を選択してください" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">男の子</SelectItem>
                <SelectItem value="female">女の子</SelectItem>
                <SelectItem value="unisex">どちらでも</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="submitter_id">提案者の名前</Label>
            <Select value={submitterId} onValueChange={setSubmitterId} required>
              <SelectTrigger className="w-full">
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
          </div>

          <div>
            <Label htmlFor="meaning">理由・由来（任意）</Label>
            <Textarea
              id="meaning"
              value={meaning}
              onChange={(e) => setMeaning(e.target.value)}
              placeholder="この名前を提案する理由や由来があれば教えてください"
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full">
            名前を提案する
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
