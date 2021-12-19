namespace PersonalAssistant.Services.Models
{
    public class RoomFilterCriteria : BaseFilterCriteria
    {
        public int? LoggedInUserId { get; set; }
        public string SearchKeyword { get; set; }
        public string ConversationType { get; set; }
    }
}
