using System.Collections.Generic;

namespace PersonalAssistant.DataAccess.Entities
{
    public class AssignmentType
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public IEnumerable<Assignment> Assignments { get; set; }
    }
}
