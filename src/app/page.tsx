import { NameList } from "@/components/NameList";
import { NameSubmissionForm } from "@/components/NameSubmissionForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";
import { Baby } from "lucide-react";

export default async function Home() {
  const supabase = await createClient();
  const { data: names } = await supabase.from("name_suggestions").select();
  const { data: submitters } = await supabase.from("submitters").select();

  if (!names || !submitters) {
    return;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <Card className="text-center">
          <CardHeader>
            <div className="flex items-center justify-center gap-3 mb-2">
              <Baby className="w-8 h-8 text-pink-500" />
              <CardTitle className="text-2xl lg:text-3xl">
                子どもの名前募集
              </CardTitle>
              <Baby className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-muted-foreground">
              みなさんから<strong>漢字一文字</strong>
              の素敵な名前のご提案をお待ちしています。
              名前と読み方を一緒に教えてください！
            </p>
          </CardHeader>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <NameSubmissionForm submitters={submitters} />
          </div>
          <div className="lg:col-span-2">
            <NameList names={names} />
          </div>
        </div>
        <Card>
          <CardContent className="text-center py-6">
            <p className="text-muted-foreground">
              素敵な名前をたくさんご提案いただき、ありがとうございます！
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
