import getPrismaClient from "../libs/prisma";

const prisma = getPrismaClient();

const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log("Prisma Connected.");
    } catch (error) {
        console.log(`Error In Connecting To Prisma - ${error}`);
        process.exit(1);
    }
};

export {
    connectDB,
};