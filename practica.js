// Eliminar todos los espacios en la cadena
function eliminarEspacios(cadena) {
    return cadena.replace(/\s+/g, '');
}

let texto = "Hola mundo con espacios";
let resultado = eliminarEspacios(texto);
console.log(resultado); // "Holamundoconespacios"

// Eliminar todos los espacios en la cadena
function eliminarEspacios(cadena) {
    return cadena.replace(/\s+/g, '');
}

// Eliminar elementos duplicados en un array
function eliminarDuplicados(arr) {
    return [...new Set(arr)];
}

let texto = "Hola mundo con espacios";
let resultado = eliminarEspacios(texto);
console.log(resultado); // "Holamundoconespacios"

let array = [1, 2, 2, 3, 4, 4, 5];
let arraySinDuplicados = eliminarDuplicados(array);
console.log(arraySinDuplicados); // [1, 2, 3, 4, 5]