//////////////
//// Clases ////

/* Hay que retocar los siguientes objetos:*/
// Clase Rectangulo redondeado

// Linea
function Forma(x, y, colorLinea, colorRelleno, grosor, tamanioLetra, tipoLetra, fontweight)
{
	this.x = x;
	this.y = y;
	this.colorLinea = colorLinea || "black";
	this.colorRelleno = colorRelleno || "white";
	this.grosor = grosor || 1;
	this.tamanioLetra = tamanioLetra || 10;
	this.tipoLetra = tipoLetra || 'Calibri';
	this.fontweight = fontweight || 'italic';
	
}

Forma.prototype.set = function(x,y)
{
	this.x = x;
	this.y = y;
}

Forma.prototype.setAtributo = function(atributo, valor)
{
	switch(atributo)
	{
		case "x": this.x = valor; break;
		case "y": this.y = valor; break;
		case "colorLinea": this.colorLinea = valor; break;
		case "colorRelleno": this.colorRelleno = valor; break;
		case "grosor": this.grosor = valor; break;
		case "tamanioLetra" : this.tamanioLetra = valor; break;
		case "tipoLetra" : this.tipoLetra = valor; break;
		case "fontweight" : this.fontweight = valor; break;
	}
}

Forma.prototype.getAtributo = function(atributo)
{
	switch(atributo)
	{
		case "x": return this.x;
		case "y": return this.y;
		case "colorLinea": return this.colorLinea;
		case "colorRelleno": return this.colorRelleno;
		case "grosor": return this.grosor;
		case "tamanioLetra" : return this.tamanioLetra;
		case "tipoLetra" : return this.tipoLetra;
		case "fontweight" : return this.fontweight;
	}
}


Forma.prototype.dibujaLinea = function(w,h) {

	context.beginPath();
	context.moveTo(this.x,this.y);
	context.lineTo(w,h);
	context.lineWidth = this.grosor;
    context.strokeStyle = this.colorLinea;
	context.stroke();
};

Forma.prototype.dibujaRectangulo = function(w,h,texto) {
	//var text = texto || false;

	if (texto)
	{
		context.beginPath();
		context.rect(this.x,this.y, w-this.x, h-this.y);
		context.lineWidth = this.grosor;
	    context.strokeStyle = this.colorLinea;
		context.stroke();
	}
	else
	{
		context.beginPath();
	context.rect(this.x,this.y, w-this.x, h-this.y);
	context.fillStyle = this.colorRelleno;
	context.fill();
	context.lineWidth = this.grosor;
    context.strokeStyle = this.colorLinea;
	context.stroke();
	}
	
};

Forma.prototype.dibujaTrianguloRecto = function(w,h) {
	var x2=this.x;
	var y2=h;
	context.beginPath();
	context.moveTo(this.x, this.y);
	context.lineTo(w,h);
	context.lineTo(x2,y2);
	context.closePath();
	context.fillStyle = this.colorRelleno;
	context.fill();
	context.lineWidth = this.grosor;
    context.strokeStyle = this.colorLinea;
	context.stroke();
};

Forma.prototype.dibujaRombo = function(x1, y1)
{

	context.beginPath();
	context.moveTo((x1+this.x)/2, this.y);
	context.lineTo(x1, (y1+this.y)/2);
	context.lineTo((x1+this.x)/2,y1);
	context.lineTo(this.x, (y1+this.y)/2);
	context.lineTo((x1+this.x)/2, this.y);
	context.lineWidth = this.grosor;
	context.fillStyle = this.colorRelleno;
	context.fill();
    context.strokeStyle = this.colorLinea;
	context.stroke();
}

Forma.prototype.dibujaTriangulo = function(x1, y1)
{
	context.beginPath();
	context.moveTo(this.x, this.y);
	context.lineTo(x1, y1);
	context.lineTo(x1-2*(x1-this.x),y1);
	context.closePath();
	context.fillStyle = this.colorRelleno;
	context.fill();
	context.lineWidth = this.grosor;
    context.strokeStyle = this.colorLinea;
	context.stroke();
}

Forma.prototype.dibujaFlecha =  function(x1, y1)
{
	context.beginPath();
	context.moveTo((x1+this.x)/2,this.y); // Punto1
	context.lineTo(x1, (y1+this.y)/2);				// Punto2
	context.lineTo((x1+this.x)/2,y1);				// Punto3
	context.lineTo((x1+this.x)/2, y1-((y1-this.y)/4));				// Punto4
	context.lineTo(this.x, y1-((y1-this.y)/4));				// Punto5
	context.lineTo(this.x, this.y+(y1-this.y)/4);					// Punto6
	context.lineTo((x1+this.x)/2,this.y+(y1-this.y)/4);					// Punto7 */
	context.closePath();
	context.fillStyle = this.colorRelleno;
	context.fill();
	context.lineWidth = this.grosor;
    context.strokeStyle = this.colorLinea;
	context.stroke();
}

