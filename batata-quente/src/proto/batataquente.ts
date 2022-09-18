import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { BatataQuenteServiceClient as _BatataQuenteServiceClient, BatataQuenteServiceDefinition as _BatataQuenteServiceDefinition } from './BatataQuenteService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  BatataQuenteService: SubtypeConstructor<typeof grpc.Client, _BatataQuenteServiceClient> & { service: _BatataQuenteServiceDefinition }
  EntrarNaBrincadeiraReply: MessageTypeDefinition
  Interacao: MessageTypeDefinition
  Jogador: MessageTypeDefinition
}

