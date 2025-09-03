"use client";

import {  useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Activity } from "@/types/activity";

interface ActivityModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (activity: Partial<Activity>) => void; 
  initialData?: Activity | null;
}

export default function ActivityModal({
  open,
  onClose,
  onSubmit,
}: ActivityModalProps) {
  const emptyForm: Partial<Activity> = {
    title: "",
    description: "",
    reward: 0,
  };

  const [form, setForm] = useState<Partial<Activity>>(emptyForm);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "reward" ? Number(value) : value,
    }));
  };

  const handleClose = () => {
    setForm(emptyForm);
    onClose();
  };

  const handleSubmit = () => {
    onSubmit(form);
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Activity</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter title"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter description"
            />
          </div>

          <div>
            <Label htmlFor="reward">Reward</Label>
            <Input
              id="reward"
              name="reward"
              type="number"
              value={form.reward}
              onChange={handleChange}
              placeholder="Enter reward"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
