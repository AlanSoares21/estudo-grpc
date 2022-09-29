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
    notifyJogadores(interacao: Interacao): void;
    getJogadorObserverByName(name?: string): IJogadorObserver | undefined;
    
    listJogadores(): Jogador[];
    filterJogadoresByname(name?: string): Jogador[];
    
    listInteracoes(): Interacao[];
    addInteracao(interacao: Interacao): void;
    
    gameIsStarted(): boolean;
    setJogadorComBatata(jogador: Jogador): void;
    getJogadorComBatata(): Jogador | undefined;
    resetStateToDefault(): void;
}

export default class ServerState implements IServerState {
    jogadores: IJogadorObserver[] = [];
    jogadorComBatata: Jogador | undefined;
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
    }
    
    notifyJogadores(interacao: Interacao): void {
        logger.logInfo(`notificando ${this.jogadores.length} jogadores`);
        // notifica os observers
        for (const jogador of this.jogadores)
        jogador.sendNewInteracao(interacao);
        logger.logInfo(`${this.jogadores.length} jogadores notificados`);
    }

    gameIsStarted(): boolean {
        return this.jogadorComBatata !== undefined;
    }
    setJogadorComBatata(jogador: Jogador): void {
        this.jogadorComBatata = jogador;
    }
    getJogadorComBatata(): Jogador | undefined {
        return this.jogadorComBatata;
    }

    removeAllJogadoresObservers() {
        for (const jogador of this.jogadores)
            jogador.onExit();
        this.jogadores = [];
    }

    resetStateToDefault(): void {
        this.removeAllJogadoresObservers();
        this.jogadorComBatata = undefined;
        this.interacoes = [];
    }
}
