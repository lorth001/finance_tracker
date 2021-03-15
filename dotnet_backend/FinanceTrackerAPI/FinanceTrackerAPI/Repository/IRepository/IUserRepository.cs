using FinanceTrackerAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FinanceTrackerAPI.Repository.IRepository
{
    public interface IUserRepository
    {
        User GetUser(int userId);

        User Authenticate(string email, string password);

        User CreateMacroUser(User user);

        User LoadUser(string token);

        bool Save();
    }
}
