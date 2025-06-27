document.addEventListener('DOMContentLoaded', () => {
    // SELEÇÃO DOS ELEMENTOS DO DOM
    const nomeUsuarioElem = document.getElementById('dataUserName');
    const emailUsuarioElem = document.getElementById('dataUserEmail');
    const imagemPerfilElem = document.getElementById('profileImageHome');
    const rendimentoElem = document.querySelector('.rendimento .porcentagem');
    const totalQuestoesElem = document.querySelector('.totalDeQuestoes .porcentagem');
    const totalAcertosElem = document.querySelector('.totalAcertos .porcentagem');
    const totalErrosElem = document.querySelector('.totalErros .porcentagem');
    const botaoLogout = document.querySelector('.logout');
    const config = document.querySelector('.iconConfig'); 
    const popUser = document.querySelector('.popUpUser'); 
    const overlayForms = document.querySelector('.overlay');
    config.addEventListener('click', popUpOpen);
    
    document.addEventListener('click', function(event) {
        if (!popUser.contains(event.target) && !config.contains(event.target)) {
            popUser.style.display = 'none';
            // overlayForms.style.display = 'none';
        }
    });


    function popUpOpen(event) {
        event.stopPropagation();
        const isVisible = popUser.style.display === 'flex';
        popUser.style.display = isVisible ? 'none' : 'flex'; 
        // overlayForms.style.display = isVisible ? 'none' : 'block';
    }
    

    carregarDadosUsuario();
    carregarDesempenho();

    config.addEventListener('click', popUpOpen);

    // FUNÇÃO PARA CARREGAR DADOS DO USUÁRIO
    function carregarDadosUsuario() {
        const usuario = JSON.parse(localStorage.getItem('userData')) || {};

        if (usuario.name && usuario.email) {
            nomeUsuarioElem.textContent = usuario.name;
            emailUsuarioElem.textContent = usuario.email;
            imagemPerfilElem.src = usuario.profileImage || 'https://w7.pngwing.com/pngs/1000/665/png-transparent-computer-icons-profile-s-free-angle-sphere-profile-cliparts-free.png';
        }
    }

// FUNÇÃO PARA CARREGAR DADOS DE DESEMPENHO
async function carregarDesempenho() {
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
        console.error('userId não encontrado no localStorage!');
        alert('Erro: não foi possível encontrar o userId.');
        return;
    }

    try {
        const response = await fetch(`https://nefropapersapi.com/usuarios/${userId}/desempenho`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error(`Erro ao carregar desempenho do usuário. Status: ${response.status}`);
        }

        const desempenho = await response.json();
        console.log('Dados de desempenho carregados:', desempenho);

        document.querySelector('.rendimento .porcentagem').textContent = `${desempenho.rendimento}%`;
        document.querySelector('.totalDeQuestoes .porcentagem').textContent = `${desempenho.totalResolutions || 0} Questões`;
        document.querySelector('.totalAcertos .porcentagem').textContent = `${desempenho.totalCorrectAnswers || 0} Acertos`;
        document.querySelector('.totalErros .porcentagem').textContent = `${desempenho.totalErrors || 0} Erros`;

    } catch (error) {
        console.error('Erro ao carregar desempenho do usuário:', error.message);
        alert('Erro ao carregar o desempenho do usuário. Tente novamente.');
    }
}

window.onload = carregarDesempenho;


    // FUNÇÃO DE LOGOUT
    botaoLogout.addEventListener('click', () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userData');
        localStorage.removeItem('performanceData');
        localStorage.removeItem('lastTest');
        localStorage.removeItem('allTests');
        window.location.href = 'index.html';
    });


});


document.addEventListener('DOMContentLoaded', () => {
    const verTodosButton = document.querySelector('.icon-tests p');
    if (verTodosButton) {
        verTodosButton.addEventListener('click', () => {
            window.location.href = 'testes.html';
        });
    }
});

document.querySelector('.iconPerf').addEventListener("click", ()=>{
    const dadosDesempenho = document.querySelector(".boxDesempenho")
    dadosDesempenho.classList.toggle('active')
})




/* VARIAVEIS E FUNÇOES PARA A EDIÇAO DO PERFIL DO USUARIO */

const apiKey = localStorage.getItem('apiKey');
const SUPABASE_URL = 'https://cksxobvyqatzegoohqru.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrc3hvYnZ5cWF0emVnb29ocXJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc3NjEyOTcsImV4cCI6MjA1MzMzNzI5N30.8v-rEmUQHBnpD6WlbJ_gocDlE4dwkg7QKf_ZfcMkLoc';
const supa = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const popUp = document.querySelector(".popUpUser");
const profileImage = document.querySelector(".edit-User img");
// const editIcon = document.querySelector(".edit-User span");
const userProfileImage = document.getElementById("userProfileImage");
const nameInput = document.querySelector(".edit-User h2");
const emailInput = document.querySelector(".containerDate input[type='text']");
const bioInput = document.querySelector(".descriptionUser textarea");
const ufInput = document.querySelector(".locationUser .location input");
const cityInput = document.querySelector(".locationUser .city input");
const updateButton = document.querySelector(".update");
const profileImages = document.querySelectorAll(".profileImage");
const profileImageSelector = document.getElementById("profileImageSelector");
const editProfileIcon = document.getElementById("editProfileIcon");
const titleUserName = document.getElementById("titleusername");

