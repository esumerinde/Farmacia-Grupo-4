var userId = localStorage.getItem("saveId");

const URL_SUPLEMENTOS = "http://localhost:3005/suplementos";
const URL_SHAMPOOS = "http://localhost:3005/shampoos";
const URL_CREMAS = "http://localhost:3005/cremas";
const URL_PERFUMES = "http://localhost:3005/perfumes";
const URL_ELECTRONICOS = "http://localhost:3005/electronicos";
const USERS_URL = "http://localhost:3005/users";
let subtotal = 0;
let total = 0;
let descuento = false;



if (
    localStorage.getItem("saveId") == null ||
    localStorage.getItem("saveId") == "null"
) {
    document.getElementById("btn-cart").style.display = "none";
} else {
    document.getElementById("btn-cart").style.display = "block";
}

const format = new Intl.NumberFormat("es-AR", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});


const loadCart = async () => {
    subtotal = 0;
    try {
        document.getElementById("content-cart").innerHTML = "";

        const suplemento = await axios.get(URL_SUPLEMENTOS);
        const suplementos = suplemento.data;
        const shampoo = await axios.get(URL_SHAMPOOS);
        const shampoos = shampoo.data;
        const crema = await axios.get(URL_CREMAS);
        const cremas = crema.data;
        const perfume = await axios.get(URL_PERFUMES);
        const perfumes = perfume.data;
        const electronico = await axios.get(URL_ELECTRONICOS);
        const electronicos = electronico.data;

        const todosLosProductos = suplementos.concat(
            shampoos,
            cremas,
            perfumes,
            electronicos
        );

        console.log(todosLosProductos);

        const response = await axios.get(`${USERS_URL}/${userId}`);
        const results = response.data;

        if (results.carrito.length > 0) {
            document.getElementById("go-buy").style.display = "block";
        } else {
            document.getElementById("go-buy").style.display = "none";
        }

        for (let i = 0; i < results.carrito.length; i++) {
            for (let k = 0; k < todosLosProductos.length; k++) {
                if (results.carrito[i].productoId == todosLosProductos[k].id) {
                    subtotal += parseInt(todosLosProductos[k].precio) * parseInt(results.carrito[i].cantidad);
                    document.getElementById("content-cart").innerHTML += /* HTML */ `
                        <tr>
                            <td>
                                <a
                                    class="btn-close"
                                    data-id="${todosLosProductos[k].id}"
                                    data-tipo="${todosLosProductos[k].tipo}"
                                    onclick="deleteProdCart('${todosLosProductos[k].id}')"
                                ></a>
                            </td>
                            <td><img src="${todosLosProductos[k].imagen}" alt="" /></td>
                            <td>${todosLosProductos[k].nombre}</td>
                            <td>${format.format(todosLosProductos[k].precio)}</td>
                            <td>
                                <input type="number" class="input-cantidad" 
                                       value="${results.carrito[i].cantidad}" 
                                       data-id="${todosLosProductos[k].id}" />
                            </td>
                            <td>${format.format(todosLosProductos[k].precio * results.carrito[i].cantidad)}</td>
                        </tr>
                    `;
                }
            }
        }
        if (descuento == false) {
            total = subtotal;
        } else {
            total = subtotal * 0.75;
        }

        document.getElementById("subtotal").textContent = `$${format.format(subtotal)}`;
        document.getElementById("total").textContent = `$${format.format(total)}`;

        document.querySelectorAll(".input-cantidad").forEach(input => {
            input.addEventListener("blur", handleCantidad);
        });
    } catch (error) {
        alert("Error al cargar el carrito");
        console.log(error);
    }
};

loadCart();

