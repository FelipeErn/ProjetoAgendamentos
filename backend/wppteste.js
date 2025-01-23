require('dotenv').config();
const axios = require('axios');

async function sendTemplateMessage() {
    try {
        const response = await axios({
            url: 'https://graph.facebook.com/v21.0/551276481400612/messages',
            method: 'post',
            headers: {
                'Authorization': `Bearer ${process.env.WPP_TOKEN}`,
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({
                messaging_product: 'whatsapp',
                to: '5547992460619',
                type: 'template',
                template: {
                    name: 'teste',
                    language: {
                        code: 'pt_BR',
                    },
                    components: [
                        {
                            type: 'header',
                            parameters: [
                                { type: 'text', text: 'Felipe' },
                            ],
                        },
                        {
                            type: 'body',
                            parameters: [
                                { type: 'text', text: '25/01/2025' },
                                { type: 'text', text: '11:00' },
                                { type: 'text', text: 'Rua Principal, 123, São Paulo' },
                                { type: 'text', text: '30' },
                            ],
                        },
                    ],
                },
            }),
        });

        console.log(response.data);
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error.response.data);
    }
}

sendTemplateMessage();
