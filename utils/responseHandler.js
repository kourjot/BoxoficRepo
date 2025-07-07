const sendSuccess = (res, message, data = {}, code = 200) => {
  return res.status(code).json({
    status: true,
    status_code: code,
    message,
    data,
  });
};


export {sendSuccess}