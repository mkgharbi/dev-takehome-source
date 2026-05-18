import { IsEmail, IsString, IsUUID, MinLength } from "class-validator";

export class CreateBookingDto {
  @IsUUID()
  sessionId!: string;

  @IsString()
  @MinLength(2)
  attendeeName!: string;

  @IsEmail()
  attendeeEmail!: string;
}
