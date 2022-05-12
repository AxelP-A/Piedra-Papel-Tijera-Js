let mano = ["Piedra", "Papel", "Tijera"];
let valorElegido;
let valorMaquina;
let cantidadGanadas;
let cantidadPerdidas;
let cantidadEmpatadas;
let puntuacion;
let resultadoDePartida;
let resumenPartidasSesionActual = [];
let infoPartidaActual;
let infoRondaActual = [];
let partidasJugadas = 0;
let promedioPuntuacion = 0;
let resultadoRonda;
let eleccionesDeManoPorPartida = [];
let puntajeMaximo = 0;
let nombreUsuario = "";
const mensajesResultado = document.querySelector("#mensajesResultado");


/* TO DO:
- Agregar otro text content para el mensaje del final de la partida, así no pisa al mensaje del resultado de la última ronda.

- Agregar un botón que redirija a las reglas del juego y comente las funcionalidades de la página.

- Cambiar los botones dinámicos por chechbox (con formato toggle bar), y guardar el id del que se activó, desactivar
cualquier otro que previamente haya estado activado, o ver la posibilidad de retener los id activados y generar la tabla con 
los datos de todos los checkbox activados.

- Averiguar como realizar un corte de línea al utilizar los textContent (no funciona con /n ni <br>) y ver como darle estilos
para así poder darle un color verde a la victoria y un color rojo a la derrota, y aumentar el tamaño de ese texto, etc. USAR 
INNERTEXT O INNER HTML.

- Averiguar por qué dataTables no reconoce las 2 tablas.

- Generar sonidos al presionar botones e iconos.

- Averiguar como realizar test unitarios.

- Mejorar interfaz gráfica (prioridad: separar los 7 datos mostrados en recuadro) y ver que pasó con el responsive.

- Averiguar como generar un login y una conexión con base de datos en Js, para poder armar una leaderboard
 y mantener los datos de cada partida realizada por cada usuario.
*/


/* Si tocamos el botón de mostrar resumen, que cambie a botón ocultar resumen, y que ese aplique el método de cambiar rondas
 y ponga la tabla en display none. 
 Buscar como limpiar el querySelectorAll*/

/*
$(".boton-tabla").on('click', firstClick)
function firstClick() {
	alert("First Clicked");
	$(".boton-tabla").off('click').on('click', secondClick)
}
function secondClick() {
	alert("Second Clicked");
	$(".boton-tabla").off('click').on('click', firstClick)
}*/


/*
$(document).on('click', '.boton-tabla', function() {
	document.querySelectorAll(".boton-tabla").forEach(el => {
		el.addEventListener("click", e => {
			const id = e.target.getAttribute("id");
			tablaReporteRondas(id);
		});
	});

});
*/

/*
window.addEventListener('DOMContentLoaded', function() {
	$('.dataTable').DataTable({
		"order": [], language: {
			url: "https://cdn.datatables.net/plug-ins/1.10.19/i18n/Spanish.json"
		}
	});
});*/

document.getElementById("continuar-o-abandonar").style.display = "none";
document.getElementById("empezar-juego").style.display = "none";


const botonUsuario = document.querySelector("#validar-usuario");
botonUsuario.addEventListener("click", function() {
	const comprobar_usuario = document.getElementById("usuario").value;
	if (validar(comprobar_usuario)) {
		document.getElementById("nombre-usuario").style.display = "none";
		document.getElementById("empezar-juego").style.display = "block";
		nombreUsuario = comprobar_usuario;
		mensajesResultado.textContent = "¡Bienvenido " + nombreUsuario + "!";
	} else {
		mensajesResultado.textContent = "El nombre solo debe tener letras y números, y una longitud 4 a 20 caracteres.";
	};
});

function validar(usuario) {
	const regEx = /^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/.exec(usuario);
	const valido = !!regEx;
	return valido;
}

$(document).on('click', '.boton-tabla', function() {
	document.querySelectorAll(".boton-tabla").forEach(function(botones) {
		botones.addEventListener("click", function(boton) {
			const id = boton.target.getAttribute("id");
			tablaReporteRondas(id);
			getFocus();
		});
	});
});

function getFocus() {
	document.getElementById("tablaResumen").focus({ preventScroll: false });
	/*EL FOCUS NO ESTÁ FUNCIONANDO*/
}


/*document.getElementById("tabla_wrapper").style.display = "none";
document.getElementById("tablaResumen_wrapper").style.display = "none";*/
document.getElementById("img-container").style.display = "none";
document.getElementById("tabla").style.display = "none";
document.getElementById("tablaResumen").style.display = "none";
document.getElementById("continuar-o-abandonar").style.display = "none";
document.getElementById("datos-partida").style.display = "none";

