import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  BookingStatus,
  TrainingSector,
  TrainingSessionStatus,
} from "@repo/api/constants";
import { Repository } from "typeorm";


import { BookingEntity } from "../../booking/entities/booking.entity";
import { TrainerEntity } from "../../trainer/entities/trainer.entity";
import { TrainingSessionEntity } from "../../training-session/entities/training-session.entity";

const addDays = (date: Date, days: number): Date => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(TrainerEntity)
    private readonly trainerRepo: Repository<TrainerEntity>,
    @InjectRepository(TrainingSessionEntity)
    private readonly sessionRepo: Repository<TrainingSessionEntity>,
    @InjectRepository(BookingEntity)
    private readonly bookingRepo: Repository<BookingEntity>,
  ) {}

  async onModuleInit(): Promise<void> {
    const existing = await this.trainerRepo.count();
    if (existing > 0) return;

    const trainers = await this.trainerRepo.save([
      {
        firstName: "Camille",
        lastName: "Dubois",
        email: "camille.dubois@formation.fr",
        certifications: ["SST", "Incendie"],
      },
      {
        firstName: "Hugo",
        lastName: "Martin",
        email: "hugo.martin@formation.fr",
        certifications: ["HACCP"],
      },
      {
        firstName: "Léa",
        lastName: "Bernard",
        email: "lea.bernard@formation.fr",
        certifications: ["Management", "Communication"],
      },
      {
        firstName: "Thomas",
        lastName: "Petit",
        email: "thomas.petit@formation.fr",
        certifications: ["SST", "HACCP"],
      },
      {
        firstName: "Inès",
        lastName: "Robert",
        email: "ines.robert@formation.fr",
        certifications: ["Management"],
      },
    ]);

    const today = new Date();
    const sectors = [
      TrainingSector.Safety,
      TrainingSector.Hygiene,
      TrainingSector.Management,
    ];
    const statuses = [
      TrainingSessionStatus.Pending,
      TrainingSessionStatus.Confirmed,
      TrainingSessionStatus.Cancelled,
    ];
    const cities = ["Paris 11e", "Lyon Part-Dieu", "Marseille Centre", "Lille", "Bordeaux"];

    const sessionsInput: Partial<TrainingSessionEntity>[] = [];
    for (let i = 0; i < 15; i += 1) {
      const trainer = trainers[i % trainers.length];
      const sector = sectors[i % sectors.length];
      const status = statuses[i % statuses.length];
      const start = addDays(today, i * 2 + 1);
      const end = new Date(start);
      end.setHours(end.getHours() + 4);

      sessionsInput.push({
        title: `Session ${sector} #${i + 1}`,
        sector,
        status,
        startsAt: start,
        endsAt: end,
        location: cities[i % cities.length] ?? "Paris",
        priceCents: 14900 + (i % 4) * 5000,
        capacity: 8 + (i % 3) * 2,
        trainerId: trainer?.id,
      });
    }
    const sessions = await this.sessionRepo.save(sessionsInput);

    const bookingsInput: Partial<BookingEntity>[] = [];
    const attendees = [
      { name: "Sophie Lemaitre", email: "sophie.lemaitre@acme.fr" },
      { name: "Pierre Garnier", email: "pierre.garnier@bcd.fr" },
      { name: "Aïcha Benali", email: "aicha.benali@xyz.fr" },
      { name: "Karim Ndiaye", email: "karim.ndiaye@hop.fr" },
      { name: "Marie Lopez", email: "marie.lopez@delta.fr" },
      { name: "Yann Roux", email: "yann.roux@delta.fr" },
      { name: "Nora Sanchez", email: "nora.sanchez@start.fr" },
      { name: "Eliott Faure", email: "eliott.faure@finco.fr" },
    ];
    const bookingStatuses = [
      BookingStatus.Pending,
      BookingStatus.Confirmed,
      BookingStatus.Confirmed,
      BookingStatus.Cancelled,
    ];
    for (let i = 0; i < 8; i += 1) {
      const session = sessions[i];
      const attendee = attendees[i];
      if (!session || !attendee) continue;
      bookingsInput.push({
        sessionId: session.id,
        attendeeName: attendee.name,
        attendeeEmail: attendee.email,
        status: bookingStatuses[i % bookingStatuses.length],
      });
    }
    await this.bookingRepo.save(bookingsInput);

    console.warn(
      `Seeded ${trainers.length} trainers, ${sessions.length} sessions, ${bookingsInput.length} bookings.`,
    );
  }
}
