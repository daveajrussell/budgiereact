using System;
using System.Runtime.Serialization;
using Budgie.Core.Enums;

[DataContract]
public class ApiTransaction
{
    [DataMember]
    public int Id { get; set; }

    [DataMember]
    public decimal Amount { get; set; }

    [DataMember]
    public DateTime Date { get; set; }

    [DataMember]
    public bool Resolved { get; set; }

    [DataMember]
    public string Notes { get; set; }

    [DataMember]
    public ApiCategory Category { get; set; }

    [DataMember]
    public int BudgetId { get; set; }
}