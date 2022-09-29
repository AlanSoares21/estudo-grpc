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

    chau() {
        this.stream.write({
            type: 'chau',
            jogadorName: this.jogadorName,
            aditionalData: JSON.stringify({
                jogadorName: this.jogadorName,
                clientTime: Date.now()
            })
        });
    }

    startGame() {
        this.stream.write({
            type: 'startGame',
            jogadorName: this.jogadorName
        });
    }

    onEnd(callback: () => any) {
        this.stream.on('end', callback);
        return this;
    }

    onData(callback: (data: Interacao) => any) {
        this.stream.on('data', callback);
        return this;
    }
}