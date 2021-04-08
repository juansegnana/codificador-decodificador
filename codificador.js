const fs = require('fs'); // para txt salida

console.log("Ingrese texto a enviar. Presione Control+C para salir.");
let stdin = process.openStdin();

stdin.addListener("data", function(data) {
    
    const input = data.toString().trim();
    const binary = input.split('').map(c => c.charCodeAt().toString(2).padStart(7, '0'));

    console.log('------------');
    // Analizar paridad vertical
    let arrMatrixA = [];
    let columna = 0;
    binary.forEach((el) => {
        
        const arrBit = el.split(''); // a los 7 bits los divide a un array tipo ['1,'0','1', ...];
        arrMatrixA[columna] = arrBit;
        columna++;
        
    })

    // el arrMatrixA es todo el binario en forma de fila
    const matrizFinal = [];
    for (let columna = 0; columna<7; columna++) {
        
        for (let fila = 0; fila<arrMatrixA.length; fila++) {
            matrizFinal.push(arrMatrixA[fila][columna]);
        }
        matrizFinal.push('salto'); // para invertir fila por columna

    }
    let temp = [];
    const finalMatrix = [];
    
    matrizFinal.forEach(el => {
        // acá agrupa por columna a cada letra (en binario)
        if(el === 'salto') {
            finalMatrix.push(temp);
            temp = [];
        } else {
            temp.push(el);
        }
    });
    
    // Muestro por pantalla lo q ingresó el user
    console.log('Su input es:');
    console.log(input.split('').join(','));
    // finalMatrix da la matriz binaria SIN paridad vertical ni horizontal (en este punto)
    console.log(finalMatrix.join('\n'));
    console.log('------------');

    // Acá recorre letra por letra contando verticalmente.
    const columnaParidad = [];
    for (let columna = 0; columna<input.split('').length; columna++) {
        
        let contadorColumna = 0;
        for (let fila = 0; fila<finalMatrix.length; fila++) {
            if (finalMatrix[fila][columna] === '1') contadorColumna++;
        }
        console.log(`La columna "${columna}" o "${input[columna]}" tiene ${contadorColumna} ${(contadorColumna > 1) ? 'unos' : 'uno'}.`);
        columnaParidad.push((contadorColumna%2 === 0) ? '0' : '1');

    }

    const filaParidad = [];
    // Acá recorre horizontalmente.
    for (let fila = 0; fila<finalMatrix.length; fila++) {
        
        let contadorFila = 0;
        for (let columna = 0; columna<input.split('').length; columna++) {
            if (finalMatrix[fila][columna] === '1') contadorFila++;
        }
            
        filaParidad.push((contadorFila%2 === 0) ? '0' : '1');
        console.log(`La fila "${fila}" tiene ${contadorFila} ${(contadorFila > 1) ? 'unos' : 'uno'}.`);

    }
    // Agregar paridad horizontal a cada elemento del finalMatrix (a cada fila)
    finalMatrix.map((el, ind) => {
        el.push(filaParidad[ind]);
    })

    const sumaTotal = () => {
        let contA = 0;
        let contB = 0;
        columnaParidad.forEach(el => el+contA);
        filaParidad.forEach(el => el+contB);
        return ((contA+contB)%2 === 0) ? '0' : '1';
    }
    columnaParidad.push(sumaTotal()); 
    finalMatrix.push(columnaParidad); // agraga paridad vertical al final de todo
    // Ultima columna: paridad horizontal. Ultima fila: paridad vertical. + paridad total

    // Escribir a salida
    const file = fs.createWriteStream('outputCodificado.txt');
    file.on('error', (err) => console.log('Error creando txt:', err.message));
    finalMatrix.forEach(function(v) { file.write(v.join(' ') + '\n'); });
    file.end();
    console.log('Puede encontrar la salida en "outputCodificado.txt".\nAhora puede usar el decodificador.\nPara salir presione Control+C. O codifique otra oración.');
    
});


