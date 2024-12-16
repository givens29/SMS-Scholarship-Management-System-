using Microsoft.EntityFrameworkCore;
using System.Data;
using WebApplication3.Models;

namespace WebApplication3.Data
{
    public class DataContext:DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {

        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Account>()
           .HasMany(a => a.SentMessages)
           .WithOne(m => m.sender)
           .HasForeignKey(m => m.SenderId)
           .OnDelete(DeleteBehavior.Restrict); 

            modelBuilder.Entity<Account>()
            .HasMany(a => a.ReceivedMessages)
            .WithOne(m => m.receipant)
            .HasForeignKey(m => m.RecipientId)
            .OnDelete(DeleteBehavior.Restrict); 
        }
        public DbSet<NewStudent> NewStudents { get; set; }
        public DbSet<Student> Students { get; set; }
        public DbSet<Manager> Managers { get; set; }
        public DbSet<Academic> Academics { get; set; }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Bank> Banks { get; set; }
        public DbSet<Expense> Expenses { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Parent> Parents { get; set; }
        public DbSet<University> Universities { get; set; }
        public DbSet<StorageToken> StorageTokens { get; set; }
    }
}
