using Microsoft.EntityFrameworkCore;
using StreamingPlatform.Domain.Entities;

namespace StreamingPlatform.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Category> Categories { get; set; } = null!;
    public DbSet<ServiceContent> Content { get; set; } = null!;
    public DbSet<FeaturedItem> FeaturedItems { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder); // 👈 was missing

        builder.Entity<User>(e =>
        {
            e.HasKey(u => u.Id);
            e.HasIndex(u => u.Email).IsUnique();
            e.HasIndex(u => u.Username).IsUnique();
        });

        builder.Entity<Category>(e =>
        {
            e.HasKey(c => c.Id);
        });

        builder.Entity<ServiceContent>(e =>
        {
            e.HasKey(c => c.Id);

            // 👇 Explicitly ignore shadow-state duplicates by being precise
            e.HasOne(c => c.Category)
             .WithMany()
             .HasForeignKey(c => c.CategoryId)
             .IsRequired()
             .OnDelete(DeleteBehavior.Restrict);

            e.HasOne(c => c.User)
             .WithMany()
             .HasForeignKey(c => c.UserId)
             .IsRequired()
             .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<FeaturedItem>(e =>
        {
            e.HasKey(f => f.Id);
        });
    }
}