const imageHome = document.getElementById("profileImageHome");
const dataUserName = document.getElementById("dataUserName");
const dataUserEmail = document.getElementById("dataUserEmail");

let isDataChanged = false;

async function loadProfileImages() {
  try {
      console.log("Iniciando carregamento das imagens...");

      const loadingSpinner = profileImagesContainer.querySelector(".loading-spinner");
      if (loadingSpinner) {
          loadingSpinner.remove();
      }
      const { data, error } = await supa.storage
          .from('profile_pictures') 
          .list();

      if (error) {
          throw error;
      }
      const imageUrls = data.map((file) => {
          const publicUrl = supa.storage
              .from('profile_pictures')
              .getPublicUrl(file.name).data.publicUrl;
          return publicUrl;
      });
      imageUrls.slice(1).forEach((url) => {
          const img = document.createElement("img");
          img.src = url;
          img.classList.add("profileImage");
          img.setAttribute("data-src", url); 
          profileImagesContainer.appendChild(img);
      });
      addImageClickEvent();
      } catch (error) {
          console.error("Erro ao carregar imagens:", error);
      }
}
  
function addImageClickEvent() {
  const profileImages = document.querySelectorAll(".profileImage");
  profileImages.forEach((image) => {
      image.addEventListener("click", () => {
          const selectedImageSrc = image.getAttribute("data-src");
          isDataChanged = true;
          updateButton.style.backgroundColor = "#ff9600";
          userProfileImage.src = selectedImageSrc;

          profileImageSelector.style.display = "none";

          console.log("Imagem selecionada:", selectedImageSrc);
      });
  });
}

editProfileIcon.addEventListener("click", (event) => {
    event.stopPropagation();
    if (profileImageSelector.style.display === "none" || profileImageSelector.style.display === "") {
        profileImageSelector.style.display = "block";
    } else {
        profileImageSelector.style.display = "none";
    }
});

document.addEventListener("click", (event) => {
    if (!profileImageSelector.contains(event.target) && !editProfileIcon.contains(event.target)) {
        profileImageSelector.style.display = "none";
    }
});

document.addEventListener("DOMContentLoaded", () => {
    loadProfileImages();
});

async function fetchUserEmail() {
    const userId = localStorage.getItem('userId');
  
    if (!userId) {
        emailInput.value = "Nenhum usuário logado.";
        return;
    }

    const { data, error } = await supa
       .from('usuarios')
       .select('email')
       .eq('id', userId) 
       .single();
  
    if (error) {
        emailInput.value = "E-mail não encontrado.";
    } else {
        emailInput.value = data.email;
    }
}

document.addEventListener('DOMContentLoaded', fetchUserEmail);

nameInput.addEventListener("click", (e) => {
    e.stopPropagation();
    if (nameInput.querySelector("input")) return;

    const nicknameInput = document.createElement("input");
    nicknameInput.type = "text";
    nicknameInput.value = nameInput.textContent.trim(); 
    nicknameInput.style.width = "100%";
    nicknameInput.style.fontSize = "inherit"
    nameInput.replaceChildren(nicknameInput); 
    nicknameInput.focus()

    nicknameInput.addEventListener("blur", () => {
        nameInput.textContent = nicknameInput.value.trim()
        ? nicknameInput.value.trim()
        : "Nickname";
        isDataChanged = true;
});
});

updateButton.addEventListener("click", async () => {
    const userData = {
      imagem_perfil: profileImage.src,
      nome: nameInput.textContent.replace("Olá, ", "").trim(),
      biografia: bioInput.value.trim(),
      uf: ufInput.value.trim().toUpperCase(),
      cidade: cityInput.value.trim(),
    };
  
    if (!userData.nome || !userData.uf || !userData.cidade || !userData.biografia) {
      alert("Todos os campos devem ser preenchidos");
      return;
    }

    try {
        const userId = localStorage.getItem('userId');
        if (!userId) throw new Error("Usuário não logado");

        let uf = ufInput.value.trim().toUpperCase(); 
        if (uf.length !== 2) {
        alert("UF deve estar no padrão XX");
        ufInput.focus();
        return;
        }
    
        const { error } = await supa
          .from('usuarios')
          .update({
            imagem_perfil: userData.imagem_perfil,
            nome: userData.nome,
            biografia: userData.biografia,
            uf: userData.uf,
            cidade: userData.cidade
          })
          .eq('id', userId);
    
        if (error) throw error;
    
        localStorage.setItem("userData", JSON.stringify(userData));
        alert("Dados atualizados com sucesso!");
    
        isDataChanged = false;
        updateButton.style.backgroundColor = "#ccc";
        if (imageHome) imageHome.src = userData.imagem_perfil;
        if (dataUserName) dataUserName.textContent = `Olá, ${userData.nome}`;
    
      } catch (error) {
        console.error("Erro detalhado:", {
          message: error.message,
          code: error.code,
          details: error.details
        });
        alert(`Erro ao salvar: ${error.message}`);
      }
});

