using FinanceTrackerAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FinanceTrackerAPI.Repository.IRepository
{
    public interface ICategoryRepository
    {
        ICollection<Category> GetCategories(string transactionMonth, string transactionDateStart, string transactionDateEnd, int macroUserId);

        Category GetCategory(int categoryId);

        Category UpdateCategory(int categoryId, Category category);

        bool Save();
    }
}
