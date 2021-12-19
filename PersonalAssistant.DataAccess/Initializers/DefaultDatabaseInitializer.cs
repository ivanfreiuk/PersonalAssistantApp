using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;
using PersonalAssistant.DataAccess.Identity;
using Microsoft.EntityFrameworkCore;
using PersonalAssistant.DataAccess.Entities;
using PersonalAssistant.DataAccess.Enums;

namespace PersonalAssistant.DataAccess.Initializers
{
    public  class DefaultDatabaseInitializer
    {
        public void Initialize(ModelBuilder builder)
        {
            InitializeDisciplines(builder);
            InitializeAssignmentTypes(builder);
            InitializeUsersWithRoles(builder);
            InitializeConversationWithMessages(builder);
            InitializeAssignments(builder);
            InitializeComments(builder);
        }

        public void InitializeDisciplines(ModelBuilder builder)
        {
            builder.Entity<Discipline>()
                .HasData(new List<Discipline>
                {
                    new Discipline {Id = 1, Name = "Aнглійська мова"},
                    new Discipline {Id = 2, Name = "Німецька мова"},
                    new Discipline {Id = 3, Name = "Біологія"},
                    new Discipline {Id = 4, Name = "Інформатика"},
                    new Discipline {Id = 5, Name = "Хімія"},
                    new Discipline {Id = 6, Name = "Географія"},
                    new Discipline {Id = 7, Name = "Економіка"},
                    new Discipline {Id = 8, Name = "Журналістика"},
                    new Discipline {Id = 9, Name = "Лабораторна робота"},
                    new Discipline {Id = 10, Name = "Історія"},
                    new Discipline {Id = 11, Name = "Педагогіка"},
                    new Discipline {Id = 12, Name = "Політологія"},
                    new Discipline {Id = 13, Name = "Правознавство"},
                    new Discipline {Id = 14, Name = "Програмування"},
                    new Discipline {Id = 15, Name = "Психологія"},
                    new Discipline {Id = 16, Name = "Математика"},
                    new Discipline {Id = 17, Name = "Музика"},
                    new Discipline {Id = 18, Name = "Українська література"},
                    new Discipline {Id = 19, Name = "Медицина"},
                    new Discipline {Id = 20, Name = "Філософія"},
                });
        }

        public void InitializeAssignmentTypes(ModelBuilder builder)
        {
            builder.Entity<AssignmentType>()
                .HasData(new List<AssignmentType>
                {
                    new AssignmentType {Id = 1, Name = "Реферат"},
                    new AssignmentType {Id = 2, Name = "Доповідь"},
                    new AssignmentType {Id = 3, Name = "Ессе"},
                    new AssignmentType {Id = 4, Name = "Стаття"},
                    new AssignmentType {Id = 5, Name = "Контрольна робота"},
                    new AssignmentType {Id = 6, Name = "Відповіді на запитання"},
                    new AssignmentType {Id = 7, Name = "Бізнес план"},
                    new AssignmentType {Id = 8, Name = "Переклад"},
                    new AssignmentType {Id = 9, Name = "Лабораторна робота"},
                    new AssignmentType {Id = 10, Name = "Презентація"},
                    new AssignmentType {Id = 11, Name = "Домашнє завдання"},
                    new AssignmentType {Id = 12, Name = "Розв'язання задач"},
                    new AssignmentType {Id = 13, Name = "Рецензія"},
                    new AssignmentType {Id = 14, Name = "Анотація"},
                });
        }
        
