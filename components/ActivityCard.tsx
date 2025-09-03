"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Activity } from "@/types/activity";
import { Badge } from "./ui/badge";

interface ActivityCardProps {
  activity: Activity;
  onDelete: (uuid: string) => void;
  onEdit?: (activity: Activity) => void;
  onAwardTokens?: (activity: Activity) => void;
  role: string;
  isConnected: boolean;
}

const getStatusConfig = (status: "pending" | "finished" | "closed" | null) => {
  switch (status) {
    case "pending":
      return {
        label: "Pending",
        variant: "secondary" as const,
        className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      };
    case "finished":
      return {
        label: "Finished",
        variant: "default" as const,
        className: "bg-green-100 text-green-800 hover:bg-green-100",
      };
    case "closed":
      return {
        label: "Closed",
        variant: "destructive" as const,
        className: "bg-red-100 text-red-800 hover:bg-red-100",
      };
    default:
      return {
        label: "Created",
        variant: "outline" as const,
        className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      };
  }
};

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onDelete,
  onEdit,
  role,
  isConnected,
}) => {
  const renderActionButton = () => {
    if (role === "participant") {
      switch (activity.status) {
        case null:
          return (
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              disabled={!isConnected} 
              onClick={() => onEdit?.(activity)}
            >
              {!isConnected ? "Connect your wallet to join" : "Join"}
            </Button>
          );
        case "pending":
          return (
            <Button
              onClick={() => onEdit?.(activity)}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              Finished
            </Button>
          );
        case "finished":
          return (
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              disabled={true}
            >
              Finished
            </Button>
          );
        case "closed":
          return (
            <Button variant="outline" size="sm" className="flex-1" disabled>
              Closed
            </Button>
          );
      }
    }

    if (role === "tocos") {
      switch (activity.status) {
        case null:
          return (
            <Button
              onClick={() => onEdit?.(activity)}
              size="sm"
              className="flex-1"
              disabled
            >
              Created
            </Button>
          );
        case "finished":
          return (
            <Button
              onClick={() => onEdit?.(activity)}
              size="sm"
              className="flex-1"
            >
              Award
            </Button>
          );
        case "closed":
          return (
            <Button variant="outline" size="sm" className="flex-1" disabled>
              Closed
            </Button>
          );
      }
    }

    return null;
  };

  const statusConfig = getStatusConfig(activity.status);
  return (
    <Card className="bg-white dark:bg-gray-800 shadow-md rounded-xl">
      <CardHeader className="flex justify-between items-center flex-row">
        <div className="flex-1 flex-row">
          <CardTitle className="text-lg font-semibold">
            {activity.title}
          </CardTitle>
        </div>

        <Button
          size="sm"
          variant="ghost"
          className="text-red-600 hover:bg-red-100 dark:hover:bg-red-800"
          onClick={() => onDelete(activity.uuid)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </CardHeader>

      <CardContent className="text-gray-700 dark:text-gray-300">
        <div className="flex-1 flex justify-between mb-6">
          <Badge
            variant={statusConfig.variant}
            className={`${statusConfig.className}  dark:bg-opacity-20 dark:text-opacity-90 font-medium`}
          >
            {statusConfig.label}
          </Badge>

          <Badge
            variant="outline"
            className={`bg-green-100 text-green-800 hover:bg-green-100 dark:bg-opacity-20 dark:text-opacity-90 font-medium`}
          >
            {activity.reward} Toco
          </Badge>
        </div>

        <p>{activity.description}</p>
      </CardContent>

      <CardFooter className="flex gap-2">{renderActionButton()}</CardFooter>
    </Card>
  );
};
