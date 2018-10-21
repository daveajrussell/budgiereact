using System.Collections.Generic;
using System.Runtime.Serialization;
using Budgie.Core.Enums;

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
    public decimal TotalSaved { get; set; }

    [DataMember]
    public decimal IncomeVsExpenditure { get; set; }

    [DataMember]
    public IEnumerable<ApiIncome> Incomes { get; set; }

    [DataMember]
    public IEnumerable<ApiOutgoing> Outgoings { get; set; }

    [DataMember]
    public IEnumerable<ApiSaving> Savings { get; set; }

    [DataMember]
    public IEnumerable<ApiTransaction> Transactions { get; set; }
}