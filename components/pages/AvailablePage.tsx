"use client";

import { Button } from "@/components/ui/button";
import ActivityModal from "@/components/ActivityModal";
import { useState } from "react";
import { useActivities } from "@/hooks/useActivities";
import { ActivityCard } from "../ActivityCard";
import { Activity } from "@/types/activity";
import { useAccount } from "wagmi";

export default function AvailablePage({
  token,
  role,
}: {
  token: string;
  role: string;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const { isConnected } = useAccount();

  const {
    availableActivities,
    createActivity,
    deleteActivity,
    updateActivity,
  } = useActivities(token);

  const handleEdit = async (activity: Activity) => {
    await updateActivity.mutateAsync(activity);
  };

  const handleModalSubmit = async (activity: Partial<Activity>) => {
    try {
      await createActivity.mutateAsync(activity);
    } catch (e) {
      console.error("Ошибка при сохранении активности:", e);
    } finally {
      setModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-6">Available activities</h1>
      <p className="text-gray-700 dark:text-gray-300 mb-8">
        Create and manage campaigns, and award Toco tokens to participants.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableActivities?.data?.map((campaign) => (
          <ActivityCard
            key={campaign.uuid}
            activity={campaign}
            role={role}
            isConnected={isConnected}
            onDelete={async (uuid) => {
              try {
                await deleteActivity.mutateAsync(uuid);
              } catch (e) {
                console.error("Ошибка при удалении:", e);
              }
            }}
            onEdit={(activity) => {
              handleEdit(activity);
            }}
          />
        ))}
      </div>

      {role === "tocos" && (
        <div className="mt-8 flex justify-center">
          <Button
            onClick={() => setModalOpen(true)}
            className="bg-black text-white hover:bg-gray-800"
          >
            Create New Campaign
          </Button>
        </div>
      )}

      <ActivityModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}
