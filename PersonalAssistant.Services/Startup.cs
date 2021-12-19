using System;
using PersonalAssistant.Services.Helpers;
using PersonalAssistant.Services.Interfaces;
using PersonalAssistant.Services.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using PersonalAssistant.Services.Extensions;

namespace PersonalAssistant.Services
{
    public static class Startup
    {
        public static IServiceCollection ConfigureServices(this IServiceCollection serviceCollection,
            IConfiguration configuration)
        {
            if (configuration == null)
            {
                throw new ArgumentNullException(nameof(configuration));
            }

            return serviceCollection.AddBlobService(configuration)
                .AddTransient<IAssignmentService, AssignmentService>()
                .AddTransient<IDisciplineService, DisciplineService>()
                .AddTransient<IAssignmentTypeService, AssignmentTypeService>()
                .AddTransient<ICommentService, CommentService>()
                .AddTransient<IFileService, FileService>()
                .AddTransient<IMessageService, MessageService>()
                .AddTransient<IRoomService, RoomService>()
                .AddTransient<IConversationService, ConversationService>();
        }

        public static IServiceCollection AddJwtTokenService(this IServiceCollection services)
        {
            return services.AddTransient<ITokenService, TokenService>();
        }
    }
}
