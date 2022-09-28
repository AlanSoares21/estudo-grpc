
# Batata Quente

A finalidade desse repo era aprender sobre gRPC, para isso foi iniciado a criação de um serviço gRPC que permitisse que os clients conectassem com o server e jogassem batata quente.

Hoje a aplicação consiste somente em um chat entre os clients conectados.

## Como rodar

 1. Clone o repositório 
 2. Entre no diretório batata-quente  
 3. Execute o comando `npm install -A` 
 4. Crie um arquivo `.env` e preencha ele com o conteúdo do arquivo `.env.sample` preencha os valores para as variáveis de ambiente do arquivo `.env`. Obs: a variável `SERVER_HOST` deve ser preenchida seguindo o formato `ip_do_server:porta_de_execução`, e  a variável `JWT_PRIVATE_KEY` só é necessária para rodar o servidor.
 5. Execute o comando `npm run start` para rodar o client ou `npm run start:server` para rodar o servidor.

 
