import { appRouter } from "@/server/api/root";
import { prisma } from "@/server/db";
import { createServerSideHelpers } from "@trpc/react-query/server";
import SuperJSON from "superjson";
import { redis } from "../server/redis";

export function ssgHelper() {
  return createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null, revalidate: null,redis },
    transformer: SuperJSON,
  });
}
