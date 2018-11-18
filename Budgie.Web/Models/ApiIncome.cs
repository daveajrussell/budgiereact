using System;
using System.Runtime.Serialization;
using Budgie.Core.Enums;

namespace Budgie.Api.Models
{
    [DataContract]
    public class ApiIncome
    {
        [DataMember]
        public int Id { get; set; }

        [DataMember]
        public decimal Budgeted { get; set; }

        [DataMember]
        public decimal Actual { get; set; }

        [DataMember]
        public ApiCategory Category { get; set; }
    }
}