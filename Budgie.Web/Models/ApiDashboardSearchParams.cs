using System.Runtime.Serialization;
using Budgie.Api.Enums;

namespace Budgie.Api.Models
{
    [DataContract]
    public class ApiDashboardSearchParams
    {
        [DataMember]
        public DashboardRange Range { get; set; }
    }
}