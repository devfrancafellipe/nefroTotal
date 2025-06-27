document.addEventListener('DOMContentLoaded', () =>{

    /* Variaveis da tela de Login */
    const loginCheck = document.querySelector('#inputCheck')

    /* Variaveis da rela de Cadastro */ 

    const section3 = document.querySelector('.registration')
    const formRegist = document.querySelector('#form-Regist')
    const userName = document.querySelector('#name')
    const passName = document.querySelector('#senha')
    const passIcon = document.querySelector('.mostarSenha')
    const passConfirIcon = document.querySelector('.confirSenha')
    const passNameConfirmation = document.querySelector("#confirmaçaoSenha")
    const registEmail = document.querySelector('#Email')
    const registButton = document.querySelector('#cadastro')
    const logar = document.querySelector('#hrefLogar')
    const divMessage = document.querySelector('#Error')

    const editBtn = document.querySelector('.createBack')
    const histBack = document.querySelector('.histrBack')
    const starsRating = document.querySelectorAll('.stars')
    const heartRating = document.querySelectorAll('.iconHeart')

    const home = document.querySelector('.userHome');
    const allTest = document.querySelector('.all-tests');
    const editHistBtn = document.getElementById('historico'); // Corrigido
    
/*      function showSection(sectionToShow) {
        const sections = [home, allTest, editHistBtn];
        sections.forEach(section => {
            if (section) {
                section.style.display = "none";
            } else {
                console.error('Uma das seções não foi encontrada');
            }
        });
        if (sectionToShow) {
            sectionToShow.style.display = "flex";
        } else {
            console.error('A seção a ser exibida não foi encontrada');
        }
    }

    // Testando a função
    showSection(); 

    document.querySelectorAll('li').forEach((navItem, index) => {
        navItem.addEventListener('click', () => {
            showScreen(navScreens[index]);
        });
        });

    function showScreen(screenId, isCreateQuestion = false){
    
    screens.forEach(screen =>{
        screen.classList.remove("active")
    })
    
    const activeScreen = document.getElementById(screenId)
    
    if (!activeScreen) {
        console.log("Tela não encontrada:", screenId);
        return;
    }
    activeScreen.classList.add("active");
    
    if (navigation) {
        if (isCreateQuestion) {
            navigation.style.display = 'none';
            
        } else {
            navigation.style.display = navScreens.includes(screenId) ? "block" : "none";
        }
    }
    }
    showScreen()
    

    iconHome.addEventListener('click', function(e){
        e.preventDefault()
        showSection(home)
        })
    iconBook.addEventListener('click', function(e){
    e.preventDefault()
    showSection(allTest)
    })
    iconClock.addEventListener('click', function(e){
    e.preventDefault()
    showSection(editHistBtn)
    })
   */      







// const iconHome = document.querySelector('.house')
// const iconBook = document.querySelector('.book')
// const iconClock = document.querySelector('.clock')
// const navigation = document.querySelector('.navigation');
// const navBar = document.querySelector('.navigation ul');
// const indicator = document.querySelector('.indicador');

// const navItems = document.querySelectorAll('.navigation ul li');
// const screens = document.querySelectorAll(".screen")
// const navScreens = ["home", "allTests", "historico",];

// let scrollTop = 0

// window.addEventListener("scroll", ()=>{
//     const scroll = window.pageYOffset || document.documentElement.scroll;
//     if(scroll > scrollTop){
//         navigation.classList.add("hidden")
//     }else{
//         navigation.classList.remove("hidden")
//     }
//     scrollTop = scroll
// })

// document.addEventListener('DOMContentLoaded', () => {
//     navItems[0].classList.add('active'); 
//     updateIndicator(); 
// });

// function updateIndicator() {
//     const activeItem = document.querySelector('.navigation ul li.active');
//     if (activeItem) {
//         const activeRect = activeItem.getBoundingClientRect();
//         const navRect = navBar.getBoundingClientRect();
//         const leftOffset = activeRect.left - navRect.left + (activeRect.width / 2) - (indicator.offsetWidth / 2);
//         indicator.style.left = `${leftOffset}px`;
//     }
// }


// updateIndicator();  
// navItems.forEach((item) => {
// item.addEventListener('click', () => {
//     navItems.forEach((i) => i.classList.remove('active'));
//     item.classList.add('active');
//     updateIndicator(); 
// });
// });

// window.addEventListener('resize', updateIndicator);
// updateIndicator();


// const updateNavbarVisibility = () => {
//     const navigation = document.querySelector('.navigation');
//     const userHome = document.querySelector('.userHome');
//     const userHist = document.querySelector('.historico');
//     const userTest = document.querySelector('.all-tests');

//     // Se qualquer uma das três telas estiver visível, mostra a navegação
//     if (userHome?.style.display !== 'none' || 
//         userHist?.style.display !== 'none' || 
//         userTest?.style.display !== 'none') {
//         navigation.style.display = 'flex';
//     } else {
//         navigation.style.display = 'none';
//     }
// }

// // Executa quando a página carrega
// document.addEventListener('DOMContentLoaded', updateNavbarVisibility);

// // Configura o observador para o container principal
// const mainContainer = document.querySelector('main') || document.body;
// const observer = new MutationObserver(updateNavbarVisibility);

// // Observa mudanças em todo o container principal
// observer.observe(mainContainer, {
//     attributes: true,
//     attributeFilter: ['style'],
//     subtree: true,
//     childList: true
// });




})