function iniciar() {
	document.getElementById("empezar-juego").style.display = "none";
	document.getElementById("continuar-o-abandonar").style.display = "none";
	document.getElementById("img-container").style.display = "block";
	document.getElementById("img-aux").style.display = "block";
	document.getElementById("datos-partida").style.display = "flex";
	mostrarTabla();
	inicializarValoresDefault();
	actualizarEstado();
	actualizarValoresIniciales();
}

function actualizarValoresIniciales() {
	document.querySelector("#partidasJugadas").textContent = partidasJugadas;
	document.querySelector("#promedioPuntaje").textContent = promedioPuntuacion;
	document.querySelector("#puntajeMaximo").textContent = puntajeMaximo;
}

function mostrarTabla() {
	const tablaBody = document.querySelector("#bodyTabla");
	if (tablaBody.childElementCount > 0) {
		document.getElementById("tabla").style.display = "block";
	}
}

function inicializarValoresDefault() {
	cantidadGanadas = 0;
	cantidadPerdidas = 0;
	cantidadEmpatadas = 0;
	puntuacion = 0;
	resultadoDePartida = "";
	valorMaquina = "";
	valorElegido = "";
	mensajesResultado.textContent = "";
	mensajesPartida.textContent = "";
	mensajeDefinicion.textContent = "";
}

const botonIniciar = document.querySelector("#empezar-juego");
botonIniciar.addEventListener("click", function() {
	iniciar();
});

const piedra = document.querySelector("#Piedra");
piedra.addEventListener("click", function() {
	valorElegido = mano[0];
})

const papel = document.querySelector("#Papel");
papel.addEventListener("click", function() {
	valorElegido = mano[1];
})

const tijera = document.querySelector("#Tijera");
tijera.addEventListener("click", function() {
	valorElegido = mano[2];
})

const botonValorElegido = document.querySelector("#img-container");
botonValorElegido.addEventListener("click", function() {
	if (cantidadGanadas < 3 && cantidadPerdidas < 3) {
		eleccionMaquina();
		resultado();
		actualizarEstado();
		estadoDePartida();
	}
});

function eleccionMaquina() {
	valorMaquina = mano[Math.floor(Math.random() * mano.length)];
}

function resultado() {
	if (valorMaquina === valorElegido) {
		/*alert("¡Empate! Ambos tienen " + valorElegido);*/
		mensajesResultado.textContent = "¡Empate! Ambos tienen " + valorElegido + ".";
		cantidadEmpatadas++;
		resultadoRonda = "Empate";
	}
	else if (condicionVictoria()) {
		agregarGanada();
	} else if (condicionDerrota()) {
		agregarPerdida();
	}
	actualizarEstado();
	generacionResultadoRonda();
}

function condicionVictoria() {
	return ((valorMaquina === "Papel" && valorElegido === "Tijera") ||
		(valorMaquina === "Tijera" && valorElegido === "Piedra") ||
		(valorMaquina === "Piedra" && valorElegido === "Papel"))
}

function condicionDerrota() {
	return ((valorMaquina === "Piedra" && valorElegido === "Tijera") ||
		(valorMaquina === "Papel" && valorElegido === "Piedra") ||
		(valorMaquina === "Tijera" && valorElegido === "Papel"))
}

function agregarGanada() {
	/*alert("¡Felicidades, has ganado la ronda! Elegiste " + valorElegido + " y la máquina ha elegido " + valorMaquina);*/
	mensajesResultado.textContent = "¡Felicidades " + nombreUsuario + ", has ganado la ronda! Elegiste " + valorElegido + " y la máquina ha elegido "
		+ valorMaquina + ".";
	cantidadGanadas++;
	resultadoRonda = "Victoria";
}

function agregarPerdida() {
	/*alert("¡Que lástima, has perdido la ronda! Elegiste " + valorElegido + " y la máquina ha elegido " + valorMaquina);*/
	mensajesResultado.textContent = "¡Que lástima " + nombreUsuario + ", has perdido la ronda! \n Elegiste " + valorElegido + " y la máquina ha elegido "
		+ valorMaquina + ".";
	cantidadPerdidas++;
	resultadoRonda = "Derrota";
}

function actualizarEstado() {
	document.querySelector("#rondasGanadas").textContent = cantidadGanadas;
	document.querySelector("#rondasPerdidas").textContent = cantidadPerdidas;
	document.querySelector("#rondasEmpatadas").textContent = cantidadEmpatadas;
	puntuacion = cantidadGanadas * 100 - cantidadPerdidas * 25 + cantidadEmpatadas * 5;
	document.querySelector("#puntaje").textContent = puntuacion;

}