        public void InitializeUsersWithRoles(ModelBuilder builder)
        {
            const int userRoleId = 2;
            builder.Entity<Role>()
                .HasData(new List<Role>
                {
                    new Role {Id = 1, Name = "Admin", NormalizedName = "ADMIN"},
                    new Role {Id = userRoleId, Name = "User", NormalizedName = "USER"},
                    new Role {Id = 3, Name = "Assistant", NormalizedName = "ASSISTANT"},
                    new Role {Id = 4, Name = "Manager", NormalizedName = "MANAGER"},
                });
            
            var first = new User
            {
                Id = 1,
                Email = "ivan.freiuk@gmail.com",
                EmailConfirmed = true,
                FirstName = "Іван",
                LastName = "Фреюк",
                UserName = "ivan.freiuk@gmail.com",
                NormalizedUserName = "IVAN.FREIUK@GMAIL.COM", 
                SecurityStamp = Guid.NewGuid().ToString()
            };
            var second = new User
            {
                Id = 2,
                Email = "serhii.romanov@gmail.com",
                EmailConfirmed = true,
                FirstName = "Сергій",
                LastName = "Романов",
                UserName = "serhii.romanov@gmail.com",
                NormalizedUserName = "SERHII.ROMANOV@GMAIL.COM",
                SecurityStamp = Guid.NewGuid().ToString()
            };
            var third = new User
            {
                Id = 3,
                Email = "artem.bohdan@gmail.com",
                EmailConfirmed = true,
                FirstName = "Артем",
                LastName = "Богдан",
                UserName = "artem.bohdan@gmail.com",
                NormalizedUserName = "ARTEM.BOHDAN@GMAIL.COM",
                SecurityStamp = Guid.NewGuid().ToString()
            };
            var fourth = new User
            {
                Id = 4,
                Email = "roman.halas@gmail.com",
                EmailConfirmed = true,
                FirstName = "Роман",
                LastName = "Галас",
                UserName = "roman.halas@gmail.com",
                NormalizedUserName = "ROMAN.HALAS@GMAIL.COM",
                SecurityStamp = Guid.NewGuid().ToString()
            };
            var fifth = new User
            {
                Id = 5,
                Email = "nazar.homeniuk@gmail.com",
                EmailConfirmed = true,
                FirstName = "Назар",
                LastName = "Гоменюк",
                UserName = "nazar.homeniuk@gmail.com",
                NormalizedUserName = "NAZAR.HOMENIUK@GMAIL.COM",
                SecurityStamp = Guid.NewGuid().ToString()
            };
            var sixth = new User
            {
                Id = 6,
                Email = "petro.luzan@gmail.com",
                EmailConfirmed = true,
                FirstName = "Петро",
                LastName = "Лузан",
                UserName = "petro.luzan@gmail.com",
                NormalizedUserName = "PETRO.LUZAN@GMAIL.COM",
                SecurityStamp = Guid.NewGuid().ToString()
            };

            // Set users password
            const string defaultPassword = "password";
            var passwordHasher = new PasswordHasher<User>();
            first.PasswordHash = passwordHasher.HashPassword(first, defaultPassword);
            second.PasswordHash = passwordHasher.HashPassword(second, defaultPassword);
            third.PasswordHash = passwordHasher.HashPassword(third, defaultPassword);
            fourth.PasswordHash = passwordHasher.HashPassword(fourth, defaultPassword);
            fifth.PasswordHash = passwordHasher.HashPassword(fifth, defaultPassword);
            sixth.PasswordHash = passwordHasher.HashPassword(sixth, defaultPassword);

            // Seed users
            builder.Entity<User>().HasData(new List<User>
            {
                first,
                second,
                third, 
                fourth,
                fifth,
                sixth
            });

            // Set user role to user 
            builder.Entity<IdentityUserRole<int>>().HasData(new List<IdentityUserRole<int>>
            {
                new IdentityUserRole<int>
                {
                    RoleId = userRoleId,
                    UserId = first.Id
                },
                new IdentityUserRole<int>
                {
                    RoleId = userRoleId,
                    UserId = second.Id
                },
                new IdentityUserRole<int>
                {
                    RoleId = userRoleId,
                    UserId = third.Id
                },
                new IdentityUserRole<int>
                {
                    RoleId = userRoleId,
                    UserId = fourth.Id
                },
                new IdentityUserRole<int>
                {
                    RoleId = userRoleId,
                    UserId = fifth.Id
                },
                new IdentityUserRole<int>
                {
                    RoleId = userRoleId,
                    UserId = sixth.Id
                }
            });
        }


