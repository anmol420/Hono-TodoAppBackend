import getPrismaClient from "../libs/prisma.lib";

import errorMessage from "../helpers/errorMessage.helper";

const prisma = getPrismaClient();

const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log("Prisma Connected.");
    } catch (error) {
        console.log(`Error In Connecting To Prisma - ${errorMessage(error)}`);
        process.exit(1);
    }
};

export {
    connectDB,
};