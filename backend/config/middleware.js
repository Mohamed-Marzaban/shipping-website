const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");


module.exports = (app) => {
    app.use(cookieParser());
    app.use(express.json());
};