function monitorFieldChanges() {
    const inputs = [nameInput, emailInput, bioInput, ufInput, cityInput];
    inputs.forEach(input => {
    input.addEventListener("input", () => {
        isDataChanged = true;
        updateButton.style.backgroundColor = "#ff9600"; 
    });
});
}

monitorFieldChanges();

async function loadUserData() {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.log("Nenhum usuário logado");
        return;
      }
  
      const { data, error } = await supa
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .single();
  
      if (error) throw error;
      if (!data) {
        console.log("Nenhum dado encontrado para este usuário");
        return;
      }
  
      if (data.imagem_perfil) {
        profileImage.src = data.imagem_perfil;
        if (imageHome) imageHome.src = data.imagem_perfil;
      }
      
      if (data.nome) {
        nameInput.textContent = data.nome;
        if (dataUserName) dataUserName.textContent = `Olá, ${data.nome}`;
      }
      
      if (data.email) {
        emailInput.value = data.email;
        if (dataUserEmail) dataUserEmail.textContent = data.email;
      }
      
      if (data.biografia) bioInput.value = data.biografia;
      if (data.uf) ufInput.value = data.uf;
      if (data.cidade) cityInput.value = data.cidade;
  
      localStorage.setItem("userData", JSON.stringify({
        profileImage: data.imagem_perfil,
        name: data.nome,
        email: data.email,
        bio: data.biografia,
        uf: data.uf,
        city: data.cidade
      }));
  
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
      const savedData = JSON.parse(localStorage.getItem("userData"));
      if (savedData) {
        if (savedData.profileImage) profileImage.src = savedData.profileImage;
        if (savedData.name) nameInput.textContent = savedData.name;
        if (savedData.email) emailInput.value = savedData.email;
        if (savedData.bio) bioInput.value = savedData.bio;
        if (savedData.uf) ufInput.value = savedData.uf;
        if (savedData.city) cityInput.value = savedData.city;
        
        if (imageHome && savedData.profileImage) imageHome.src = savedData.profileImage;
        if (dataUserName && savedData.name) dataUserName.textContent = `Olá, ${savedData.name}`;
        if (dataUserEmail && savedData.email) dataUserEmail.textContent = savedData.email;
      }
    }
  }
  
  document.addEventListener('DOMContentLoaded', loadUserData);



// variaveis e funçoes da barra de navegaçao //


const iconHome = document.querySelector('.house')
const iconBook = document.querySelector('.book')
const iconClock = document.querySelector('.clock')
const navigation = document.querySelector('.navigation');
const navBar = document.querySelector('.navigation ul');
const indicator = document.querySelector('.indicador');

const navItems = document.querySelectorAll('.navigation ul li');
const screens = document.querySelectorAll(".screen")
const navScreens = ["home", "allTests", "historico",];

let scrollTop = 0

window.addEventListener("scroll", ()=>{
    const scroll = window.pageYOffset || document.documentElement.scroll;
    if(scroll > scrollTop){
        navigation.classList.add("hidden")
    }else{
        navigation.classList.remove("hidden")
    }
    scrollTop = scroll
})

document.addEventListener("DOMContentLoaded", function () {
    const navItems = document.querySelectorAll(".navigation ul li");
    const indicator = document.querySelector(".indicador");

    // Mapeia cada página ao seu respectivo ícone
    const pages = {
        "home.html": "house",
        "testes.html": "book",
        "historico.html": "clock"
    };

    // Obtém o nome do arquivo atual
    const path = window.location.pathname.split("/").pop();

    // Verifica se a página atual tem um ícone correspondente
    if (pages[path]) {
        // Remove a classe 'active' de todos os itens
        navItems.forEach(item => item.classList.remove("active"));

        // Encontra o ícone correspondente e adiciona a classe 'active'
        const activeItem = document.querySelector(`.${pages[path]}`);
        if (activeItem) {
            activeItem.classList.add("active");

            // Ajusta a posição do indicador
            updateIndicator(activeItem);
        }
    }

    // Função para atualizar a posição do indicador
    function updateIndicator(activeItem) {
        const navBar = document.querySelector(".navigation ul");
        const activeRect = activeItem.getBoundingClientRect();
        const navRect = navBar.getBoundingClientRect();

        // Calcula a posição exata do indicador
        const leftOffset = activeRect.left - navRect.left + (activeRect.width / 2) - (indicator.offsetWidth / 2);
        indicator.style.left = `${leftOffset}px`;
        indicator.style.transition = "left 0.3s ease-in-out";
    }

    // Atualiza o indicador ao redimensionar a janela
    window.addEventListener("resize", () => {
        const activeItem = document.querySelector(".navigation ul li.active");
        if (activeItem) {
            updateIndicator(activeItem);
        }
    });
});