        public void InitializeConversationWithMessages(ModelBuilder builder)
        {
            const int userRoomId = 1;
            const int groupRoomId = 2;
            var firstUserId = 1;
            var secondUserId = 2;
            var thirdUserId = 3;
            builder.Entity<Room>()
                .HasData(new List<Room>
                {
                    new Room
                    {
                        Id = userRoomId,
                        ConversationType = ConversationType.User.ToString(),
                        RoomType = RoomType.Public.ToString()
                    },
                    new Room
                    {
                        Name = "Інформатика",
                        Id = groupRoomId,
                        OwnerId = thirdUserId,
                        ConversationType = ConversationType.Group.ToString(),
                        RoomType = RoomType.Public.ToString()
                    },
                    new Room
                    {
                        Name = "Іноземна мова",
                        Id = 3,
                        OwnerId = firstUserId,
                        ConversationType = ConversationType.Group.ToString(),
                        RoomType = RoomType.Public.ToString()
                    },
                    new Room
                    {
                        Name = "Програмування",
                        Id = 4,
                        OwnerId = firstUserId,
                        ConversationType = ConversationType.Group.ToString(),
                        RoomType = RoomType.Public.ToString()
                    },
                    new Room
                    {
                        Name = "Українська мова",
                        Id = 5,
                        OwnerId = firstUserId,
                        ConversationType = ConversationType.Group.ToString(),
                        RoomType = RoomType.Public.ToString()
                    },
                    new Room
                    {
                        Name = "Математика",
                        Id = 6,
                        OwnerId = firstUserId,
                        ConversationType = ConversationType.Group.ToString(),
                        RoomType = RoomType.Private.ToString()
                    },
                    new Room
                    {
                        Name = "Фізика",
                        Id = 7,
                        OwnerId = firstUserId,
                        ConversationType = ConversationType.Group.ToString(),
                        RoomType = RoomType.Protected.ToString()
                    },
                    new Room
                    {
                        Name = "Хімія",
                        Id = 8,
                        OwnerId = firstUserId,
                        ConversationType = ConversationType.Group.ToString(),
                        RoomType = RoomType.Public.ToString()
                    }
                });

            builder.Entity<Message>()
                .HasData(new List<Message>
                {
                    new Message
                    {
                        Id = 1,
                        SenderId = firstUserId,
                        RoomId = userRoomId,
                        Text = "Привіт! Потрібно написати ессе на тему 'How computer technologies can help in learning English' Чи є в тебе посилання на джерела які допоможуть мені у написанні ессе?",
                        SentAt = DateTime.Now,
                        Type = MessageType.Text.ToString()
                    },
                    new Message
                    {
                        Id = 2,
                        SenderId = secondUserId,
                        RoomId = userRoomId,
                        Text = "Привіт! Переглянь спочатку наступну статтю: Use of computer technology for English language learning: do learning styles, gender, and age matter? https://www.tandfonline.com/doi/abs/10.1080/09588221.2016.1140655?journalCode=ncal20",
                        SentAt = DateTime.Now,
                        Type = MessageType.Text.ToString()
                    },
                    new Message
                    {
                        Id = 3,
                        SenderId = secondUserId,
                        RoomId = userRoomId,
                        Text = "Також наступна стаття містить описані плюси та мінуси використання компютерних технологій для вивчення мов: https://www.researchgate.net/publication/316912447_THE_ROLE_OF_COMPUTER_TECHNOLOGY_IN_TEACHING_ENGLISH_LANGUAGE",
                        SentAt = DateTime.Now,
                        Type = MessageType.Text.ToString()
                    },
                    new Message
                    {
                        Id = 4,
                        SenderId = firstUserId,
                        RoomId = userRoomId,
                        Text = "Супер, дякую!",
                        SentAt = DateTime.Now,
                        Type = MessageType.Text.ToString()
                    },
                    new Message
                    {
                        Id = 5,
                        SenderId = firstUserId,
                        RoomId = userRoomId,
                        Text = "Наступне питання: Яка загальна структура ессе повинна бути? ",
                        SentAt = DateTime.Now,
                        Type = MessageType.Text.ToString()
                    },
                    new Message
                    {
                        Id = 6,
                        SenderId = secondUserId,
                        RoomId = userRoomId,
                        Text = "Тут складно пояснити коротко. Загалом есе має складатись з таких частин: вступ (опис тези), аргументи або основна частина (підтвердження або спростування тези за допомогою цитат, прикладів з життя, історичних подій, законів та актів), висновок (остаточна позиція автора щодо конкретного питання). Більш детально можна глянути за наступним посиланням: http://csbc.edu.ua/documents/news/691_3.pdf",
                        SentAt = DateTime.Now,
                        Type = MessageType.Text.ToString()
                    },
                    new Message
                    {
                        Id = 7,
                        SenderId = firstUserId,
                        RoomId = userRoomId,
                        Text = "Переглянув. Це те що треба, дякую!",
                        SentAt = DateTime.Now,
                        Type = MessageType.Text.ToString()
                    },
                    new Message
                    {
                        Id = 8,
                        SenderId = secondUserId,
                        RoomId = userRoomId,
                        Text = "Будь ласка!",
                        SentAt = DateTime.Now,
                        Type = MessageType.Text.ToString()
                    },
                });

            builder.Entity<UserRoom>()
                .HasData(new List<UserRoom>
                {
                    new UserRoom
                    {
                        UserId = firstUserId,
                        RoomId = userRoomId,
                        Scope = RoomScope.Admin.ToString()
                    },
                    new UserRoom
                    {
                        UserId = secondUserId,
                        RoomId = userRoomId,
                        Scope = RoomScope.Participant.ToString()
                    },
                    new UserRoom
                    {
                        UserId = firstUserId,
                        RoomId = groupRoomId,
                        Scope = RoomScope.Admin.ToString()
                    },
                    new UserRoom
                    {
                        UserId = secondUserId,
                        RoomId = groupRoomId,
                        Scope = RoomScope.Participant.ToString()
                    },
                    new UserRoom
                    {
                        UserId = thirdUserId,
                        RoomId = groupRoomId,
                        Scope = RoomScope.Admin.ToString()
                    },
                    new UserRoom
                    {
                        UserId = firstUserId,
                        RoomId = 3,
                        Scope = RoomScope.Owner.ToString()
                    },
                    new UserRoom
                    {
                        UserId = firstUserId,
                        RoomId = 4,
                        Scope = RoomScope.Owner.ToString()
                    },
                    new UserRoom
                    {
                        UserId = firstUserId,
                        RoomId = 5,
                        Scope = RoomScope.Owner.ToString()
                    },
                    new UserRoom
                    {
                        UserId = firstUserId,
                        RoomId = 6,
                        Scope = RoomScope.Owner.ToString()
                    },
                    new UserRoom
                    {
                        UserId = firstUserId,
                        RoomId = 7,
                        Scope = RoomScope.Owner.ToString()
                    },
                    new UserRoom
                    {
                        UserId = firstUserId,
                        RoomId = 8,
                        Scope = RoomScope.Owner.ToString()
                    }
                });
        }

