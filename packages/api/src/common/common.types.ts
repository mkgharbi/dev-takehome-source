/**
 * Type-safe route registry. Frontend imports `AppPages` from `@repo/api/constants`
 * and never hardcodes route strings.
 *
 * Static routes are plain strings; dynamic routes are functions that take the
 * params and return the path.
 */

type DynamicPage<P extends unknown[]> = ((...args: P) => string) & {
  readonly pattern: string;
};

export const dynamicPage = <P extends unknown[]>(
  pattern: string,
  builder: (...args: P) => string,
): DynamicPage<P> => {
  const fn = builder as DynamicPage<P>;
  Object.defineProperty(fn, "pattern", { value: pattern, enumerable: true });
  return fn;
};

export const AppPages = {
  Home: "/",
  Trainers: "/trainers",
  TrainerDetails: dynamicPage(
    "/trainers/:id",
    (id: string) => `/trainers/${id}`,
  ),
  TrainingSessions: "/training-sessions",
  Bookings: "/bookings",
} as const;

export const ApiRoutes = {
  trainers: "/trainers",
  trainerById: (id: string) => `/trainers/${id}`,
  trainingSessions: "/training-sessions",
  trainingSessionById: (id: string) => `/training-sessions/${id}`,
  bookings: "/bookings",
} as const;
