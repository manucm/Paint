// Definimos variables globales
var canvas;
var context;
var startx;
var starty;
var tmpx;
var tmpy;
var endx;
var endy;
var estado;
var desplz=0;
var pulsado;
var lineHeight;
var tabulador;
var imagenFondo = new Image();
var imagenMomentanea = new Image();
var estado='Lapiz';
var cadena = "";
var ultimoCaracter = "";
var contextos = new Array();
var contextosEliminados = new Array();
var lineas = 1;
var cuadroTexto = {
	x : 0,
	y : 0,
	alto : 0,
	ancho : 0,
	activo : false,
	dibujaR : function()
	{
		context.save();
		context.beginPath();
		context.rect(this.x, this.y, this.ancho, this.alto);
    	context.strokeStyle = this.colorLinea;
		context.stroke();
		//context.restore();
	},
	set : function(x1, y1)
	{
		this.x = x1;
		this.y = y1;
	}
}

// Creamos todos los objetos que vamos a necesitar
var pintor = new Forma(0,0);

window.onload = function()
{
	// Realizamos la activación de todas las herramientas
	activarHerramientas();

	// Extraemos el canvas y el contexto
	canvas = document.getElementById('myCanvas');
	context = canvas.getContext('2d');

	// Guardamos la imagen inicial
	contextos.push(context.getImageData(0, 0, canvas.width, canvas.height));


	canvas.onmousedown = iniciar;
	canvas.onmouseup = finalizar;
	canvas.onmousemove = actualizar;
	document.onkeypress=keylogger;	
	document.onkeydown=teclasEspeciales;

	var input = document.getElementById('iColor');
}


function iniciar(e)
{
	if (e.button==0)
	{
		pulsado=true;

		startx = e.pageX - this.offsetLeft;
		starty = e.pageY - this.offsetTop;



		if (estado!='Texto' || !cuadroTexto.activo)
			imagenFondo = context.getImageData(0, 0, canvas.width, canvas.height);

		// Modificamso la posicion inical del pintor
		if (estado=='Trayectoria' && dibujoSinIniciar==false )
		{	
			pintor.set(endx, endy);
			pintor.dibujaLinea(startx, starty);
		}
		else if (estado=='ObtenerColor')
		{
	        var mouseX = parseInt(e.offsetX);
        	var mouseY = parseInt(e.offsetY);

	        //  get imageData object from canvas
	        var idata = context.getImageData(0, 0, canvas.width, canvas.height);

	        //  get pixelArray from imagedata object
	        var data = idata.data;  

	        //  calculate offset into array for pixel at mouseX/mouseY
	        var i = ((mouseY * canvas.width) + mouseX) * 4;

	        //  get RGBA values
	        var r = data[i];        
	        var g = data[i+1];
	        var b = data[i+2];
	        //var a = data[i+3];

	        
	        var col =rgbToHex(r,g,b);
	        
	        var colores = document.getElementsByClassName('propiedades');

			for (var i=0; i< colores.length; i++)
			{
				if (colores[i].checked==true)
				{
					var id = "c"+colores[i].id.slice(2,7);

					document.getElementById(id).style.background = col;
					if (colores[i].id == 'icolor1')
						pintor.setAtributo("colorLinea", col);
					
					else
						pintor.setAtributo("colorRelleno", col);			
				}
					
			}
			document.getElementById('Lapiz').checked = "checked"; 
		}
		else if (estado=='LineaCuadratica' && dibujoSinIniciar==false)
		{
			var intx = startx; var inty = starty;
			limpiarCanvas();
			pintor.dibujaLineaCuadratica(intx, inty, endx, endy);

		}
		else if (estado=='Borrar')
		{
			pintor.dibujaCirculo(startx, starty, true);
		}
		else if (estado=='Texto')
		{
			if (cuadroTexto.activo==true)
			{
				

				if (startx>=(cuadroTexto.x + cuadroTexto.ancho) || startx <= cuadroTexto.x ||
				 		starty >= (cuadroTexto.y +cuadroTexto.alto) || starty < cuadroTexto.y)
					{
						context.putImageData(imagenFondo, 0,0);
						//pintor.escribe(5+cuadroTexto.x, cuadroTexto.y+15, cadena, cuadroTexto.ancho, 15);
						pintor.escribe(tabulador+cuadroTexto.x, cuadroTexto.y+lineHeight, cadena, cuadroTexto.ancho-tabulador, lineHeight);
						cadena ="";
						cuadroTexto.activo=false;
						imagenFondo = context.getImageData(0, 0, canvas.width, canvas.height);
					}
					else 
					{
						context.putImageData(imagenFondo, 0,0);
						pintor.escribe(tabulador+cuadroTexto.x, cuadroTexto.y+lineHeight, cadena, cuadroTexto.ancho-tabulador, lineHeight);
						imagenMomentanea = context.getImageData(0, 0, canvas.width, canvas.height);
					}
			} 
			else 
			{
								

				cuadroTexto.x = startx;
				cuadroTexto.y = starty;
				pintor.set(startx, starty);
				cuadroTexto.activo = true;
				imagenMomentanea = imagenFondo;
			}
			
			
		}
		else
		{
			pintor.set(startx, starty);
		}
	}
	
	
}


