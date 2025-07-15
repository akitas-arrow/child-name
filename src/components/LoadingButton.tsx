"use client";

import { ComponentProps } from "react";
import { Button } from "./ui/button";
import { Loader2Icon } from "lucide-react";
import { useFormStatus } from "react-dom";

// Props型を明示的に定義
type LoadingButtonProps = ComponentProps<typeof Button> & {
  children: React.ReactNode;
};

export const LoadingButton = ({ children, ...props }: LoadingButtonProps) => {
  // フォームの送信状態を取得
  const { pending: isLoading } = useFormStatus();
  return (
    <Button disabled={isLoading} {...props}>
      {isLoading && <Loader2Icon className="animate-spin" />}
      {children}
    </Button>
  );
};
