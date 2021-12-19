using Azure.Storage.Blobs;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using PersonalAssistant.Services.Interfaces;
using PersonalAssistant.Services.Services;

namespace PersonalAssistant.Services.Extensions
{
    public static class AzureBlobExtensions
    {
        private const string DefaultSectionPath = "AzureBlobStorage:DefaultConnection";


        public static IServiceCollection AddBlobService(this IServiceCollection services,
            IConfiguration configuration, string sectionPath=DefaultSectionPath)
        {
            var connectionString = configuration.GetValue<string>(sectionPath);
            return services.AddTransient(x=> new BlobServiceClient(connectionString))
                .AddTransient<IBlobService, BlobService>();
        }
    }
}
