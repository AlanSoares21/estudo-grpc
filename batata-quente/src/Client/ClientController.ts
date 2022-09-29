import readline from 'readline';
import { credentials } from '@grpc/grpc-js';
import logger from '../logger';
import { createAuthMetadataGenerator } from '../grpcUtils';
import { isEntraraNaBrincadeiraReply } from '../typeCheck';
import { getUserName } from './promptInteraction';
import { EntrarNaBrincadeiraReply } from "../proto/EntrarNaBrincadeiraReply";
import BatataQuenteClientWrapper from './BatataQuenteClientWrapper';

/**
 * Controla interacao do usuario com o prompt
 */
export default class ClientController {
    private _batataQuenteClient: BatataQuenteClientWrapper;
    private _readlineInterface: readline.Interface;
    constructor (batataQuenteClient: BatataQuenteClientWrapper, readlineInterface: readline.Interface) {
        this._batataQuenteClient = batataQuenteClient;
        this._readlineInterface = readlineInterface;
    }

    async authenticate(): Promise<{authData: EntrarNaBrincadeiraReply, name: string}> {
        let name = '';
        let brincadeiraData: EntrarNaBrincadeiraReply | undefined;
        do {
            // pedidindo ao usuario que informe o nome que deseja utilizar
            name = await getUserName(this._readlineInterface);
            // autenticando com o nome informado pelo usuario
            const entrarNaBrincadeiraResponse = await 
                this._batataQuenteClient
                .entrarNaBrincadeira({name})
                .catch(() => undefined);
            // validando resposta
            if (
                isEntraraNaBrincadeiraReply(entrarNaBrincadeiraResponse) 
                && entrarNaBrincadeiraResponse.success
            ) 
                brincadeiraData = entrarNaBrincadeiraResponse;
            else
                logger.logInfo(`o nome ${name} não  pode ser utilizado.`);
        } while (brincadeiraData == undefined);
        return {authData: brincadeiraData, name};
    }

    async brincar(token: string, jogadorName: string) {
        // gerando credenciais grpc para realizar call brincar
        const callCreds = credentials.createFromMetadataGenerator(createAuthMetadataGenerator(token));
        // iniciando stream
        const brincarStream = this._batataQuenteClient.brincar(callCreds, jogadorName)
            .onEnd(() => {
                logger.logInfo('The server close the connection');
                process.exit();
            })
            .onData(interacao => {
                logger.logInfo(`[${interacao.type}]${interacao.jogadorName} - ${interacao.aditionalData}`);
            });
        // guarda o comportamentamento de cada comando
        const commands: {[key: string]: (args: string[]) => any} = {
            'chau': args => brincarStream.chau(),
            'send': args => brincarStream.sendMessage(args.join(' ')),
            'startGame': args => brincarStream.startGame()
        }
        // lista dos comandos validos
        const validCommands = Object.keys(commands);

        // trata o input de novos comandos do usuario
        function executeCommand(line: string) {
            const args = line.trim().split(' ');
            if (args.length === 0) 
                return logger.logInfo(`É necessário digitar um comando valido`);
            // retirando o primeiro argumento
            const [ command ] = args.splice(0, 1);
            if (!validCommands.some(value => value === command)) 
                return logger.logInfo(`O comando ${command} é invalido. Os comandos validos são \n\t ${validCommands.join('\n\t')}`);
            // executando comando
            commands[command](args);
        }

        // registrando listener para quando o usuario insere uma nova linha
        this._readlineInterface.on('line', executeCommand);
    }
}