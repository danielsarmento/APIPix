require('dotenv').config();
const axios = require('axios');
const { response } = require('express');
const fs = require('fs');
const https = require('https');
const randexp = require('randexp')

exports.autenticacao = async (req, res, next) => {

    try{
        const cert = fs.readFileSync('producao-403617-api-pagamentos-.p12')

        const credentials = process.env.GN_CLIENT_ID + ":" + process.env.GN_CLIENT_SECRET
        const auth = Buffer.from(credentials).toString('base64')

        const agent = new https.Agent({
            pfx: cert,
            passphrase:''
        });

        const data = JSON.stringify({"grant_type":"client_credentials"});

        const config = {
            method: 'POST',
            url: 'https://api-pix.gerencianet.com.br/oauth/token',
            headers: {
                Authorization: 'Basic ' + auth,
                'Content-Type':'application/json'
            },
            httpsAgent : agent,
            data: data 
        }

        axios(config)
            .then((response) => {
                res.locals.accessToken = response.data.access_token;
                console.log(response.data);
                next();
            })
            .catch (erro => {
                console.log(error);
            })


    } catch (error){
        return res.status(500).send({error: error});
    }

}

exports.createBilling = async (req, res, next) => {
        const cert = fs.readFileSync('producao-403617-api-pagamentos-.p12')
        
        const agent = new https.Agent({
            pfx: cert,
            passphrase:''
        });

        const data = JSON.stringify({
            "calendario": { "expiracao": 3600},
            "devedor": {
                "cpf": "09764037496",
                "nome": "Daniel Sarmento"
            },
            "valor": { "original": "0.01"},
            "chave": "2b0a323e-690b-4f8b-b86d-a419a9befd40",
            "solicitacaoPagador": "Informe o número ou identificador do pedido."
        });

        const config = {
            method: 'POST',
            url: 'https://api-pix.gerencianet.com.br/v2/cob',
            headers: {
                Authorization: 'Bearer ' + res.locals.accessToken,
                'Content-Type':'application/json'
            },
            httpsAgent : agent,
            data: data 
        }
        axios(config)
            .then((response) => {
                res.locals.cobranca = response.data;
                console.log(response.data);
                next();
            })
            .catch (erro => {
                console.log(erro);
            })
}

exports.getQrCode = async (req, res, next) => {
    try{
        const cert = fs.readFileSync('producao-403617-api-pagamentos-.p12')
        
        const agent = new https.Agent({
            pfx: cert,
            passphrase:''
        });
        const locId = res.locals.cobranca.loc.id;
        const config = {
            method: 'GET',
            url: `https://api-pix.gerencianet.com.br/v2/loc/${locId}/qrcode`,
            headers: {
                Authorization: 'Bearer ' + res.locals.accessToken,
                'Content-Type':'application/json'
            },
            httpsAgent : agent,
        }
        
        axios(config)
            .then((response) => {
                console.log(response.data);
                imgQrCode = decodeBase64Image(response.data.imagemQrcode);
                console.log('image', imgQrCode)
                fs.writeFileSync(`pix-cobranca-teste.jpg`, imgQrCode.data)
            })
            .catch (erro => {
                console.log(erro);
            })

    } catch (error) {
        return res.status(500).send({error: error});
    }
}

function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};
    
    response.type = matches[1];
    response.data = new Buffer.from(matches[2], 'base64');
    return response;
}