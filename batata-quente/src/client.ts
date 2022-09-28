import * as dotenv from 'dotenv';
import logger from './logger';
import { createClientInstance, getHost } from './grpcUtils';
import readline from 'readline';
import BatataQuenteClientWrapper from './Client/BatataQuenteClientWrapper';
import ClientController from './Client/ClientController';

// configurando o ambiente
dotenv.config();

const readlineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const host = getHost();
logger.logInfo(`Connecting host: ${host}`);

const client = createClientInstance(host);

const deadline = dateFiveSecondsAfterNow();

client.waitForReady(deadline, (error?: Error) => {
    if (error) 
        return logger.logInfo(`Client connect error: ${error.message}`);
    onClientReady();
});

async function onClientReady() {    
    const clientController = new ClientController(
        new BatataQuenteClientWrapper(client), 
        readlineInterface);
    // autenticando
    const { authData, name } = await clientController.authenticate();
    logger.logInfo(`O nome utilizado pelo jogador é: ${name}.`);
    logger.logInfo(`Conectando no server com o token: ${authData.authtoken}`);
    if (authData.authtoken === undefined) {
        logger.logError(`O token de autenticação está vazio. AuthToken: ${authData.authtoken}`);
        return process.exit();
    }
    // brincando
    clientController.brincar(authData.authtoken, name);
}

function dateFiveSecondsAfterNow() {
    const value = new Date();
    value.setSeconds(value.getSeconds() + 5);
    return value;
}