namespace Budgie.Framework.Models
{
    public class Token
    {
        public int UserId { get; set; }

        public Token()
        {

        }

        public Token(int userId)
        {
            UserId = userId;
        }
    }
}
