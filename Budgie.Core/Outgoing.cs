using System;

namespace Budgie.Core
{
    public class Outgoing : BaseEntity, IUserEntity
    {
        public DateTime? Date { get; set; }

        public bool Resolved { get; set; }

        public decimal Budgeted { get; set; }

        public decimal Actual { get; set; }

        public decimal Remaining { get; set; }

        public int CategoryId { get; set; }

        public virtual Category Category { get; set; }

        public int BudgetId { get; set; }

        public virtual Budget Budget { get; set; }

        public virtual User User { get; set; }

        public int UserId { get; set; }
    }
}