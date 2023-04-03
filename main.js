//import conditions from './conditions.js';

const apiKey = '2d47db3551aa4209903134237233103';

//http://api.weatherapi.com/v1/current.json?key=2d47db3551aa4209903134237233103&q=London


//Элементы на странице
const header = document.querySelector('.header');
const form = document.querySelector('#form');
const input = document.querySelector('#inputCity');

function removeCard(){
    const prevCard = document.querySelector('.card');
    if(prevCard) prevCard.remove();
};

function showError(errorMessage){
    const html = `<div class="card">${errorMessage}</div>`;
    header.insertAdjacentHTML('afterend', html);
}

function showCard({name, country, temp, condition, imgPath}){
    //Разметка для карточки
    const html = `<div class="card">
                    <h2 class="card-city">${name}<span>${country}</span></h2>

                    <div class="card-weather">
                        <div class="card-value">${temp}<sup>°c</sup></div>
                        <img class="card-img" src="${imgPath}" alt="Weather">
                    </div>

                    <div class="card-description">${condition}</div>

                </div>`

    //Отображаем карточку на странице
    header.insertAdjacentHTML('afterend', html);
}

async function getWeather(city){
    //Делаем запрос на сервер
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

//Слушаем отправку формы
form.onsubmit = async function(e) {
    //Отменяем отправку формы
    e.preventDefault();

    //Берем значение из инпута, обрезаем пробелы
    let city = input.value.trim();

    //Получаем данные с сервера
    const data = await getWeather(city);

   //Проверка на ошибку
   if(data.error){
        //Если есть ошибка
        //Удаляем предыдущую карточку
        removeCard();

        //Отображаем карточку с ошибкой
        showError(data.error.message);
    }
    else {
        //Если ошибки нет - выводим карточку
        //Удаляем предыдущую карточку
        removeCard();

        const infoResp = await fetch(`https://www.weatherapi.com/docs/conditions.json`);
        const infoJSON = await infoResp.json();
        const info = infoJSON.find((obj) => obj.code === data.current.condition.code);

        const filePath = './img/' + (data.current.is_day ? 'day' : 'night') + '/';
        const fileName = (data.current.is_day ? info.day : info.night) + '.png';
        const imgPath = filePath + fileName;
                        
        const weatherData = {
            name: data.location.name,
            country: data.location.country,
            temp: data.current.temp_c,
            condition: data.current.is_dy ? info.languages[23]['day_text'] : info.languages[23]['night_text'],
            imgPath,
        };

        //Отображаем карточку на странице
        showCard(weatherData);
    }    
}

