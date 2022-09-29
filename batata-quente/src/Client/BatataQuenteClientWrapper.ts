import { CallCredentials } from "@grpc/grpc-js";
import { BatataQuenteServiceClient } from "../proto/BatataQuenteService";
import { EntrarNaBrincadeiraReply } from "../proto/EntrarNaBrincadeiraReply";
import { Jogador } from "../proto/Jogador";
import BrincarStreamWrapper from "./BrincarStreamWrapper";

/**
 * Encapsula chamadas do client para facilitar o uso
 */
export default class BatataQuenteClientWrapper {
    private _client: BatataQuenteServiceClient;
    constructor(client: BatataQuenteServiceClient) {
        this._client = client;
    }

    entrarNaBrincadeira(jogador: Jogador): Promise<EntrarNaBrincadeiraReply> {
        return new Promise((
            resolve: (value: EntrarNaBrincadeiraReply) => any, 
            reject: (error: string) => any) => {
                this._client.EntrarNaBrincadeira(jogador, 
                    (err, response) => {
                        if (err)
                            return reject(err.message);
                        if (response === undefined)
                            return reject(`Error: response is undefined.`);
                        resolve(response);
                    }
                )
            }
        );
    }

    brincar(credentials: CallCredentials,
        jogadorName: string
    ): BrincarStreamWrapper {
        return new BrincarStreamWrapper(this._client.brincar({credentials}), jogadorName)
    }
}