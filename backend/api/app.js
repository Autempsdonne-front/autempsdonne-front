const express = require('express');
const bodyParser = require('body-parser');
const beneficiaryRoutes = require('./routes/beneficiaryRoutes');
const defaultRoute = require('./routes/defaultRoute');
const corsMiddleware = require('./middleware/cors');
const volunteersRoutes = require("./routes/volunteersRoutes");

const app = express();

app.use((req,res,next)=>{
    res.status(200).json({
        message: 'It is working !'
    });
});
app.use('/volunteersRoutes',volunteersRoutes);
module.exports = app;