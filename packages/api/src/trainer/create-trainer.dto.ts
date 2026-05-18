import { ArrayMaxSize, IsArray, IsEmail, IsString, MinLength } from "class-validator";

export class CreateTrainerDto {
  @IsString()
  @MinLength(2)
  firstName!: string;

  @IsString()
  @MinLength(2)
  lastName!: string;

  @IsEmail()
  email!: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(10)
  certifications!: string[];
}
