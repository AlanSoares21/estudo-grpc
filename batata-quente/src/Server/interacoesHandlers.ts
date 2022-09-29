import { TStartEvent } from "../additionalDataTypes";
import logger from "../logger";
import { Interacao } from "../proto/Interacao";
import { IServerState } from "./ServerState";

export type TInteracaoHandler = (serverState: IServerState, interacao: Interacao) => any;

const regitreInteracaoAndNotifyJogadores: TInteracaoHandler = (serverState, interacao) => {
    serverState.addInteracao(interacao);
    serverState.notifyJogadores(interacao);
}

function sendServerMessage(serverState: IServerState, message: string) {
    regitreInteracaoAndNotifyJogadores(
        serverState, 
        {
            type: 'message',
            jogadorName: 'Server',
            aditionalData: message
        }
    );
}

function getRandomIntegerLessThan(limit: number) {
    return Math.round(Math.random() * limit);
}

const interacoesHandlers: {
    [interacaoType: string]: TInteracaoHandler | undefined;
} = {
    'chau': (serverState, interacao) => {
        const jogador = serverState.getJogadorObserverByName(interacao.jogadorName);
        if (jogador === undefined)
            return logger.logInfo(`jogador ${interacao.jogadorName} nao tem um observer cadastrado com o mesmo nome.`);
            regitreInteracaoAndNotifyJogadores(serverState, interacao);
        serverState.removeJogador(jogador);
    },
    'message': regitreInteracaoAndNotifyJogadores,
    'startGame': (serverState, interacao) => {
        /**
         * verifica se o jogo já foi iniciado
         * se foi 
         *  manda menssagem informando que o jogo já foi iniciado
         *  para o processo
         * escolhe um jogador aleatório
         * registra no server state que esse jogador está com a batata
         * registra no aditional data da interação qual jogador está com a batata
         * registra e notifica a interação 
         */
        if (serverState.gameIsStarted())
            return sendServerMessage(serverState, `O jogador ${interacao.jogadorName} tentou iniciar o jogo, mas o jogo já foi iniciado.`);
        const jogadores = serverState.listJogadores();
        // selecionando jogador aleatorio
        const jogador = jogadores[getRandomIntegerLessThan(jogadores.length)];
        // definindo quem esta com a batata
        serverState.setJogadorComBatata(jogador);
        // montando informacoes do aditional data
        const startEvent: TStartEvent = { jogadorComBatata: jogador.name || 'name não informado' };
        interacao.aditionalData = JSON.stringify(startEvent);
        // registrando interação
        regitreInteracaoAndNotifyJogadores(serverState, interacao);
    }
};

export default interacoesHandlers;
