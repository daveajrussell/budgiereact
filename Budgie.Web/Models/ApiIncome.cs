using System;
using System.Runtime.Serialization;
using Budgie.Core.Enums;

[DataContract]
public class ApiIncome
{
    [DataMember]
    public int Id { get; set; }

    [DataMember]
    public DateTime Date { get; set; }

    [DataMember]
    public bool Resolved { get; set; }

    [DataMember]
    public decimal Total { get; set; }

    [DataMember]
    public ApiCategory Category { get; set; }

    [DataMember]
    public ApiBudget Budget { get; set; }
}