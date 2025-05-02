import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getPrismaClient = () => {
    return prisma;
};

export default getPrismaClient;