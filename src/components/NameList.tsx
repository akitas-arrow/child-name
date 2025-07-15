"use client";

import { useRef, useState } from "react";
import { NameCard } from "./NameCard";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type Name = {
  id: string;
  name: string;
  reading: string;
  gender: string;
  meaning: string;
};

type NameListProps = {
  names: Name[];
};

export const NameList = ({ names }: NameListProps) => {
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // ひらがな行のrefs
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const filteredNames = names.filter((name) => {
    if (filter === "all") return true;
    return name.gender === filter;
  });

  const sortedNames = [...filteredNames].sort((a, b) => {
    switch (sortBy) {
      case "alphabetical":
        // 読み方で並び替え
        return a.reading.localeCompare(b.reading, "ja");
      case "newest":
      default:
        return 0; // Keep original order (newest first)
    }
  });

  // 読み方の最初の文字でひらがな行を判定する関数
  const getHiraganaGroup = (reading: string): string => {
    const firstChar = reading.charAt(0);

    if (firstChar >= "あ" && firstChar <= "お") return "あ";
    if (firstChar >= "か" && firstChar <= "ご") return "か";
    if (firstChar >= "さ" && firstChar <= "ぞ") return "さ";
    if (firstChar >= "た" && firstChar <= "ど") return "た";
    if (firstChar >= "な" && firstChar <= "の") return "な";
    if (firstChar >= "は" && firstChar <= "ぽ") return "は";
    if (firstChar >= "ま" && firstChar <= "も") return "ま";
    if (firstChar >= "や" && firstChar <= "よ") return "や";
    if (firstChar >= "ら" && firstChar <= "ろ") return "ら";
    if (firstChar >= "わ" && firstChar <= "ん") return "わ";

    return "その他";
  };

  // 名前を読み方のひらがな行でグループ化
  const groupedNames =
    sortBy === "alphabetical"
      ? (() => {
          const groups: { [key: string]: Name[] } = {};
          const hiraganaOrder = [
            "あ",
            "か",
            "さ",
            "た",
            "な",
            "は",
            "ま",
            "や",
            "ら",
            "わ",
          ];

          // グループを初期化
          hiraganaOrder.forEach((group) => {
            groups[group] = [];
          });
          groups["その他"] = [];

          // 名前を読み方でグループに分類
          sortedNames.forEach((name) => {
            const group = getHiraganaGroup(name.reading);
            groups[group].push(name);
          });

          return groups;
        })()
      : {};

  const scrollToSection = (section: string) => {
    const element = sectionRefs.current[section];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const hiraganaButtons = [
    "あ",
    "か",
    "さ",
    "た",
    "な",
    "は",
    "ま",
    "や",
    "ら",
    "わ",
  ];

  console.log({ names });
  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2>提案された名前一覧 ({filteredNames.length}件)</h2>
        <div className="flex gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              <SelectItem value="male">男の子</SelectItem>
              <SelectItem value="female">女の子</SelectItem>
              <SelectItem value="unisex">どちらでも</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">新しい順</SelectItem>
              <SelectItem value="alphabetical">あいうえお順</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ひらがな行ナビゲーション（あいうえお順の時のみ表示） */}
      {sortBy === "alphabetical" && sortedNames.length > 0 && (
        <div className="flex flex-wrap gap-2 p-4 bg-muted rounded-lg">
          <span className="text-sm text-muted-foreground mr-2">
            行から選ぶ:
          </span>
          {hiraganaButtons.map((group) => {
            const hasNames =
              groupedNames[group] && groupedNames[group].length > 0;
            return (
              <Button
                key={group}
                variant={hasNames ? "outline" : "ghost"}
                size="sm"
                onClick={() => hasNames && scrollToSection(group)}
                disabled={!hasNames}
                className="min-w-[2.5rem]"
              >
                {group}
              </Button>
            );
          })}
        </div>
      )}

      {sortedNames.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {filter === "all"
            ? "名前がまだ提案されていません。"
            : "この性別の名前がありません。"}
        </div>
      ) : sortBy === "alphabetical" ? (
        // あいうえお順の場合はグループ化して表示
        <div className="space-y-8">
          {hiraganaButtons.map((group) => {
            const groupNames = groupedNames[group];
            if (!groupNames || groupNames.length === 0) return null;

            return (
              <div key={group} ref={(el) => {
                sectionRefs.current[group] = el;
              }}>
                <h3 className="mb-4 pb-2 border-b">{group}行</h3>
                <div className="grid gap-4">
                  {groupNames.map((name) => (
                    <NameCard key={name.id} nameData={name} />
                  ))}
                </div>
              </div>
            );
          })}
          {groupedNames["その他"] && groupedNames["その他"].length > 0 && (
            <div ref={(el) => {
              sectionRefs.current["その他"] = el;
            }}>
              <h3 className="mb-4 pb-2 border-b">その他</h3>
              <div className="grid gap-4">
                {groupedNames["その他"].map((name) => (
                  <NameCard key={name.id} nameData={name} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        // 新しい順の場合は通常表示
        <div className="grid gap-4">
          {sortedNames.map((name) => (
            <NameCard key={name.id} nameData={name} />
          ))}
        </div>
      )}
    </div>
  );
};