// Método buscado en internet para extraer colores del canvas
function rgbToHex(r, g, b) 
{
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function actualizar(e)
{
	if (pulsado==true)
	{
		//context.clearRect(0,0,canvas.width, canvas.height);
		var tmpx = e.pageX - this.offsetLeft;
		var tmpy = e.pageY - this.offsetTop;

		
		if ((estado!='Lapiz') && (estado!='Borrar')) 
			context.putImageData(imagenFondo, 0, 0);

		switch (estado)
		{
			case 'Texto': if (cuadroTexto.activo==true) 
						  {				
							context.putImageData(imagenMomentanea, 0, 0);
							pintor.dibujaRectangulo(tmpx, tmpy,true)
						  } 
						 break;

			case 'Linea': pintor.dibujaLinea(tmpx, tmpy); break;
			case 'Lapiz': pintor.dibujaLinea(tmpx, tmpy);
					pintor.set(tmpx, tmpy); break;
			case 'Borrar': pintor.dibujaCirculo(tmpx, tmpy,true); break;
			case 'Rectangulo': pintor.dibujaRectangulo(tmpx, tmpy); break;
			case 'Pentagono': pintor.dibujaFormaGeometrica(tmpx, tmpy, 'Pentagono'); break;
			case 'Hexagono': pintor.dibujaFormaGeometrica(tmpx, tmpy, 'Hexagono'); break;
			case 'Heptagono': pintor.dibujaFormaGeometrica(tmpx, tmpy, 'Heptagono'); break;
			case 'Octagono': pintor.dibujaFormaGeometrica(tmpx, tmpy, 'Octagono'); break;
			case 'TrianguloRecto' : pintor.dibujaTrianguloRecto(tmpx, tmpy); break;
			case 'Rombo' :pintor.dibujaRombo(tmpx, tmpy); break;
			case 'Triangulo': pintor.dibujaTriangulo(tmpx, tmpy); break;
			case 'Flecha' : pintor.dibujaFlecha(tmpx, tmpy); break;
			case 'FlechaH' : pintor.dibujaFlechaH(tmpx, tmpy); break;
			case 'Trayectoria':pintor.dibujaLinea(tmpx, tmpy); break;
			case 'Elipse': pintor.dibujaElipse(tmpx, tmpy); break;
		}
	}

}

function finalizar(e)
{
	if (e.button==0)
	{
		pulsado = false;
		
		endx = e.pageX - this.offsetLeft;
		endy = e.pageY - this.offsetTop;

		switch (estado)
		{
			case 'Texto': 
				if (cuadroTexto.activo== true)
				{
					cuadroTexto.ancho = endx - cuadroTexto.x;
					cuadroTexto.alto = endy - cuadroTexto.y;
				}
				

			break;
			case 'Linea': pintor.dibujaLinea(endx, endy); break;
			case 'Borrar': pintor.dibujaCirculo(endx, endy, true); break;
			case 'Lapiz': //pintor.dibujaCirculo(endx, endy);
				pintor.dibujaLinea(endx, endy);

			break;
			// Si extraemos el color, al finalizar el metodo el estado lo ponemos a lapiz
			case 'ObtenerColor': estado='Lapiz'; break;
			case 'Rectangulo': pintor.dibujaRectangulo(endx, endy); break;
			case 'TrianguloRecto': pintor.dibujaTrianguloRecto(endx, endy); break;
			case 'Pentagono': pintor.dibujaFormaGeometrica(endx, endy, 'Pentagono'); break;
			case 'Hexagono': pintor.dibujaFormaGeometrica(endx, endy, 'Hexagono'); break;
			case 'Heptagono': pintor.dibujaFormaGeometrica(endx, endy, 'Heptagono'); break;
			case 'Octagono': pintor.dibujaFormaGeometrica(endx, endy, 'Octagono'); break;
			case 'Rombo': pintor.dibujaRombo(endx, endy); break;
			case 'Triangulo': pintor.dibujaTriangulo(endx, endy); break;
			case 'Flecha': pintor.dibujaFlecha(endx, endy); break;
			case 'Elipse': pintor.dibujaElipse(endx, endy); break;
			case 'FlechaH': pintor.dibujaFlechaH(endx, endy); break;
			case 'Trayectoria': pintor.dibujaLinea(endx, endy); dibujoSinIniciar=false; break;
		}
		contextos.push(context.getImageData(0, 0, canvas.width, canvas.height));
	}	
}

function keylogger(e)
{
	var e = e || window.event;
	var caracter = e.charCode || e.keyCode;

	if (estado=='Texto' && cuadroTexto.activo)
	{
		context.putImageData(imagenFondo, 0, 0);
		var tamanioLetra = pintor.getAtributo('tamanioLetra');
		var intro = false;
		
		lineHeight = 25/16*(tamanioLetra);
		tabulador = 0.5*tamanioLetra;
		var altoOptimo = (lineas < 10)? lineas*(tamanioLetra + lineHeight/2): lineas*(tamanioLetra + lineHeight/2.5);

		var medida = palabraMasLarga(cadena);
		cuadroTexto.alto = (cuadroTexto.alto > altoOptimo)? cuadroTexto.alto : altoOptimo;
		cuadroTexto.ancho = (cuadroTexto.ancho > medida+3.5*tabulador)? cuadroTexto.ancho : medida+3.5*tabulador;
		
		cuadroTexto.dibujaR();
		
		var letra =  String.fromCharCode(caracter);

		if (e.keyCode==13)
		{	
			var cond = lineas
			while (cond <= lineas)
			{
				cadena += " ";
				cond = pintor.escribe(tabulador+cuadroTexto.x, cuadroTexto.y+lineHeight, cadena, cuadroTexto.ancho-tabulador, lineHeight);
			}
		}
		else 
		{
			cadena += letra;
			lineas = pintor.escribe(tabulador+cuadroTexto.x, cuadroTexto.y+lineHeight, cadena, cuadroTexto.ancho-tabulador, lineHeight);
		}
	}
}

function palabraMasLarga(cadena)
{
	var metrics = 0;
	var aux = 0;
	var arraryPalabras = cadena.split(" ");
	
	
	for (var i = 0; i < arraryPalabras.length; i++) 
	{
	    aux = context.measureText(arraryPalabras[i]).width;
	    metrics = (aux > metrics)? aux : metrics;
	}
		return metrics;
}


function teclasEspeciales(e)
{
	e = e || window.event;
	
	if (estado=='Texto' && cuadroTexto.activo && e.keyCode==8)
	{
		context.putImageData(imagenFondo, 0, 0);
		
		var tamanioLetra = pintor.getAtributo('tamanioLetra');
		
		
		lineHeight = 25/16*(tamanioLetra);
		tabulador = 0.5*tamanioLetra;
		var altoOptimo = (lineas < 10)? lineas*(tamanioLetra + lineHeight/2): lineas*(tamanioLetra + lineHeight/2.5);


		cuadroTexto.alto = (cuadroTexto.alto > altoOptimo)? cuadroTexto.alto : altoOptimo;

		cuadroTexto.dibujaR();
		
		cadena = cadena.slice(0, cadena.length -1);
		pintor.escribe(tabulador+cuadroTexto.x, cuadroTexto.y+lineHeight, cadena, cuadroTexto.ancho-tabulador, lineHeight);
	}
}


function limpiarCanvas()
{
	context.clearRect(0, 0, canvas.width, canvas.height);
}

function desplazar()
{
	if (this.value=="abajo")
		desplz = (desplz-5<-70)? desplz:desplz-5;
	else
		desplz = (desplz+5>=5)? desplz:desplz+5;
	var estilo = 'translateY('+desplz+'px)';
	document.getElementById('objeto3D').style.transform=estilo;
}

function desplazarR(e)
{
	e.preventDefault();
	e = e || window.event;
	if (e.wheelDelta==-120)
		desplz = (desplz-3<-70)? desplz:desplz-3;
	else
		desplz = (desplz+3>=3)? desplz:desplz+3;
	var estilo = 'translateY('+desplz+'px)';
	document.getElementById('objeto3D').style.transform=estilo;
}

function Rehacer()
{
	// Eliminamos la ultima imagen eliminada los elementos eliminados
	var recuperar = contextosEliminados.pop();

	if (recuperar!=undefined)
	{
		// La añadimos al array de contextos y mostramos la última
		contextos.push(recuperar);
		context.putImageData(contextos[contextos.length-1],0,0);
	}
	else
	{
		console.log('no hay mas');
	}
}

// Método que elimina la ultima imagen añadida
function Deshacer()
{
	// Eliminamos la última imagen guardada
	var elmentoEliminado = contextos.pop(); 
	// La imagen eliminada la guardamos por si queremos llevar a cabo un rehacer
	contextosEliminados.push(elmentoEliminado);
	// A continuacion mostrmaos el último elemento del array contextos

	if (typeof contextos[contextos.length-1] != 'undefined')
	{
		context.putImageData(contextos[contextos.length-1],0,0);
	}
}

// Método que activa todas las herramientas
function activarHerramientas()
{
	// COLOR BOTONES
	document.getElementById('iColor').onchange = function()
	{
		var color = this.value;

		// Detectamos cual es el color seleccionado (linea o relleno)
		var colores = document.getElementsByClassName('propiedades');

		for (var i=0; i< colores.length; i++)
		{
			if (colores[i].checked==true)
			{
				var id = "c"+colores[i].id.slice(2,7);


				document.getElementById(id).style.background = color;
				if (colores[i].id == 'icolor1')
					pintor.setAtributo("colorLinea", color);
				
				else
					pintor.setAtributo("colorRelleno", color);			
			}
				
		}
	}

	// Botones inicio, rehacer y deshacer
	document.getElementById('bNuevo');
	document.getElementById('bDeshacer').onclick= Deshacer;
	document.getElementById('bRehacer').onclick=Rehacer;

	bNuevo.onclick = function()
	{
		limpiarCanvas();
		contextos= new Array();
	}

	// Objeto3d para mover el panel
	var panel = document.getElementById('panelFormas');
	var botones = document.getElementById('btnDesplazamiento').getElementsByTagName('input')
	for (var i=0; i<botones.length;i++)
	{
		botones[i].onclick = desplazar;
	}

	panelFormas.onmousewheel = desplazarR;

	// ESTADO
	var radios = document.getElementsByClassName('radio');

	// ACCIONES
	for (var i=0; i<radios.length;i++)
	{
		radios[i].onclick = function()
		{
			estado = this.id;
			var labelSeleccionado = document.getElementById("l"+estado);
			labelSeleccionado.className = "hover seleccionado";
		}
	}


	// TEXTO
	var lTexto = document.getElementById('lTexto');
	lTexto.onclick = mostrarPanelTexto;

	// GROSOR
	var grosores = document.getElementById('grosor').getElementsByTagName('input');
	for (var i=0;i<grosores.length;i++)
	{
		grosores[i].onclick=eligeGrosor;
	}
	// INICIAMOS LAS OPCIONES DE ESCRITURA 
	var selects = document.getElementById('selects').getElementsByTagName('select');
	for (var i=0;i<selects.length;i++)
	{
		selects[i].onchange = tipoTamanio;
	}

	var labels = document.getElementById('inputs').getElementsByTagName('label');

	for (var i=0; i<labels.length;i++)
	{
		labels[i].onclick = pesoLinea;
	}
}

function pesoLinea()
{
	var id = this.id.slice(1,10);
	valor = (id=="Normal")?"":id;
	pintor.setAtributo('fontweight', valor);
}

function tipoTamanio()
{
	var tamanio = "tamanioLetra";
	var tipo = "tipoLetra"
	var valor = this.value;

	if (this.id==tamanio)
	{
		pintor.setAtributo(tamanio, valor);
	}
		
	else
	{
		pintor.setAtributo(tipo, valor);
	}
		
}

function mostrarPanelTexto()
{
	var panelTexto = document.getElementById('panelTexto');
	panelTexto.className = "mostrado";

	var btnSalir = document.getElementById('Salir');

	btnSalir.onclick = function() 
	{
		panelTexto.className = "oculto";
	} 
}

function eligeGrosor()
{
	var grosor = this.id.slice(2,4);
	pintor.setAtributo("grosor", grosor);
}