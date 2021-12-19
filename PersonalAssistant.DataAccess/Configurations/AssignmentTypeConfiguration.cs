using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PersonalAssistant.DataAccess.Entities;

namespace PersonalAssistant.DataAccess.Configurations
{
    public class AssignmentTypeConfiguration : IEntityTypeConfiguration<AssignmentType>
    {
        public void Configure(EntityTypeBuilder<AssignmentType> builder)
        {
            builder.HasKey(at => at.Id);

            builder.HasMany(at => at.Assignments)
                .WithOne(a => a.AssignmentType)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
