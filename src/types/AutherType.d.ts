import type { filterUser } from "@/utils/data-filters";

declare global {
  type AutherType = ReturnType<typeof filterUser>;
}
