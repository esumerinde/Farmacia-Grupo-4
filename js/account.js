var userId = localStorage.getItem("saveId");

const URL_SUPLEMENTOS = 'http://localhost:3005/suplementos';
const URL_SHAMPOOS = 'http://localhost:3005/shampoos';
const URL_CREMAS = 'http://localhost:3005/cremas';
const URL_PERFUMES = 'http://localhost:3005/perfumes';
const URL_ELECTRONICOS = 'http://localhost:3005/electronicos';
const USERS_URL = "http://localhost:3005/users";

const format = new Intl.NumberFormat('es-AR', {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});


document.getElementById("account-input-name").value = localStorage.getItem("saveName");
document.getElementById("account-input-lastname").value = localStorage.getItem("saveLastName");
document.getElementById("account-input-email").value = localStorage.getItem("saveEmail");
document.getElementById("account-input-dni").value = localStorage.getItem("saveDni");
document.getElementById("account-input-phone").value = localStorage.getItem("savePhoneNumber");
document.getElementById("access-email").textContent = localStorage.getItem("saveEmail");

const handlerExit = () => {
  localStorage.setItem("saveId", "null");
  localStorage.setItem("saveName", "null");
  localStorage.setItem("saveLastName", "null");
  localStorage.setItem("saveEmail", "null");
  localStorage.setItem("savePassword", "null");
  localStorage.setItem("saveAdress", "null");
  localStorage.setItem("saveRol", "null");
  localStorage.setItem("savePhoneNumber", "null");
  localStorage.setItem("saveDni", "null");
  window.location.href = "./index.html";
};

const handlerSaveData = async (event) => {
  event.preventDefault();
  try {
    const name = document.getElementById("account-input-name").value;
    const lastName = document.getElementById("account-input-lastname").value;
    const email = document.getElementById("account-input-email").value;
    const dni = document.getElementById("account-input-dni").value;
    const phoneNumber = document.getElementById("account-input-phone").value;

    await axios.patch(`${URL_USERS}/${userId}`, {
      name,
      lastName,
      email,
      dni,
      phoneNumber,
    });

    localStorage.setItem("saveName", name);
    localStorage.setItem("saveLastName", lastName);
    localStorage.setItem("saveEmail", email);
    localStorage.setItem("saveDni", dni);
    localStorage.setItem("savePhoneNumber", phoneNumber);

    alert("Tus datos de contacto se han actualizado");
  } catch (error) {
    console.log(error);
  }
};

const handlerChangePass = async (event) => {
  event.preventDefault();
  try {
    const password = document.getElementById("account-input-password").value;
    const newPassword = document.getElementById(
      "account-input-newpassword"
    ).value;
    const newPasswordRepeat = document.getElementById(
      "account-input-newpassword-repeat"
    ).value;

    if (password == localStorage.getItem("savePassword")) {
      if (newPassword == newPasswordRepeat) {
        await axios.patch(`${URL_USERS}/${userId}`, {
          password,
        });
        alert("La contraseña se actualizo correctamente");
      } else {
        alert("Error, Las nuevas contraseñas no concuerdan");
      }
    } else {
      alert("La contraseña actual es incorrecta");
    }
  } catch (error) { }
};


const showAccount = () => {
  document.getElementById("account-btn-myaccount").style.backgroundColor = "#C7C7C7";
  document.getElementById("account-btn-myshops").style.backgroundColor = "#FEFEFF";
  document.getElementById("account-btn-myfav").style.backgroundColor = "#FEFEFF";
  document.getElementById("myaccount-div").style.display = "block"
  document.getElementById("myshops-div").style.display = "none"
  document.getElementById("myfavs-div").style.display = "none"
}
const showshops = () => {
  document.getElementById("account-btn-myaccount").style.backgroundColor = "#FEFEFF";
  document.getElementById("account-btn-myshops").style.backgroundColor = "#C7C7C7";
  document.getElementById("account-btn-myfav").style.backgroundColor = "#FEFEFF";
  document.getElementById("myaccount-div").style.display = "none"
  document.getElementById("myshops-div").style.display = "block"
  document.getElementById("myfavs-div").style.display = "none"
}
const showfav = () => {
  document.getElementById("account-btn-myaccount").style.backgroundColor = "#FEFEFF";
  document.getElementById("account-btn-myshops").style.backgroundColor = "#FEFEFF";
  document.getElementById("account-btn-myfav").style.backgroundColor = "#C7C7C7";
  document.getElementById("myaccount-div").style.display = "none"
  document.getElementById("myshops-div").style.display = "none"
  document.getElementById("myfavs-div").style.display = "block"
}
document.getElementById("account-btn-myfav").addEventListener("click", (showfav));
document.getElementById("account-btn-myshops").addEventListener("click", (showshops));
document.getElementById("account-btn-myaccount").addEventListener("click", (showAccount));
document.getElementById("account-btn-exit").addEventListener("click", handlerExit);
document.getElementById("form-contact-data").addEventListener("submit", handlerSaveData);
document.getElementById("form-newpassword").addEventListener("submit", handlerChangePass);



