using System;

namespace Budgie.Core
{
    public class Income : BaseEntity, IUserEntity
    {
        public decimal Actual { get; set; }

        public int CategoryId { get; set; }

        public virtual Category Category { get; set; }

        public int BudgetId { get; set; }

        public virtual Budget Budget { get; set; }

        public virtual User User { get; set; }

        public int UserId { get; set; }
    }
}