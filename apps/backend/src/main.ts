import "reflect-metadata";

import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";
import { ApiExceptionFilter } from "./utils/filters/api-exception.filter";
import { DatabaseExceptionFilter } from "./utils/filters/database.filter";

const bootstrap = async (): Promise<void> => {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: "http://localhost:3000", credentials: true });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Order matters: catch-all `ApiExceptionFilter` is registered first so the
  // more specific `DatabaseExceptionFilter` runs before it.
  app.useGlobalFilters(
    new ApiExceptionFilter(),
    new DatabaseExceptionFilter(),
  );

  const port = 3001;
  await app.listen(port);
  console.warn(`Backend running on http://localhost:${port}`);
};

bootstrap().catch((err) => {
  console.error("Failed to start backend", err);
  process.exit(1);
});
