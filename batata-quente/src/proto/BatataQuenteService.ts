// Original file: proto/batataquente.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { CommomReply as _CommomReply, CommomReply__Output as _CommomReply__Output } from './CommomReply';
import type { Interacao as _Interacao, Interacao__Output as _Interacao__Output } from './Interacao';
import type { Jogador as _Jogador, Jogador__Output as _Jogador__Output } from './Jogador';

export interface BatataQuenteServiceClient extends grpc.Client {
  EntrarNaBrincadeira(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_Interacao, _Interacao__Output>;
  EntrarNaBrincadeira(options?: grpc.CallOptions): grpc.ClientDuplexStream<_Interacao, _Interacao__Output>;
  entrarNaBrincadeira(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_Interacao, _Interacao__Output>;
  entrarNaBrincadeira(options?: grpc.CallOptions): grpc.ClientDuplexStream<_Interacao, _Interacao__Output>;
  
  PossoEntrarNaBrincadeira(argument: _Jogador, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_CommomReply__Output>): grpc.ClientUnaryCall;
  PossoEntrarNaBrincadeira(argument: _Jogador, metadata: grpc.Metadata, callback: grpc.requestCallback<_CommomReply__Output>): grpc.ClientUnaryCall;
  PossoEntrarNaBrincadeira(argument: _Jogador, options: grpc.CallOptions, callback: grpc.requestCallback<_CommomReply__Output>): grpc.ClientUnaryCall;
  PossoEntrarNaBrincadeira(argument: _Jogador, callback: grpc.requestCallback<_CommomReply__Output>): grpc.ClientUnaryCall;
  possoEntrarNaBrincadeira(argument: _Jogador, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_CommomReply__Output>): grpc.ClientUnaryCall;
  possoEntrarNaBrincadeira(argument: _Jogador, metadata: grpc.Metadata, callback: grpc.requestCallback<_CommomReply__Output>): grpc.ClientUnaryCall;
  possoEntrarNaBrincadeira(argument: _Jogador, options: grpc.CallOptions, callback: grpc.requestCallback<_CommomReply__Output>): grpc.ClientUnaryCall;
  possoEntrarNaBrincadeira(argument: _Jogador, callback: grpc.requestCallback<_CommomReply__Output>): grpc.ClientUnaryCall;
  
}

export interface BatataQuenteServiceHandlers extends grpc.UntypedServiceImplementation {
  EntrarNaBrincadeira: grpc.handleBidiStreamingCall<_Interacao__Output, _Interacao>;
  
  PossoEntrarNaBrincadeira: grpc.handleUnaryCall<_Jogador__Output, _CommomReply>;
  
}

export interface BatataQuenteServiceDefinition extends grpc.ServiceDefinition {
  EntrarNaBrincadeira: MethodDefinition<_Interacao, _Interacao, _Interacao__Output, _Interacao__Output>
  PossoEntrarNaBrincadeira: MethodDefinition<_Jogador, _CommomReply, _Jogador__Output, _CommomReply__Output>
}
