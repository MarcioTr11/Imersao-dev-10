let cardContainer = document.querySelector(".card-container");
let todosOsDados = []; // Armazena todos os dados do JSON
let dadosAtuais = []; // Armazena os dados a serem exibidos (pode ser filtrado)
let debounceTimer;
let tagAtiva = "todos";
let ordenacaoAtual = "default";

// --- Configurações de Paginação ---
let paginaAtual = 1;
const itensPorPagina = 9; // Você pode ajustar este número
// ---------------------------------

document.addEventListener("DOMContentLoaded", inicializarApp);

document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.querySelector("#start-btn");
  const splashScreen = document.querySelector("#splash-screen");
  const mainContent = document.querySelector("#main-content");

  startBtn.addEventListener("click", () => {
    // Esconde a tela de abertura com uma transição
    splashScreen.style.opacity = "0";
    splashScreen.style.visibility = "hidden";

    // Mostra o conteúdo principal
    mainContent.classList.remove("hidden");
    mainContent.classList.add("fade-in-content");
    iniciarPagina();
  });

  // Lógica do botão Voltar ao Topo
  const backToTopBtn = document.querySelector("#back-to-top-btn");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.remove("hidden");
    } else {
      backToTopBtn.classList.add("hidden");
    }
  });
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

function inicializarApp() {
  // ... (código da tela de abertura e botão de voltar ao topo)
}

async function iniciarPagina() {
  let resposta = await fetch("data.json");
  todosOsDados = await resposta.json();
  dadosAtuais = [...todosOsDados]; // Começa mostrando todos os dados

  gerarFiltroDeTags();
  gerarAutocomplete();
  adicionarListenersDeFiltroEOrdenacao();
  adicionarListenerTagsNosCards();

  renderizarPagina();

  // --- Lógica do Botão de Voltar ---
  const backBtn = document.querySelector("#back-to-home-btn");
  backBtn.addEventListener("click", () => {
    const splashScreen = document.querySelector("#splash-screen");
    const mainContent = document.querySelector("#main-content");

    mainContent.classList.add("hidden");
    splashScreen.style.opacity = "1";
    splashScreen.style.visibility = "visible";
    // Reseta o estado da aplicação
    document.querySelector("#campo-busca").value = "";
    tagAtiva = "todos";
    ordenacaoAtual = "default";
  });

  const searchForm = document.querySelector(".search-form");
  const campoBusca = document.querySelector("#campo-busca");

  // Previne o comportamento padrão do formulário de recarregar a página
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    clearTimeout(debounceTimer); // Cancela o debounce se o form for submetido
    filtrarErenderizar(campoBusca.value); // Executa a busca imediatamente
  });

  // Busca em tempo real com debounce
  campoBusca.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      filtrarErenderizar(campoBusca.value);
    }, 300); // Atraso de 300ms
  });

  // Limpa o timer se o usuário sair da página
  window.addEventListener("beforeunload", () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
  });
}

function gerarFiltroDeTags() {
  const tagSelect = document.querySelector("#tag-select");
  const todasAsTags = new Set();
  todosOsDados.forEach((dado) => {
    dado.tags?.forEach((tag) => todasAsTags.add(tag));
  });

  tagSelect.innerHTML = `<option value="todos">Todas as Tags</option>`;
  [...todasAsTags].sort().forEach((tag) => {
    tagSelect.innerHTML += `<option value="${tag}">${
      tag.charAt(0).toUpperCase() + tag.slice(1)
    }</option>`;
  });
}

function gerarAutocomplete() {
  const datalist = document.createElement("datalist");
  datalist.id = "autocomplete-list";
  const suggestions = new Set();

  todosOsDados.forEach((dado) => {
    suggestions.add(dado.nome);
    dado.tags?.forEach((tag) => suggestions.add(tag));
  });

  [...suggestions].sort().forEach((suggestion) => {
    datalist.innerHTML += `<option value="${suggestion}"></option>`;
  });

  document.body.appendChild(datalist);
  document
    .querySelector("#campo-busca")
    .setAttribute("list", "autocomplete-list");
}

