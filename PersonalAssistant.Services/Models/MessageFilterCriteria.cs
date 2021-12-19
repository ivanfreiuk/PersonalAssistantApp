namespace PersonalAssistant.Services.Models
{
    public class MessageFilterCriteria : BaseFilterCriteria
    {        
        public int? LoggedInUserId { get; set; }

        public int? RoomId { get; set; }
    }
}
