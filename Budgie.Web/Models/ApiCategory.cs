using System;
using System.Runtime.Serialization;
using Budgie.Core.Enums;

namespace Budgie.Api.Models
{
    [DataContract]
    public class ApiCategory
    {
        [DataMember]
        public int Id { get; set; }

        [DataMember]
        public string Name { get; set; }

        [DataMember]
        public string ColourHex { get; set; }

        [DataMember]
        public CategoryType Type { get; set; }
    }
}