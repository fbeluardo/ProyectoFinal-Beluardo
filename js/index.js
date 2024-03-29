// DEFINICIÓN DE VARIABLES / PRODUCTOS *************************************************************************
const productos = [
  {
    id: 1,
    nombre: "Alcohol 96° 1000 ml Porta",
    precio: 200
  },
  {
    id: 2,
    nombre: "Alcohol 70° 5000 ml Porta",
    precio: 2000
  },
  {
    id: 3,
    nombre: "Alcohol 96° 250 ml Aerosol",
    precio: 1000
  }
];

// INICIALIZACIÓN DE LA VARIABLE CARRITO Y TOTAL ***************************************************************
let carrito = [];
let total = 0;

// DECLARACIÓN DE VARIABLES Y OBTENER REFERENCIAS A LOS ELEMENTOS DEL DOM *************************************
const formularioIdentificacion = document.getElementById('formularioIdentificacion');
const inputUsuario = document.getElementById("inputUsuario");
const contenedorIdentificacion = document.getElementById("contenedorIdentificacion");
const contenedorUsuario = document.getElementById("contenedorUsuario");
const textoUsuario = document.getElementById("textoUsuario");

// FUNCIÓN PARA MANEJAR EL ENVÍO DEL FORMULARIO DE IDENTIFICACIÓN *********************************************
async function identificarUsuario(event) {
  event.preventDefault();
  usuario = inputUsuario.value;
  formularioIdentificacion.reset();
  actualizarUsuarioStorage();
  mostrarTextoUsuario();

  // MOSTRAR MENSAJE DE TOASTIFY *****************************************************************************
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-right',
    iconColor: 'white',
    customClass: {
      popup: 'colored-toast'
    },
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true
  })
  await Toast.fire({
    icon: 'success',
    title: 'Identificación exitosa!'
  })
}

// FUNCIÓN PARA MOSTRAR LA INFORMACIÓN DEL USUARIO EN EL CARRITO ************************************************
function mostrarTextoUsuario() {
  contenedorIdentificacion.hidden = true;
  contenedorUsuario.hidden = false;
  textoUsuario.innerHTML += ` ${usuario}`;
}

// FUNCION PARA MOSTRAR EL FORMULARIO DE IDENTIFICACIÓN EN EL CARRITO ******************************************
function mostrarFormularioIdentificacion() {
  contenedorIdentificacion.hidden = false;
  contenedorUsuario.hidden = true;
  textoUsuario.innerHTML = ``;
}
// ONSUBMIT PARA EL ENVÍO DE LA INFORMACIÓN DEL FORMULARIO DE IDENTIFICACIÓN **********************************
formularioIdentificacion.onsubmit = (event) => identificarUsuario(event);

// DEFINIR UNA FUNCIÓN PARA ACTUALIZAR EL ALMACENAMIENTO LOCAL CON LA INFO DEL USUARIO *************************
function actualizarUsuarioStorage() {
  localStorage.setItem("usuario", usuario);
}

// SELECCIÓN DE LOS ELEMENTOS DE HTML***************************************************************************
const productosCarrito = document.querySelector(".productos-carrito");
const totalCarrito = document.querySelector(".total-carrito");
const botonLimpiarCarrito = document.querySelector(".limpiar-carrito");

window.onload = function() {
  
  // CARGAR LOS DATOS CARRITO DESDE EL LOCALSTORAGE*************************************************************
  const articulosCarritoStock = localStorage.getItem('productosCarrito');
  const articulosCarritoTotalStock = localStorage.getItem('totalCarrito');

  if (articulosCarritoStock) {
    carrito = JSON.parse(articulosCarritoStock);
    total = parseFloat(articulosCarritoTotalStock);
    mostrarCarrito();
  }
}
// FUNCIÓN MOSTRAR CARRITO *************************************************************************************
function mostrarCarrito() {

  // LIMPIAR EL CARRITO DE PRODUCTOS****************************************************************************
  productosCarrito.innerHTML = "";

  // CREAR UN OBJETO VACÍO PARA CONTENER EL NÚMERO DE CADA PRODUCTO EN EL CARRITO*******************************
  const cantidades = {};

  // RECORRER EL CARRITO Y ACTUALIZAR LAS CANTIDADES DE CADA PRODUCTO EN EL OBJETO******************************
  carrito.forEach(producto => {
      if (producto.nombre in cantidades) {
        cantidades[producto.nombre]++;
      } else {
        cantidades[producto.nombre] = 1;
      }
  });
  
  // CREAR UN ELEMENTO LI PARA CADA PRODUCTO EN EL OBJETO Y AGREGARLO AL CARRITO*******************************
  for (const nombreProducto in cantidades) {
    const cantidad = cantidades[nombreProducto];
    const precio = productos.find(producto => producto.nombre === nombreProducto).precio;
    const li = document.createElement("li");
    
    // BOTÓN PARA REDUCIR LA CANTIDAD DE PRODUCTOS EN EL CARRITO **********************************************
    const btnReduce = document.createElement("button");
    btnReduce.textContent = "-";
    btnReduce.addEventListener("click", () => {
      const index = carrito.findIndex(p => p.nombre === nombreProducto);
      carrito.splice(index, 1);
      total -= precio;
      mostrarCarrito();
    });
    
    // BOTÓN PARA AUMENTAR LA CANTIDAD DE PRODUCTOS EN EL CARRITO **********************************************
    const btnIncrease = document.createElement("button");
    btnIncrease.textContent = "+";
    btnIncrease.addEventListener("click", () => {
      carrito.push(productos.find(p => p.nombre === nombreProducto));
      total += precio;
      mostrarCarrito();
    });
    
    li.innerText = `${cantidad} x ${nombreProducto} - $${(cantidad * precio).toFixed(2)}`;
    li.appendChild(btnReduce);
    li.appendChild(btnIncrease);
    productosCarrito.appendChild(li);
  }

  //  ACTUALIZAR EL TOTAL DE PRODUCTOS *************************************************************************
  totalCarrito.innerText = `$${total.toFixed(0)}`;

  // GUARDAR LA INFORMACIÓN DEL CARRITO ACTUALIZADA AL LOCALSTORAGE*********************************************
  localStorage.setItem('productosCarrito', JSON.stringify(carrito));
  localStorage.setItem('totalCarrito', total.toFixed(0));
}

