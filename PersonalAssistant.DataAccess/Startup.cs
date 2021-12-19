using System;
using PersonalAssistant.DataAccess.Interfaces;
using PersonalAssistant.DataAccess.Repositories;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace PersonalAssistant.DataAccess
{
    public static class Startup
    {
        public static IServiceCollection ConfigureRepositories(this IServiceCollection serviceCollection,
            IConfiguration configuration)
        {
            if (configuration == null)
            {
                throw new ArgumentNullException(nameof(configuration));
            }

            return serviceCollection.AddTransient<IAssignmentRepository, IAssignmentRepository>()
                .AddTransient<IAssignmentTypeRepository, AssignmentTypeRepository>();
        }
    }
}
