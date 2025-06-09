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

if (localStorage.getItem("saveId") == null || localStorage.getItem("saveId") == "null") {
  document.getElementById("btn-cart").style.display = "none"
} else {
  document.getElementById("btn-cart").style.display = "block"
}

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


const topSellers = async () => {
  try {
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

    


    const productosSeleccionados = todosLosProductos
      .sort(() => Math.random() - 0.5)
      .slice(0, 12);

    productosSeleccionados.map(
      (producto) =>
        (document.getElementById(
          'prod-container'
        ).innerHTML += /* HTML */ ` <div class="prod">
          <a href="../html/product.html" onclick="handleProductPage('${producto.tipo}/${producto.id}')" class="img-link">
            <img src="${producto.imagen}" alt="Producto" class="imgProd" />
          </a>
          <div class="desc">
            <span>${producto.marca}</span>
            <h5>${producto.nombre}</h5>
            <h5>${producto.tamanio}</h5>
            <h4>$${format.format(producto.precio)}</h4>
          </div>
          <div class="icon-container" >
            <button class="cart-icon" data-id="${producto.id}"
              data-tipo="${producto.tipo}">
              <i class="fas fa-shopping-cart"></i>
            </button>
            <button
              class="favorite-icon"
              data-id="${producto.id}"
              data-tipo="${producto.tipo}"
            >
              <i class="fas fa-heart"></i>
            </button>
          </div>
        </div>`)
    );
    updateIcons();
  } catch (error) {
    console.log('error');
  }
};

topSellers();


const handleProductPage = (id) =>{

  localStorage.setItem("productUrl", id)

  console.log(localStorage.getItem("productUrl"))
}