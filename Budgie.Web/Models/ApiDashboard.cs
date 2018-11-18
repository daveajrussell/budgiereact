using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace Budgie.Api.Models
{
    [DataContract]
    public class ApiDashboard
    {
        [DataMember]
        public List<string> Labels { get; set; }

        [DataMember]
        public List<ApiDataset> Datasets { get; set; }
    }

    [DataContract]
    public class ApiDataset
    {
        [DataMember]
        public string Label { get; set; }

        [DataMember]
        public string BackgroundColor { get; set; }

        [DataMember]
        public List<decimal> Data { get; set; }
    }
}