// FUNCIÓN PARA AGREGAR UN PRODUCTO AL CARRITO ******************************************************************
function agregarProductoCarrito(id) {

// UTILIZAR EL FIND PARA ENCONTRAR EL ID ************************************************************************
const producto = productos.find(producto => producto.id === id);

// AGREGAR EL PRODUCTO AL CARRITO *******************************************************************************
carrito.push(producto);

// GUARDAR LA INFORMACION ACTUALIZADA AL LOCALSTORAGE************************************************************
localStorage.setItem('productosCarrito', JSON.stringify(carrito));
localStorage.setItem('totalCarrito', total.toFixed(0));

// ACTUALIZAR EL TOTAL ******************************************************************************************
total += producto.precio;

// MOSTRAR LOS ARTÍCULOS DEL CARRITO ****************************************************************************
mostrarCarrito();
}

// FUNCIÓN LIMPIAR EL CARRITO ***********************************************************************************
function limpiarCarrito() {

// ELIMINAR TODOS LOS ARTÍCULOS DEL CARRITO Y ACTUALIZAR EL TOTAL A 0 *******************************************
carrito = [];
total = 0;

// MOSTRAR LOS ARTÍCULOS DEL CARRITO ****************************************************************************
mostrarCarrito();

// BORRAR LA INFORMACIÓN DEL CARRITO EN EL LOCALSTORAGE**********************************************************
localStorage.removeItem('productosCarrito');
localStorage.removeItem('totalCarrito');
}

// AGREGAR EVENT LISTENERS AL BOTÓN AGREGAR PRODUCTO ***********************************************************
const botonAgregarAlCarrito = document.querySelectorAll(".agregar-carrito");
botonAgregarAlCarrito.forEach(boton => {
  boton.addEventListener("click", event => {
    const id = parseInt(event.target.dataset.id);
    agregarProductoCarrito(id);
  });
});

// AGREGAR EVENT LISTENER AL BOTON LIMPIAR CARRITO ***********************************************************
botonLimpiarCarrito.addEventListener("click", limpiarCarrito);

// VINCULAR EL BOTÓN DE FINALIZAR COMPRA CON EL HTML *********************************************************
const finalizarCompraBoton = document.querySelector('.finalizar_compra');

// AGREGAR UN EVENT LISTENER AL BOTÓN DE FINALIZAR COMPRA ****************************************************
finalizarCompraBoton.addEventListener('click', function() {

// OBTENER LA CANTIDAD TOTAL DE COMPRA ***********************************************************************
  const total = document.querySelector('.total-carrito').textContent;
  
  // MOSTRAR AL USUARIO UN MENSAJE CON EL TOTAL DEL MONTO A PAGAR CON SWEET ALERT ****************************
  const mensajeConfirmacion = `El total de su pedido es de ${total}.`;

Swal.fire({
  title: '¡Gracias por su compra!',
  text: mensajeConfirmacion,
  icon: 'success'
});
  
  // RESETEAR EL CARRITO BORRANDO LOS ARTÍCULOS Y ACTUALIZANDO EL TOTAL DEL MONTO A PAGAR *******************
  const productosCarrito = document.querySelector('.productos-carrito');
  productosCarrito.innerHTML = '';
  document.querySelector('.total-carrito').textContent = '$0';
});

// USO DE FETCH PARA TOMAR PRODUCTOS DE UNA API *************************************************************
fetch("https://643739730c58d3b1456d5945.mockapi.io//finalproyect")
  .then((response) => response.json())
  .then((jsonResponse) => {
    console.log(jsonResponse);
  })