function adicionarListenersDeFiltroEOrdenacao() {
  // Listener para tags
  const tagSelect = document.querySelector("#tag-select");
  tagSelect.addEventListener("change", (event) => {
    tagAtiva = event.target.value;
    aplicarFiltrosEOrdenacao(true);
  });

  // Listener para ordenação
  const sortSelect = document.querySelector("#sort-select");
  sortSelect.addEventListener("change", (event) => {
    ordenacaoAtual = event.target.value;
    // Apenas re-renderiza com a nova ordenação, sem refiltrar
    aplicarFiltrosEOrdenacao(false);
  });
}

function adicionarListenerTagsNosCards() {
  const cardContainer = document.querySelector(".card-container");
  cardContainer.addEventListener("click", (event) => {
    const target = event.target;
    if (target.classList.contains("card-tag")) {
      const tagClicada = target.dataset.tag;
      tagAtiva = tagClicada;
      // Atualiza o dropdown principal para refletir a seleção
      document.querySelector("#tag-select").value = tagClicada;
      // Aplica o filtro
      aplicarFiltrosEOrdenacao(true);
    }
  });
}

function aplicarFiltrosEOrdenacao(refiltrar = true) {
  let dadosFiltrados = refiltrar ? [...todosOsDados] : [...dadosAtuais];

  if (refiltrar) {
    // 1. Aplicar filtro de tag
    if (tagAtiva !== "todos") {
      dadosFiltrados = dadosFiltrados.filter((dado) =>
        dado.tags?.includes(tagAtiva)
      );
    }

    // 2. Aplicar filtro de busca por texto
    const termoBuscado = document.querySelector("#campo-busca").value;
    if (termoBuscado.trim()) {
      const termoNormalizado = termoBuscado.toLowerCase().trim();
      dadosFiltrados = dadosFiltrados.filter(
        (dado) =>
          dado.nome.toLowerCase().includes(termoNormalizado) ||
          dado.descrição.toLowerCase().includes(termoNormalizado)
      );
    }
  }

  // 3. Aplicar ordenação
  switch (ordenacaoAtual) {
    case "name-asc":
      dadosFiltrados.sort((a, b) => a.nome.localeCompare(b.nome));
      break;
    case "name-desc":
      dadosFiltrados.sort((a, b) => b.nome.localeCompare(a.nome));
      break;
    case "year-desc":
      dadosFiltrados.sort((a, b) => (b.ano || 0) - (a.ano || 0));
      break;
    case "year-asc":
      dadosFiltrados.sort((a, b) => (a.ano || 0) - (b.ano || 0));
      break;
  }

  dadosAtuais = dadosFiltrados;
  paginaAtual = 1; // Reseta para a primeira página
  renderizarPagina();
}

function renderizarPagina() {
  renderizarCards();
  renderizarPaginacao();
}

