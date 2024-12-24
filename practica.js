// Eliminar todos los espacios en la cadena
function eliminarEspacios(cadena) {
    return cadena.replace(/\s+/g, '');
}

let texto = "Hola mundo con espacios";
let resultado = eliminarEspacios(texto);
console.log(resultado); // "Holamundoconespacios"
gygyugu