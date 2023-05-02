const {check, body} = require('express-validator');

module.exports = [
    check("first_name").notEmpty().withMessage("Nombre Requerido"),
    check("last_name").notEmpty().withMessage("Apellido Requerido"),
    check("rating").notEmpty().withMessage("Rating Requerido"),

]