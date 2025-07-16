import React, { useRef, useState, useEffect } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

interface Name {
  id: string;
  name: string;
  reading: string;
  gender: string;
  meaning: string;
}

interface NameCardProps {
  nameData: Name;
}

export function NameCard({ nameData }: NameCardProps) {
  const getCategoryLabel = (gender: string) => {
    switch (gender) {
      case "male":
        return "男の子";
      case "female":
        return "女の子";
      case "unisex":
        return "どちらでも";
      default:
        return gender;
    }
  };

  const getCategoryColor = (gender: string) => {
    switch (gender) {
      case "male":
        return "bg-blue-100 text-blue-800";
      case "female":
        return "bg-pink-100 text-pink-800";
      case "unisex":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const [expanded, setExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const meaningRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (meaningRef.current) {
      const el = meaningRef.current;
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight || "0");
      const maxHeight = lineHeight * 2;
      setIsClamped(el.scrollHeight > maxHeight + 1);
    }
  }, [nameData.meaning]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">{nameData.name}</CardTitle>
        <CardDescription>({nameData.reading})</CardDescription>
        <CardAction>
          <Badge className={getCategoryColor(nameData.gender)}>
            {getCategoryLabel(nameData.gender)}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        {nameData.meaning && (
          <div className="relative">
            <p
              ref={meaningRef}
              className={
                "text-muted-foreground whitespace-pre-wrap transition-all duration-200 " +
                (!expanded && isClamped ? " max-h-15" : "")
              }
              style={{
                overflow: !expanded && isClamped ? "hidden" : undefined,
              }}
            >
              {nameData.meaning}
            </p>
            {isClamped && (
              <Button
                variant="ghost"
                type="button"
                className={
                  "absolute bottom-0 left-0 w-full pb-0 rounded-none" +
                  (!expanded && isClamped
                    ? " bg-linear-to-t from-white to-white/40"
                    : "")
                }
                onClick={() => setExpanded((v) => !v)}
                aria-label={expanded ? "折りたたむ" : "全文表示"}
              >
                {expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
