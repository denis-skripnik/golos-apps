module.exports.help = () => {
    return `Привет, я бот, который наблюдает за делегатами. 
    
/watchall - Включает/выключает сообщения обо всех делегатах, включено если список делегатов пуст
/list - список выбранных делегатов.

Введите имя аккаунта делегата с плюсом впереди (например, +login), что бы отслеживать активность адресно;
Введите с минусом, чтоб удалить (например, -login).
`;
}

module.exports.watchall_switch = (chat) => {
    if(chat.watchall) {
        return `Слежу за всеми делегатами`;
    } else  {
        return `Слежу только за вашим делегатом`;
    }
}

module.exports.get_text_blocks = (missed) => {
    if(missed > 20) {
        missed = missed % 10;
    }

    if(missed == 1 ) {
        return "блок";
    } else if(missed >= 2 && missed <= 4) {
        return "блока";
    } else {
        return "блоков";
    }
}