        public void InitializeAssignments(ModelBuilder builder)
        {
            builder.Entity<Assignment>()
                .HasData(new List<Assignment>
                {
                    new Assignment 
                    {
                        Id = 1,
                        DisciplineId = 4,
                        AssignmentTypeId = 9,
                        CreatorId = 2,
                        PreferredDeadline = DateTime.Now,
                        CreationDate = DateTime.Now,
                        Details = @"<p>Написати програму послідовного та паралельного <strong>Розв'язування системи лінійних алгебраїчних рівнянь методом Гауса.</strong></p>
                                    <p>Програма повинна задовольняти наступні вимоги:</p>
                                    <ul>
                                    <li>Порахувати час виконання обох видів алгоритмів;</li>
                                    <li>Розміри матриці &gt;=100;</li>
                                    <li>Обчислити прискорення;</li>
                                    <li>Обчислити ефективність паралельних обчислень.</li>
                                    </ul>
                                    <p><strong>Питання:</strong> <em>Як образувати прискорення?</em></p>"
                    },
                    new Assignment
                    {
                        Id = 2,
                        DisciplineId = 4,
                        AssignmentTypeId = 11,
                        CreatorId = 1,
                        PreferredDeadline = DateTime.Now,
                        CreationDate = DateTime.Now,
                        Details = @"<p>Написати програму послідовного та паралельного <strong>множення матриць</strong>.&nbsp;</p>
                                    <p>Програма повинна задовольняти наступні вимоги:</p>
                                    <ul>
                                    <li>Порахувати час виконання обох видів алгоритмів;</li>
                                    <li>Розміри матриці &gt;=500;</li>
                                    <li>Обчислити прискорення;</li>
                                    <li>Обчислити ефективність паралельних обчислень.</li>
                                    </ul>
                                    <p><strong>Питання</strong>: <em>Яка найоптимальніша кількість потоків потрібна для множення матриць?</em></p>"
                    },
                    new Assignment
                    {
                        Id = 3,
                        DisciplineId = 1,
                        AssignmentTypeId = 3,
                        CreatorId = 1,
                        PreferredDeadline = DateTime.Now,
                        CreationDate = DateTime.Now,
                        Details = @"<p>Потрібно написати ессе на тему <strong><em> 'How computer technologies can help in learning English'</em></strong></p>
                                    <p><strong>Запитання:</strong></p>
                                    <ul>
                                    <li><strong> </strong>Яка структура ессе повинна бути?</li>
                                    <li>Також було б добре отримати посилання на джерела які допоможуть у написанні ессе.</li>
                                    </ul>"
                    }
                });
        }

