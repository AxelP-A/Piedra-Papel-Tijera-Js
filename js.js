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

/* TO DO:
Averiguar como generar un login y una conexión con base de datos en Js, para poder armar una leaderboard y mantener los datos de cada partida realizada por cada usuario.

 Refactorizar método tablaReportePartidas() y hacer las modificaciones necesarias para que los botones que genere tengan funcionalidad e id único.
 Realizar interfaz gráfica.
*/

document.getElementById("img-container").style.display = "none";
document.getElementById("tabla").style.display = "none";
document.getElementById("tablaResumen").style.display = "none";

function iniciar() {
	document.getElementById("empezar-juego").style.display = "none";
	document.getElementById("img-container").style.display = "block";
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
		actualizarEstado()
		estadoDePartida();
	}
});

function eleccionMaquina() {
	valorMaquina = mano[Math.floor(Math.random() * mano.length)];
}

function resultado() {
	if (valorMaquina === valorElegido) {
		alert("¡Empate! Ambos tienen " + valorElegido);
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
	alert("¡Felicidades, has ganado la ronda! Elegiste " + valorElegido + " y la máquina ha elegido " + valorMaquina);
	cantidadGanadas++;
	resultadoRonda = "Victoria";
}

function agregarPerdida() {
	alert("¡Que lástima, has perdido la ronda! Elegiste " + valorElegido + " y la máquina ha elegido " + valorMaquina);
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

function estadoDePartida() {
	if (cantidadPerdidas === 3) {
		generacionDeTablasPuntajesYresultados("derrota", "Has perdido la partida :(. Tu puntuación fue de " + puntuacion + " puntos.");
	} else if (cantidadGanadas === 3) {
		generacionDeTablasPuntajesYresultados("Victoria", "Has perdido la partida :(. Tu puntuación fue de " + puntuacion + " puntos.");
	}
}

function generacionDeTablasPuntajesYresultados(resultado, mensaje) {
	resultadoDePartida = resultado;
	tablaReportePartidas();
	promedioPuntajeSesion();
	puntajeMasAlto();
	alert(mensaje);
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

			/*	let $botonResumenRonda = document.createElement("td");
				$botonResumenRonda.tagName = <button type="button" id="partida + i">Click me</button>
				$tr.appendChild($botonResumenRonda);*/
			let $botonResumenRonda = document.createElement("td");
			$botonResumenRonda = document.createElement("button");
			$botonResumenRonda.innerHTML = "Resumen";
			$tr.appendChild($botonResumenRonda);

			$tabla.appendChild($tr);
		}
	}
	tablaReporteRondas();
	/*document.querySelector("#footTabla");
	let $tFootPartidas = document.createElement("td");
	$tFootPartidas.textContent = "Cantidad de partidas jugadas: " + partidasJugadas;

	let $tFootPromedio = document.createElement("td");
	$tFootPromedio.textContent = "Cantidad de partidas jugadas: " + promedioPuntuacion;*/
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

function tablaReporteRondas() {

	removerTablaRondas();
	document.getElementById("tablaResumen").style.display = "block";

	for (let i = 0; i <= resumenPartidasSesionActual.length; i++) {
		if (resumenPartidasSesionActual[i] !== undefined) {
			console.log("entro al primer for");
			console.log("El valor de i es: " + i);
			for (let j = 0; j <= resumenPartidasSesionActual[i].eleccionesPartida.length; j++) {
				console.log(resumenPartidasSesionActual[i].eleccionesPartida.length);

				if (resumenPartidasSesionActual[i].eleccionesPartida[j] !== undefined) {
					console.log("entro al último for");

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
					console.log("El valor de j es: " + j);
					console.log("creo la tabla");
				}
			}
		}
	}
}

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

function fin() {
	let continuar = confirm("Juego terminado ¿Deseas comenzar una nueva partida?");
	if (continuar) {
		iniciar();
	} else {
		document.getElementById("empezar-juego").style.display = "block";
		document.getElementById("img-container").style.display = "none";
		mostrarTabla()
	}
}