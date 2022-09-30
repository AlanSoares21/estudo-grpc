import * as dotenv from 'dotenv';
import logger from './logger';
import { createClientInstance, getHost } from './grpcUtils';
import readline from 'readline';
import BatataQuenteClientWrapper from './Client/BatataQuenteClientWrapper';
import ClientController from './Client/ClientController';

// configurando o ambiente
dotenv.config();

try {
    const host = getHost();
    logger.logInfo(`Connecting host: ${host}`);
    const readlineInterface = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    const client = createClientInstance(host);
    const deadline = dateFiveSecondsAfterNow();
    client.waitForReady(deadline, (error?: Error) => {
        if (error) 
            return logger.logInfo(`Client connect error: ${error.message}`);
        onClientReady(new BatataQuenteClientWrapper(client), readlineInterface)
    });
}
catch (err) {
    logger.logError(`global: ${err}`);
}

async function onClientReady(client: BatataQuenteClientWrapper, readlineInterface: readline.Interface) {    
    const clientController = new ClientController(client, readlineInterface);
    // autenticando
    const { authData, name } = await clientController.authenticate();
    logger.logInfo(`O nome utilizado pelo jogador é: ${name}.`);
    logger.logInfo(`Conectando no server com o token: ${authData.authtoken}`);
    if (authData.authtoken === undefined) {
        logger.logError(`O token de autenticação está vazio. AuthToken: ${authData.authtoken}`);
        return process.exit();
    }
    // brincando
    clientController.brincar(authData.authtoken, name)
}

function dateFiveSecondsAfterNow() {
    const value = new Date();
    value.setSeconds(value.getSeconds() + 5);
    return value;
}