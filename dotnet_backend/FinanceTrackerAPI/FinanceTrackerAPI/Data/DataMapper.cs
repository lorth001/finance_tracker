using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Data;
using FinanceTrackerAPI.Models;

namespace FinanceTrackerAPI.Data
{
    public class DataMapper
    {
        public ICollection<Transaction> MapTransaction(DataTable table)
        {
            ICollection<Transaction> transactions = new Collection<Transaction>();

            foreach (DataRow row in table.Rows)
            {
                Transaction transaction = new Transaction();

                Console.WriteLine(row["longitude"].ToString());
                Console.WriteLine(row["latitude"].ToString());

                transaction.TransactionId = Convert.ToInt32(row["transaction_id"].ToString());
                transaction.TransactionDate = Convert.ToDateTime(row["transaction_date"].ToString());
                transaction.TransactionAmount = Convert.ToDecimal(row["transaction_amount"].ToString());
                transaction.MerchantName = row["merchant_name"].ToString();
                transaction.CategoryName = row["category_name"].ToString();
                transaction.CategoryColor = Convert.ToInt32(row["category_color"]).ToString("X");
                if (!Convert.IsDBNull(row["longitude"]))
                {
                    transaction.Longitude = Convert.ToDouble(row["longitude"].ToString());
                }
                if (!Convert.IsDBNull(row["latitude"]))
                {
                    transaction.Latitude = Convert.ToDouble(row["latitude"].ToString());
                }
                transaction.Address = row["address"].ToString();
                transaction.MemberName = row["member_name"].ToString();
                transaction.AccountName = row["account_name"].ToString();
                transaction.MicroUserId = Convert.ToInt32(row["micro_user_id"].ToString());
                transaction.MacroUserId = Convert.ToInt32(row["macro_user_id"].ToString());

                transactions.Add(transaction);
            }

            return transactions;
        }

        public ICollection<Category> MapCategory(DataTable table)
        {
            ICollection<Category> categories = new Collection<Category>();

            foreach (DataRow row in table.Rows)
            {
                Category category = new Category();

                category.CategoryId = Convert.ToInt32(row["category_id"].ToString());
                category.CategoryName = row["category_name"].ToString();
                if (!Convert.IsDBNull(row["category_count"]))
                category.CategoryCount = Convert.ToInt32(row["category_count"].ToString());
                category.CategoryColor = Convert.ToInt32(row["category_color"]).ToString("X");
                category.SumTransactionAmount = Convert.ToDouble(row["sum_transaction_amount"].ToString());
                category.MacroUserId = Convert.ToInt32(row["macro_user_id"].ToString());

                categories.Add(category);
            }

            return categories;
        }

        public ICollection<Merchant> MapMerchant(DataTable table)
        {
            ICollection<Merchant> merchants = new Collection<Merchant>();

            foreach (DataRow row in table.Rows)
            {
                Merchant merchant = new Merchant();

                merchant.MerchantId = Convert.ToInt32(row["merchant_id"].ToString());
                merchant.MerchantName = row["merchant_name"].ToString();
                merchant.MerchantCount = Convert.ToInt32(row["merchant_count"].ToString());
                merchant.CategoryColor = Convert.ToInt32(row["category_color"]).ToString("X");
                merchant.SumTransactionAmount = Convert.ToDouble(row["sum_transaction_amount"].ToString());
                merchant.MacroUserId = Convert.ToInt32(row["macro_user_id"].ToString());

                merchants.Add(merchant);
            }

            return merchants;
        }

        public ICollection<User> MapUser(DataTable table)
        {
            ICollection<User> users = new Collection<User>();

            foreach (DataRow row in table.Rows)
            {
                User user = new User();

                user.MacroUserId = Convert.ToInt32(row["macro_user_id"].ToString());
                user.MicroUserId = Convert.ToInt32(row["micro_user_id"].ToString());
                user.FullName = row["member_name"].ToString();
                user.Email = row["email"].ToString();
                user.Password = row["password"].ToString();

                users.Add(user);
            }

            return users;
        }
    }
}
