import { definePrismaConfig } from "prisma/config";

export default definePrismaConfig({
  orm: {
    adapter: { provider: "sqlite" },
    target: { provider: "sqlite" },
    family: { provider: "sqlite" },
    schema: {
      path: "prisma/schema.prisma",
    },
    datasource: {
      url: process.env.DATABASE_URL,
    },
  },
  skills: {
    agents: ["claude", "cursor", "agents", "devin"],
  },
});