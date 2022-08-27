import { Jogador } from "./proto/Jogador";

export interface IServerState {
    jogadores: Jogador[];
    mensagens: string[];
}
const serverState: IServerState = {
    jogadores: [],
    mensagens: []
}

export default {
    addJogador: (jogador: Jogador) => {
        serverState.jogadores.push(jogador)
    },
    
    filterJogadoresByname: (name?: string) => serverState.jogadores.filter(j => j.name === name),
    
    removeJogador: (jogador: Jogador) => {
        serverState.jogadores = serverState.jogadores.filter(j => j.name !== jogador.name);
    },

    listMensagens: () => serverState.mensagens,
    
    addMensagem: (mensagem: string) => {
        serverState.mensagens.push(mensagem)
    }
}
