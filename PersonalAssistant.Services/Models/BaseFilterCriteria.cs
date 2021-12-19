namespace PersonalAssistant.Services.Models
{
    public class BaseFilterCriteria
    {
        private const int MaxLimit = 1000;
        private const int MinLimit = 1;
        private int? _limit;
        private int? _pageNumber;
        public int? Limit
        {
            get => _limit;
            set => _limit = (value > MaxLimit || value < MinLimit) ? MaxLimit : value;
        }

        public int? PageNumber
        {
            get => _pageNumber;
            set => _pageNumber = (value <= 0) ? 1 : value;
        }

        public int? StartRecord => (PageNumber - 1) * Limit;
    }
}
