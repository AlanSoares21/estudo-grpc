import {ServerUnaryCall, sendUnaryData, ServerDuplexStream, ServerErrorResponse, StatusObject} from '@grpc/grpc-js';
import {BatataQuenteServiceHandlers} from './proto/BatataQuenteService';
import { EntrarNaBrincadeiraReply } from './proto/EntrarNaBrincadeiraReply';
import { Interacao, Interacao__Output } from './proto/Interacao';
import { Jogador__Output } from './proto/Jogador';
import logger from './logger';
import ServerState, { IJogadorObserver } from './ServerState';
import batataQuenteController from './batataQuenteController';

export const metadataKeys = {
    clientAuthToken: 'AUTHORIZATION'
}

type GrpcError = ServerErrorResponse | Partial<StatusObject> | null;

const serverState = new ServerState();

export const batataQuenteServiceHandlers: BatataQuenteServiceHandlers = {
    EntrarNaBrincadeira (call: ServerUnaryCall<Jogador__Output, EntrarNaBrincadeiraReply>, callback: sendUnaryData<EntrarNaBrincadeiraReply>): void {
        let response: EntrarNaBrincadeiraReply = {};
        let error: GrpcError = null;
        try {
            logger.logInfo(`jogador ${call.request.name} quer entrar na brincadeira`);
            response = batataQuenteController.EntrarNaBrincadeira(serverState, call.request);
            logger.logInfo(`jogador ${call.request.name} entrou na brincadeira: ${response.success || response.message}`);
        }
        catch (err) {
            error = err as Error;
            logger.logError(`Erro quando o jogador ${call.request.name} perguntou se podia entrar na brincadeira. Error: ${error.message} \n ${error.stack}`);
        }
        callback(error, response);
    },
    Brincar (call: ServerDuplexStream<Interacao__Output, Interacao>): void {
        const peer = call.getPeer();
        logger.logInfo(`new peer connected: ${peer}`);
        
        // recuperando o token de autenticação
        const authtokenMetadataList = call.metadata.get(metadataKeys.clientAuthToken);
        if (authtokenMetadataList.length === 0) {
            logger.logInfo(`O peer ${peer} não forneceu token de autenticação, portanto a chamada foi encerrada.`);
            call.end();
            return;
        }
        const authtoken = authtokenMetadataList[0].toString();
        logger.logInfo(`Peer ${peer} autenticou com o token token: ${authtoken}`);

        // extraindo dados do jogador do token de autenticação
        const jogadorData = batataQuenteController.getJogadorDataFromAuthToken(authtoken);
        if (jogadorData === undefined) {
            logger.logInfo(`O peer ${peer} forneceu token de autenticação, mas não foi possivel recuperar os dados do jogador autenticado com o token ${authtoken}`);
            call.end();
            return;
        }
        logger.logInfo(`Peer ${peer} é o usuário ${jogadorData.name}`);

        const novoJogador: IJogadorObserver = {
            data: jogadorData,
            sendNewInteracao: i => {
                logger.logInfo(`enviando interacao ${i.type} do jogador ${i.jogadorName} para o jogador ${novoJogador.data.name}. Adicional: ${i.aditionalData}`);
                call.write(i)
            },
            onExit: () => {
                logger.logInfo(`finalizando call para o jogador ${novoJogador.data.name}`);
                call.end()
            }
        };
        // registra que o jogador entrou na brincadeira
        serverState.addJogador(novoJogador);

        const onData = (interacao: Interacao) => batataQuenteController.handleNewInteracao(serverState, interacao);

        // trata as interacoes que chegaram do usuario
        call.on('data', onData);
    }
}