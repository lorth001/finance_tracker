using FinanceTrackerAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FinanceTrackerAPI.Repository.IRepository
{
    public interface ITransactionRepository
    {
        ICollection<Transaction> GetTransactions(string transactionMonth, string transactionDateStart, string transactionDateEnd, int macroUserId);

        Transaction GetTransaction(int transactionId);

        Transaction CreateTransaction(Transaction transaction, User user);

        Transaction UpdateTransaction(int transactionId, Transaction transaction, User user);

        Transaction DeleteTransaction(int transactionId);

        Transaction UpdateMerchant(int transactionId, string merchantName);

        bool Save();
    }
}
