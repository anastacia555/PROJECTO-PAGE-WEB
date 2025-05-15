Modelo de Documentação para Aplicação Front-end
1. Introdução
Esta documentação descreve os aspetos relevantes da aplicação Front-end do projeto Planejamento de Carreira Educacional, incluindo suas funcionalidades, estrutura, tecnologias utilizadas, e instruções para uso e manutenção. O objetivo é fornecer um guia claro para desenvolvedores, mantenedores e usuários interessados em entender ou contribuir para o projeto.
2. Informações Gerais
•	Nome da aplicação: Planejamento de Carreira Educacional
•	Objetivo principal: facilitar o planejamento de carreiras educacionais por meio do cadastro de usuários, metas, progresso, chat de mentoria e relatórios administrativos.
•	Público-alvo: Estudantes, docentes, profissionais em busca de planejamento educacional e administradores educacionais.
•	Tecnologias utilizadas: HTML, CSS, JavaScript (frameworks como bootstrap ou Vue), WebSocket (para o chat), Fetch API (para comunicação com o backend).
3. Instalação e Configuração
Descreve os passos necessários para instalar e executar a aplicação localmente:
•	Pré-requisitos:
o	Node.js (versão 14.x ou superior)
o	npm (geralmente instalado com Node.js)
•	Comandos de instalação:
o	Navegue até o diretório do projeto:
cd C:\Users\ANASTACIA\Desktop\projecto-pagina-web
o	Instale as dependências:
npm install
•	Como iniciar o projeto:
o	Inicie o servidor:
npm start
o	Acesse a aplicação em http://localhost:3000.
•	Configuração de variáveis de ambiente:
o	Não há variáveis de ambiente específicas. O token de administrador padrão é admin123 para acesso ao painel de administração (admin.html).
4. Estrutura do Projeto
Explica a organização das pastas e ficheiros:
/projecto-pagina-web
  ├── /server
  │   ├── /data (armazena arquivos JSON: users.json, goals.json, progress.json, adminLogs.json, chatHistory.json)
  │   ├── app.js (servidor principal)
  │   ├── routes.js (lógica de rotas e manipulação de dados)
  ├── /public
  │   ├── index.html (página principal com formulários de cadastro)
  │   ├── chat.html (página de chat de mentoria)
  │   ├── admin.html (painel de administração com relatórios)
  │   ├── script.js (lógica JavaScript do frontend)
  │   ├── estilo.css (estilos CSS globais e específicos)
  ├── package. json (configurações e dependências do projeto)
  ├── package-lock.json (lockfile das dependências)
5. Funcionalidades
Lista e descreve cada funcionalidade implementada na aplicação Front-end:
•	Página de Cadastro (index.html):
o	Cadastro de usuários (nome, email, tipo, curso, nível educacional).
o	Cadastro de metas (descrição, data de início, prazo, categoria, status), associadas a um usuário.
o	Cadastro de progresso (texto, data, percentagem concluída), associado a um usuário.
•	Chat de Mentoria (chat.html):
o	Interface para troca de mensagens em tempo real via WebSocket.
o	Exibe histórico de mensagens com nome do remetente e conteúdo formatado em "bolhas".
o	Permite envio de mensagens com nome de usuário e texto.
•	Painel de Administração (admin.html):
o	Autenticação simples (usuário: "Ana", senha: "1234", token: admin123).
o	Lista de metas com opções para editar ou excluir.
o	Relatórios de acompanhamento de metas (percentagem por status: em progresso, concluídas, atrasadas, etc.).
o	Relatórios de utilização e envolvimento (metas criadas vs. concluídas, uso do chat, ações por tipo de usuário).
o	Exibição de logs administrativos (ações como criação, atualização e exclusão de metas).
•	Responsividade:
o	Design responsivo básico implementado via CSS, com ajustes para telas menores (ex.: navbar empilhada em dispositivos móveis).
•	Integração com APIs:
o	Comunicação com o backend via Fetch API (endpoints: /api/users, /api/goals, /api/progress, /api/data, /api/chatHistory).
o	WebSocket para chat em tempo real (ws://localhost:3000).
6. Documentação de Código
Explica como o código está comentado e documentado:
•	O código JavaScript (script.js) inclui comentários inline explicando funções principais, como saveUser(), saveGoal(), saveProgress(), e loadChatHistory ().
•	No admin.html e chat.html, os scripts inline contêm comentários implícitos na estrutura (ex.: nomes de funções descritivas como updateGoal() e deleteGoal()).
•	Boas práticas adotadas: validação de entrada nos formulários, tratamento de erros com try/catch no backend (visível em routes.js), e uso de console.error para depuração.
•	Ferramentas como JSDoc não foram utilizadas, mas a estrutura do código é clara e autoexplicativa.
7. Testes
Descreve os testes realizados:
•	Tipos de testes:
o	Testes manuais realizados para verificar o cadastro de usuários, metas e progresso, além da funcionalidade do chat e relatórios no painel de administração.
o	Testes de integração manual para garantir que as requisições Fetch e WebSocket funcionem corretamente com o backend.
•	Ferramentas utilizadas:
o	Nenhum framework de teste (ex.: Jest) foi implementado; testes foram feitos diretamente na interface.
•	Como executar os testes:
o	Testes manuais podem ser realizados acessando http://localhost:3000, preenchendo os formulários e verificando os arquivos JSON em server/data/.
o	Para o chat, envie mensagens em chat.html e confirme que elas aparecem no histórico.
o	Para o admin, acesse admin.html, insira as credenciais e verifique os relatórios.
8. Hospedagem
Indica onde a aplicação foi hospedada e os passos seguidos para o deploy:
•	Hospedagem:
o	A aplicação não foi hospedada publicamente; está funcionando apenas localmente em http://localhost:3000.
•	Comandos usados:
o	Não aplicável para deploy; o projeto é executado localmente com npm start.
•	Configuração de domínio:
o	Não configurado.
•	Link de acesso à aplicação:
o	http://localhost:3000 (apenas local).
9. Conclusão
Resumo final da aplicação, lições aprendidas durante o desenvolvimento e sugestões para melhorias futuras:
•	Resumo:
A aplicação Front-end do Planejamento de Carreira Educacional oferece uma interface funcional para cadastro de usuários, metas e progresso, além de um chat de mentoria e um painel administrativo com relatórios detalhados. A integração com o backend via Fetch e WebSocket é eficiente para um projeto local.
•	Lições aprendidas:
o	A importância de configurar corretamente o CORS e o servidor para evitar erros como "Failed to fetch".
o	A necessidade de validação rigorosa de entrada para prevenir falhas no salvamento de dados.
o	A relevância de estilos consistentes para melhorar a experiência do usuário (ex.: ajustes na navbar e nos formulários).
•	Sugestões para melhorias futuras:
o	Implementar um framework como React para melhor organização e reutilização de componentes.
o	Adicionar testes automatizados com Jest para garantir a robustez das funcionalidades.
o	Hospedar a aplicação em plataformas como Vercel ou Netlify para acesso público.
o	Substituir a autenticação simples (admin123) por um sistema mais seguro, como JWT.
o	Melhorar a responsividade com frameworks CSS (ex.: Bootstrap) para uma experiência mais fluida em dispositivos móveis.

