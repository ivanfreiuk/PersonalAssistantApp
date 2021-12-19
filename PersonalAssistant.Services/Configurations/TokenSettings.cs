namespace PersonalAssistant.Services.Configurations
{
    public class TokenSettings
    {
        public string Key { get; set; }
        public int Lifetime { get; set; }
        public string Issuer { get; set; }
        public string Audience { get; set; }
    }
}
