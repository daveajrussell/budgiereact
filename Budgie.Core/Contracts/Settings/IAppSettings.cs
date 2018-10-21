namespace Budgie.Core.Contracts.Settings
{
    public interface IAppSettings
    {
        string ConnectionString { get; }
        string Secret { get; }
    }
}