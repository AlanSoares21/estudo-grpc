import { Jogador } from "./proto/Jogador"

export type TStartEvent = {
    jogadorComBatata: string;
}

export type TPassarBatataEvent = {
    jogadorRecebeBatata: string;
}