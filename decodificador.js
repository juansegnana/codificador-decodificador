const fs = require('fs');
const { exit } = require('process');

let stdin = process.openStdin();

fs.readFile('./outputCodificado.txt', 
        {encoding:'utf8', flag:'r'},
        function(err, data) {
    if(err) {
        if (err.code === 'ENOENT') {
            console.log('No existe salida de un codificador. Por favor ejecute "index.js" o verifique que exista un "output.txt"');
        } else {
            console.log('Se produjo un error:', err.message);
        };
        return;
    }
    
    const arrData = data.split('\n');
    const splited = arrData.map(el => el.split(' '));
    splited.pop(); // remover espacio vacio final.
    

    //console.log(splited);
    let ArrLetraC = [6]
    let ArrLetraF = []
    let ContadorColumna = 0
    let ContadorFila = 0
    let ParidadHorizontal = []
    let ParidadVertical = []
    
    //Primero copio las paridades en arreglos
    for (let i = 0; i < (splited.length-1); i++) {
        ParidadVertical[i] = splited[i][splited[i].length-1]
        for (let j = 0; j < (splited[i].length-1); j++) {
            ParidadHorizontal[j]= splited[7][j]
        }
    }
    const ParidadGeneral= splited[7][splited[1].length-1]

    //Controlo que esten las paridades V y H correctas con respecto a la paridad general
    let contPV=0
    let contPH=0
    let Mayor = 0
    if ((ParidadHorizontal.length)<(ParidadVertical.length)){
        Mayor = ParidadVertical.length
    }else{
        Mayor = ParidadHorizontal.length
    }
    for (let i = 0; i < Mayor; i++) {
        if (ParidadVertical[i] === '1') {
            contPV++
        }
        if (ParidadHorizontal[i] === '1') {
            contPH++
        }
    }
    
    console.log(`La paridad horizontal es: ${ParidadHorizontal}`)
    console.log(`La paridad vertical es: ${ParidadVertical}`)
    
    const TotalP = ((contPH + contPV) % 2).toString()

    //si son correctas ejecuto lo demas 
    if (TotalP === ParidadGeneral) {
    
        //Primero me centro en obtener las filas y contar los '1'
        let k = 0
        let errorFila = []
        for (let fila = 0; fila < splited.length-1; fila++) {
            while(ArrLetraC.length > 0){
                ArrLetraC.pop();  
            }
            ContadorColumna = 0
            for (let columna = 0; columna < splited[fila].length-1; columna++) {
                ArrLetraC [columna] = splited[fila][columna]
                if (ArrLetraC[columna] === '1') {
                    ContadorColumna++
                }
            
            }

            // Aca compruebo si Obtuve lo mismo en cada fila con la paridad vertical y lo guardo en un arreglo para luego poder conocer su ubicacion y arregarlo
            if ((ContadorColumna %2).toString() === ParidadVertical[k]) {
                console.log(`La fila numero "${k}" no posee ningun error`)
                errorFila[k]= 'CORRECTO'
            }else{
                console.log(`La fila numero "${k}" posee un error`)
                errorFila[k]= 'ERROR'
            }
            k++
            
        }
    
        //Ahora me centro en las columnas y obtener sus '1'
        k = 0
        let errorColumna= []
        for (let columna = 0; columna < splited[1].length-1; columna++) {
            while(ArrLetraF.length > 0){
                ArrLetraF.pop();  
            }
            ContadorFila = 0
            for (let fila = 0; fila < splited.length-1; fila++) {
                ArrLetraF [fila] = splited[fila][columna]
                if (ArrLetraF[fila] === '1') {
                    ContadorFila++
                }
    
            }

            //Compruebo tambien con la Paridad horizontal en este caso y lo guardo en otro arreglo para obtener la interseccion 
            if ((ContadorFila %2).toString() === ParidadHorizontal[k]) {
                console.log(`La columna numero "${k}" no posee ningun error`)
                errorColumna[k]= 'CORRECTO'
            }else{
                console.log(`La columna "${k}" posee un error`)
                errorColumna[k]= 'ERROR'
            }
            k++
        }
        
        //Paso a las correcciones 
        console.log('Se realizaran las correcciones de ser necesario...\nObservar outputDecodificador.txt')
        
        //Ya que se me guardo los 'ERROR' manteniendo la ubicacion que tenian, puedo obtener la interserccion 
        for (let i = 0; i < errorFila.length; i++) {
            for (let j = 0; j < errorColumna.length; j++) {
                if ((errorColumna[j]=== 'ERROR') && (errorFila[i]=== 'ERROR')) {
                    if (splited[i][j]==='1') {
                        splited[i][j]= '0'
                    } else {
                        splited[i][j]= '1'
                    }
                }
                
            }
        }

        const file = fs.createWriteStream('outputDecodificador.txt');
        // convertir splited a texto.
        splited.unshift(convertirATexto(splited)); // unshift coloca a primer elemento.
        splited.forEach(function(v) { file.write(v.join(' ') + '\n'); });
        file.end();

        console.log('Escriba "exit" para salir.');
        stdin.addListener("data", function(data) {
            if (data.toString().trim() === 'exit') {
                exit();
            }
        });

    } else {
        console.log('La paridad general es incorrecta, reenvie la informacion')
    }

});

const convertirATexto = (arrMatrix) => {

    let binaryArray = [];

    for (j = 0; j<arrMatrix[0].length-1; j++) {
        
        let tempColumna = [];
        for (i = 0; i<arrMatrix.length-1; i++) {
            
            tempColumna.push(arrMatrix[i][j]);

        }
        binaryArray.push(tempColumna.join(''));

    };

    // Cada caracter en binario lo parsea a un caracter en Unicode. 
    const toAscii = (arr) => arr.map(i => String.fromCharCode(parseInt(i, 2))).join('');
    const arrAscii = toAscii(binaryArray).split('');
    return arrAscii;
    
}