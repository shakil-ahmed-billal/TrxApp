declare const prismaClientSingleton: () => import("../generated/internal/class").PrismaClient<"query" | "warn" | "error", import("../generated/internal/prismaNamespace").GlobalOmitConfig | undefined, import("@prisma/client/runtime/client").DefaultArgs>;
declare global {
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}
declare const prisma: import("../generated/internal/class").PrismaClient<"query" | "warn" | "error", import("../generated/internal/prismaNamespace").GlobalOmitConfig | undefined, import("@prisma/client/runtime/client").DefaultArgs>;
export default prisma;
//# sourceMappingURL=prisma.d.ts.map