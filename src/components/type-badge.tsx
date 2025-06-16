import { ItemMovement } from "@/db/schema";
import { AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "./ui/badge";

export default function TypeBadge({ movement }: { movement: ItemMovement }) {
  const getTypeColor = (type: ItemMovement["tipe"]) => {
    switch (type) {
      case "masuk":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "keluar":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "rusak":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: ItemMovement["tipe"]) => {
    switch (type) {
      case "masuk":
        return <TrendingUp className="h-4 w-4" />;
      case "keluar":
        return <TrendingDown className="h-4 w-4" />;
      case "rusak":
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <Badge className={getTypeColor(movement.tipe)}>
      <div className="flex items-center gap-1">
        {getTypeIcon(movement.tipe)}
        {movement.tipe.charAt(0).toUpperCase() + movement.tipe.slice(1)}
        {/* test */}
      </div>
    </Badge>
  );
}
