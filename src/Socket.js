import {io} from 'socket.io-client';

export const initSocket = async => {
    const options = {
        'force new connection': true,
        timeout: 10000,
        reconncetionAttempt: 'Infinity',
        transports: ['websockets'],
    };

    
}