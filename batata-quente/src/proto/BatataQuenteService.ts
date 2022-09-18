// Original file: proto/batataquente.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { EntrarNaBrincadeiraReply as _EntrarNaBrincadeiraReply, EntrarNaBrincadeiraReply__Output as _EntrarNaBrincadeiraReply__Output } from './EntrarNaBrincadeiraReply';
import type { Interacao as _Interacao, Interacao__Output as _Interacao__Output } from './Interacao';
import type { Jogador as _Jogador, Jogador__Output as _Jogador__Output } from './Jogador';

export interface BatataQuenteServiceClient extends grpc.Client {
  Brincar(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_Interacao, _Interacao__Output>;
  Brincar(options?: grpc.CallOptions): grpc.ClientDuplexStream<_Interacao, _Interacao__Output>;
  brincar(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_Interacao, _Interacao__Output>;
  brincar(options?: grpc.CallOptions): grpc.ClientDuplexStream<_Interacao, _Interacao__Output>;
  
  EntrarNaBrincadeira(argument: _Jogador, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_EntrarNaBrincadeiraReply__Output>): grpc.ClientUnaryCall;
  EntrarNaBrincadeira(argument: _Jogador, metadata: grpc.Metadata, callback: grpc.requestCallback<_EntrarNaBrincadeiraReply__Output>): grpc.ClientUnaryCall;
  EntrarNaBrincadeira(argument: _Jogador, options: grpc.CallOptions, callback: grpc.requestCallback<_EntrarNaBrincadeiraReply__Output>): grpc.ClientUnaryCall;
  EntrarNaBrincadeira(argument: _Jogador, callback: grpc.requestCallback<_EntrarNaBrincadeiraReply__Output>): grpc.ClientUnaryCall;
  entrarNaBrincadeira(argument: _Jogador, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_EntrarNaBrincadeiraReply__Output>): grpc.ClientUnaryCall;
  entrarNaBrincadeira(argument: _Jogador, metadata: grpc.Metadata, callback: grpc.requestCallback<_EntrarNaBrincadeiraReply__Output>): grpc.ClientUnaryCall;
  entrarNaBrincadeira(argument: _Jogador, options: grpc.CallOptions, callback: grpc.requestCallback<_EntrarNaBrincadeiraReply__Output>): grpc.ClientUnaryCall;
  entrarNaBrincadeira(argument: _Jogador, callback: grpc.requestCallback<_EntrarNaBrincadeiraReply__Output>): grpc.ClientUnaryCall;
  
}

export interface BatataQuenteServiceHandlers extends grpc.UntypedServiceImplementation {
  Brincar: grpc.handleBidiStreamingCall<_Interacao__Output, _Interacao>;
  
  EntrarNaBrincadeira: grpc.handleUnaryCall<_Jogador__Output, _EntrarNaBrincadeiraReply>;
  
}

export interface BatataQuenteServiceDefinition extends grpc.ServiceDefinition {
  Brincar: MethodDefinition<_Interacao, _Interacao, _Interacao__Output, _Interacao__Output>
  EntrarNaBrincadeira: MethodDefinition<_Jogador, _EntrarNaBrincadeiraReply, _Jogador__Output, _EntrarNaBrincadeiraReply__Output>
}
