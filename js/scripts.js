const impuestoGanancias = 0.35
const impuestoPais = 0.3

let productos;
const fetchAProductos = () => {
    fetch("js/productos.json")
    .then(response => response.json())
    .then(response => {
        productos = response
        console.log(productos)
        agregarPreciosReales()
        ponerProductosEnHTML(productos)
    })
    .catch(err=>console.log(err))
}

fetchAProductos()

/*Carrito y compra*/
const productosHTML = document.getElementById("productos")
const cantidadDeProductosHTML = document.getElementById("cantidadDeproductosEnElCarrito")
const carritoHTML= document.getElementById("carrito")
const totalSteamHTML = document.getElementById("totalSteam")
const totalRealHTML = document.getElementById("totalReal")
const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
let idDelCarrito = 0
const carritoStorage = localStorage.getItem("carrito")
let carrito = JSON.parse(carritoStorage) ?? {
    precioTotal : 0,
    precioTotalReal : 0,
    cantidadDeProductos:0,
    carritoDisplay:""
}

const agregarAlCarrito = (id) => {
    const producto = productos.find(element => element.id == id)
    idDelCarrito++
    carrito.precioTotal += producto.precio
    carrito.precioTotalReal += producto.precioReal
    carrito.cantidadDeProductos++
    cantidadDeProductosHTML.innerHTML = carrito.cantidadDeProductos
    carritoHTML.innerHTML +=`
    <div id="${idDelCarrito}" class="d-flex flex-wrap">
    <hr class="col-12">
        <div class="col-11">${producto.juego}</div> 
        <button type="button" class="btn-danger col-1" onclick="sacarDelCarrito(${producto.id},${idDelCarrito})">
            X
        </button>
    <hr class="col-12">
    </div>
    `
    carrito.carritoDisplay = carritoHTML.innerHTML
    totalSteamHTML.innerHTML = carrito.precioTotal
    totalRealHTML.innerHTML = carrito.precioTotalReal
    Toastify({
        text: `Agregaste ${producto.juego} al carrito`,
        duration: 2000,
        gravity: "bottom",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        }).showToast();
    const carritoJSON = JSON.stringify(carrito)
    localStorage.setItem("carrito",carritoJSON)
}

const sacarDelCarrito = (id, idCarrito) => {
    const producto = productos.find(element => element.id == id)
    carrito.precioTotal -= producto.precio
    carrito.precioTotalReal -= producto.precioReal
    carrito.cantidadDeProductos--
    cantidadDeProductosHTML.innerHTML = carrito.cantidadDeProductos
    document.getElementById(idCarrito).outerHTML=null
    carrito.carritoDisplay=carritoHTML.innerHTML
    totalSteamHTML.innerHTML = carrito.precioTotal
    totalRealHTML.innerHTML = carrito.precioTotalReal
    const carritoJSON = JSON.stringify(carrito)
    localStorage.setItem("carrito",carritoJSON)
    Toastify({
        text: `Sacaste ${producto.juego} del carrito`,
        duration: 2000,
        gravity: "bottom",
        position: "left",
        stopOnFocus: true,
        style: {
            background: "rgb(195,133,34)",
            background: "linear-gradient(90deg, rgba(195,133,34,1) 0%, rgba(253,45,81,1) 100%)"
        },
        }).showToast();
}


