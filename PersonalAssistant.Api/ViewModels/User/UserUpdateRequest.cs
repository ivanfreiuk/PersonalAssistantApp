using System;

namespace PersonalAssistant.Api.ViewModels.User
{
    public class UserUpdateRequest
    {
        public int Id { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Email { get; set; }

        public string Sex { get; set; }

        public string Location { get; set; }

        public DateTime BirthDate { get; set; }

        public string EducationalInstitutionType { get; set; }

        public string EducationalInstitutionName { get; set; }
    }
}
