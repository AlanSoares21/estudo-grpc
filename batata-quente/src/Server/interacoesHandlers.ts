import { TPassarBatataEvent, TStartEvent } from "../additionalDataTypes";
import logger from "../logger";
import { Interacao } from "../proto/Interacao";
import { IServerState } from "./ServerState";

export type TInteracaoHandler = (serverState: IServerState, interacao: Interacao) => any;

const regiterInteracaoAndNotifyJogadores: TInteracaoHandler = (serverState, interacao) => {
    serverState.addInteracao(interacao);
    serverState.notifyJogadores(interacao);
}

function sendServerMessage(serverState: IServerState, message: string) {
    regiterInteracaoAndNotifyJogadores(
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

function tryParseAdditionalData<TAdditionalData>(additionalData: Interacao['aditionalData']): TAdditionalData | undefined {
    try {
        if (additionalData === undefined)
            return undefined;
        return JSON.parse(additionalData) as TAdditionalData;
    } 
    catch (err) {
        logger.logError(`Error parsing ${additionalData}`);
        return undefined;
    }
}

const interacoesHandlers: {
    [interacaoType: string]: TInteracaoHandler | undefined;
} = {
    'chau': (serverState, interacao) => {
        const jogador = serverState.getJogadorObserverByName(interacao.jogadorName);
        if (jogador === undefined)
            return logger.logInfo(`jogador ${interacao.jogadorName} nao tem um observer cadastrado com o mesmo nome.`);
            regiterInteracaoAndNotifyJogadores(serverState, interacao);
        serverState.removeJogador(jogador);
    },
    'message': regiterInteracaoAndNotifyJogadores,
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
        regiterInteracaoAndNotifyJogadores(serverState, interacao);
    },
    'passarBatata': (serverState, interacao) => {
        /**
         * verificar se o jogador que quer passar a batata está com a batata
         * se nao
         *  envia menssagem informando que o usuario que passa a batata não está com a batata
         *  para o processo
         * verifica se no additionalData tem a informacao do nome do usuario que deve recebe a batata
         * se nao
         *  envia menssagem informando que o usuario que recebe a batata não foi informado
         *  para o processo
         * verifica se o usuario que recebe a batata esta no jogo
         * se nao
         *  envia menssagem informando que o usuario que receberia a batata nao existe e nao pode receber a batata
         *  para o processo
         * troca o registro de quem esta com a batata no serverState
         * registra e notifica a interação 
         */
        // validando se o jogador que passa a batata está com a batata
        const jogadorComBatata = serverState.getJogadorComBatata();
        if (
            jogadorComBatata === undefined 
            || jogadorComBatata.name !== interacao.jogadorName
        )
            return sendServerMessage(serverState, `${interacao.jogadorName} tentou passar a batata, mas a batata esta com ${jogadorComBatata?.name}`);
        // validando se foi informado que ira receber a batata
        const passarBatata = tryParseAdditionalData<TPassarBatataEvent>(interacao.aditionalData);
        if (passarBatata === undefined)
            return sendServerMessage(serverState, `${interacao.jogadorName} tentou passar a batata, mas não informou para quem!`);
        // validando se quem receberá a batata está no jogo
        const jogadores = serverState.filterJogadoresByname(passarBatata.jogadorRecebeBatata);
        if (jogadores.length === 0)
            return sendServerMessage(serverState, `${interacao.jogadorName} tentou passar a batata, mas ${passarBatata.jogadorRecebeBatata} não está no jogo.`);
        // alterando jogador com batata
        serverState.setJogadorComBatata(jogadores[0]);
        // registrando interação
        regiterInteracaoAndNotifyJogadores(serverState, interacao);
    }
};

export default interacoesHandlers;