const comprar = () => {
    if(carrito.precioTotalReal===0){
        document.getElementById("modal").innerHTML = "No compraste nada gato"
    }else{
        document.getElementById("modal").innerHTML = `Felicidades, compraste jueguitos y gastaste $${carrito.precioTotalReal}`
        carritoHTML.innerHTML=null
        cantidadDeProductosHTML.innerHTML = 0
        carrito.cantidadDeProductos = 0
        totalSteamHTML.innerHTML = 0
        totalRealHTML.innerHTML = 0
        carrito.carritoDisplay=carritoHTML.innerHTML
        carrito.precioTotal = 0
        carrito.precioTotalReal = 0
        const carritoJSON = JSON.stringify(carrito)
        localStorage.setItem("carrito",carritoJSON)
        
        var duration = 15 * 500;
        var animationEnd = Date.now() + duration;
        var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
        
        function randomInRange(min, max) {
          return Math.random() * (max - min) + min;
        }
        
        var interval = setInterval(function() {
        var timeLeft = animationEnd - Date.now();
        
        if (timeLeft <= 0) {
            return clearInterval(interval);
        }
        
        var particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    }
}

/*Termina carrito y compra*/


/*Crear la pagina al iniciar*/
let acumuladorDeHTML=''

const agregarPreciosReales = () => {
    productos.forEach(element => {
        element.precioReal = Math.round(element.precio * impuestoPais + element.precio * impuestoGanancias + element.precio)
    })
}

const ponerProductosEnHTML = (objeto) => {
    objeto.forEach(element =>{
        acumuladorDeHTML += `<div id="${element.id}" class="juego col-3 d-flex flex-wrap border border-dark border-3 rounded-2 p-3">
            <h2 class="row-4 col-12">${element.juego}</h2>
            <img src="${element.foto}" alt="foto de ${element.juego}" style=" height:200px; width:100%; object-fit:contain">
            <div class="row-4 col-12">
                <h4>precio Steam: ${element.precio}</h4>
                <h4>precio real: ${element.precioReal}</h4>
            </div>
            <button type="button" class="btn btn-primary row-2 col-12 align-self-end my-2" onclick="agregarAlCarrito(${element.id})">Agregar</button>
            <button type="button" class="btn btn-primary row-2 col-12 align-self-end" onclick="visitarPagina(${element.id})" data-bs-toggle="modal" data-bs-target="#juegoModal">Ver</button>
        </div>`
    })
    document.getElementById("saludo").innerHTML=`<h1 class="text-center">SteameAR</h1>`
    productosHTML.innerHTML = acumuladorDeHTML
    cantidadDeProductosHTML.innerHTML = carrito.cantidadDeProductos
    carritoHTML.innerHTML = carrito.carritoDisplay
    totalSteamHTML.innerHTML = carrito.precioTotal
    totalRealHTML.innerHTML = carrito.precioTotalReal
}

/*Termina crear la pagina al iniciar */


/*Abrir modal con juego*/
function visitarPagina(id){
    let juegoAMostrar = productos.find(e=>e.id == id)
    document.getElementById("juegoModalLabel").innerHTML=juegoAMostrar.juego
    document.getElementById("juegoModalFoto").innerHTML=`<img src="${juegoAMostrar.foto}" alt="foto de ${juegoAMostrar.juego}" class="w" style=" max-height:300px; width:100%; object-fit:contain">`
    document.getElementById("juegoModalDesc").innerHTML=`<h4>$${juegoAMostrar.precio} - $${juegoAMostrar.precioReal}</h4>`+juegoAMostrar.descripcion+`<div>Link de steam: <a href="${juegoAMostrar.link}" target="_blank">${juegoAMostrar.juego}</a></div>`
    document.getElementById("juegoModalFooter").innerHTML=`
    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
    <button type="button" class="btn btn-primary" onclick="agregarAlCarrito(${juegoAMostrar.id})" data-bs-dismiss="modal">Comprar</button>`
}

/*Termina abrir modal con juego*/


/*Ordenar productos*/
const botonMayorAMenor = document.getElementById("boton--mayor-a-menor")
const botonMenorAMayor = document.getElementById("boton--menor-a-mayor")
const botonDefault = document.getElementById("boton--default")
const ordenados = document.getElementById("ordenados")

botonDefault.onclick = () => {
    acumuladorDeHTML = ""
    if(acumuladorDeNoFiltrados.length>=1){
        acumuladorDeNoFiltrados.sort(function (a,b) {
            if (a.id>b.id){return 1}
            if(a.id<b.id){return -1}
            else {return 0}
        })
        ponerProductosEnHTML(acumuladorDeNoFiltrados)
    }
    else{
        productos.sort(function (a,b) {
            if (a.id>b.id){return 1}
            if(a.id<b.id){return -1}
            else {return 0}
        })
        ponerProductosEnHTML(productos)
    }
    ordenados.innerHTML="Default"
}

botonMenorAMayor.onclick = () => {
    acumuladorDeHTML = ""
    if(acumuladorDeNoFiltrados.length>=1){
        acumuladorDeNoFiltrados.sort(function (a,b) {
            if (a.precio>b.precio){return 1}
            if(a.precio<b.precio){return -1}
            else {return 0}
        })
        ponerProductosEnHTML(acumuladorDeNoFiltrados)
    }
    else{
        productos.sort(function (a,b) {
            if (a.precio>b.precio){return 1}
            if(a.precio<b.precio){return -1}
            else {return 0}
        })
        ponerProductosEnHTML(productos)
    }
    ordenados.innerHTML = "Menor a mayor"
}

botonMayorAMenor.onclick = () => {
    acumuladorDeHTML = ""
    if(acumuladorDeNoFiltrados.length>=1){
        acumuladorDeNoFiltrados.sort(function (a,b) {
            if (a.precio < b.precio){return 1}
            if(a.precio>b.precio){return -1}
            else {return 0}
        })
        ponerProductosEnHTML(acumuladorDeNoFiltrados)
    }
    else{
        productos.sort(function (a,b) {
            if (a.precio<b.precio){return 1}
            if(a.precio>b.precio){return -1}
            else {return 0}
        })
        ponerProductosEnHTML(productos)
    }
    ordenados.innerHTML="Mayor a menor"
}

/*Termina ordenar productos*/


/*Filtro de precios*/

const filtroMaximo = document.getElementById("maximo")
filtroMaximo.addEventListener("change",filtrar)
let acumuladorDeFiltrados = []
let acumuladorDeNoFiltrados = []

function filtrar (e) {
    acumuladorDeHTML = ""
    acumuladorDeFiltrados=[]
    acumuladorDeNoFiltrados=[]
    let precioQueIngresoElUsuario = e.target.value
    productos.map(element => {
        element.precio <= precioQueIngresoElUsuario?acumuladorDeNoFiltrados.push(element):acumuladorDeFiltrados.push(element)
    })
    ponerProductosEnHTML(acumuladorDeNoFiltrados)
}

const botonBorrarFiltro = document.getElementById("boton--borrar-filtro")
botonBorrarFiltro.onclick = () => {
    acumuladorDeNoFiltrados=[]
    filtroMaximo.value=""
    acumuladorDeHTML=""
    if(ordenados.innerHTML=="Mayor a menor"){
        productos.sort(function (a,b) {
            if (a.precio<b.precio){return 1}
            if(a.precio>b.precio){return -1}
            else {return 0}
        })
        ponerProductosEnHTML(productos)
    }else if(ordenados.innerHTML == "Menor a mayor"){
        productos.sort(function (a,b) {
            if (a.precio>b.precio){return 1}
            if(a.precio<b.precio){return -1}
            else {return 0}
        })
        ponerProductosEnHTML(productos)
    }else{
        productos.sort(function (a,b) {
            if (a.id>b.id){return 1}
            if(a.id<b.id){return -1}
            else {return 0}
        })
        ponerProductosEnHTML(productos)
    }
}

/*Termina filtro de precios*/