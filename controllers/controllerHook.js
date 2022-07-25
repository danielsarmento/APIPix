const axios = require('axios');

exports.notificacao = async (req, res) => {
    const token = 'n23pPyiaCzFAlaiXAGdrGWAWUTfSSO0uhCQM';
    const URL = 'https://api.zenvia.com/v2/channels/whatsapp/messages';
    const body = {
        from: '558399088426',
        to: '5583999415087',
        contents: [
            {
                type: 'text',
                text: 'API funcionando'
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
        console.log(response.data);
        return res.send(response.data);
    } catch (error) {
        console.log(error);  
        return res.send('Ops! algo deu errado');
    }
 };