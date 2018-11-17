using System;
using System.Collections.Generic;
using Budgie.Core.Enums;

namespace Budgie.Core
{
    public class Category : BaseEntity, IUserEntity
    {
        public string Name { get; set; }

        public CategoryType Type { get; set; }

        public string ColourHex { get; set; }

        public int UserId { get; set; }

        public virtual User User { get; set; }

        public virtual ICollection<Transaction> Transactions { get; set; }
    }
}
