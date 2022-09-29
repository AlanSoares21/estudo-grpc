import logger from "../logger";
import { Interacao } from "../proto/Interacao";
import { IServerState } from "./ServerState";

export type TInteracaoHandler = (serverState: IServerState, interacao: Interacao) => any;

const interacoesHandlers: {
    [interacaoType: string]: TInteracaoHandler | undefined;
} = {
    'chau': (serverState, interacao) => {
        const jogador = serverState.getJogadorObserverByName(interacao.jogadorName);
        if (jogador === undefined)
            return logger.logInfo(`jogador ${interacao.jogadorName} nao tem um observer cadastrado com o mesmo nome.`);
        serverState.notifyJogadores(interacao);
        serverState.removeJogador(jogador);
    },
    'message': (serverState, interacao) => serverState.notifyJogadores(interacao)
};

export default interacoesHandlers;
