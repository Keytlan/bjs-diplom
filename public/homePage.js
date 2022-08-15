//Выход из личного кабинета
const logoutButton = new LogoutButton();
logoutButton.action = () => {
    ApiConnector.logout(response => {
        if (response.success) {
            location.reload();
        };
    });
};

//Получение информации о пользователе
ApiConnector.current(response => {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
    };
});

//Получение текущих курсов валюты
const ratesBoard = new RatesBoard();

const getRatesBoard = () => {
    ApiConnector.getStocks(response => {
        if (response.success) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(response.data);
        };
    });
};

getRatesBoard();

let ratesBoardIntervalId = setInterval(getRatesBoard, 60000);

//Операции с деньгами
const moneyManager = new MoneyManager();

//Пополнение счёта
moneyManager.addMoneyCallback = data => {
    ApiConnector.addMoney(data, response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
        };
        moneyManager.setMessage(response.success, response.error || `${data.amount} ${data.currency} добавлены на счет`);
    });
};

//Конвертация валют
moneyManager.conversionMoneyCallback = data => {
    ApiConnector.convertMoney(data, response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
        };
        moneyManager.setMessage(response.success, response.error || `${data.fromAmount} ${data.fromCurrency} сконвертированы в ${data.targetCurrency}`);
    });
};

//  Перевод средств
moneyManager.sendMoneyCallback = data => {
    ApiConnector.transferMoney(data, response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
        };
        moneyManager.setMessage(response.success, response.error || `${data.amount} ${data.currency} переведены пользователю с ID ${data.to}`);
    });
};

//Работа с избранным
const favoritesWidget = new FavoritesWidget();

//Список избранного
ApiConnector.getFavorites(response => {
    if (response.success) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
    };
});

//Добавление в избранное
favoritesWidget.addUserCallback = data => {
    ApiConnector.addUserToFavorites(data, response => {
        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
        };
       favoritesWidget.setMessage(response.success, response.error || `Пользователь ${data.name} (ID ${data.id}) добавлен в избранное`);
    });
};

//Удаление из избранного
favoritesWidget.removeUserCallback = data => {
    ApiConnector.removeUserFromFavorites(data, response => {
        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
        };
        favoritesWidget.setMessage(response.success, response.error || `Пользователь ID ${data} удален из избранного`);      
    });
};