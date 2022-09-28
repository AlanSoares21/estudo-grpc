import readline from 'readline';

export function getUserName(readlineInterface: readline.Interface) {
    return new Promise((resolve: (value: string) => any) => readlineInterface.question(`What's tour name? \n`, resolve));
}