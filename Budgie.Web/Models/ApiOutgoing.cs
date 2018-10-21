using System;
using System.Runtime.Serialization;
using Budgie.Core.Enums;

[DataContract]
public class ApiOutgoing
{
    [DataMember]
    public int Id { get; set; }

    [DataMember]
    public DateTime Date { get; set; }

    [DataMember]
    public bool Resolved { get; set; }

    [DataMember]
    public decimal Budgeted { get; set; }

    [DataMember]
    public decimal Actual { get; set; }

    [DataMember]
    public decimal Remaining => Budgeted - Actual;

    [DataMember]
    public ApiCategory Category { get; set; }

    [DataMember]
    public ApiBudget Budget { get; set; }
}