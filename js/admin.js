const URL_USER = "http://localhost:3005/users"
const URL_SUPLEMENTOS = "http://localhost:3005/suplementos"
const URL_SHAMPOOS = "http://localhost:3005/shampoos"
const URL_CREMAS = "http://localhost:3005/cremas"
const URL_PERFUMES = "http://localhost:3005/perfumes"
const URL_ELECTRONICOS = 'http://localhost:3005/electronicos';

var edit = false
var editId = ""
//Panel de admin

const loadTableUsers = async () => {
    try {
        const results = await axios.get(URL_USER)
        document.getElementById("table-body").innerHTML = ""
        results.data.forEach(user => {

            if (user.email == localStorage.getItem("saveEmail")) {
                return
            }

            let rol = ""
            if (user.rol == "user") {
                rol = "Usuario"
            } else if (user.rol == "employee") {
                rol = "Empleado"
            } else if (user.rol == "admin") {
                rol = "Admin"
            }

            document.getElementById("table-body").innerHTML += `
            <tr>
                <th>${user.id}</th>
                <th>${user.name}</th>
                <th>${user.lastName}</th>
                <th>${user.password}</th>
                <th>${user.email}</th>
                <th>${rol}</th>
                <th><button class="btn btn-success" data-bs-toggle="modal"
          data-bs-target="#exampleModal" onclick="handleEditUsers('${user.id}')">EDIT</button></th>
                <th><button class="btn btn-danger" onclick="handleDeleteUsers('${user.id}')">DELETE</button></th>
              </tr>
            `
        });
    } catch (error) {

    }
}
const handleEditUsers = async (id) => {
    try {

        const response = await axios.get(URL_USER + "/" + id)
        const results = response.data

        document.getElementById("modal-add-name").value = results.name
        document.getElementById("modal-add-lastname").value = results.lastName
        document.getElementById("modal-add-email").value = results.email
        document.getElementById("modal-add-pass").value = results.password
        document.getElementById("modal-add-select").value = results.rol
        console.log(response)

        document.getElementById("exampleModalLabel").textContent = "Editar usuario"
        document.getElementById("btn-success-modal-user").textContent = "Aplicar cambios"

        edit = true
        editId = id
    } catch (error) {

    }
}
const handleDeleteUsers = async (id) => {
    try {
        const response = await axios.delete(URL_USER + "/" + id)
        loadTableUsers()

        if (response) {
            alert("Usuario eliminado correctamente")
        } else {
            alert("Algo salio mal")
        }
    } catch (error) {
        console.log(error)
    }
}
const handleEditProducts = async (id) => {
    try {


        const response = await axios.get("http://localhost:3005/" + id)
        const results = response.data

        document.getElementById("modal-add-product-title").value = results.marca
        document.getElementById("modal-add-product-name").value = results.nombre
        document.getElementById("modal-add-product-size").value = results.tamanio
        document.getElementById("modal-add-product-price").value = results.precio
        document.getElementById("modal-add-product-img").value = results.imagen
        document.getElementById("modal-addproduct-select").value = results.tipo

        document.getElementById("modalLabelProduct").textContent = "Editar Producto"
        document.getElementById("btn-success-modal-product").textContent = "Aplicar cambios"

        edit = true
        editId = id
    } catch (error) {
        console.log(error)
    }
}
const handleDeleteProduct = async (id) => {
    try {
        const response = await axios.delete("http://localhost:3005/" + id)
        loadTableProducts()

        if (response) {
            alert("Usuario eliminado correctamente")
        } else {
            alert("Algo salio mal")
        }
    } catch (error) {
        console.log(error)
    }
}
const handlerNewUser = async (event) => {
    event.preventDefault()
    try {
        let available = true
        const name = document.getElementById("modal-add-name").value
        const lastName = document.getElementById("modal-add-lastname").value
        let email = document.getElementById("modal-add-email").value
        const password = document.getElementById("modal-add-pass").value
        const adress = "";
        const phoneNumber = "";
        const dni = "";
        const rol = document.getElementById("modal-add-select").value
        email = email.toLowerCase();
        if (edit == false) {
            const getResults = await axios.get(URL_USER)
            getResults.data.some((element) => {
                if (element.email == email) {
                    alert("El email ingresado ya esta en uso")
                    available = false;
                    return true;

                }
                return false;
            });

            if (available == true) {
                const response = await axios.post(URL_USER, {
                    name,
                    lastName,
                    email,
                    password,
                    adress,
                    phoneNumber,
                    rol,
                    dni,
                    favs: [],
                    carrito: []
                })
                loadTableUsers()
                alert("Usuario nuevo creado con exito")
            }
        } else {
            const dataId = await axios.get(URL_USER + "/" + editId)
            const response = dataId.data
            if (response.email == email) {
                available = true
            } else {
                const getResults = await axios.get(URL_USER)
                getResults.data.some((element) => {
                    if (element.email == email) {
                        alert("El email ingresado ya esta en uso")
                        available = false;
                        return true;

                    }
                    return false;
                });
            }


            if (available == true) {
                await axios.patch(URL_USER + "/" + editId, {
                    name,
                    lastName,
                    email,
                    password,
                    rol
                })
                loadTableUsers()
                alert("Usuario modificado con exito")

            }
        }

    } catch (error) {
        console.error("Error al crear el usuario:", error);
        alert("Hubo un problema al crear el usuario");
    }
}




