using Budgie.Core;

namespace Budgie.Framework.Extensions
{
    public static class UserExtensions
    {
        public static string GetFullName(this User user)
        {
            return user.FirstName + " " + user.LastName;
        }
    }
}