import {ServerUnaryCall, sendUnaryData, ServerDuplexStream, ServerErrorResponse, StatusObject} from '@grpc/grpc-js';
import {BatataQuenteServiceHandlers} from './proto/BatataQuenteService';
import { CommomReply } from './proto/CommomReply';
import { Interacao, Interacao__Output } from './proto/Interacao';
import { Jogador__Output } from './proto/Jogador';
import logger from './logger';
import serverState from './serverState';
import batataQuenteController from './batataQuenteController';

type GrpcError = ServerErrorResponse | Partial<StatusObject> | null;

export const batataQuenteServiceHandlers: BatataQuenteServiceHandlers = {
    PossoEntrarNaBrincadeira (call: ServerUnaryCall<Jogador__Output, CommomReply>, callback: sendUnaryData<CommomReply>): void {
        let response: CommomReply = {};
        let error: GrpcError = null;
        try {
            logger.logInfo(`jogador ${call.request.name} quer entrar na brincadeira`);
            response = batataQuenteController.possoEntrarNaBrincadeira(call.request);
            logger.logInfo(`jogador ${call.request.name} entrou na brincadeira: ${response.success || response.message}`);
        }
        catch (err) {
            error = err as Error;
            logger.logError(`Erro quando o jogador ${call.request.name} perguntou se podia entrar na brincadeira. Error: ${error.message} \n ${error.stack}`);
        }
        callback(error, response);
    },
    EntrarNaBrincadeira (call: ServerDuplexStream<Interacao__Output, Interacao>): void {
        throw new Error('Function not implemented.');
    }
}