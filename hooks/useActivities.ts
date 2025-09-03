import { Activity } from "@/types/activity";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface ActivitiesResponse {
    data: Activity[];
    success: boolean;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export function useActivities(token: string) {
  const queryClient = useQueryClient();

  const { data: activities, isLoading } = useQuery({
    queryKey: ["activities"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/activity`, { credentials: "include",    headers: {
        ...(token && { Authorization: token })
      } });
      if (!res.ok) throw new Error("Failed to load activities");
      return res.json() as Promise<ActivitiesResponse>;
    },
    enabled: !!token,
  });


  const { data: availableActivities, isLoading: isAvailableActivitiesLoading } = useQuery({
    queryKey: ["availableActivities"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/activity/available`, { credentials: "include",    headers: {
        ...(token && { Authorization: token })
      } });
      if (!res.ok) throw new Error("Failed to load activities");
      return res.json() as Promise<ActivitiesResponse>;
    },
    enabled: !!token,
  });


  const createActivity = useMutation({
    mutationFn: async (newActivity: Partial<Activity>) => {
      const res = await fetch(`${API_BASE_URL}/api/activity`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token && { Authorization: token }) },
        credentials: "include",
        body: JSON.stringify(newActivity),
      });
      if (!res.ok) throw new Error("Failed to create");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      queryClient.invalidateQueries({ queryKey: ["availableActivities"] });
    }
  });

  const updateActivity = useMutation({
    mutationFn: async (activity: Partial<Activity>) => {
      const res = await fetch(`${API_BASE_URL}/api/activity`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...(token && { Authorization: token }) },
        credentials: "include",
        body: JSON.stringify(activity),
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      queryClient.invalidateQueries({ queryKey: ["availableActivities"] });
    }
  });

  const deleteActivity = useMutation({
    mutationFn: async (uuid: string) => {
      const res = await fetch(`${API_BASE_URL}/api/activity/`, {
        method: "DELETE",
        body: JSON.stringify({uuid: uuid}),
        headers: {
          ...(token && { Authorization: token }),
        },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete activity");
      return res.json() as Promise<{ success: boolean }>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      queryClient.invalidateQueries({ queryKey: ["availableActivities"] });
    }
  });

  return { activities, isLoading, createActivity, updateActivity, deleteActivity, availableActivities, isAvailableActivitiesLoading };
}