        public void InitializeComments(ModelBuilder builder)
        {
            builder.Entity<Comment>()
                .HasData(new List<Comment>
                {
                    new Comment 
                    {
                        Id = 1, 
                        AssignmentId = 3, 
                        UserId = 2, 
                        CreationDate = DateTime.Now,
                        Content = @"<p><em><strong>Загальна структура ессе:</strong></em></p>
                                    <ol>
                                    <li><strong>Лаконічність </strong>викладу матеріалу. Нарис має бути аргументованим та переконливим. Всі аргументи &ndash; підтвердженими та перевіреними.</li>
                                    <li><strong>Оригінальність</strong>. Під час оформлення есе категорично забороняється використання чужих робіт, їх повне або часткове копіювання.</li>
                                    <li>Забороняється використовувати в текстах сленг чи ненормативну лексику, вислови, що пропагують ворожнечу, шкідливі звички чи насильство.</li>
                                    <li>Есе має містити проведений автором аналіз проблеми, суб&rsquo;єктивну авторську позицію (в цілому під час оформлення есе головне розкрити і проблему, і особистість автора та його світогляд).</li>
                                    <li>Есе має складатись з таких частин: <strong>вступ </strong>(опис тези),<strong> аргументи або основна частина</strong> (підтвердження або спростування тези за допомогою цитат, прикладів з життя, історичних подій, законів та актів), <strong>висновок </strong>(остаточна позиція автора щодо конкретного питання).</li>
                                    </ol>"
                    },
                    new Comment
                    {
                        Id = 2,
                        AssignmentId = 3,
                        UserId = 1,
                        CreationDate = DateTime.Now,
                        Content = @"<p>Проаналізуйте наступні ресурси для написання ессе:</p>
                                    <ol>
                                    <li>Use of computer technology for English language learning: do learning styles, gender, and age matter? https://www.tandfonline.com/doi/abs/10.1080/09588221.2016.1140655?journalCode=ncal20 </li>
                                    <li> THE ROLE OF COMPUTER TECHNOLOGY IN TEACHING ENGLISH LANGUAGE https://www.researchgate.net/publication/316912447_THE_ROLE_OF_COMPUTER_TECHNOLOGY_IN_TEACHING_ENGLISH_LANGUAGE </li>
                                    </ol>
                                    <p><strong> Тут описані плюси та мінуси використання компютерних технологій для вивчення мов.</strong></p>
                                    <p> &nbsp;</p> "
                    }
                });
        }
    }
}
