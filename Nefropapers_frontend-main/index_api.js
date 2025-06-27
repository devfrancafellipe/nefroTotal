// async function loginUsuario(email, senha) {
//     try {
//         const response = await fetch('https://nefropapersapi.com/auth/login', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ email, senha }),
//         });

//         const data = await response.json();
//         if (!response.ok) throw new Error(data.message || 'Erro no login');

//         localStorage.setItem('apiKey', data.apiKey);
//         localStorage.setItem('userId', data.userId);
//         localStorage.setItem('isLoggedIn', 'true');
//         console.log('Login bem-sucedido:', data);

//         window.location.href = 'home.html'; 
//     } catch (error) {
//         console.error('Erro no login:', error.message);
//         alert(`Erro: ${error.message}`);
//     }
// }

async function loginUsuario(email, senha) {
    try {
        const response = await fetch('https://nefropapersapi.com/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Erro no login');

        localStorage.setItem('apiKey', data.apiKey);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('nivel_acesso', data.nivel_acesso);
        localStorage.setItem('isLoggedIn', 'true');
        console.log('Login bem-sucedido:', data);

        window.location.href = 'home.html'; 
    } catch (error) {
        console.error('Erro no login:', error.message);
        alert(`Erro: ${error.message}`);
    }
}



async function cadastrarUsuario(nome, email, senha) {
    try {
        const response = await fetch('https://nefropapersapi.com/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, email, senha })
        });
        
        const data = await response.json();
        if (data.error) {
            console.error('Erro ao cadastrar:', data.error);
            alert(`Erro ao cadastrar: ${data.error}`);
        } else {
            alert('E-mail de confirmação enviado. Verifique sua caixa de entrada.');
            window.location.href = 'index.html'; 
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro ao se conectar ao servidor. Verifique sua conexão.');
    }
}