function generacionResultadoRonda() {
	infoRondaActual = {
		estado: resultadoRonda,
		eleccionJugador: valorElegido,
		eleccionMaquina: valorMaquina,
	}
	eleccionesDeManoPorPartida.push(infoRondaActual);
	infoRondaActual = [];
}

const mensajeDefinicion = document.querySelector("#mensajeDefinicion");

function estadoDePartida() {
	if (cantidadPerdidas === 3) {
		generacionDeTablasPuntajesYresultados("Derrota", "Has perdido la partida " + nombreUsuario + " :(.  Tu puntuación fue de " + puntuacion + " puntos.");
	} else if (cantidadGanadas === 3) {
		generacionDeTablasPuntajesYresultados("Victoria", "¡Felicidades " + nombreUsuario + ", has ganado la partida! Tu puntuación fue de " + puntuacion + " puntos.");
	}
}

function generacionDeTablasPuntajesYresultados(resultado, mensaje) {
	mensajeDefinicion.textContent = mensaje;
	resultadoDePartida = resultado;
	tablaReportePartidas();
	promedioPuntajeSesion();
	puntajeMasAlto();
	/*alert(mensaje);*/
	fin();
}

function generacionDeInfopartidaActual() {
	infoPartidaActual = {
		estado: resultadoDePartida,
		rondasGanadas: cantidadGanadas,
		rondasEmpatadas: cantidadEmpatadas,
		rondasPerdidas: cantidadPerdidas,
		puntaje: puntuacion,
		eleccionesPartida: eleccionesDeManoPorPartida,
	}
	resumenPartidasSesionActual.push(infoPartidaActual);
	eleccionesDeManoPorPartida = [];
	partidasJugadas++;
}

function tablaReportePartidas() {
	generacionDeInfopartidaActual();
	removerTablaActual();
	for (let i = 0; i <= resumenPartidasSesionActual.length; i++) {
		if (resumenPartidasSesionActual[i] !== undefined) {
			const $tabla = document.querySelector("#bodyTabla");
			const $tr = document.createElement("tr");

			let $tdResultado = document.createElement("td");
			$tdResultado.textContent = resumenPartidasSesionActual[i].estado;
			$tr.appendChild($tdResultado);

			let $tdGanadas = document.createElement("td");
			$tdGanadas.textContent = resumenPartidasSesionActual[i].rondasGanadas;
			$tr.appendChild($tdGanadas);

			let $tdEmpate = document.createElement("td");
			$tdEmpate.textContent = resumenPartidasSesionActual[i].rondasEmpatadas;
			$tr.appendChild($tdEmpate);

			let $tdPerdidas = document.createElement("td");
			$tdPerdidas.textContent = resumenPartidasSesionActual[i].rondasPerdidas;
			$tr.appendChild($tdPerdidas);

			let $tdPuntaje = document.createElement("td");
			$tdPuntaje.textContent = resumenPartidasSesionActual[i].puntaje;
			$tr.appendChild($tdPuntaje);

			let $tdbotonResumen = document.createElement("td");
			$botonResumenRonda = document.createElement("button");
			$botonResumenRonda.innerHTML = "Resumen";
			$botonResumenRonda.id = i;
			$botonResumenRonda.className = "boton-tabla";

			$tdbotonResumen.appendChild($botonResumenRonda);
			$tr.appendChild($tdbotonResumen);

			$tabla.appendChild($tr);
		}
	}
}

function removerTablaActual() {
	const removerTablaBody = document.querySelector("#bodyTabla");
	while (removerTablaBody.hasChildNodes()) {
		removerTablaBody.removeChild(removerTablaBody.firstChild);
	}
}

function removerTablaRondas() {
	const removerTablaBodyResumen = document.querySelector("#bodyTablaResumen");
	while (removerTablaBodyResumen.hasChildNodes()) {
		removerTablaBodyResumen.removeChild(removerTablaBodyResumen.firstChild);
	}
}

function tablaReporteRondas(id) {

	removerTablaRondas();
	document.getElementById("tablaResumen").style.display = "block";

	if (resumenPartidasSesionActual[id] !== undefined) {
		for (let j = 0; j <= resumenPartidasSesionActual[id].eleccionesPartida.length; j++) {
			if (resumenPartidasSesionActual[id].eleccionesPartida[j] !== undefined) {

				const $tabla = document.querySelector("#bodyTablaResumen");
				const $tr = document.createElement("tr");

				let $tdnumeroPartida = document.createElement("td");
				$tdnumeroPartida.textContent = parseInt(id, 10) + 1;
				$tr.appendChild($tdnumeroPartida);

				let $tdnumeroRonda = document.createElement("td");
				$tdnumeroRonda.textContent = j + 1;
				$tr.appendChild($tdnumeroRonda);

				let $tdResultadoRonda = document.createElement("td");
				$tdResultadoRonda.textContent = resumenPartidasSesionActual[id].eleccionesPartida[j].estado;
				$tr.appendChild($tdResultadoRonda);

				let $tdGanadas = document.createElement("td");
				$tdGanadas.textContent = resumenPartidasSesionActual[id].eleccionesPartida[j].eleccionJugador;
				$tr.appendChild($tdGanadas);

				let $tdEmpate = document.createElement("td");
				$tdEmpate.textContent = resumenPartidasSesionActual[id].eleccionesPartida[j].eleccionMaquina;
				$tr.appendChild($tdEmpate);

				$tabla.appendChild($tr);
			}
		}
	}
}

