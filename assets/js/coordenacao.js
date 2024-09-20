// Função para abrir o menu lateral
function openSideMenu() {
    document.getElementById("sideMenu").style.width = "250px";
}

// Função para fechar o menu lateral
function closeSideMenu() {
    document.getElementById("sideMenu").style.width = "0";
}

// Função para filtrar os cards com base na pesquisa
function filterCards() {
    var input, filter, container, cards, h2, i, txtValue;
    input = document.getElementById('searchInput');
    filter = input.value.toUpperCase();
    container = document.getElementById('cardContainer');
    cards = container.getElementsByClassName('card');
    let hasVisibleCards = false;

    for (i = 0; i < cards.length; i++) {
        h2 = cards[i].getElementsByTagName("h2")[0];
        txtValue = h2.textContent || h2.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            cards[i].style.display = "";
            hasVisibleCards = true;
        } else {
            cards[i].style.display = 'none';
        }
    }

    document.getElementById('noResults').style.display = hasVisibleCards ? 'none' : 'block';
}

// Função para alternar a exibição dos links nos cards
function toggleLinks(button) {
    var card = button.closest('.card');
    var links = card.querySelector('.show-links');
    
    if (links.style.display === 'none' || links.style.display === '') {
        links.style.display = 'flex';
        button.textContent = 'Fechar';
        button.style.backgroundColor = '#0f96ae';  
        button.style.color = '#ffffff';  
    } else {
        links.style.display = 'none';
        button.textContent = 'Veja o seu link!';
        
        if (document.body.classList.contains("dark-mode")) {
            button.style.backgroundColor = '#f5c200';  
            button.style.color = '#000';  
        } else {
            button.style.backgroundColor = '#3b5998';  
            button.style.color = '#ffffff';  
        }
    }
}

// Função para alternar o modo escuro e claro
function toggleDarkMode() {
    const toggleButton = document.getElementById('darkModeToggle');
    const isDarkMode = document.body.classList.toggle("dark-mode");
    toggleButton.textContent = isDarkMode ? "☀️" : "🌙";
    localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
}

// Função para carregar a preferência de modo escuro do localStorage
function loadDarkModePreference() {
    const darkModePreference = localStorage.getItem('darkMode');
    if (darkModePreference === 'enabled') {
        document.body.classList.add("dark-mode");
        document.getElementById('darkModeToggle').textContent = "☀️";
    }
}

// Função para carregar o JSON com os coordenadores
function loadJSON() {
    fetch('/assets/data/Coordenadores.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar o arquivo JSON');
            }
            return response.json();
        })
        .then(data => {
            console.log('JSON carregado com sucesso:', data);
            loadCards(data); 
        })
        .catch(error => {
            console.error('Erro ao carregar o JSON:', error);
        });
}

// Função para carregar os cards dinamicamente com base no JSON
function loadCards(sectors) {
    const container = document.getElementById('cardContainer');
    
    sectors.forEach(sector => {
        const card = document.createElement('div');
        card.classList.add('card');
        
        const name = document.createElement('h2');
        name.textContent = sector.nome;  
        card.appendChild(name);

        const linksContainer = document.createElement('div');
        linksContainer.classList.add('show-links');
        linksContainer.style.display = 'none';  
        
        const linkParticipante = document.createElement('a');
        linkParticipante.textContent = 'Link Participante';
        linkParticipante.href = sector.Acesso_participante || '#';
        linkParticipante.target = '_blank';
        linksContainer.appendChild(linkParticipante);

        const linkModerador = document.createElement('a');
        linkModerador.textContent = 'Link do Coordenador';
        linkModerador.href = sector.Acesso_moderador || '#';
        linkModerador.target = '_blank';
        linksContainer.appendChild(linkModerador);

        const toggleLink = document.createElement('div');
        toggleLink.classList.add('toggle-link');
        toggleLink.textContent = 'Veja o seu link!';
        toggleLink.addEventListener('click', () => {
            const isVisible = linksContainer.style.display === 'flex';
            linksContainer.style.display = isVisible ? 'none' : 'flex';
            toggleLink.textContent = isVisible ? 'Veja o seu link!' : 'Fechar';
        });

        card.appendChild(toggleLink);
        card.appendChild(linksContainer);
        container.appendChild(card);
    });
}

// Executar a função para carregar a preferência assim que a página carregar
window.onload = function() {
    loadDarkModePreference();
    loadJSON();  
    document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);
};
