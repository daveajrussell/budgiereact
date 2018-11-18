using System.Collections.Generic;
using System.Runtime.Serialization;
using Budgie.Core.Enums;

namespace Budgie.Api.Models
{
    [DataContract]
    public class ApiBudget
    {
        [DataMember]
        public int Id { get; set; }

        [DataMember]
        public int Month { get; set; }

        [DataMember]
        public int Year { get; set; }

        [DataMember]
        public decimal TotalBudgeted { get; set; }

        [DataMember]
        public decimal TotalActuals { get; set; }

        [DataMember]
        public IEnumerable<ApiOutgoing> Outgoings { get; set; }

        [DataMember]
        public IEnumerable<ApiTransaction> Transactions { get; set; }

        [DataMember]
        public IEnumerable<ApiCategory> Categories { get; set; }
    }
}