const updateIcons = (event) => {

  document.querySelectorAll(".cart-icon").forEach((cartIcon) => {
    const iconsStartCar = async () => {
      const productId = cartIcon.getAttribute("data-id");
      const userId = localStorage.getItem("saveId");
      try {
        const response = await axios.get(`${USERS_URL}/${userId}`);
        const results = response.data;
  
        for (let i = 0; i < results.carrito.length; i++) {
          if (results.carrito[i].productoId == productId) {
            cartIcon.classList.toggle("active");
            return;
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    iconsStartCar();
    cartIcon.addEventListener("click", async (event) => {
      if (localStorage.getItem("saveId") == null || localStorage.getItem("saveId") == "null") {
        alert("Para agregar algo a favoritos, primero debe iniciar sesión.")
      } else {
      event.stopPropagation();
      event.preventDefault();
      
      cartIcon.classList.toggle("active");

      const productId = cartIcon.getAttribute("data-id");
      const tipo = cartIcon.getAttribute("data-tipo");

      const userId = localStorage.getItem("saveId");

      try {
        const response = await axios.get(`${USERS_URL}/${userId}`);
        const results = response.data;

        for (let i = 0; i < results.carrito.length; i++) {
          if (results.carrito[i].productoId == productId) {
            results.carrito.splice(i, 1);
            await axios.patch(`${USERS_URL}/${userId}`, { carrito: results.carrito });
            return;
          }
        }

        const cargarCart = {
          productoId: productId,
          tipo: tipo,
          cantidad: 1

        }

        results.carrito.push(cargarCart);
        const carrito = results.carrito;

        await axios.patch(`${USERS_URL}/${userId}`, {
          carrito,
        });
      } catch (error) {
        console.error("Error al actualizar favoritos:", error);
      }

      const isAddedToCart = cartIcon.classList.contains("active");
      console.log(
        isAddedToCart
          ? "Producto agregado al carrito"
          : "Producto eliminado del carrito"
      );
    }
    });
  });

  document.querySelectorAll(".favorite-icon").forEach((favoriteIcon) => {
    const iconsStart = async () => {
      const productId = favoriteIcon.getAttribute("data-id");
      const userId = localStorage.getItem("saveId");
      try {
        const response = await axios.get(`${USERS_URL}/${userId}`);
        const results = response.data;

        for (let i = 0; i < results.favs.length; i++) {
          if (results.favs[i] == productId) {
            favoriteIcon.classList.toggle("active");
            return;
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    iconsStart();
    favoriteIcon.addEventListener("click", async (event) => {
      if (localStorage.getItem("saveId") == null || localStorage.getItem("saveId") == "null") {
        alert("Para agregar algo a favoritos, primero debe iniciar sesión.")
      } else {
        event.stopPropagation();
        event.preventDefault();
  
        favoriteIcon.classList.toggle("active");
        const productId = favoriteIcon.getAttribute("data-id");
        const tipo = favoriteIcon.getAttribute("data-tipo");
  
        const userId = localStorage.getItem("saveId");
  
        const isFavorite = favoriteIcon.classList.contains("active");
        console.log(
          isFavorite
            ? "Producto agregado a favoritos"
            : "Producto eliminado de favoritos"
        );
  
        try {
          const response = await axios.get(`${USERS_URL}/${userId}`);
          const results = response.data;
  
          for (let i = 0; i < results.favs.length; i++) {
            if (results.favs[i] == productId) {
              results.favs.splice(i, 2);
              await axios.patch(`${USERS_URL}/${userId}`, { favs: results.favs });
              return;
            }
          }
  
          results.favs.push(productId, tipo);
          const favs = results.favs;
  
          await axios.patch(`${USERS_URL}/${userId}`, {
            favs,
          });
        } catch (error) {
          console.error("Error al actualizar favoritos:", error);
        }
      }

    });
  });
};


const loadFavs = async () => {
  try {
    document.getElementById("favs-container").innerHTML = ""
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
    console.log(todosLosProductos)

    const response = await axios.get(`${USERS_URL}/${userId}`)
    const results = response.data

    if (results.favs.length == 0) {
      const favsContainer = document.getElementById('favs-container-empty');
      favsContainer.style.setProperty('display', 'flex', 'important');
    } else {
      const favsContainer = document.getElementById('favs-container-empty');
      favsContainer.style.setProperty('display', 'none', 'important');


      for (let i = 0; i < results.favs.length; i++) {

        for (let k = 0; k < todosLosProductos.length; k++) {
          if (results.favs[i] == todosLosProductos[k].id) {

            document.getElementById("favs-container").innerHTML += /* HTML */ ` <div class="prod">
                    <a href="./product.html" onclick="handleProductPage('${todosLosProductos[k].tipo}/${todosLosProductos[k].id}')" class="img-link">
                      <img src="${todosLosProductos[k].imagen}" alt="Producto" class="imgProd" />
                    </a>
                    <div class="desc">
                      <span>${todosLosProductos[k].marca}</span>
                      <h5>${todosLosProductos[k].nombre}</h5>
                      <h5>${todosLosProductos[k].tamanio}</h5>
                      <h4>$${format.format(todosLosProductos[k].precio)}</h4>
                    </div>
                    <div class="icon-container">
                      <a href="#" class="cart-icon" data-id="${todosLosProductos[k].id}" data-tipo="${todosLosProductos[k].tipo}">
                        <i class="fas fa-shopping-cart"></i>
                      </a>
                      <button class="favorite-icon" data-id="${todosLosProductos[k].id}" data-tipo="${todosLosProductos[k].tipo}">
                        <i class="fas fa-heart"></i>
                      </button>
                    </div>
                  </div>`

          }
        }

      }
    }
    updateIcons()

  } catch (error) {
    alert("error")
    console.log(error)
  }

}
loadFavs()
const loadBuys = async () => {
  try {

    document.getElementById("tickets-div").innerHTML = "";

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


    const response = await axios.get(`${USERS_URL}/${userId}`);
    const results = response.data;

    if (results.compras.length === 0) {

      const comprasContainer = document.getElementById("tickets-empty");
      comprasContainer.style.setProperty("display", "flex", "important");
    } else {

      const comprasContainer = document.getElementById("tickets-empty");
      comprasContainer.style.setProperty("display", "none", "important");


      for (let j = 0; j < results.compras.length; j++) {
        const compra = results.compras[j];
        const divId = `products-${j}`;


        document.getElementById("tickets-div").innerHTML += `
 <div class="d-flex tickets-card p-3 my-4 mx-5 shadow-lg rounded bg-light">
              <!-- Imagen -->
              <div class="me-3">
                <img class="img-ticket rounded-circle" src="https://thumbs.dreamstime.com/b/dibujo-de-icono-caricatura-caja-concepto-producto-o-maquinaria-listo-para-ser-entregado-al-cliente-simple-157425701.jpg" alt="Recibo de Compra">
              </div>
          
              <!-- Información del Ticket -->
              <div class="flex-grow-1 d-flex flex-column ticket-info">
                <h5 class="fw-bold  mb-3">RECIBO DE COMPRA</h5>
                <p><strong>Nombre:</strong> ${compra.name}</p>
                <p><strong>Apellido:</strong> ${compra.lastName}</p>
                <p><strong>DNI Cliente:</strong> ${compra.dni}</p>
                <p><strong>Dirección:</strong> ${compra.adress}</p>
                <p><strong>Precio Final:</strong> $${compra.total}</p>
                <p><strong>Tarjeta terminada en:</strong> ${compra.card}</p>
              </div>
          
              <!-- Productos Comprados -->
              <div class="mx-5 flex-grow-1 div-products" id="${divId}">
                <h6 class="fw-bold text-secondary mb-3">PRODUCTOS COMPRADOS</h6>
                <!-- Productos se agregarán aquí -->
              </div>
          
              <!-- Estado de Entrega -->
              <div class="d-flex align-items-center justify-content-center delivery-div">
                <h5 class="delivery-status">PENDIENTE</h5>
              </div>
            </div>
        `;
        for (let i = 0; i < compra.products.length; i++) {
            for (let k = 0; k < todosLosProductos.length; k++) {
              if (compra.products[i].productoId == todosLosProductos[k].id) {
                document.getElementById(divId).innerHTML += `
                <div class="d-flex flex-wrap">
    <img src="${todosLosProductos[k].imagen}" class="img-product-list">
    <h6 style="max-width: 180px;">${todosLosProductos[k].nombre} x ${compra.products[i].cantidad}</h6>
</div>

              `;
              }
            }
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

loadBuys()
const handleProductPage = (id) => {
  localStorage.setItem("productUrl", id)

  console.log(localStorage.getItem("productUrl"))

}
