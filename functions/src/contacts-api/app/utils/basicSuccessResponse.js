const basicSuccessResponse = message => ({
    type: "Success",
    code: 200,
    message: message || "success"
});

module.exports = basicSuccessResponse;