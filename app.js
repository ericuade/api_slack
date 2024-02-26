let express = require('express')
let axio = require('axios')
let app = express()
let port = 3002

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.post('/api_slack', (req, res) => {
    const { trigger_id } = req.body.trigger_id // Extrae el trigger_id de la solicitud de Slack
    console.log("Recibido TRIGGER ID: ${trigger_id}")
    
    // Define el payload del modal
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

    // Utiliza la API de Slack para abrir el modal
    try {
        async function openModal() {
        const response = await axios.post('https://slack.com/api/views.open', JSON.stringify({
            trigger_id: trigger_id,
            view: modalPayload
        }), {
            headers: {
                //'Authorization': `Bearer xoxb-tu-token-de-bot`,
                'Authorization': 'xapp-1-A06LR5J4XB3-6687032251511-74649c2f5f7be47717cb4ef2dd1869c16a43b3f9b41bca6b1155b12b658f5233',
                'Content-Type': 'application/json'
            }
        });
        }
        if (response.data.ok) {
            res.status(200).send('Hello Flock 200');
        } else {
            // Manejo de errores si Slack devuelve un error
            console.error('Error al abrir el modal:', response.data.error);
            res.status(200).send('No se pudo abrir el modal');
        }
    } catch (error) {
        console.error('Error al enviar la solicitud a Slack:', error);
        res.status(500).send('Error al procesar el comando');
    }
})


app.listen(port, () => {
    console.log(`Slack integration listening on port ${port}`)
})

