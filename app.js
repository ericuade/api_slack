const express = require('express');
const axios = require('axios'); // Corrige el nombre de 'axios'
const app = express();
const port = 3002;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/api_slack', async (req, res) => { // Añade async para permitir el uso de await dentro de la función
    console.log('req.body: ', req.body);
    const { trigger_id } = req.body;
    
    const modalPayload = {
        "type": "modal",
        "callback_id": "soporte_form",
        "title": {
            "type": "plain_text",
            "text": "Solicitud de Soporte"
        },
        "submit": {
            "type": "plain_text",
            "text": "Enviar"
        },
        "blocks": [
            {
                "type": "input",
                "block_id": "asunto_input",
                "element": {
                    "type": "plain_text_input",
                    "action_id": "asunto"
                },
                "label": {
                    "type": "plain_text",
                    "text": "Asunto"
                }
            },
            {
                "type": "input",
                "block_id": "descripcion_input",
                "element": {
                    "type": "plain_text_input",
                    "multiline": true,
                    "action_id": "descripcion"
                },
                "label": {
                    "type": "plain_text",
                    "text": "Descripción"
                }
            }
        ]
    };

    try {
        // Se llama a la función directamente y se maneja la respuesta dentro del try-catch
        const response = await axios.post('https://slack.com/api/views.open', JSON.stringify({
            trigger_id: trigger_id,
            view: modalPayload
        }), {
            headers: {
                'Authorization': 'Bearer xoxb-1351970980016-6715848183312-rmMx4ohUUiUHDfDlP76K3Rez', // Asegúrate de reemplazar 'xoxb-tu-token-de-bot' con tu token real de Bot
                'Content-Type': 'application/json'
            }
        });

        if (response.data.ok) {
            res.status(200).send('Modal abierto con éxito');
        } else {
            console.error('Error al abrir el modal:', response.data.error);
            res.status(200).send('No se pudo abrir el modal: ' + response.data.error);
        }
    } catch (error) {
        console.error('Error al enviar la solicitud a Slack:', error);
        res.status(500).send('Error al procesar el comando');
    }
});

app.listen(port, () => {
    console.log(`Slack integration listening on port ${port}`);
});
