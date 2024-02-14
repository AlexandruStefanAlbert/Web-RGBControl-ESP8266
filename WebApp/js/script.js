let isDragging = false;
const url = `http://192.168.1.243/`;
// Drag event start
function startDrag(event) {
    isDragging = true;
    var brightness = document.getElementById('brightnessInput');
        brightness.value = '100';
    if (event.type === 'touchstart') {
        document.addEventListener('touchmove', dragColor, { passive: false });
        document.addEventListener('touchend', stopDrag);
    } else {
        document.addEventListener('mousemove', dragColor);
        document.addEventListener('mouseup', stopDrag);
    }

    dragColor(event);
}
// Drag event stop
function stopDrag() {
    isDragging = false;
    document.removeEventListener('mousemove', dragColor);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('touchmove', dragColor);
    document.removeEventListener('touchend', stopDrag);
}

// Navigare prin bara de culori 
function dragColor(event) {
    if (isDragging) {
        var button = document.getElementById('toggleButton');
        button.dataset.value = '1';
        button.innerHTML = "TurnOff";
        
        requestAnimationFrame(() => {
            let bar = document.getElementById('colorBar');
            let barRect = bar.getBoundingClientRect();
            let x = (event.clientX || event.touches[0].clientX) - barRect.left;
            let percentage = (x / barRect.width) * 100;
            let hue = (percentage * 3.6) % 360;

            let color = `hsl(${hue}, 100%, 50%)`;

            document.body.style.background = color;
          
            setColor();
        });
    }
}

function setColor() {
    // Obține valorile pentru rosu (R), verde (G) si albastru (B) din culoarea curenta
    let rgb = hexToRgb(colorToHex(document.body.style.background));

    if (rgb && rgb.r !== undefined && rgb.g !== undefined && rgb.b !== undefined) {
        let red = rgb.r;
        let green = rgb.g;
        let blue = rgb.b;
        const newURL = url+`setcolor?r=${red}&g=${green}&b=${blue}`;
        console.log('colors: ', red, green, blue);

        // Trimite valorile pentru r, g și b către server în corpul cererii
        fetch(newURL, { method: 'POST', mode: 'no-cors' })
        .then(response => response.text())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });       
    }
}

function toggleLED() {
    // Obține elementul butonului
    var button = document.getElementById('toggleButton');
    
    // Inversează textul butonului și trimite cererea la server
    if (button.dataset.value === '0') {
        button.innerHTML = 'TurnOff';
        button.dataset.value = '1';
        

    } else {
        button.innerHTML = 'TurnOn';
        button.dataset.value = '0';
        var brightness = document.getElementById('brightnessInput');
        brightness.value = '100';
    }
    const newURL = url+`setOnOff?toggle=${button.dataset.value}`;
    fetch(newURL, { method: 'POST', mode: 'no-cors' })
        .then(response => response.text())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function setBrightness(value) {
    const brightnessInput = document.getElementById('brightnessInput');
    if (brightnessInput && !isNaN(value)) {
        {
            brightnessInput.value = value;
            
        }
    const newURL = url+`setbrightness?brightness=${(brightnessInput.value/100).toFixed(2)}`;
        fetch(newURL, { method: 'POST', mode: 'no-cors' })
        .then(response => response.text())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    /*const requestBody = JSON.stringify({ brightness: parseInt(value) });
    console.log(requestBody);
        // Trimite valoarea la server sub forma unui obiect JSON
        fetch('/setbrightness', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: requestBody // Convertește valoarea la tipul așteptat în server
        })
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    }*/
    }
}

// Adaugam evenimentul de start pentru touch
document.getElementById('colorBar').addEventListener('touchstart', startDrag);
// Funcție pentru convertirea unei culori într-un cod hexadecima
function colorToHex(color) {
    // Verificăm dacă culoarea este nedefinită sau null
    if (!color) {
        return null;
    }

    // Dacă culoarea începe cu '#' (hexadecimal)
    if (color.startsWith('#')) {
        return color;
    }

    // Incercam sa obtinem culoarea in format RGB
    const match = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

    // Verificam dacă match nu este null si are suficiente grupuri
    if (match && match.length === 4) {
        // Obținem valorile RGB din match
        const [, r, g, b] = match;

        // Convertim valorile in format hexadecimal
        const hex = `#${parseInt(r).toString(16).padStart(2, '0')}${parseInt(g).toString(16).padStart(2, '0')}${parseInt(b).toString(16).padStart(2, '0')}`;

        return hex;
    }
    // În caz contrar, returnăm null
    return null;
}


/*function rgbToHex(r, g, b) {
    // Converteste culorile de la RGB la HEX
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function componentToHex(c) {
    // Converteste un singur canal de culoare la HEX
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}*/

// Funcție pentru convertirea unei culori hexadecimale într-un obiect RGB
function hexToRgb(hex) {
    // Verificam dacă hex este nedefinit sau null
    if (!hex) {
        return null;
    }

    // Eliminăm caracterele nedorite, dacă există
    hex = hex.replace(/^#/, '');

    // Verificăm dacă hex are lungimea corectă
    if (hex.length !== 6) {
        return null;
    }

    // Convertim valorile hexadecimale într-un array de numere
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    // Returnăm un obiect cu componentele RGB
    return { r, g, b };
}
