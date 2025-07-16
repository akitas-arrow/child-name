import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";

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
          <p className="text-muted-foreground">{nameData.meaning}</p>
        )}
      </CardContent>
    </Card>
  );
}
