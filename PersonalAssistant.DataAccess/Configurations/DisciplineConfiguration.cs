using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PersonalAssistant.DataAccess.Entities;

namespace PersonalAssistant.DataAccess.Configurations
{
    public class DisciplineConfiguration: IEntityTypeConfiguration<Discipline>
    {
        public void Configure(EntityTypeBuilder<Discipline> builder)
        {
            builder.HasKey(d => d.Id);

            builder.HasMany(d => d.Assignments)
                .WithOne(a => a.Discipline)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
