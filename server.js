const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

app.get('/', async (req, res) => {
  res.send('Hola api  awl bsale + klaviyo');
});


app.get('/clientes-bsale', async (req, res) => {
  const access_token = 'dc113865582bf39e832c6068c90a02e6bc9af44b';

  try {
    const response = await axios.get('https://api.bsale.cl/v1/clients.json', {
      headers: {
        'access_token': access_token
      }
    });

    // Procesar la respuesta y enviarla como respuesta de la ruta GET
    res.send(response.data);
  } catch (error) {
    // Manejar cualquier error de la solicitud
    res.status(500).send('Error al obtener los clientes');
  }
});

// Creación de perfiles en klaviyo 
app.post('/users', async (req, res) => {
  const klaviyoAPI = 'https://a.klaviyo.com/api/profiles/';
  const apiKey = 'pk_b229e9d87388da0fd2adf63967740b2010';

  try {
    const response = await axios.post(klaviyoAPI, req.body, {
      headers: {
        'Authorization': `Klaviyo-API-Key ${apiKey}`,
        'accept': 'application/json',
        'content-type': 'application/json',
        'revision': '2023-08-15'
      }
    });
  // Agregar el perfil a la lista en Klaviyo
    const profileId = response.data.data.id;
    const listId = 'RUhMBB';
    const url = 'https://a.klaviyo.com/api/lists/RUhMBB/relationships/profiles/';

    const addToListAPI = `https://a.klaviyo.com/api/lists/${listId}/relationships/profiles/`;
      body: JSON.stringify({data: [{type: 'profile', id: '01H9TZWZW1EH0676KTGBS0PBJP'}]})

    await axios.post(addToListAPI, { data: [{type: 'profile', id: profileId}] }, {
      headers: {
        'Authorization': `Klaviyo-API-Key ${apiKey}`,
        'accept': 'application/json',
        'content-type': 'application/json',
        'revision': '2023-08-15'
      }
    });
    const data = response.data;
    res.status(response.status).json({ data }); 
    
  } catch (error) {
    res.status(error.response.status).json(error.response.data);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor Express.js iniciado en el puerto ${port}`);
});