import { Jogador } from "./proto/Jogador";
import { CommomReply } from "./proto/CommomReply";
import serverState from "./serverState";

function jaExisteJogadorComEsseNome(jogador: Jogador) {
    return serverState.filterJogadoresByname(jogador.name).length > 0;
}

export default {
    possoEntrarNaBrincadeira (jogador: Jogador): CommomReply {
        // verificando se nao tem jogadores com esse nome na brincadeira
        if (jaExisteJogadorComEsseNome(jogador))
            return {
                success: false,
                message: `Já existe um ${jogador.name} no jogo...`
            }
        return {success: true};
    }
}