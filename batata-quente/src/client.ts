import * as dotenv from 'dotenv';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { ProtoGrpcType } from './proto/batataquente';
// import { ServerMessage } from './proto/example_package/ServerMessage';
import logger from './logger';
import { getChanellCredentials, getHost, loadBatataQuenteDefinition } from './grpcUtils';
import readline from 'readline';
import { EntrarNaBrincadeiraReply } from './proto/EntrarNaBrincadeiraReply';
import { Jogador } from './proto/Jogador';
import { Interacao } from './proto/Interacao';
import { metadataKeys } from './servicesHandlers';
import { CallMetadataGenerator } from '@grpc/grpc-js/build/src/call-credentials';

// configurando o ambiente
dotenv.config();

const readlineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const host = getHost();
logger.logInfo(`Connecting host: ${host}`);

const proto = loadBatataQuenteDefinition();
const client = new proto.BatataQuenteService(
    host,
    getChanellCredentials()
);

const deadline = new Date();
deadline.setSeconds(deadline.getSeconds() + 5);
client.waitForReady(deadline, (error?: Error) => {
    if (error) 
        return logger.logInfo(`Client connect error: ${error.message}`);
    onClientReady();
});

function isEntraraNaBrincadeiraReply(value: any): value is EntrarNaBrincadeiraReply {
    return value !== undefined 
    && typeof value['success'] === 'boolean'
    && (typeof value['authtoken'] === 'string' || typeof value['authtoken'] === 'undefined')
    && (typeof value['message'] === 'string' || typeof value['message'] === 'undefined')
}

// REQUISICOES PARA O CLIENT

const entrarNaBrincadeira = (jogador: Jogador) => new Promise((
    resolve: (value: EntrarNaBrincadeiraReply) => any, 
    reject: (error: string) => any) => {
    client.EntrarNaBrincadeira(jogador, 
        (err, response) => {
            if (err)
                return reject(err.message);
            if (response === undefined)
                return reject(`Error: response is undefined.`);
            resolve(response);
        })
});

// INTERACAO COM O USUARIO

const getUserName = () => new Promise((resolve: (value: string) => any) => {
    readlineInterface.question(`What's tour name? \n`, resolve);
});

async function onClientReady() {
    /**
     * 1 - pedir para informar nick
     * 2 - verificar se pode usar esse nick
     * se nao 
     *  3 - volta pro passo 1
     * 4 - entra na brincadeira. 
     *  stream de dados entre o server e o client
     *  2 threads
     *  
     * 1 interface
     * 2(stream) comunicacao com o server
     */
    let name = '';
    let brincadeiraData: EntrarNaBrincadeiraReply | undefined;
    do {
        name = await getUserName();
        const entrarNaBrincadeiraResponse = await entrarNaBrincadeira({name}).catch((error: string) => ({message: error}));
        if (isEntraraNaBrincadeiraReply(entrarNaBrincadeiraResponse)) 
        {
            brincadeiraData = entrarNaBrincadeiraResponse;
        }
        else
            logger.logInfo(`o nome ${name} não  pode ser utilizado.`);
    } while (brincadeiraData == undefined)
    logger.logInfo(`o nome ${name} pode ser utilizado.`);
    logger.logInfo(`conectando no server com o token: ${brincadeiraData.authtoken}`);
    const authtoken = brincadeiraData.authtoken;
    const authenticationMetadaGenerator: CallMetadataGenerator = (
        _params: any, 
        callback: (
            param: null, 
            metadata: grpc.Metadata
        ) => void
    ) => {
        const meta = new grpc.Metadata();
        meta.add(metadataKeys.clientAuthToken, authtoken || '');
        callback(null, meta);
    }
    const callCreds = grpc.credentials.createFromMetadataGenerator(authenticationMetadaGenerator);
    const brincadeiraStream = client.brincar({credentials: callCreds});
    // verificando se ja nao começou fechada
    if (brincadeiraStream.closed) {
        logger.logInfo(`not possible connect to the server`);
        process.exit();
    }
    brincadeiraStream.on('close', () => {
        logger.logInfo(`disconnected...`);
        process.exit();
    });
    brincadeiraStream.on('data', (data: Interacao) => {
        logger.logInfo(`[${data.type}]${data.jogadorName} - ${data.aditionalData}`);
    });
    readlineInterface.on('line', line => {
        brincadeiraStream.write({type: 'message', jogadorName: name, aditionalData: line});
    });
}
