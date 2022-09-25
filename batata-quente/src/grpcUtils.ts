import * as protoLoader from '@grpc/proto-loader';
import * as grpc from '@grpc/grpc-js';
import { ProtoGrpcType } from './proto/batataquente';

export function getHost(): string {
    return process.env.SERVER_HOST;
}

export function loadBatataQuenteDefinition(): ProtoGrpcType {
    const packageDefinition = protoLoader.loadSync('./proto/batataquente.proto');
    return grpc.loadPackageDefinition(
        packageDefinition
    ) as unknown as ProtoGrpcType;
};

export function getServerCredentials(): grpc.ServerCredentials {
    return grpc.ServerCredentials.createInsecure();
}

export function getChanellCredentials(): grpc.ChannelCredentials {
    return grpc.credentials.createInsecure();
}
