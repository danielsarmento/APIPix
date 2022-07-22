require('dotenv').config()
const express = require('express')
const app = express()

const fs = require("fs");
const https = require("https");
var logger = require('morgan');

const httpsOptions = {
    
    ca: fs.readFileSync("chain-pix-prod.crt"),   // Certificado público da Gerencianet
    minVersion: "TLSv1.2",
    requestCert: true,
    rejectUnauthorized: false, //Mantenha como false para que os demais endpoints da API não rejeitem requisições sem MTLS
};

const httpsServer = https.createServer(httpsOptions, app);
app.use(logger('dev'));

const routes = require('./routes/routes');
const PORT = process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);


app.listen(PORT, () => {
    console.log("Servidor em execução na porta 3000")
})