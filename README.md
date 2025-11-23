# Base de Conhecimento de Linguagens de Programação
## Aviso
Este repositório é apenas para exibição e avaliação. Todos os direitos reservados; sem contribuições.
![Build](https://img.shields.io/badge/build-passing-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue) ![Deploy](https://img.shields.io/badge/deploy-vercel-black)

## Visão geral
**Base de Conhecimento de Linguagens de Programação** é uma aplicação web responsiva que organiza e apresenta informações sobre linguagens e tecnologias em um catálogo pesquisável.
Permite busca com autocomplete, filtragem por facetas, ordenação e visualização em cards com link para documentação oficial. Ideal para consultas rápidas, estudos e demonstração de padrões de UI/UX.

## Funcionalidades
- **Busca com autocomplete** para termos e linguagens.  
- **Filtragem por facetas** (tags, paradigma, ecossistema, ano) via painel de filtros avançados.  
- **Chips de filtros ativos** e resumo compacto dos filtros aplicados.  
- **Ordenação** por nome, ano e relevância.  
- **Cards de linguagem** com ano, descrição curta e link para documentação.  
- **Design responsivo** com drawer de filtros no mobile e painel lateral no desktop.  
- **Acessibilidade**: navegação por teclado, labels ARIA e contraste adequado para tema escuro.  
- **Resumo de filtros** e botão **Limpar filtros**.

## Tecnologias
**Frontend:** React; TypeScript  
**Estilização:** Tailwind CSS ou SASS  
**Componentes UI:** Material UI ou Ant Design  
**Estado e busca:** React Query ou Context API  
**Deploy:** Vercel ou Netlify

## Instalação
**Clonar e rodar localmente**
```bash
git clone https://github.com/seu-usuario/seu-repo.git
cd seu-repo
npm install
npm run dev
```

**Build para produção**
```bash
npm run build
npm run start
```

**Testes**
```bash
npm run test
```

## Estrutura sugerida
```
/src
  /components    # Search, FiltersDrawer, LanguageCard, Header
  /pages         # rotas e páginas
  /data          # seed ou mock de linguagens
  /styles        # tokens e temas

## Guia de design resumido
**Layout Desktop**  
- Header com logo e campo de busca centralizado.  
- Painel lateral com facetas colapsáveis.  
- Área principal com barra de ordenação e grid de cards.  
- Chips ativos acima do grid com botão Limpar.

**Layout Mobile**  
- Header compacto com campo de busca.  
- Botão fixo **Filtrar** que abre um drawer full-screen.  
- Grid em 1 coluna; cards com CTA claro para documentação.

**Comportamento dos filtros**  
- Exibir **apenas chips ativos** no topo; filtros adicionais ficam em painel.  
- Filtros leves aplicam em tempo real; filtros custosos usam botão **Aplicar**.  
- Mostrar contadores de resultados por filtro.  
- Oferecer scroll horizontal para chips quando necessário.

