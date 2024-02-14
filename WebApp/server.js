const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// Adaugăm middleware pentru servirea fișierelor statice
app.use(express.static(path.join(__dirname)));
app.use(cors());
app.use(bodyParser.json());
// Ruta pentru afișarea paginii HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'rgb.html'));
    

    // Poți trimite înapoi un răspuns sau să faci orice altceva cu aceste valori
    // Aici trimitem un răspuns simplu pentru a indica succesul primirii culorilor
    
});


app.get('/getcolor', (req, res) => {
    // Aici poți returna culorile stocate sau orice alte informații legate de culori
    // Exemplu simplu: returnăm un șir JSON cu culorile roșu, verde și albastru
    const red = req.query.r;
    const green = req.query.g;
    const blue = req.query.b;

    // Procesează valorile cum dorești
    console.log(`Received colors: Red=${red}, Green=${green}, Blue=${blue}`);
    
});


app.post('/setcolor', (req, res) => {
    const red = req.body.r;
    const green = req.body.g;
    const blue = req.body.b;
  
    // Procesează valorile cum dorești
    console.log(`SENDED colors: Red=${red}, Green=${green}, Blue=${blue}`);
  
    // Poți trimite înapoi un răspuns sau să faci orice altceva cu aceste valori
    // res.sendFile(path.join(__dirname, 'rgb.html'));
    res.send('Colors SENDED successfully');
  });
  

  app.post('/setbrightness', (req, res) => {
    const brightness = req.body?.brightness;

    if (brightness !== undefined) {
        console.log(`Received brightness: ${brightness}`);
        res.send(`Brightness received successfully: ${brightness}`);
    } else {
        res.status(400).send('Brightness is missing in the request body');
    }
});

app.post('/setOnOff', (req, res) => {
    const onOff = req.body.toggle;
    if(onOff !== undefined)
    {
        console.log(`Received brightness: ${onOff}`);
        res.send(`Setting successfully: ${onOff}`);
    }
    else{
        res.status(400).send('Toggle is missing in the request body');
    }
});

// Pornirea serverului
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Serverul rulează pe portul ${PORT}`);
});

