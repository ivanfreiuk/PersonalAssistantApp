using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PersonalAssistant.DataAccess.Entities;

namespace PersonalAssistant.DataAccess.Configurations
{
    public class AssignmentConfiguration: IEntityTypeConfiguration<Assignment>
    {
        public void Configure(EntityTypeBuilder<Assignment> builder)
        {
            builder.HasKey(a => a.Id);
            builder.HasOne(a => a.Creator)
                .WithMany(u => u.CreatorAssignments)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(a => a.Executor)
                .WithMany(u => u.ExecutorAssignments)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(a => a.AssignmentType)
                .WithMany(at => at.Assignments)
                .OnDelete(DeleteBehavior.SetNull);

            builder.HasOne(a => a.Discipline)
                .WithMany(d => d.Assignments)
                .OnDelete(DeleteBehavior.SetNull);

            builder.HasMany(a => a.Comments)
                .WithOne(c => c.Assignment)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasMany(a => a.Files)
                .WithOne(c => c.Assignment)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
