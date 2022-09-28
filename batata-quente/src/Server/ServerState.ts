import logger from "../logger";
import { Interacao } from "../proto/Interacao";
import { Jogador } from "../proto/Jogador";

export interface IJogadorObserver {
    data: Jogador;
    sendNewInteracao(interacao: Interacao): void;
    onExit(): void;
}

export interface IServerState {
    addJogador(jogador: IJogadorObserver): void;
    removeJogador(jogador: IJogadorObserver): void;
    notifyJogadores(): void;
    getJogadorObserverByName(name?: string): IJogadorObserver | undefined;

    listJogadores(): Jogador[];
    filterJogadoresByname(name?: string): Jogador[];

    listInteracoes(): Interacao[];
    addInteracao(interacao: Interacao): void;
}

export default class ServerState implements IServerState {
    jogadores: IJogadorObserver[] = [];
    interacoes: Interacao[] = [];
    
    addJogador(jogador: IJogadorObserver): void {
        this.jogadores.push(jogador)
    }
    removeJogador(jogador: IJogadorObserver): void {
        const index = this.jogadores.indexOf(jogador);
        if (index === -1)
        return logger.logError(`Jogador ${jogador.data.name} non exists.`);
        this.jogadores[index].onExit();
        this.jogadores.splice(index, 1);
    }
    
    getJogadorObserverByName(name?: string | undefined): IJogadorObserver | undefined {
        const index = this.jogadores.findIndex(j => j.data.name === name);
        if (index === -1)
            return undefined;
        return this.jogadores[index];
    }
    listJogadores(): Jogador[] {
        return this.jogadores.map(j => j.data);
    }
    filterJogadoresByname(name?: string): Jogador[] {
        return this.listJogadores().filter(j => j.name === name);
    }
    
    listInteracoes(): Interacao[] {
        return this.interacoes
    }
    addInteracao(interacao: Interacao): void {
        this.interacoes.push(interacao);
        this.notifyJogadores();
    }

    notifyJogadores(): void {
        // pega ultima interacao
        const lastInteracao: Interacao = this.interacoes[this.interacoes.length - 1];
        logger.logInfo(`notificando ${this.jogadores.length} jogadores`);
        // notifica os observers
        for (const jogador of this.jogadores) {
            jogador.sendNewInteracao(lastInteracao);
        }
        logger.logInfo(`${this.jogadores.length} jogadores notificados`);
    }
}
