using PersonalAssistant.DataAccess.Identity;

namespace PersonalAssistant.Services.Helpers
{
    public interface ITokenService
    {
        string GetToken(User user);
    }
}
