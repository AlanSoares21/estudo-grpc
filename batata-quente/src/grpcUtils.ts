import * as protoLoader from '@grpc/proto-loader';
import * as grpc from '@grpc/grpc-js';
import { ProtoGrpcType } from './proto/batataquente';
import { CallMetadataGenerator } from '@grpc/grpc-js/build/src/call-credentials';
import { metadataKeys } from './servicesHandlers';

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

export function createAuthMetadataGenerator(token: string): CallMetadataGenerator {
    return (
        _params: any, 
        callback: (
            param: null, 
            metadata: grpc.Metadata
        ) => void
    ) => {
        const meta = new grpc.Metadata();
        meta.add(metadataKeys.clientAuthToken, token);
        callback(null, meta);
    }
}

export function createClientInstance(host: string) {
    const proto = loadBatataQuenteDefinition();
    return new proto.BatataQuenteService(
        host,
        getChanellCredentials()
    );
}
