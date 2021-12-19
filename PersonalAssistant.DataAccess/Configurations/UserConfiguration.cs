using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PersonalAssistant.DataAccess.Entities;
using PersonalAssistant.DataAccess.Identity;

namespace PersonalAssistant.DataAccess.Configurations
{
    public class UserConfiguration: IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasKey(u => u.Id);

            builder.HasMany(u => u.CreatorAssignments)
                .WithOne(a => a.Creator)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasMany(u => u.ExecutorAssignments)
                .WithOne(a => a.Executor)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(u => u.Avatar)
                .WithOne(f => f.User)
                .HasForeignKey<File>(f=>f.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasMany(ur => ur.UserRooms)
                .WithOne(r => r.User)
                .HasForeignKey(u => u.UserId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