Forma.prototype.dibujaFlechaH =  function(x1, y1)
{
	context.beginPath();
	context.moveTo(this.x+(x1-this.x)/4, this.y);
	context.lineTo(this.x+3/4*(x1-this.x),this.y);
	context.lineTo(this.x+3/4*(x1-this.x), (this.y+y1)/2);
	context.lineTo(x1, 0.5*(this.y+y1));
	context.lineTo(0.5*(x1+this.x), y1);
	context.lineTo(this.x,(this.y+y1)*0.5);
	context.lineTo(this.x+(x1-this.x)/4, 0.5*(this.y+y1));
	context.closePath();
	context.fillStyle = this.colorRelleno;
	context.fill();
	context.lineWidth = this.grosor;
    context.strokeStyle = this.colorLinea;
	context.stroke();
}

Forma.prototype.dibujaLineaCuadratica = function(x1, y1, controlPointX, controlPointY)
{
	context.beginPath();
      context.moveTo(this.x, this.y);
      context.quadraticCurveTo(x1, y1, controlPointX, controlPointY);
      context.lineWidth = this.grosor;
    context.strokeStyle = this.colorLinea;
      context.stroke();
}

// Método encontrado en Stackoverflow
Forma.prototype.dibujaFormaGeometrica = function(x1, y1, forma)
{
	var nlados;

	switch (forma)
	{
		case 'Pentagono': nlados = 5; break;
		case 'Hexagono':nlados = 6; break;
		case 'Heptagono':nlados=7; break;
		case 'Octagono' : nlados = 8; break;
	}

	Xcenter = this.x + (x1-this.x)/2;
	Ycenter = this.y + (y1-this.y)/2;
    size = (Math.abs(Xcenter)>Math.abs(Ycenter))? (x1-this.x)/2: (y1-this.y)/2;
    

	context.beginPath();
	context.moveTo (Xcenter +  size * Math.cos(0), Ycenter +  size *  Math.sin(0));          

	for (var i = 1; i <= nlados;i += 1) {
	    context.lineTo (Xcenter + size * Math.cos(i * 2 * Math.PI / nlados), Ycenter + size * Math.sin(i * 2 * Math.PI / nlados));
	}

	context.fillStyle = this.colorRelleno;
	context.fill();
	context.lineWidth = this.grosor;
    context.strokeStyle = this.colorLinea;
	context.stroke();


}

Forma.prototype.dibujaCirculo = function(x, y, borrado)
{
		if (borrado)
			context.fillStyle = 'white';
		else
			context.fillStyle = this.colorLinea;
		context.beginPath();
		context.moveTo(x, y);
		context.arc(x, y, this.grosor, 0, Math.PI * 2, false);
		context.fill();
	
}

Forma.prototype.dibujaElipse = function(x, y)
{
	// Definimos puntox, puntoy, radio de la elipse

	var puntox = (x - this.x)/2;
	var puntoy = (y - this.y)/2;
	var radio;
	var deformacion = new Array();

	if (Math.abs(puntox)>Math.abs(puntoy))
	{
		radio = puntox/2;
		deformacion[0]=1.5;
		deformacion[1]=1;
	}
	else {
		radio = puntoy/2;
		deformacion[0]=1;
		deformacion[1]=1.5;
	}

	radio = (radio <0)? -radio: radio;

	context.save();
	context.translate(this.x , this.y);
	context.scale(deformacion[0], deformacion[1]);
	context.beginPath();
	context.arc(puntox, puntoy, radio, 0, Math.PI*2, false);
	context.stroke();
	context.closePath();
	context.fillStyle = this.colorRelleno;
	context.fill();
	context.lineWidth = this.grosor;
    context.strokeStyle = this.colorLinea;
	context.stroke();
	context.restore();

}

Forma.prototype.escribe = function(x, y, text, maxWidth, lineHeight, intro) 
      {
      	context.fillStyle = 'black';
      	context.font = this.fontweight+ ' '+this.tamanioLetra+'pt ' + this.tipoLetra;
        var words = text.split(' ');
        var line = '';
        var lineas = 1;

        for(var n = 0; n < words.length; n++) 
        {
          var testLine = line + words[n] + ' ';
          var metrics = context.measureText(testLine);
          var testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) 
          {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
            lineas++;
          }
          else 
          {
            line = testLine;
          }
        }
        context.fillText(line, x, y);
        return lineas;
      }