function renderizarCards() {
  cardContainer.innerHTML = ""; // Limpa os cards existentes
  const resultsCounter = document.querySelector("#results-counter");

  if (dadosAtuais.length === 0) {
    cardContainer.innerHTML = `<p class="info-message">Nenhum resultado encontrado.</p>`;
    resultsCounter.innerHTML = ""; // Limpa o contador se não houver resultados
    return;
  }

  // Calcula os itens para a página atual
  const indiceInicial = (paginaAtual - 1) * itensPorPagina;
  const indiceFinal = indiceInicial + itensPorPagina;
  const itensDaPagina = dadosAtuais.slice(indiceInicial, indiceFinal);

  // Atualiza o contador de resultados
  resultsCounter.textContent = `Mostrando ${itensDaPagina.length} de ${dadosAtuais.length} itens.`;

  const tagsHTML = (tags) => {
    if (!tags || tags.length === 0) return "";
    return `
      <div class="card-tags">
        ${tags
          .map(
            (tag) =>
              `<button class="card-tag" data-tag="${tag}">${tag}</button>`
          )
          .join("")}
      </div>
    `;
  };

  for (let dado of itensDaPagina) {
    let article = document.createElement("article");
    article.classList.add("card");
    article.style.animation = "fadeIn 0.5s ease-in-out";
    article.innerHTML = `
      <h2>
        ${
          dado.logo
            ? `<img src="${dado.logo}" alt="Logo ${
                dado.nome
              }" class="card-logo ${
                // Apenas aplica o filtro se o logo for do simple-icons
                dado.logo.startsWith(
                  "https://cdn.jsdelivr.net/npm/simple-icons"
                )
                  ? "monochrome-logo"
                  : ""
              }">`
            : ""
        }
        ${dado.nome}
      </h2>
      <p><strong>Ano:</strong> ${dado.ano}</p>  
      <p>${dado.descrição}</p>
      <a href="${
        dado.link
      }" target="_blank" rel="noopener noreferrer">Acessar documentação <span class="external-link-icon">↗</span></a>
      ${tagsHTML(dado.tags)}
      `;

    cardContainer.appendChild(article);
  }
}

function renderizarPaginacao() {
  const paginationContainer = document.querySelector("#pagination-container");
  const totalPaginas = Math.ceil(dadosAtuais.length / itensPorPagina);

  paginationContainer.innerHTML = ""; // Limpa a paginação existente

  if (totalPaginas <= 1) return; // Não mostra paginação se só houver 1 página

  // Botão "Início"
  const btnInicio = document.createElement("button");
  btnInicio.textContent = "Início";
  btnInicio.classList.add("pagination-btn");
  btnInicio.disabled = paginaAtual === 1;
  btnInicio.addEventListener("click", () => {
    if (paginaAtual > 1) {
      paginaAtual = 1;
      renderizarPagina();
      window.scrollTo(0, 0); // Rola para o topo
    }
  });
  paginationContainer.appendChild(btnInicio);

  // Botão "Anterior"
  const btnAnterior = document.createElement("button");
  btnAnterior.textContent = "Anterior";
  btnAnterior.classList.add("pagination-btn");
  btnAnterior.disabled = paginaAtual === 1;
  btnAnterior.addEventListener("click", () => {
    if (paginaAtual > 1) {
      paginaAtual--;
      renderizarPagina();
      window.scrollTo(0, 0); // Rola para o topo
    }
  });
  paginationContainer.appendChild(btnAnterior);

  // Informação da página
  const infoPagina = document.createElement("span");
  infoPagina.textContent = `Página ${paginaAtual} de ${totalPaginas}`;
  infoPagina.classList.add("page-info");
  paginationContainer.appendChild(infoPagina);

  // Botão "Próxima"
  const btnProxima = document.createElement("button");
  btnProxima.textContent = "Próxima";
  btnProxima.classList.add("pagination-btn");
  btnProxima.disabled = paginaAtual === totalPaginas;
  btnProxima.addEventListener("click", () => {
    if (paginaAtual < totalPaginas) {
      paginaAtual++;
      renderizarPagina();
      window.scrollTo(0, 0); // Rola para o topo
    }
  });
  paginationContainer.appendChild(btnProxima);

  // Botão "Fim"
  const btnFim = document.createElement("button");
  btnFim.textContent = "Fim";
  btnFim.classList.add("pagination-btn");
  btnFim.disabled = paginaAtual === totalPaginas;
  btnFim.addEventListener("click", () => {
    if (paginaAtual < totalPaginas) {
      paginaAtual = totalPaginas;
      renderizarPagina();
      window.scrollTo(0, 0); // Rola para o topo
    }
  });
  paginationContainer.appendChild(btnFim);
}

function filtrarErenderizar(termoBuscado) {
  // Agora, esta função apenas dispara a aplicação de todos os filtros
  aplicarFiltrosEOrdenacao(true);
}