const handlerUsers = () => {
    document.getElementById("accounts-container").style.display = "block"
    document.getElementById("Products-container").style.display = "none"
    document.getElementById("admin-btn-users").style.backgroundColor = "#C7C7C7"
    document.getElementById("admin-btn-product").style.backgroundColor = "#FEFEFF"
}

const handlerProducts = () => {
    document.getElementById("accounts-container").style.display = "none"
    document.getElementById("Products-container").style.display = "block"
    document.getElementById("admin-btn-users").style.backgroundColor = "#FEFEFF"
    document.getElementById("admin-btn-product").style.backgroundColor = "#C7C7C7"
}
const handleCleanInputsProducts = () => {
    document.getElementById("modal-add-product-title").value = ""
    document.getElementById("modal-add-product-name").value = ""
    document.getElementById("modal-add-product-size").value = ""
    document.getElementById("modal-add-product-price").value = ""
    document.getElementById("modal-add-product-img").value = ""
    document.getElementById("modalLabelProduct").textContent = "Producto nuevo"
    document.getElementById("btn-success-modal-product").textContent = "Agregar producto"
    edit = false
}
const handleCleanInputsUsers = () => {
    document.getElementById("modal-add-name").value = ""
    document.getElementById("modal-add-lastname").value = ""
    document.getElementById("modal-add-email").value = ""
    document.getElementById("modal-add-pass").value = ""
    document.getElementById("exampleModalLabel").textContent = "Usuario nuevo"
    document.getElementById("btn-success-modal-user").textContent = "Agregar usuario"
    document.getElementById("modal-add-select").value = "user"
    edit = false
}
const loadTableProducts = async () => {
    try {

        const resultsSuplements = await axios.get(URL_SUPLEMENTOS)
        document.getElementById("table-body-products").innerHTML = ""
        resultsSuplements.data.forEach(product => {
            document.getElementById("table-body-products").innerHTML += `
            <tr>
                <th>${product.id}</th>
                <th>${product.marca}</th>
                <th>${product.tipo}</th>
                <th>${product.nombre}</th>
                <th>${product.tamanio}</th>
                <th><img src="${product.imagen}" class="img-list-products" alt=""></th>
                <th><button class="btn btn-success" data-bs-toggle="modal"
          data-bs-target="#productsModal" onclick="handleEditProducts('${product.tipo}/${product.id}')">EDIT</button></th>
                <th><button class="btn btn-danger" onclick="handleDeleteProduct('${product.tipo}/${product.id}')">DELETE</button></th>
              </tr>
            `
        });


        const resultsShampoos = await axios.get(URL_SHAMPOOS)

        resultsShampoos.data.forEach(product => {
            document.getElementById("table-body-products").innerHTML += `
            <tr>
                <th>${product.id}</th>
                <th>${product.marca}</th>
                <th>${product.tipo}</th>
                <th>${product.nombre}</th>
                <th>${product.tamanio}</th>
                <th><img src="${product.imagen}" class="img-list-products" alt=""></th>
                <th><button class="btn btn-success" data-bs-toggle="modal"
          data-bs-target="#productsModal" onclick="handleEditProducts('${product.tipo}/${product.id}')">EDIT</button></th>
                <th><button class="btn btn-danger" onclick="handleDeleteProduct('${product.tipo}/${product.id}')">DELETE</button></th>
              </tr>
            `
        });

        const resultsCremas = await axios.get(URL_CREMAS)

        resultsCremas.data.forEach(product => {
            document.getElementById("table-body-products").innerHTML += `
            <tr>
                <th>${product.id}</th>
                <th>${product.marca}</th>
                <th>${product.tipo}</th>
                <th>${product.nombre}</th>
                <th>${product.tamanio}</th>
                <th><img src="${product.imagen}" class="img-list-products" alt=""></th>
                <th><button class="btn btn-success" data-bs-toggle="modal"
          data-bs-target="#productsModal" onclick="handleEditProducts('${product.tipo}/${product.id}')">EDIT</button></th>
                <th><button class="btn btn-danger" onclick="handleDeleteProduct('${product.tipo}/${product.id}')">DELETE</button></th>
              </tr>
            `
        });


        const resultsPerfumes = await axios.get(URL_PERFUMES)

        resultsPerfumes.data.forEach(product => {
            document.getElementById("table-body-products").innerHTML += `
            <tr>
                <th>${product.id}</th>
                <th>${product.marca}</th>
                <th>${product.tipo}</th>
                <th>${product.nombre}</th>
                <th>${product.tamanio}</th>
                <th><img src="${product.imagen}" class="img-list-products" alt=""></th>
                <th><button class="btn btn-success" data-bs-toggle="modal"
          data-bs-target="#productsModal" onclick="handleEditProducts('${product.tipo}/${product.id}')">EDIT</button></th>
                <th><button class="btn btn-danger" onclick="handleDeleteProduct('${product.tipo}/${product.id}')">DELETE</button></th>
              </tr>
            `
        });



        const resultsElectronicos = await axios.get(URL_ELECTRONICOS)

        resultsElectronicos.data.forEach(product => {
            document.getElementById("table-body-products").innerHTML += `
            <tr>
                <th>${product.id}</th>
                <th>${product.marca}</th>
                <th>${product.tipo}</th>
                <th>${product.nombre}</th>
                <th>${product.tamanio}</th>
                <th><img src="${product.imagen}" class="img-list-products" alt=""></th>
                <th><button class="btn btn-success" data-bs-toggle="modal"
          data-bs-target="#productsModal" onclick="handleEditProducts('${product.tipo}/${product.id}')">EDIT</button></th>
                <th><button class="btn btn-danger" onclick="handleDeleteProduct('${product.tipo}/${product.id}')">DELETE</button></th>
              </tr>
            `
        });


    } catch (error) {

    }
}
const handleNewProduct = async (event) => {
    event.preventDefault()
    try {
        const marca = document.getElementById("modal-add-product-title").value
        const nombre = document.getElementById("modal-add-product-name").value
        const tamanio = document.getElementById("modal-add-product-size").value
        const precio = document.getElementById("modal-add-product-price").value
        const imagen = document.getElementById("modal-add-product-img").value
        const tipo = document.getElementById("modal-addproduct-select").value
        if (edit == false) {
            switch (tipo) {
                case "suplementos":
                    await axios.post(`http://localhost:3005/${tipo}`, {
                        marca,
                        nombre,
                        tamanio,
                        precio,
                        imagen,
                        tipo
                    })
                    break;
                case "shampoos":
                    await axios.post(`http://localhost:3005/${tipo}`, {
                        marca,
                        nombre,
                        tamanio,
                        precio,
                        imagen,
                        tipo
                    })
                    break;
                case "cremas":
                    await axios.post(`http://localhost:3005/${tipo}`, {
                        marca,
                        nombre,
                        tamanio,
                        precio,
                        imagen,
                        tipo
                    })
                    break;
                case "perfumes":
                    await axios.post(`http://localhost:3005/${tipo}`, {
                        marca,
                        nombre,
                        tamanio,
                        precio,
                        imagen,
                        tipo
                    })
                    break;
                    case "electronicos":
                    await axios.post(`http://localhost:3005/${tipo}`, {
                        marca,
                        nombre,
                        tamanio,
                        precio,
                        imagen,
                        tipo
                    })
                    break;
            }
        } else {
            await axios.patch("http://localhost:3005/" + editId, {
                marca,
                nombre,
                tamanio,
                precio,
                imagen,
                tipo
            })
            alert("Producto actualizado")
        }
        loadTableProducts()
    } catch (error) {
        console.log(error)
    }
}
loadTableUsers()
loadTableProducts()
document.getElementById("form-add-newproduct").addEventListener("submit", handleNewProduct)
document.getElementById("form-add-newuser").addEventListener("submit", handlerNewUser)
document.getElementById("admin-btn-users").addEventListener("click", handlerUsers)
document.getElementById("admin-btn-product").addEventListener("click", handlerProducts)
document.getElementById("btn-add-user").addEventListener("click", handleCleanInputsUsers)
document.getElementById("btn-add-product").addEventListener("click", handleCleanInputsProducts)

