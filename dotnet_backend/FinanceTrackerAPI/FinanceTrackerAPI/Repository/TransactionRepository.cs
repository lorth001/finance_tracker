using FinanceTrackerAPI.Data;
using FinanceTrackerAPI.Models;
using FinanceTrackerAPI.Repository.IRepository;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;

namespace FinanceTrackerAPI.Repository
{
    public class TransactionRepository : ITransactionRepository
    {
        DbConnection conn = new DbConnection(); // instantiate new database connection
        DataTable table = new DataTable();
        DataMapper data = new DataMapper();

        public ICollection<Transaction> GetTransactions(string transactionMonth, string transactionDateStart, string transactionDateEnd, int macroUserId)
        {
            if (transactionMonth != null)
            {
                conn.OpenConnection();
                SqlDataAdapter sqlData = conn.QuerySproc("GET_TransactionsForMonth");
                sqlData.SelectCommand.Parameters.AddWithValue("TransactionMonth", transactionMonth);
                sqlData.SelectCommand.Parameters.AddWithValue("MacroUserId", macroUserId);
                sqlData.Fill(table);
                conn.CloseConnection();
                return data.MapTransaction(table);
            }
            else
            {
                if (transactionDateStart == null)
                {
                    transactionDateStart = "1900-01-01";
                }
                if (transactionDateEnd == null)
                {
                    transactionDateEnd = DateTime.Now.ToString("yyyy-MMM-dd");
                }
                conn.OpenConnection();
                SqlDataAdapter sqlData = conn.QuerySproc("GET_TransactionsBetween");
                sqlData.SelectCommand.Parameters.AddWithValue("TransactionDateStart", DateTime.Parse(transactionDateStart));
                sqlData.SelectCommand.Parameters.AddWithValue("TransactionDateEnd", DateTime.Parse(transactionDateEnd));
                sqlData.SelectCommand.Parameters.AddWithValue("MacroUserId", macroUserId);
                sqlData.Fill(table);
                conn.CloseConnection();
                return data.MapTransaction(table);
            }
        }

        public Transaction GetTransaction(int transactionId)
        {
            conn.OpenConnection();
            SqlDataAdapter sqlData = conn.QuerySproc("GET_TransactionById");
            sqlData.SelectCommand.Parameters.AddWithValue("TransactionId", transactionId);
            sqlData.Fill(table);
            conn.CloseConnection();

            return data.MapTransaction(table).FirstOrDefault();
        }

        public Transaction CreateTransaction(Transaction transaction, User user)
        {
            try
            {
                conn.OpenConnection();
                SqlCommand command = conn.InsertSproc("POST_CreateTransaction");
                command.Parameters.AddWithValue("TransactionDate", transaction.TransactionDate);
                command.Parameters.AddWithValue("TransactionAmount", transaction.TransactionAmount);
                command.Parameters.AddWithValue("MerchantName", transaction.MerchantName);
                command.Parameters.AddWithValue("CategoryName", transaction.CategoryName);
                command.Parameters.AddWithValue("Longitude", transaction.Longitude);
                command.Parameters.AddWithValue("Latitude", transaction.Latitude);
                command.Parameters.AddWithValue("Address", transaction.Address);
                command.Parameters.AddWithValue("MemberName", transaction.MemberName);
                command.Parameters.AddWithValue("AccountName", transaction.AccountName);
                command.Parameters.AddWithValue("MacroUserId", user.MacroUserId);

                using(var reader = command.ExecuteReader())
                {
                    while(reader.Read())
                    {
                        transaction.TransactionId = (int)reader[0];
                        transaction.CategoryColor = Convert.ToInt32(reader[1]).ToString("X");
                    }
                }

                conn.CloseConnection();

                return transaction;
            }
            catch
            {
                return null;
            }
        }

        public Transaction UpdateTransaction(int transactionId, Transaction transaction, User user)
        {
            try
            {
                conn.OpenConnection();
                SqlCommand command = conn.InsertSproc("PUT_UpdateTransaction");
                command.Parameters.AddWithValue("TransactionId", transactionId);
                command.Parameters.AddWithValue("TransactionDate", transaction.TransactionDate);
                command.Parameters.AddWithValue("TransactionAmount", transaction.TransactionAmount);
                command.Parameters.AddWithValue("MerchantName", transaction.MerchantName);
                command.Parameters.AddWithValue("CategoryName", transaction.CategoryName);
                command.Parameters.AddWithValue("Longitude", transaction.Longitude);
                command.Parameters.AddWithValue("Latitude", transaction.Latitude);
                command.Parameters.AddWithValue("Address", transaction.Address);
                command.Parameters.AddWithValue("MemberName", transaction.MemberName);
                command.Parameters.AddWithValue("AccountName", transaction.AccountName);
                command.Parameters.AddWithValue("MacroUserId", user.MacroUserId);

                //command.ExecuteNonQuery();
                transaction.CategoryColor = Convert.ToInt32(command.ExecuteScalar()).ToString("X");
                conn.CloseConnection();

                return transaction;
            }
            catch
            {
                return null;
            }
        }

        public Transaction DeleteTransaction(int transactionId)
        {
            try
            {
                conn.OpenConnection();
                SqlCommand command = conn.InsertSproc("DELETE_DeleteTransaction");
                command.Parameters.AddWithValue("TransactionId", transactionId);

                command.ExecuteNonQuery();
                conn.CloseConnection();

                return GetTransaction(transactionId);
            }
            catch
            {
                return null;
            }
        }

        public Transaction UpdateMerchant(int transactionId, string merchantName)
        {
            conn.OpenConnection();
            SqlDataAdapter sqlData = conn.QuerySproc("PATCH_MerchantName");
            sqlData.SelectCommand.Parameters.AddWithValue("TransactionId", transactionId);
            sqlData.SelectCommand.Parameters.AddWithValue("MerchantName", merchantName);
            sqlData.Fill(table);
            conn.CloseConnection();

            return data.MapTransaction(table).FirstOrDefault();
        }

        public bool Save()
        {
            throw new NotImplementedException();
        }
    }
}
