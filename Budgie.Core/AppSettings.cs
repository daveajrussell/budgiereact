using Budgie.Core.Contracts.Settings;

namespace Budgie.Core
{
    public class AppSettings : IAppSettings
    {
        public string ConnectionString { get; set; }
        public string Secret { get; set; }
    }
}