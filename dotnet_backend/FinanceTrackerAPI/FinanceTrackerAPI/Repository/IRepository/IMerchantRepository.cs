using FinanceTrackerAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FinanceTrackerAPI.Repository.IRepository
{
    public interface IMerchantRepository
    {
        ICollection<Merchant> GetMerchants(string transactionMonth, string transactionDateStart, string transactionDateEnd, int macroUserId);

        Merchant GetMerchant(int merchantId);

        bool Save();
    }
}
