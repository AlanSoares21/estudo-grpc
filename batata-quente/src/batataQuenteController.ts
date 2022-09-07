import { Jogador } from "./proto/Jogador";
import { CommomReply } from "./proto/CommomReply";
import {IServerState} from "./ServerState";
import { Interacao } from "./proto/Interacao";
import logger from "./logger";

function jaExisteJogadorComEsseNome(serverState: IServerState, jogador: Jogador) {
    return serverState.filterJogadoresByname(jogador.name).length > 0;
}

export default {
    possoEntrarNaBrincadeira (serverState: IServerState, jogador: Jogador): CommomReply {
        // verificando se nao tem jogadores com esse nome na brincadeira
        if (jaExisteJogadorComEsseNome(serverState, jogador))
            return {
                success: false,
                message: `Já existe um ${jogador.name} no jogo...`
            }
        return {success: true};
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