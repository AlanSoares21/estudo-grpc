import dotenv from 'dotenv';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import logger from './logger';
import {ProtoGrpcType} from './proto/batataquente';
import { batataQuenteServiceHandlers } from './servicesHandlers';

// usando arquivo .env para definir variaveis de ambiente
dotenv.config();

const host = process.env.SERVER_HOST;
logger.logInfo(`Server host: ${host}`);

function createServer(): grpc.Server {
    // carregando definicao do .proto
    const packageDefinition = protoLoader.loadSync('./proto/batataquente.proto');
    const proto = grpc.loadPackageDefinition(
        packageDefinition
    ) as unknown as ProtoGrpcType;
    const server = new grpc.Server();
    server.addService(proto.BatataQuenteService.service, batataQuenteServiceHandlers);
    return server;
}
    
// iniciando server
const server = createServer();
server.bindAsync(
    host, 
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
        if (err) {
            logger.logError(`Erro no bind do servidor: ${err.message}`);
        } else {
            logger.logInfo(`Server bound on port: ${port}`);
            server.start();
        }
    }
);
