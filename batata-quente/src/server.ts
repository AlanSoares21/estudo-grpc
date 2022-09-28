import dotenv from 'dotenv';
import * as grpc from '@grpc/grpc-js';
import logger from './logger';
import { batataQuenteServiceHandlers } from './Server/servicesHandlers';
import { getHost, getServerCredentials, loadBatataQuenteDefinition } from './grpcUtils';

// usando arquivo .env para definir variaveis de ambiente
dotenv.config();

const host = getHost();
logger.logInfo(`Server host: ${host}`);

function createServer(): grpc.Server {
    // carregando definicao do .proto
    const proto = loadBatataQuenteDefinition();
    const server = new grpc.Server();
    server.addService(proto.BatataQuenteService.service, batataQuenteServiceHandlers);
    return server;
}
    
// iniciando server
const server = createServer();
server.bindAsync(
    host, 
    getServerCredentials(),
    (err, port) => {
        if (err) {
            logger.logError(`Erro no bind do servidor: ${err.message}`);
        } else {
            logger.logInfo(`Server bound on port: ${port}`);
            server.start();
        }
    }
);
