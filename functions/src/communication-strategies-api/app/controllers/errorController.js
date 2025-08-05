const error = (err, _req, res, _next) => {
    console.log( err );

    const code = err.code || 500;

    return res.status(code).json({
        "type": err.name,
        "code": parseInt(err.code),
        "message": err.message
    });
};

module.exports = error;