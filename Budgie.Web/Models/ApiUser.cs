using System;
using System.Runtime.Serialization;

namespace Budgie.Api.Models
{
    [DataContract]
    public class ApiUser
    {
        [DataMember]
        public string FirstName { get; set; }

        [DataMember]
        public string LastName { get; set; }

        [DataMember]
        public string Username { get; set; }

        [DataMember]
        public string Password { get; set; }
    }
}