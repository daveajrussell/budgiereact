using System.Runtime.Serialization;
using Budgie.Api.Enums;

[DataContract]
public class ApiDashboardSearchParams
{
    [DataMember]
    public DashboardRange Range { get; set; }
}