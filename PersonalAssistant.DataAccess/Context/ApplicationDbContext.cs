using PersonalAssistant.DataAccess.Entities;
using PersonalAssistant.DataAccess.Identity;
using PersonalAssistant.DataAccess.Initializers;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace PersonalAssistant.DataAccess.Context
{
    public sealed class ApplicationDbContext : IdentityDbContext<User, Role, int>
    {
        public DbSet<Assignment> Assignments { get; set;}

        public DbSet<Discipline> Disciplines { get; set; }

        public DbSet<AssignmentType> AssignmentTypes { get; set; }

        public DbSet<Comment> Comments { get; set; }

        public DbSet<File> Files { get; set; }

        public DbSet<Room> Rooms { get; set; }

        public DbSet<UserRoom> UserRooms { get; set; }

        public DbSet<Message> Messages { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
            Database.EnsureCreated();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);

            new DefaultDatabaseInitializer().Initialize(modelBuilder);

            base.OnModelCreating(modelBuilder);
        }
    }
}
