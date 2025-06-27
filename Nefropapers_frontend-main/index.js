document.addEventListener('DOMContentLoaded', () => {

    const container = document.querySelector('.container');
    const loginForm = document.querySelector('#form');
    const loginEmail = document.querySelector('#inputEmail');
    const loginPass = document.querySelector('#inputPass');
    const loginPassIcon = document.querySelector('.showPass');
    const passIcon = document.querySelector('.mostarSenha')
    const loginCheck = document.querySelector('#inputCheck');
    const loginButton = document.querySelector('#loginButton');
    const lembrarSenha = document.querySelector('#forgotPass');
    const loginFirst = document.querySelector('#firstHref');
    const section3 = document.querySelector('.registration');
    const formRegist = document.querySelector('#form-Regist');
    const userName = document.querySelector('#name');
    const passName = document.querySelector('#senha');
    const passConfirIcon = document.querySelector('.confirSenha');
    const passNameConfirmation = document.querySelector("#confirmaçaoSenha");
    const registEmail = document.querySelector('#Email');
    const registButton = document.querySelector('#cadastro');
    const divMessage = document.querySelector('#Error');
    const section2 = document.querySelector('.section-recover');
    const recoverInput = document.querySelector('#recoverPassword');
    const recoverButton = document.querySelector('#recoverEmail');
    const recoverHref = document.querySelector('#hrefRemenber');

// TRANSIÇAO PARA TELA INICIAL //
    window.onload = function () {
        setTimeout(function () {
            const mainContainer = document.getElementById('main_container');
            const inputScreen = document.getElementById('inputScreen');

            console.log("Iniciando a transição da tela de entrada...");

            mainContainer.style.display = 'flex'; 
            mainContainer.style.opacity = 0; 

            inputScreen.style.transition = 'opacity 0.5s ease-out';
            inputScreen.style.opacity = 0; 

            setTimeout(() => {
                inputScreen.style.display = 'none'; 
                console.log("Tela de entrada ocultada.");
                
                mainContainer.style.transition = 'opacity 0.5s ease-out';
                mainContainer.style.opacity = 1; 
                console.log("Tela principal exibida.");
            }, 500); 
        }, 500); 
    };

    registButton.addEventListener('click', (e) => {
        e.preventDefault();
        const nome = userName.value.trim();
        const email = registEmail.value.trim();
        const senha = passName.value.trim();

        if (nome === '' || email === '' || senha === '') {
            alert('Por favor, preencha todos os campos antes de continuar.');
            return;
        }
        
        cadastrarUsuario(nome, email, senha);
    });

    function togglePassword(input, icon) {

        if (input.type === "password") {
            input.type = "text"
            icon.querySelector('i').classList.add('fa-eye-slash')
        } else {
            input.type = "password"
            icon.querySelector('i').classList.remove('fa-eye-slash')
        }
    }

    passIcon.addEventListener('click', () =>{ togglePassword(passName, passIcon)})
    passConfirIcon.addEventListener('click', () => {togglePassword(passNameConfirmation, passConfirIcon)})
    loginPassIcon.addEventListener('click', () =>{ togglePassword(loginPass, loginPassIcon)})

    lembrarSenha.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (window.innerWidth >= 800) {
            document.querySelector('.section-recover').classList.add('modal-visible');
        } else {
            document.querySelector('.container').style.display = 'none';
            document.querySelector('.section-recover').style.display = 'flex';
        }
        
    })


    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        const email = loginEmail.value.trim();
        const senha = loginPass.value.trim();

        if (email === '' || senha === '') {
            alert('Por favor, preencha seu e-mail e senha.');
            return;
        }
        
        loginUsuario(email, senha);
    });

    loginFirst.addEventListener('click', (e) => {
        e.preventDefault();
        toggleVisibility(section3, container);
    });
    loginFirst.addEventListener('click', (e) => {
        e.preventDefault()
        container.style.display = 'none'
        section3.style.display = 'flex'
    })  

    const savedLogin = localStorage.getItem("saveLogin")
    loginCheck.checked = savedLogin === "true"

    loginCheck.addEventListener("change",  function() {
        localStorage.setItem("saveLogin", loginCheck.checked )})
        

    recoverHref.addEventListener('click', (e) =>{
        e.preventDefault();
    
        if (window.innerWidth >= 800){
            document.querySelector('.section-recover').classList.remove('modal-visible'); // Remove a classe modal-visible
        }else{
            section2.style.display = 'none'
            container.style.display = 'flex'
    
        }
    })
    recoverButton.addEventListener('click', async (event) => {
        event.preventDefault();
    
        const email = recoverInput.value.trim();
        if (!email) {
            alert("Por favor, insira seu e-mail!");
            return;
        }
    
        try {
            console.log("Enviando e-mail para recuperação:", email);
            const response = await fetch('https://nefropapersapi.com/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });
    
            const data = await response.json();
            console.log("Resposta do servidor:", data);
    
            if (response.ok) {
                alert("Um e-mail foi enviado com os detalhes da recuperação da senha.");
                window.location.href = 'index.html';
            } else {
                alert(data.error || "Ocorreu um erro. Tente novamente.");
            }
        } catch (error) {
            console.error("Erro ao enviar o e-mail:", error);
            alert("Ocorreu um erro ao tentar enviar o e-mail. Tente novamente.");
        }
    });

});


document.querySelector('#form-Regist').addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = document.querySelector('#name').value.trim();
    const email = document.querySelector('#Email').value.trim();
    const senha = document.querySelector('#senha').value.trim();
    
    if (nome === '' || email === '' || senha === '') {
        alert('Por favor, preencha todos os campos antes de continuar.');
        return;
    }
    
    cadastrarUsuario(nome, email, senha);
});

document.querySelector('#form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.querySelector('#inputEmail').value.trim();
    const senha = document.querySelector('#inputPass').value.trim();
    
    if (email === '' || senha === '') {
        alert('Por favor, preencha seu e-mail e senha.');
        return;
    }
    
    loginUsuario(email, senha);
    showScreen("home")
    console.log('Dados recebidos da API:', simulados);

});
