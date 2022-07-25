const axios = require('axios');

exports.notificacao = async (req, res) => {
    const e2e  = req.body.pix[0].endToEndId;
    const txId = req.body.pix[0].txid;
    const valor = req.body.pix[0].valor;
    const horario = req.body.pix[0].horario;

    const token = 'n23pPyiaCzFAlaiXAGdrGWAWUTfSSO0uhCQM';
    const URL = 'https://api.zenvia.com/v2/channels/whatsapp/messages';
    const body = {
        from: '558399088426',
        to: '5583999415087',
        contents: [
            {
                type: 'template',
                templateId: '66c87ec0-e194-45c1-b5d6-15b536f6a693',
                fields: {
                    txId: `${e2e}, com *txId:* ${txId}, no *valor de R$* ${valor} no *dia:* ${horario}, `
                }
            }
        ]
    }
    try {
        const response = await axios.post(URL, body, {
            headers: {
                'X-API-TOKEN': token,
                'Content-Type': 'application/json',
            },
        });
        console.log(response);
        return res.send(response.data);
    } catch (error) {
        console.log(error);  
        return res.send('Ops! algo deu errado');
    }
 };