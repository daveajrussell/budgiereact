using System;

namespace Budgie.Core
{
    public class Saving : BaseEntity, IUserEntity
    {
        public DateTime? Date { get; set; }

        public bool Resolved { get; set; }

        public decimal Total { get; set; }

        public int CategoryId { get; set; }

        public virtual Category Category { get; set; }

        public int BudgetId { get; set; }

        public virtual Budget Budget { get; set; }

        public virtual User User { get; set; }

        public int UserId { get; set; }
    }
}