# PersonalAssistant

# Архітектера застосунку
Проект складається з 3 модулів: 
•	PersonalAssistant.DataAccess  
•	PersonalAssistant.Services 
•	PersonalAssistant.Api

Модуль PersonalAssistant.DataAccess
PersonalAssistant.DataAccess - це модуль, за допомогою якого здійснюється керування даними в базі даних. Для маніпулювання даними в базі даних було використано технологію Entity Framework Core. В цьому модулі технологія використовує підхід Code First, при якому спочатку було визначено всі моделі, відношення між ними і контекст даних, а потім вже з цих моделей і класу контексту була згенерована база даних і всі її таблиці. EF  Core надає можливість взаємодії з об'єктами як за допомогою LINQ у вигляді LINQ to Entities, так і з використанням Entity SQL.

Модуль PersonalAssistant.Services
PersonalAssistant.Services - це модуль, який інкапсулює в собі бізнес логіку, що включає операції: пошуку даних по ідентифікатору та за певним користувачем, групування завдань по дисциплінах та фільтрування за визначеними критеріями, створення нових повідомлень та нових групових чатів. Вся функціональність реалізована в спеціальних класах сервісах. Кожен сервіс містить логіку опрацювання даних певної сутності, яка представлена в базі даних у вигляді таблиці.

Модуль PersonalAssistant.Api
PersonalAssistant.Api - це головний модуль проекту, який містить в собі перелік контролерів, які отримують дані від сервісів та у свою чергу віддають їх на клієнтську частину. Кожен контролер опрацьовує запити від клієнта, далі перевіряє дані на коректність та виконує обробку помилок у випадку невдалого запиту і повертає статус код клієнту та повідомлення з причиною помилки, а в іншому випадку повертає потрібні дані та статус код, що відповідає успішному запиту. Виконання проекту починається з файлу Startup.cs, а саме з класу Sturtup в якому відбувається вся конфігурація проекту, тобто налаштування Dependency Injection контейнера, процесу аутентифікації та авторизації, конфігурація підключення до бази даних, налаштування SignalR бібліотеки, маршрутизація API тощо. 
