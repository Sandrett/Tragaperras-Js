let monedasTotales = 0
let pictures = ['aguacate', 'ajo', 'cebolla', 'pepino', 'puerro', 'tomate', 'zanahoria']

// 0 => aguacate, 1 => ajo, 2 => cebolla, 3 => pepino, 4 => puerro, 5 => tomate, 6 => zanahoria

function obtenerValorTirada() {
    let x = Array()

    for (i = 0; i < 3; i++) {
        let result = Math.round(Math.random() * (pictures.length - 1))
        console.log("Resultado",result)
        x.push(result)
    }

    return x
}

function mostarImagenes(result) {

    let counter = 0

    // Añadimos aleatoriamente 3 imagenes
    $('.picture img').each(function () {

        let randomPicture = result[counter]
        $(this).attr('src', "images/" + pictures[randomPicture] + ".png")
        counter++

    })

}

function ocurrencias(array, value) {
    let count = 0

    for (i = 0; i < array.length; i++) {
        if (array[i] == value)
            count++
    }
    return count
}


//
//  Combinaciones posibles:
//
//     1 zanahoria -> ganar 1 moneda
//     2 zanahoria -> ganar 4 monedas
//     3 zanahoria -> ganar 10 monedas
//     2 verduras iguales (no zanahoria) --> ganar 2 monedas
//     3 verduras iguales(no zanahoria) --> ganar 5 monedas
//     1 zanahoria + 2 verduras iguales --> ganar 3 monedas

// 2 vegetales iguales
function dosVegetalesIguales(result) {

    if ((result.indexOf(6) === -1) &&
        (result[0] === result[1] || result[0] === result[2] || result[1] === result[2])
    ) return true

    return false;
}
//funcion para calcular la recompensa de 3 vegetales iguales
function tresVegetalesIguales(result) {
    if (result.indexOf(6) === -1 && result[0] === result[1] && result[1] === result[2])
        return true;
    return false;
}
//funcion de una zanahoria y 2 vegetales iguales
function zanahoriaDosVegetalesIguales(result) {
    if ((result.indexOf(6) !== -1) &&
        (result[0] === result[1] || result[0] === result[2] || result[1] === result[2])
    ) return true

    return false;
}

//Establecemos el valor de la recompensa según las combinaciones de los vegetales
function calcularRecompensa(result) {
    let recompensa = 0

    if (zanahoriaDosVegetalesIguales(result)) {
        recompensa = 3
    } else if (result.indexOf(6) !== -1 && ocurrencias(result, 6) === 1) {
        recompensa = 1;
    } else if (result.indexOf(6) !== -1 && ocurrencias(result, 6) === 2) {
        recompensa = 4
    } else if (result.indexOf(6) !== -1 && ocurrencias(result, 6) === 3) {
        recompensa = 10
    } else if (dosVegetalesIguales(result)) {
        recompensa = 2
    } else if (tresVegetalesIguales(result)) {
        recompensa = 5
    } else {
        recompensa = 0
    }

    return recompensa
}

function actualizarMonedas() {
    $("#contador-monedas").text(monedasTotales)
}

$(document).ready(function () {

    let tiradaInicial = obtenerValorTirada()
    mostarImagenes(tiradaInicial)

    // Los botones Tirar y Salir están desabilitados hasta que haya dinero
    $("#start_button, #stop_button").attr('disabled', true)

    $("#insert_button").click(function () {

        let monedas = $("#amount_input").val()

        if (monedas === "" || monedas <= 0) {
            alert("Por favor introducir un valor valido. valor > 0")
            return
        }
        if (monedas === "") {
            alert("Porfavor introduce un valor válido.")
            return
        }

        monedasTotales = monedas

        actualizarMonedas();


        $(this).attr('disabled', true)

        // Habilitamos el botón tirar
        $("#start_button").attr('disabled', false)

    })

    $("#start_button").click(function () {

        if(monedasTotales <= 0 )
        {
            alert("No tienes más monedas, pulsa salir para volver jugar.")
            return
        }
        console.log('Girando....')
        monedasTotales--
        actualizarMonedas()

        console.log("Monedas totales, ",monedasTotales)

        $(".picture img").addClass('rotate')
        $("#stop_button").attr('disabled', true)

        $("#start_button").attr('disabled', true)
        setTimeout(function(){
            $(".picture img").removeClass('rotate')
            $("#start_button").attr('disabled', false)
            $("#stop_button").attr('disabled', false)
            console.log('Parada')
        
        // obtenemos 3 valores aleatorios
        let result = obtenerValorTirada()

        // mostrar las imagenes
        mostarImagenes(result)

        // calcular las monedas
        let recompensa = calcularRecompensa(result)

        
        // Actualizamos y mostramos las monedas
        monedasTotales += recompensa
        actualizarMonedas()

        // Añadimos al historial de monedas
        if (recompensa >0){
            $("#history ul").append(`<li> Has ganado ${recompensa} monedas. </li>`)
        } else {
            $("#history ul").append(`<li> Has perdido 1 moneda. </li>`)
        }

        
        },1000);
        $(".picture img").addClass('rotate')
        
  


    })

    //boton Salir
    $("#stop_button").click(function () {

        console.log('Parada')
        alert("Monedas totales: "+monedasTotales)
        monedasTotales = 0
        recompensa = 0
        actualizarMonedas()
        //vaciamos la lista
        $("#history ul").empty();
        //habilitamos el botón
        $("#insert_button").attr('disabled', false)
        

    })

})

