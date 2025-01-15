const errorMessage = (error: unknown) => {
    return error instanceof Error ? error.message : "Internal Server Error.";
};

export default errorMessage;