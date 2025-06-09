//Parte visual del offcanvas
const URL_USERS = "http://localhost:3005/users"



const handlerForgotPassword = () => {
    document.getElementById("error-text-id").style.display = "none";
    document.getElementById("title-login").textContent = "RECUPERA TU CONTRASEÑA";
    document.getElementById("login-offcanvas").style.display = "none";
    document.getElementById("btn-close").style.display = "none";
    document.getElementById("btn-back").style.display = "inline-block";
    document.getElementById("forgotPass-offcanvas").style.display = "inline-block";
    document.getElementById("input-login-email").value = "";
    document.getElementById("input-login-password").value = "";
     section = "forgotPass"
}
const handlerBtnLogin = async (event) => {
    event.preventDefault()
    try {
        success = false;
        let email = document.getElementById("input-login-email").value;
        const password = document.getElementById("input-login-password").value;
        email = email.toLowerCase();
        const getResults = await axios.get(URL_USERS)

        getResults.data.forEach(element => {
            if (element.email === email && element.password === password) {
                localStorage.setItem('saveName', element.name);
                localStorage.setItem('saveLastName', element.lastName);
                localStorage.setItem('saveEmail', element.email);
                localStorage.setItem('savePassword', element.password);
                localStorage.setItem('saveAdress', element.adress);
                localStorage.setItem('saveRol', element.rol);
                localStorage.setItem('savePhoneNumber', element.phoneNumber);
                localStorage.setItem('saveDni', element.dni);
                localStorage.setItem('saveId', element.id);
                success = true

            }
        });
        if (success) {
            console.log(success)
            alert("Sesión iniciada con éxito");
            location.reload();

        } else {
            document.getElementById("error-text-id").style.display = "block";
        }
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        alert("Ocurrió un error. Intenta nuevamente.");
    }
}
const handlerRegister = () => {

    document.getElementById("error-text-id").style.display = "none";
    document.getElementById("title-login").textContent = "REGÍSTRATE";
    document.getElementById("login-offcanvas").style.display = "none";
    document.getElementById("btn-close").style.display = "none";
    document.getElementById("btn-back").style.display = "inline-block";
    document.getElementById("register-offcanvas").style.display = "inline-block";
    document.getElementById("input-login-email").value = "";
    document.getElementById("input-login-password").value = "";
    section = "register"
}
const handlerBtnRegisterSuccess = async (event) => {
    event.preventDefault()
    try {
        let available = true
        const name = document.getElementById("input-register-name").value;
        const lastName = document.getElementById("input-register-lastName").value;
        let email = document.getElementById("input-register-email").value;
        const password = document.getElementById("input-register-password").value;
        const adress = "";
        const phoneNumber = "";
        const rol = "user";
        const dni = "";
        email = email.toLowerCase();

        const getResults = await axios.get(URL_USERS)
        getResults.data.some((element) => {
            if (element.email == email) {
                document.getElementById("error-text-id-register").style.display = "block";
                available = false;
                return true;

            }
            return false;
        });
        if (available == true) {
            await axios.post(URL_USERS, {
                name,
                lastName,
                email,
                password,
                adress,
                phoneNumber,
                rol,
                dni,
                favs: [],
                carrito: [],
                compras: []
            })
            alert("Usuario creado con exito")

            location.reload()
        }

    } catch (error) {
        console.error("Error al crear el usuario:", error);
        alert("Hubo un problema al crear el usuario.");
    }
}
const handlerBackBtn = () => {
    switch (section) {
        case "forgotPass":
            document.getElementById("btn-back").style.display = "none";
            document.getElementById("btn-close").style.display = "inline-block";
            document.getElementById("login-offcanvas").style.display = "block";
            document.getElementById("title-login").textContent = "INICIAR SESION";
            document.getElementById("forgotPass-offcanvas").style.display = "none";
            document.getElementById("input-forgotPass-email").value = "";
            break;
        case "register":
            document.getElementById("btn-back").style.display = "none";
            document.getElementById("btn-close").style.display = "inline-block";
            document.getElementById("login-offcanvas").style.display = "block";
            document.getElementById("title-login").textContent = "INICIAR SESION";
            document.getElementById("register-offcanvas").style.display = "none";
            document.getElementById("error-text-id-register").style.display = "none";
            document.getElementById("input-register-name").value = "";
            document.getElementById("input-register-lastName").value = "";
            document.getElementById("input-register-email").value = "";
            document.getElementById("input-register-password").value = "";
            break;
    }
    section = "login"
}

document.getElementById("btn-forgot-password").addEventListener("click", handlerForgotPassword)
document.getElementById("btn-register").addEventListener("click", handlerRegister)
document.getElementById("btn-back").addEventListener("click", handlerBackBtn)


//CRUD LOGIN
document.getElementById("btn-login").addEventListener("submit", handlerBtnLogin)
//CRUD REGISTER
document.getElementById("btn-register-success").addEventListener("submit", handlerBtnRegisterSuccess)


if (localStorage.getItem('saveRol') != "null" && localStorage.getItem('saveRol') != null )  {
    document.getElementById("btn-account-status").innerHTML = `<a href="./account.html">${localStorage.getItem('saveName')}</a>`
} else{
    document.getElementById("btn-account-status").innerHTML = `
    <button class="" type="button" id="button-login" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
        Login
    </button>
`;
}
console.log(typeof localStorage.getItem('saveRol'))
console.log(localStorage.getItem('saveRol'))
//localStorage.setItem('saveRol',"null")


if (localStorage.getItem('saveRol') == "admin") {
    document.getElementById("navbar").innerHTML += `<li>
            <a href="./adminPanel.html"><b>ADMIN PANEL</b></a>
          </li>`
}

if (localStorage.getItem("saveId") == null || localStorage.getItem("saveId") == "null") {
    document.getElementById("btn-cart").style.display = "none"
  } else {
    document.getElementById("btn-cart").style.display = "block"
  }