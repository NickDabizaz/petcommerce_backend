const models = require("../models");

const getAllCategories = async (req, res) => {
    const categories = await models.Category.findAll()
    res.status(200).json(categories)
}

module.exports = {
    getAllCategories
}