const handleCantidad = async (event) => {
    try {
        const input = event.target
        const productoId = input.dataset.id
        const nuevaCantidad = parseInt(input.value)

        if (nuevaCantidad > 0) {

            console.log(`Actualizar producto ${productoId} con cantidad ${nuevaCantidad}`);

            const response = await axios.get(`${USERS_URL}/${userId}`);
            const results = response.data;
            for (let i = 0; i < results.carrito.length; i++) {

                if (results.carrito[i].productoId == productoId) {

                    results.carrito[i].cantidad = nuevaCantidad
                    await axios.patch(`${USERS_URL}/${userId}`, {
                        carrito : results.carrito
                    });
                    loadCart();
                    return
                }
            }
            
        } else {
            alert("La cantidad debe ser mayor que 0");
        }
    } catch (error) {
        console.log("Error al actualizar la cantidad:", error);
    }
};






const deleteProdCart = async (productId, tipo) => {
    console.log(productId, tipo);

    const userId = localStorage.getItem("saveId");

    try {
        const response = await axios.get(`${USERS_URL}/${userId}`);
        const results = response.data;

        for (let i = 0; i < results.carrito.length; i++) {
            if (results.carrito[i].productoId == productId) {
                results.carrito.splice(i, 1);
                await axios.patch(`${USERS_URL}/${userId}`, {
                    carrito: results.carrito,
                });
                loadCart();
                return;
            }
        }

        results.carrito.push(productId, tipo);
        await axios.patch(`${USERS_URL}/${userId}`, {
            carrito: results.carrito,
        });
        loadCart();
    } catch (error) {
        console.error("Error al actualizar carrito:", error);
    }
};

const handleDiscount = () => {
    const code = document.getElementById("input-discount").value;
    const newcode = code.toLowerCase();
    if (newcode == "calcagni") {
        descuento = true;
        document.getElementById("btn-discount").style.display = "none";
        document.getElementById("success-discount").style.display = "block";
        document.getElementById("input-discount").disabled = true;
        loadCart();
    }else{
        alert("Ingrese algun codigo de descuento por ejemplo: calcagni")
    }

};
document
    .getElementById("btn-discount")
    .addEventListener("click", handleDiscount);

const handleBuy = async () => {
    const response = await axios.get(`${USERS_URL}/${userId}`);
    const results = response.data;
    document.getElementById("modal-buy-name").value = results.name;
    document.getElementById("modal-buy-lastname").value = results.lastName;
    document.getElementById("modal-buy-adress").value = results.adress;
    document.getElementById("modal-buy-dni").value = results.dni;
};
const handleFinishBuy = async (event) => {
    event.preventDefault();
    try {
        const response = await axios.get(`${USERS_URL}/${userId}`);
        const results = response.data;

        const getCard = document.getElementById("modal-buy-numbercard").value;
        const card = parseInt(getCard.toString().slice(-4));
        const products = results.carrito
        const process = "EN CAMINO"
        const recibo = {
            name: document.getElementById("modal-buy-name").value,
            lastName: document.getElementById("modal-buy-lastname").value,
            adress: document.getElementById("modal-buy-adress").value,
            dni: document.getElementById("modal-buy-dni").value,
            products,
            card,
            total,
            process
        };
        results.compras.push(recibo)

        carrito = []

        await axios.patch(`${USERS_URL}/${userId}`, {
            compras: results.compras,
            carrito
        });



        document.getElementById("modal-buy-name").value = "";
        document.getElementById("modal-buy-lastname").value = "";
        document.getElementById("modal-buy-adress").value = "";
        document.getElementById("modal-buy-dni").value = "";
        document.getElementById("modal-buy-numbercard").value = "";
        document.getElementById("modal-buy-code").value = "";
        document.getElementById("modal-buy-date").value = "";



        alert("Su compra ha sido realizada. Para ver más detalles, ingrese a la sección 'Mi cuenta' y luego a 'Mis compras'.");

        location.reload()
    } catch (error) {
        console.log(error);
    }
};

document.getElementById("go-buy").addEventListener("click", handleBuy);
document.getElementById("btn-finish-buy").addEventListener("submit", handleFinishBuy);
