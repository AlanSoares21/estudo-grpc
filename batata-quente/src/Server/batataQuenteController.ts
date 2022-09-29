import { Jogador } from "../proto/Jogador";
import { EntrarNaBrincadeiraReply } from "../proto/EntrarNaBrincadeiraReply";
import {IServerState} from "./ServerState";
import { Interacao } from "../proto/Interacao";
import logger from "../logger";
import jwt from 'jsonwebtoken';
import interacoesHandlers from "./interacoesHandlers";

function jaExisteJogadorComEsseNome(serverState: IServerState, jogador: Jogador) {
    return serverState.filterJogadoresByname(jogador.name).length > 0;
}

function createJogadorAuthToken(jogador: Jogador) {
    // tempo até o token expirar
    const expiresIn = Math.floor(Date.now() / 1000) + (60 * 60);
    // criando token de autenticação
    return jwt.sign(jogador, process.env.JWT_PRIVATE_KEY, { expiresIn });
}

function decodeAuthToken(token: string): string | jwt.JwtPayload | null {
    return jwt.decode(token);
}

export default {
    EntrarNaBrincadeira (serverState: IServerState, jogador: Jogador): EntrarNaBrincadeiraReply {
        // verificando se nao tem jogadores com esse nome na brincadeira
        if (jaExisteJogadorComEsseNome(serverState, jogador))
        return {
            success: false,
            message: `Já existe um ${jogador.name} no jogo...`
        }
        const authtoken = createJogadorAuthToken(jogador);
        return {success: true, authtoken};
    },
    handleNewInteracao (serverState: IServerState, newInteracao: Interacao)  {
        logger.logInfo(`Nova interação ${newInteracao.type} do jogador ${newInteracao.jogadorName}`);
        if (newInteracao.type === undefined)
            return logger.logError(`A interação do jogador ${newInteracao.jogadorName} tem type nulo.`);
        // obtendo o handler para a interacao
        const interacaoHandler = interacoesHandlers[newInteracao.type];
        if (interacaoHandler === undefined)
            return logger.logError(` A interação ${newInteracao.type} do jogador ${newInteracao.jogadorName} não tem um handler cadastrado.`)
        // executando handler da interacao
        interacaoHandler(serverState, newInteracao);
    },
    getJogadorDataFromAuthToken(token: string): undefined | Jogador {
        const data = decodeAuthToken(token);
        if (data === null || typeof data === 'string' || data.exp === undefined) {
            logger.logInfo(`Não foi possivel decodificar o token. token decoded data type: ${typeof data}. Token: ${token}`)
            return;
        }
        if (data.exp * 1000 < Date.now()) {
            logger.logInfo(`token expirado. Expirava em ${data.exp * 1000}. Token: ${token}`)
            return;
        }
        return data as Jogador;
    }
}