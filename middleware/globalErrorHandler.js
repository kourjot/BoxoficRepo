
const errorHandler=(err, req, res, next)=> {
  console.error(err); //    for debugging

  const messageArray = err.message ? err.message.split("::") : [];

  if (messageArray.length === 3) {
    return res.status(Number(messageArray[0])).json({
      status: false,
      response_code: Number(messageArray[1]),
      message: messageArray[2],
    });
  }

  res.status(500).json({
    status: false,
    response_code: 500,
    message:
      process.env.ENVIRONMENT === "production"
        ? "Validation failed."
        : err.message || "Something went wrong.",
  });
}

export {errorHandler};
