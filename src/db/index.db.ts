import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log("Prisma Connected.");
    } catch (error) {
        console.log(`Error In Connecting To Prisma - ${error}`);
        process.exit(1);
    }
};

const getPrismaClient = () => {
    return prisma;
}

export {
    connectDB,
    getPrismaClient,
};