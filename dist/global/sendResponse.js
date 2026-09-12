const sendResponse = (res, payload) => {
    return res.status(payload.statusCode).json({
        success: payload.success,
        message: payload.message,
        data: payload.data,
        error: payload.error,
    });
};
export default sendResponse;
