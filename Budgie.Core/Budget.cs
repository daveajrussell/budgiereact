using System.Collections.Generic;

namespace Budgie.Core
{
    public class Budget : BaseEntity, IUserEntity
    {
        public int Month { get; set; }

        public int Year { get; set; }

        public int UserId { get; set; }

        public virtual User User { get; set; }

        public virtual ICollection<Income> Incomes { get; set; } = new List<Income>();

        public virtual ICollection<Outgoing> Outgoings { get; set; } = new List<Outgoing>();

        public virtual ICollection<Saving> Savings { get; set; } = new List<Saving>();

        public virtual ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
    }
}
