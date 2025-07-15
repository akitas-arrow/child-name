import { login } from "@/app/login/actions";
import { LoadingButton } from "@/components/LoadingButton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <form className="w-full max-w-sm">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>ログイン</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">メールアドレス</Label>
                <Input id="email" name="email" type="email" required />
                <Label htmlFor="password">パスワード</Label>
                <Input id="password" name="password" type="password" required />
                {/* <button formAction={signup}>Sign up</button> */}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <LoadingButton formAction={login} className="w-full">
              ログイン
            </LoadingButton>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
