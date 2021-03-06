using System;
using System.Runtime.Serialization;
using Budgie.Core.Enums;

namespace Budgie.Api.Models
{
    [DataContract]
    public class ApiOutgoing
    {
        [DataMember]
        public int Id { get; set; }

        [DataMember]
        public decimal Budgeted { get; set; }

        [DataMember]
        public decimal Actual { get; set; }

        [DataMember]
        public decimal Remaining => Budgeted - Actual;

        [DataMember]
        public ApiCategory Category { get; set; }
    }
}