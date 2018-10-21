using System;
using System.Runtime.Serialization;

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