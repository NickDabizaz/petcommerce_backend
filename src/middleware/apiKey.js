const checkApiKey = async (req, res, next) => {
    const apikey = req.headers.apikey;
    if (!apikey) {
        return res.sendStatus(401);
    }

    const pengguna = await Pengguna.findOne({ where: { api_key: apikey } });
    if (!pengguna) {
        return res.status(400).send("Invalid Api Key");
    }

    //penting guys
    req.pengguna = pengguna;
    next();
};


module.exports = { checkApiKey }