import { ClientDuplexStream } from "@grpc/grpc-js";
import { Interacao, Interacao__Output } from "../proto/Interacao";

export default class BrincarStreamWrapper {
    private stream: ClientDuplexStream<Interacao, Interacao__Output>;
    private jogadorName: string;
    
    constructor(
        stream: ClientDuplexStream<Interacao, Interacao__Output>, 
        jogadorName: string
    ) {
        this.stream = stream;
        this.jogadorName = jogadorName;
    }
    
    sendMessage(message: string) {
        this.stream.write({type: 'message', jogadorName: this.jogadorName, aditionalData: message});
    }

    onClose(callback: () => any) {
        this.stream.on('close', callback);
        return this;
    }

    onData(callback: (data: Interacao) => any) {
        this.stream.on('data', callback);
        return this;
    }
}