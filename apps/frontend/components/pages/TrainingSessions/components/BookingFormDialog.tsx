"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/dialog";
import { Input } from "@repo/ui/input";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { createBooking } from "@/services/api/booking/booking";

const schema = z.object({
  attendeeName: z.string().min(2, "Nom trop court"),
  attendeeEmail: z.string().email("Email invalide"),
});

type Schema = z.infer<typeof schema>;

type Props = {
  sessionId: string;
  sessionTitle: string;
};

export const BookingFormDialog: FC<Props> = ({ sessionId, sessionTitle }) => {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Schema>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await createBooking({ sessionId, ...values });
      toast.success("Réservation enregistrée");
      reset();
      setOpen(false);
    } catch {
      toast.error("Impossible d'enregistrer la réservation");
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Réserver</Button>
      </DialogTrigger>
      <DialogContent maxWidth="480px">
        <DialogHeader>
          <DialogTitle>Réserver une place</DialogTitle>
          <DialogDescription>{sessionTitle}</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
          <DialogBody>
            <Input
              id="attendeeName"
              label="Nom complet"
              autoComplete="name"
              fullWidth
              error={errors.attendeeName?.message}
              {...register("attendeeName")}
            />
            <Input
              id="attendeeEmail"
              type="email"
              label="Email"
              autoComplete="email"
              fullWidth
              error={errors.attendeeEmail?.message}
              {...register("attendeeEmail")}
            />
          </DialogBody>
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setOpen(false)}
            >
              Annuler
            </Button>
            <Button type="submit" variant="default" isLoading={isSubmitting}>
              Confirmer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
