namespace PersonalAssistant.Services.Models
{
    public class UserFilterCriteria : BaseFilterCriteria
    {
        public int? LoggedInUserId { get; set; }

        public string SearchKeyword { get; set; }
    }
}
