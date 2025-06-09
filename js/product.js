const URL_USER = "http://localhost:3005/users"
const URL_SUPLEMENTOS = "http://localhost:3005/suplementos"
const URL_SHAMPOOS = "http://localhost:3005/shampoos"
const URL_CREMAS = "http://localhost:3005/cremas"
const URL_PERFUMES = "http://localhost:3005/perfumes"
const URL_ELECTRONICOS = 'http://localhost:3005/electronicos';

const productUrl = localStorage.getItem("productUrl")

const format = new Intl.NumberFormat("es-AR", {
  style: "decimal",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
let productId;
let tipo;
let cantidadProd = 1;

if (localStorage.getItem("saveId") == null || localStorage.getItem("saveId") == "null") {
  document.getElementById("btn-cart").style.display = "none"
} else {
  document.getElementById("btn-cart").style.display = "block"
}

const changeProductInfo = async () => {
  try {
    const response = await axios.get(`http://localhost:3005/${productUrl}`)
    const results = response.data


    productId = results.id
    tipo = results.tipo

    document.getElementById("content-img").src = `${results.imagen}`
    document.getElementById("content-name").textContent = `${results.nombre}`
    document.getElementById("content-price").textContent = `$${format.format(results.precio)}`
    document.getElementById("content-description").textContent = `${results.descripcion}`

    console.log(results)


  } catch (error) {

  }
}
changeProductInfo()


const handleAddToCart = async () => {
  try {
    const userId = localStorage.getItem("saveId")

    const response = await axios.get(`${URL_USER}/${userId}`);
    const results = response.data;

    const cargarCart = {
      productoId: productId,
      tipo: tipo,
      cantidad: cantidadProd

    }

    results.carrito.push(cargarCart);
    const carrito = results.carrito;
    await axios.patch(`${URL_USER}/${userId}`, {
      carrito,
    });
    alert("El producto fue agregado al carrito")
  } catch (error) {
console.log(error)
  }
}

const handleChangeCantidad = () =>{
  cantidadProd = document.getElementById("input-cantidad").value
}
document.getElementById("btn-add-cart").addEventListener("click", handleAddToCart)
document.getElementById("input-cantidad").addEventListener("blur", handleChangeCantidad)