/* ESTA VERSIÓN TRAE TODAS LAS PARTIDAS DISPONIBLES AL MISMO TIEMPO:
function tablaReporteRondas() {
	removerTablaRondas();
	document.getElementById("tablaResumen").style.display = "block";
	for (let i = 0; i <= resumenPartidasSesionActual.length; i++) {
		if (resumenPartidasSesionActual[i] !== undefined) {
			for (let j = 0; j <= resumenPartidasSesionActual[i].eleccionesPartida.length; j++) {
				if (resumenPartidasSesionActual[i].eleccionesPartida[j] !== undefined) {
					const $tabla = document.querySelector("#bodyTablaResumen");
					const $tr = document.createElement("tr");
					let $tdnumeroPartida = document.createElement("td");
					$tdnumeroPartida.textContent = i + 1;
					$tr.appendChild($tdnumeroPartida);
					let $tdnumeroRonda = document.createElement("td");
					$tdnumeroRonda.textContent = j + 1;
					$tr.appendChild($tdnumeroRonda);
					let $tdResultadoRonda = document.createElement("td");
					$tdResultadoRonda.textContent = resumenPartidasSesionActual[i].eleccionesPartida[j].estado;
					$tr.appendChild($tdResultadoRonda);
					let $tdGanadas = document.createElement("td");
					$tdGanadas.textContent = resumenPartidasSesionActual[i].eleccionesPartida[j].eleccionJugador;
					$tr.appendChild($tdGanadas);
					let $tdEmpate = document.createElement("td");
					$tdEmpate.textContent = resumenPartidasSesionActual[i].eleccionesPartida[j].eleccionMaquina;
					$tr.appendChild($tdEmpate);
					$tabla.appendChild($tr);
				}
			}
		}
	}
}
*/

function promedioPuntajeSesion() {
	promedioPuntuacion = 0;
	for (let i = 0; i <= resumenPartidasSesionActual.length; i++) {
		if (resumenPartidasSesionActual[i] !== undefined) {
			promedioPuntuacion += parseInt(resumenPartidasSesionActual[i].puntaje, 10);
		}
	}
	promedioPuntuacion /= resumenPartidasSesionActual.length;
}

function puntajeMasAlto() {

	let valorMaximo = -999;

	for (let i = 0; i <= resumenPartidasSesionActual.length; i++) {
		if (resumenPartidasSesionActual[i] !== undefined) {
			if (valorMaximo <= resumenPartidasSesionActual[i].puntaje) {
				valorMaximo = resumenPartidasSesionActual[i].puntaje;
			}
		}
	}
	puntajeMaximo = valorMaximo;
}

const botonContinuar = document.querySelector("#comenzar-nueva-partida");
botonContinuar.addEventListener("click", function() {
	iniciar();
});

const botonAbandonar = document.querySelector("#abandonar-partida");
botonAbandonar.addEventListener("click", function() {
	document.getElementById("empezar-juego").style.display = "block";
	document.getElementById("img-aux").style.display = "none";
	document.getElementById("continuar-o-abandonar").style.display = "none";
	mensajesResultado.textContent = "";
	mensajesPartida.textContent = "";
	mensajeDefinicion.textContent = "";
	mostrarTabla();
});

const mensajesPartida = document.querySelector("#mensajesPartida");

function fin() {
	document.getElementById("continuar-o-abandonar").style.display = "flex";
	document.getElementById("img-aux").style.display = "none";
	document.getElementById("datos-partida").style.display = "flex";
	mostrarTabla();
	mensajesPartida.textContent = "¡¡" + resultadoDePartida + "!! " + " Juego terminado ¿Deseas comenzar una nueva partida?";
	/*let continuar = confirm("¡¡" + resultadoDePartida + "!! " + "\n Juego terminado ¿Deseas comenzar una nueva partida?");
	if (continuar) {
		iniciar();
	} else {
		document.getElementById("empezar-juego").style.display = "block";
		document.getElementById("img-container").style.display = "none";
		document.getElementById("continuar-o-abandonar").style.display = "none";
		mostrarTabla()
	}*/
}