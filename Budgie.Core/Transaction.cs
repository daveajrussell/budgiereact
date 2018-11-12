using System;

namespace Budgie.Core
{
    public class Transaction : BaseEntity, IUserEntity
    {
        public decimal Amount { get; set; }

        public DateTime Date { get; set; }

        public int CategoryId { get; set; }

        public virtual Category Category { get; set; }

        public int BudgetId { get; set; }

        public virtual Budget Budget { get; set; }

        public User User { get; set; }

        public int UserId { get; set; }
    }
}