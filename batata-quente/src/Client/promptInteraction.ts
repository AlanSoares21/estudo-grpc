import readline from 'readline';

export function getUserName(readlineInterface: readline.Interface) {
    if (process.env.DEBUG)
        return 'nomeUnico'+Date.now();
    return new Promise((resolve: (value: string) => any) => readlineInterface.question(`What's tour name? \n`, resolve));
}