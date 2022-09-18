import {ServerUnaryCall, sendUnaryData, ServerDuplexStream, ServerErrorResponse, StatusObject} from '@grpc/grpc-js';
import {BatataQuenteServiceHandlers} from './proto/BatataQuenteService';
import { EntrarNaBrincadeiraReply } from './proto/EntrarNaBrincadeiraReply';
import { Interacao, Interacao__Output } from './proto/Interacao';
import { Jogador__Output } from './proto/Jogador';
import logger from './logger';
import ServerState, { IJogadorObserver } from './ServerState';
import batataQuenteController from './batataQuenteController';

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
        logger.logInfo(`new peer connected: ${call.getPeer()}`);
        const novoJogador: IJogadorObserver = {
            data: {},
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

        /**
         * OBS: o campo data do novoJogador deve ser preenchido,
         * porém a informação sobre quem é o jogador só chega quando uma interação é disparada,
         * as funções a baixo são a maneira encontrada para contornar esse problema,
         * porém, acredito que o ideal seja: que um metódo de autenticação seja implementado
         * e os dados o usuário sejam obtidos através da autenticação.
         * O método de autenticação não foi implementado agora por falta de conhecimento
         */

        const onData = (interacao: Interacao) => batataQuenteController.handleNewInteracao(serverState, interacao);
        
        const onDataMiddleware = (interacao: Interacao) => {
            if (novoJogador.data.name === undefined)
                novoJogador.data = { name: interacao.jogadorName };
            onData(interacao);
        }

        // trata as interacoes que chegaram do usuario
        call.on('data', onDataMiddleware);
    }
}