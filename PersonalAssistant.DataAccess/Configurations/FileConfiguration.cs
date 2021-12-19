using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PersonalAssistant.DataAccess.Entities;
using PersonalAssistant.DataAccess.Identity;

namespace PersonalAssistant.DataAccess.Configurations
{
    public class FileConfiguration: IEntityTypeConfiguration<File>
    {
        public void Configure(EntityTypeBuilder<File> builder)
        {
            builder.HasKey(f => f.Id);

            builder.HasOne(f => f.Assignment)
                .WithMany(a => a.Files)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(f => f.User)
                .WithOne(u => u.Avatar)
                .HasForeignKey<User>(u=>u.AvatarId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
