import { Jogador } from "./proto/Jogador";
import { EntrarNaBrincadeiraReply } from "./proto/EntrarNaBrincadeiraReply";
import {IServerState} from "./ServerState";
import { Interacao } from "./proto/Interacao";
import logger from "./logger";
import jwt from 'jsonwebtoken';

function jaExisteJogadorComEsseNome(serverState: IServerState, jogador: Jogador) {
    return serverState.filterJogadoresByname(jogador.name).length > 0;
}

function createJogadorAuthToken(jogador: Jogador) {
    // tempo até o token expirar
    const expiresIn = Math.floor(Date.now() / 1000) + (60 * 60);
    // criando token de autenticação
    return jwt.sign(jogador, process.env.JWT_PRIVATE_KEY, { expiresIn });
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
        serverState.addInteracao(newInteracao);
        // tratando interacao para sair da brincadeira
        if (newInteracao.type === 'chau') {
            const jogador = serverState.getJogadorObserverByName(newInteracao.jogadorName);
            if (jogador === undefined)
                return logger.logInfo(`jogador ${newInteracao.jogadorName} nao tem um observer cadastrado com o mesmo nome.`);
            serverState.removeJogador(jogador);
        }
    },
}