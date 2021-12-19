using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace PersonalAssistant.DataAccess.Migrations
{
    public partial class initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserName = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(maxLength: 256, nullable: true),
                    Email = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(nullable: false),
                    PasswordHash = table.Column<string>(nullable: true),
                    SecurityStamp = table.Column<string>(nullable: true),
                    ConcurrencyStamp = table.Column<string>(nullable: true),
                    PhoneNumber = table.Column<string>(nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(nullable: false),
                    TwoFactorEnabled = table.Column<bool>(nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(nullable: true),
                    LockoutEnabled = table.Column<bool>(nullable: false),
                    AccessFailedCount = table.Column<int>(nullable: false),
                    AvatarId = table.Column<int>(nullable: false),
                    Icon = table.Column<string>(nullable: true),
                    FirstName = table.Column<string>(nullable: true),
                    LastName = table.Column<string>(nullable: true),
                    Location = table.Column<string>(nullable: true),
                    BirthDate = table.Column<DateTime>(nullable: false),
                    EducationalInstitutionType = table.Column<string>(nullable: true),
                    EducationalInstitutionName = table.Column<string>(nullable: true),
                    Status = table.Column<string>(nullable: true),
                    LastActiveAt = table.Column<DateTime>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AssignmentTypes",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AssignmentTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Disciplines",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Disciplines", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleId = table.Column<int>(nullable: false),
                    ClaimType = table.Column<string>(nullable: true),
                    ClaimValue = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(nullable: false),
                    ClaimType = table.Column<string>(nullable: true),
                    ClaimValue = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(nullable: false),
                    ProviderKey = table.Column<string>(nullable: false),
                    ProviderDisplayName = table.Column<string>(nullable: true),
                    UserId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<int>(nullable: false),
                    RoleId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<int>(nullable: false),
                    LoginProvider = table.Column<string>(nullable: false),
                    Name = table.Column<string>(nullable: false),
                    Value = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Rooms",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(nullable: true),
                    Icon = table.Column<string>(nullable: true),
                    ConversationType = table.Column<string>(nullable: true),
                    RoomType = table.Column<string>(nullable: true),
                    Password = table.Column<string>(nullable: true),
                    OwnerId = table.Column<int>(nullable: true),
                    CreatedAt = table.Column<DateTime>(nullable: true),
                    UpdatedAt = table.Column<DateTime>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rooms", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Rooms_AspNetUsers_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Assignments",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DisciplineId = table.Column<int>(nullable: true),
                    AssignmentTypeId = table.Column<int>(nullable: true),
                    CreatorId = table.Column<int>(nullable: true),
                    ExecutorId = table.Column<int>(nullable: true),
                    TopicName = table.Column<string>(nullable: true),
                    PreferredDeadline = table.Column<DateTime>(nullable: false),
                    CreationDate = table.Column<DateTime>(nullable: false),
                    Details = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Assignments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Assignments_AssignmentTypes_AssignmentTypeId",
                        column: x => x.AssignmentTypeId,
                        principalTable: "AssignmentTypes",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Assignments_AspNetUsers_CreatorId",
                        column: x => x.CreatorId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Assignments_Disciplines_DisciplineId",
                        column: x => x.DisciplineId,
                        principalTable: "Disciplines",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Assignments_AspNetUsers_ExecutorId",
                        column: x => x.ExecutorId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Messages",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SenderId = table.Column<int>(nullable: false),
                    RoomId = table.Column<int>(nullable: true),
                    Type = table.Column<string>(nullable: true),
                    Category = table.Column<string>(nullable: true),
                    SentAt = table.Column<DateTime>(nullable: true),
                    EditedAt = table.Column<DateTime>(nullable: true),
                    EditedBy = table.Column<int>(nullable: false),
                    DeletedAt = table.Column<DateTime>(nullable: true),
                    DeletedBy = table.Column<int>(nullable: false),
                    Text = table.Column<string>(nullable: true),
                    ParentMessageId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Messages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Messages_Rooms_RoomId",
                        column: x => x.RoomId,
                        principalTable: "Rooms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Messages_AspNetUsers_SenderId",
                        column: x => x.SenderId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserRooms",
                columns: table => new
                {
                    UserId = table.Column<int>(nullable: false),
                    RoomId = table.Column<int>(nullable: false),
                    Scope = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserRooms", x => new { x.RoomId, x.UserId });
                    table.ForeignKey(
                        name: "FK_UserRooms_Rooms_RoomId",
                        column: x => x.RoomId,
                        principalTable: "Rooms",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_UserRooms_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Comments",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AssignmentId = table.Column<int>(nullable: false),
                    UserId = table.Column<int>(nullable: false),
                    Headline = table.Column<string>(nullable: true),
                    Content = table.Column<string>(nullable: true),
                    CreationDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Comments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Comments_Assignments_AssignmentId",
                        column: x => x.AssignmentId,
                        principalTable: "Assignments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Comments_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Files",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AssignmentId = table.Column<int>(nullable: false),
                    UserId = table.Column<int>(nullable: false),
                    FileName = table.Column<string>(nullable: true),
                    FileUrl = table.Column<string>(nullable: true),
                    CreationDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Files", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Files_Assignments_AssignmentId",
                        column: x => x.AssignmentId,
                        principalTable: "Assignments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Files_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { 4, "b09bf5c7-5adf-449b-bc58-f22ca3fd6624", "Manager", "MANAGER" },
                    { 3, "dcebf646-b4d2-4938-92b7-3f954ad29c72", "Assistant", "ASSISTANT" },
                    { 2, "bac984a5-413f-4949-a81d-9782faca4894", "User", "USER" },
                    { 1, "b0256264-6704-427e-98be-fcc6f7d53903", "Admin", "ADMIN" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "AvatarId", "BirthDate", "ConcurrencyStamp", "EducationalInstitutionName", "EducationalInstitutionType", "Email", "EmailConfirmed", "FirstName", "Icon", "LastActiveAt", "LastName", "Location", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "Status", "TwoFactorEnabled", "UserName" },
                values: new object[,]
                {
                    { 6, 0, 0, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "4a79f0b9-6998-4e0e-9a27-ed631107437d", null, null, "petro.luzan@gmail.com", true, "Петро", null, null, "Лузан", null, false, null, null, "PETRO.LUZAN@GMAIL.COM", "AQAAAAEAACcQAAAAEPe79Rn1XrNMnol901iJG1dJ3kKUJyMuL8FPEn24iP8kx+Lz/8i/J4pTpdPaBaRguA==", null, false, "510d9ca1-ccfd-47b5-863e-7440cf4c966d", null, false, "petro.luzan@gmail.com" },
                    { 4, 0, 0, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "4f0ede67-d1ef-47fd-8318-3d868340adc0", null, null, "roman.halas@gmail.com", true, "Роман", null, null, "Галас", null, false, null, null, "ROMAN.HALAS@GMAIL.COM", "AQAAAAEAACcQAAAAEKcMZVBPVsMEK5gNg0Pqdv090cZmNwpsbR0s/OJodzxa2KYQZm81cCh7GbVR9VA70Q==", null, false, "b1ab5780-f3c8-45d9-a858-b6af84a44813", null, false, "roman.halas@gmail.com" },
                    { 3, 0, 0, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "ba9db9b8-4731-4d24-85b2-a1394fde28d3", null, null, "artem.bohdan@gmail.com", true, "Артем", null, null, "Богдан", null, false, null, null, "ARTEM.BOHDAN@GMAIL.COM", "AQAAAAEAACcQAAAAEL+6/8IN6J6SbuGDSDzRt8Gv17SF+wI4yEa1qOlVox0+9FDJqbsx8oZrikDf7TV79Q==", null, false, "dc3171b5-2acf-4a00-9e90-1499241918da", null, false, "artem.bohdan@gmail.com" },
                    { 2, 0, 0, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "35a9092c-090a-4607-bd39-164a05484eda", null, null, "serhii.romanov@gmail.com", true, "Сергій", null, null, "Романов", null, false, null, null, "SERHII.ROMANOV@GMAIL.COM", "AQAAAAEAACcQAAAAEMLSkALVVJz+C1xMSmUdDJr5SWrdRBmf2jDUYbhkaN07IERHHZeRjHpHTBQNL3mFHQ==", null, false, "5aced4b8-0e99-42ec-9849-1cc8cfd83d74", null, false, "serhii.romanov@gmail.com" },
                    { 1, 0, 0, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "4d3d56f9-ac14-42c3-a0aa-be9d27d655ba", null, null, "ivan.freiuk@gmail.com", true, "Іван", null, null, "Фреюк", null, false, null, null, "IVAN.FREIUK@GMAIL.COM", "AQAAAAEAACcQAAAAEGkUAajNwi+WT/q/pYumDvmpRoEf6LjbmDFbd3mnrfRUsG8DpfHn/bhYH7ZL4AbmWA==", null, false, "cc605458-665d-41fc-b1ad-3b23ac94c9b5", null, false, "ivan.freiuk@gmail.com" },
                    { 5, 0, 0, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "c3325b17-1107-4d8e-bdd3-cd204cad0cde", null, null, "nazar.homeniuk@gmail.com", true, "Назар", null, null, "Гоменюк", null, false, null, null, "NAZAR.HOMENIUK@GMAIL.COM", "AQAAAAEAACcQAAAAEN/pPLuZyRGlvCAOL5uYKWQHp7zAc1wvc7fCwoQitFhC9+OmTjZi56KCBufTr7VE2w==", null, false, "35859150-3456-4e0f-9f15-8c14e9848801", null, false, "nazar.homeniuk@gmail.com" }
                });

            migrationBuilder.InsertData(
                table: "AssignmentTypes",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 14, "Анотація" },
                    { 13, "Рецензія" },
                    { 1, "Реферат" },
                    { 11, "Домашнє завдання" },
                    { 2, "Доповідь" },
                    { 3, "Ессе" },
                    { 4, "Стаття" },
                    { 5, "Контрольна робота" },
                    { 6, "Відповіді на запитання" },
                    { 7, "Бізнес план" },
                    { 8, "Переклад" },
                    { 9, "Лабораторна робота" },
                    { 10, "Презентація" },
                    { 12, "Розв'язання задач" }
                });

            migrationBuilder.InsertData(
                table: "Disciplines",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 20, "Філософія" },
                    { 19, "Медицина" },
                    { 18, "Українська література" },
                    { 17, "Музика" },
                    { 16, "Математика" },
                    { 15, "Психологія" },
                    { 13, "Правознавство" },
                    { 12, "Політологія" },
                    { 11, "Педагогіка" },
                    { 10, "Історія" },
                    { 8, "Журналістика" },
                    { 7, "Економіка" },
                    { 6, "Географія" },
                    { 5, "Хімія" },
                    { 4, "Інформатика" },
                    { 3, "Біологія" },
                    { 2, "Німецька мова" },
                    { 1, "Aнглійська мова" },
                    { 14, "Програмування" },
                    { 9, "Лабораторна робота" }
                });

            migrationBuilder.InsertData(
                table: "Rooms",
                columns: new[] { "Id", "ConversationType", "CreatedAt", "Icon", "Name", "OwnerId", "Password", "RoomType", "UpdatedAt" },
                values: new object[] { 1, "User", null, null, null, null, null, "Public", null });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "UserId", "RoleId" },
                values: new object[,]
                {
                    { 1, 2 },
                    { 4, 2 },
                    { 3, 2 },
                    { 2, 2 },
                    { 5, 2 },
                    { 6, 2 }
                });

            migrationBuilder.InsertData(
                table: "Assignments",
                columns: new[] { "Id", "AssignmentTypeId", "CreationDate", "CreatorId", "Details", "DisciplineId", "ExecutorId", "PreferredDeadline", "TopicName" },
                values: new object[,]
                {
                    { 1, 9, new DateTime(2021, 12, 19, 14, 36, 36, 967, DateTimeKind.Local).AddTicks(9190), 2, @"<p>Написати програму послідовного та паралельного <strong>Розв'язування системи лінійних алгебраїчних рівнянь методом Гауса.</strong></p>
                                                    <p>Програма повинна задовольняти наступні вимоги:</p>
                                                    <ul>
                                                    <li>Порахувати час виконання обох видів алгоритмів;</li>
                                                    <li>Розміри матриці &gt;=100;</li>
                                                    <li>Обчислити прискорення;</li>
                                                    <li>Обчислити ефективність паралельних обчислень.</li>
                                                    </ul>
                                                    <p><strong>Питання:</strong> <em>Як образувати прискорення?</em></p>", 4, null, new DateTime(2021, 12, 19, 14, 36, 36, 967, DateTimeKind.Local).AddTicks(8957), null },
                    { 2, 11, new DateTime(2021, 12, 19, 14, 36, 36, 967, DateTimeKind.Local).AddTicks(9676), 1, @"<p>Написати програму послідовного та паралельного <strong>множення матриць</strong>.&nbsp;</p>
                                                    <p>Програма повинна задовольняти наступні вимоги:</p>
                                                    <ul>
                                                    <li>Порахувати час виконання обох видів алгоритмів;</li>
                                                    <li>Розміри матриці &gt;=500;</li>
                                                    <li>Обчислити прискорення;</li>
                                                    <li>Обчислити ефективність паралельних обчислень.</li>
                                                    </ul>
                                                    <p><strong>Питання</strong>: <em>Яка найоптимальніша кількість потоків потрібна для множення матриць?</em></p>", 4, null, new DateTime(2021, 12, 19, 14, 36, 36, 967, DateTimeKind.Local).AddTicks(9661), null },
                    { 3, 3, new DateTime(2021, 12, 19, 14, 36, 36, 967, DateTimeKind.Local).AddTicks(9710), 1, @"<p>Потрібно написати ессе на тему <strong><em> 'How computer technologies can help in learning English'</em></strong></p>
                                                    <p><strong>Запитання:</strong></p>
                                                    <ul>
                                                    <li><strong> </strong>Яка структура ессе повинна бути?</li>
                                                    <li>Також було б добре отримати посилання на джерела які допоможуть у написанні ессе.</li>
                                                    </ul>", 1, null, new DateTime(2021, 12, 19, 14, 36, 36, 967, DateTimeKind.Local).AddTicks(9708), null }
                });

            migrationBuilder.InsertData(
                table: "Messages",
                columns: new[] { "Id", "Category", "DeletedAt", "DeletedBy", "EditedAt", "EditedBy", "ParentMessageId", "RoomId", "SenderId", "SentAt", "Text", "Type" },
                values: new object[,]
                {
                    { 8, null, null, 0, null, 0, null, 1, 2, new DateTime(2021, 12, 19, 14, 36, 36, 967, DateTimeKind.Local).AddTicks(2914), "Будь ласка!", "Text" },
                    { 6, null, null, 0, null, 0, null, 1, 2, new DateTime(2021, 12, 19, 14, 36, 36, 967, DateTimeKind.Local).AddTicks(2907), "Тут складно пояснити коротко. Загалом есе має складатись з таких частин: вступ (опис тези), аргументи або основна частина (підтвердження або спростування тези за допомогою цитат, прикладів з життя, історичних подій, законів та актів), висновок (остаточна позиція автора щодо конкретного питання). Більш детально можна глянути за наступним посиланням: http://csbc.edu.ua/documents/news/691_3.pdf", "Text" },
                    { 3, null, null, 0, null, 0, null, 1, 2, new DateTime(2021, 12, 19, 14, 36, 36, 967, DateTimeKind.Local).AddTicks(2890), "Також наступна стаття містить описані плюси та мінуси використання компютерних технологій для вивчення мов: https://www.researchgate.net/publication/316912447_THE_ROLE_OF_COMPUTER_TECHNOLOGY_IN_TEACHING_ENGLISH_LANGUAGE", "Text" },
                    { 2, null, null, 0, null, 0, null, 1, 2, new DateTime(2021, 12, 19, 14, 36, 36, 967, DateTimeKind.Local).AddTicks(2846), "Привіт! Переглянь спочатку наступну статтю: Use of computer technology for English language learning: do learning styles, gender, and age matter? https://www.tandfonline.com/doi/abs/10.1080/09588221.2016.1140655?journalCode=ncal20", "Text" },
                    { 5, null, null, 0, null, 0, null, 1, 1, new DateTime(2021, 12, 19, 14, 36, 36, 967, DateTimeKind.Local).AddTicks(2899), "Наступне питання: Яка загальна структура ессе повинна бути? ", "Text" },
                    { 7, null, null, 0, null, 0, null, 1, 1, new DateTime(2021, 12, 19, 14, 36, 36, 967, DateTimeKind.Local).AddTicks(2910), "Переглянув. Це те що треба, дякую!", "Text" },
                    { 4, null, null, 0, null, 0, null, 1, 1, new DateTime(2021, 12, 19, 14, 36, 36, 967, DateTimeKind.Local).AddTicks(2896), "Супер, дякую!", "Text" },
                    { 1, null, null, 0, null, 0, null, 1, 1, new DateTime(2021, 12, 19, 14, 36, 36, 965, DateTimeKind.Local).AddTicks(2784), "Привіт! Потрібно написати ессе на тему 'How computer technologies can help in learning English' Чи є в тебе посилання на джерела які допоможуть мені у написанні ессе?", "Text" }
                });

            migrationBuilder.InsertData(
                table: "Rooms",
                columns: new[] { "Id", "ConversationType", "CreatedAt", "Icon", "Name", "OwnerId", "Password", "RoomType", "UpdatedAt" },
                values: new object[,]
                {
                    { 7, "Group", null, null, "Фізика", 1, null, "Protected", null },
                    { 6, "Group", null, null, "Математика", 1, null, "Private", null },
                    { 5, "Group", null, null, "Українська мова", 1, null, "Public", null },
                    { 4, "Group", null, null, "Програмування", 1, null, "Public", null },
                    { 2, "Group", null, null, "Інформатика", 3, null, "Public", null },
                    { 3, "Group", null, null, "Іноземна мова", 1, null, "Public", null },
                    { 8, "Group", null, null, "Хімія", 1, null, "Public", null }
                });

            migrationBuilder.InsertData(
                table: "UserRooms",
                columns: new[] { "RoomId", "UserId", "Scope" },
                values: new object[,]
                {
                    { 1, 1, "Admin" },
                    { 1, 2, "Participant" }
                });

            migrationBuilder.InsertData(
                table: "Comments",
                columns: new[] { "Id", "AssignmentId", "Content", "CreationDate", "Headline", "UserId" },
                values: new object[,]
                {
                    { 1, 3, @"<p><em><strong>Загальна структура ессе:</strong></em></p>
                                                    <ol>
                                                    <li><strong>Лаконічність </strong>викладу матеріалу. Нарис має бути аргументованим та переконливим. Всі аргументи &ndash; підтвердженими та перевіреними.</li>
                                                    <li><strong>Оригінальність</strong>. Під час оформлення есе категорично забороняється використання чужих робіт, їх повне або часткове копіювання.</li>
                                                    <li>Забороняється використовувати в текстах сленг чи ненормативну лексику, вислови, що пропагують ворожнечу, шкідливі звички чи насильство.</li>
                                                    <li>Есе має містити проведений автором аналіз проблеми, суб&rsquo;єктивну авторську позицію (в цілому під час оформлення есе головне розкрити і проблему, і особистість автора та його світогляд).</li>
                                                    <li>Есе має складатись з таких частин: <strong>вступ </strong>(опис тези),<strong> аргументи або основна частина</strong> (підтвердження або спростування тези за допомогою цитат, прикладів з життя, історичних подій, законів та актів), <strong>висновок </strong>(остаточна позиція автора щодо конкретного питання).</li>
                                                    </ol>", new DateTime(2021, 12, 19, 14, 36, 36, 968, DateTimeKind.Local).AddTicks(2591), null, 2 },
                    { 2, 3, @"<p>Проаналізуйте наступні ресурси для написання ессе:</p>
                                                    <ol>
                                                    <li>Use of computer technology for English language learning: do learning styles, gender, and age matter? https://www.tandfonline.com/doi/abs/10.1080/09588221.2016.1140655?journalCode=ncal20 </li>
                                                    <li> THE ROLE OF COMPUTER TECHNOLOGY IN TEACHING ENGLISH LANGUAGE https://www.researchgate.net/publication/316912447_THE_ROLE_OF_COMPUTER_TECHNOLOGY_IN_TEACHING_ENGLISH_LANGUAGE </li>
                                                    </ol>
                                                    <p><strong> Тут описані плюси та мінуси використання компютерних технологій для вивчення мов.</strong></p>
                                                    <p> &nbsp;</p> ", new DateTime(2021, 12, 19, 14, 36, 36, 968, DateTimeKind.Local).AddTicks(3083), null, 1 }
                });

            migrationBuilder.InsertData(
                table: "UserRooms",
                columns: new[] { "RoomId", "UserId", "Scope" },
                values: new object[,]
                {
                    { 3, 1, "Owner" },
                    { 4, 1, "Owner" },
                    { 5, 1, "Owner" },
                    { 6, 1, "Owner" },
                    { 7, 1, "Owner" },
                    { 8, 1, "Owner" },
                    { 2, 1, "Admin" },
                    { 2, 2, "Participant" },
                    { 2, 3, "Admin" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true,
                filter: "[NormalizedName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true,
                filter: "[NormalizedUserName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Assignments_AssignmentTypeId",
                table: "Assignments",
                column: "AssignmentTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Assignments_CreatorId",
                table: "Assignments",
                column: "CreatorId");

            migrationBuilder.CreateIndex(
                name: "IX_Assignments_DisciplineId",
                table: "Assignments",
                column: "DisciplineId");

            migrationBuilder.CreateIndex(
                name: "IX_Assignments_ExecutorId",
                table: "Assignments",
                column: "ExecutorId");

            migrationBuilder.CreateIndex(
                name: "IX_Comments_AssignmentId",
                table: "Comments",
                column: "AssignmentId");

            migrationBuilder.CreateIndex(
                name: "IX_Comments_UserId",
                table: "Comments",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Files_AssignmentId",
                table: "Files",
                column: "AssignmentId");

            migrationBuilder.CreateIndex(
                name: "IX_Files_UserId",
                table: "Files",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Messages_RoomId",
                table: "Messages",
                column: "RoomId");

            migrationBuilder.CreateIndex(
                name: "IX_Messages_SenderId",
                table: "Messages",
                column: "SenderId");

            migrationBuilder.CreateIndex(
                name: "IX_Rooms_OwnerId",
                table: "Rooms",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_UserRooms_UserId",
                table: "UserRooms",
                column: "UserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "Comments");

            migrationBuilder.DropTable(
                name: "Files");

            migrationBuilder.DropTable(
                name: "Messages");

            migrationBuilder.DropTable(
                name: "UserRooms");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "Assignments");

            migrationBuilder.DropTable(
                name: "Rooms");

            migrationBuilder.DropTable(
                name: "AssignmentTypes");

            migrationBuilder.DropTable(
                name: "Disciplines");

            migrationBuilder.DropTable(
                name: "AspNetUsers");
        }
    }
}
