using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PersonalAssistant.DataAccess.Entities;

namespace PersonalAssistant.DataAccess.Configurations
{
    public class RoomConfiguration : IEntityTypeConfiguration<Room>
    {
        public void Configure(EntityTypeBuilder<Room> builder)
        {
            builder.HasKey(r => r.Id);

            builder.HasMany(r => r.UserRooms)
                .WithOne(ur => ur.Room)
                .HasForeignKey(ur => ur.RoomId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasMany(r => r.Messages)
                .WithOne(ur => ur.Room)
                .HasForeignKey(ur => ur.RoomId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
