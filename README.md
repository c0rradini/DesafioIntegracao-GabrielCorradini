#DesafioIntegracao-GabrielCorradini

> Desafio de integrar uma planilha do Google com a plataforma Hubspot.

##Pré-requisitos

- NodeJS instalado globalmente na versão mais recente.
- Express como dependencia.
- Conta na plataforma HubSpot.
- Chave no Google com API habilitada.
- Planilha do Google compartilhada com o email de uma conta de serviços do próprio Google.

Antes de começar, verifique se você atendeu aos seguintes requisitos:
* Você instalou a versão mais recente do NodeJS.

##Para instalar e utilizar o projeto, siga estas etapas:

- Clone do projeto em uma pasta.
- Renomear o arquivo '.env.example' para '.env'.
- Popular com as credenciais, sendo elas, a primeira: 
  - Chave API do HubSpot.
  - Seed da planilha do Google.
  - Porta para hospedagem do Express.
- Popular a planilha do Google com os dados desejados nas colunas:
  - A: Nome da Empresa.
  - B: Nome do Colaborador.
  - C: E-mail institucional.
  - D: Telefone.
  - E: Site institucional.
- Para aplicar os cadastros, use: 'npm start' no terminal na pasta que foi clonado o projeto.
  - Para iniciar em modo de desenvolvimento, utilize: 'npm run dev'.
- Para integrar a aplicação, acesse o endpoint '/sync' com a porta informada no arquivo '.env'.
