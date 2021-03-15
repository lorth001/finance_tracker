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
    public class MerchantRepository : IMerchantRepository
    {
        DbConnection conn = new DbConnection(); // instantiate new database connection
        DataTable table = new DataTable();
        DataMapper data = new DataMapper();

        public ICollection<Merchant> GetMerchants(string transactionMonth, string transactionDateStart, string transactionDateEnd, int macroUserId)
        {
            if (transactionMonth != null)
            {
                conn.OpenConnection();
                SqlDataAdapter sqlData = conn.QuerySproc("GET_MerchantsForMonth");
                sqlData.SelectCommand.Parameters.AddWithValue("TransactionMonth", transactionMonth);
                sqlData.SelectCommand.Parameters.AddWithValue("MacroUserId", macroUserId);
                sqlData.Fill(table);
                conn.CloseConnection();
                return data.MapMerchant(table);
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
                SqlDataAdapter sqlData = conn.QuerySproc("GET_MerchantsBetween");
                sqlData.SelectCommand.Parameters.AddWithValue("TransactionDateStart", DateTime.Parse(transactionDateStart));
                sqlData.SelectCommand.Parameters.AddWithValue("TransactionDateEnd", DateTime.Parse(transactionDateEnd));
                sqlData.SelectCommand.Parameters.AddWithValue("MacroUserId", macroUserId);
                sqlData.Fill(table);
                conn.CloseConnection();
                return data.MapMerchant(table);
            }
        }

        public Merchant GetMerchant(int merchantId)
        {
            conn.OpenConnection();
            SqlDataAdapter sqlData = conn.QuerySproc("GET_MerchantById");
            sqlData.SelectCommand.Parameters.AddWithValue("MerchantId", merchantId);
            sqlData.Fill(table);
            conn.CloseConnection();

            return data.MapMerchant(table).FirstOrDefault();
        }

        public bool Save()
        {
            throw new NotImplementedException();
        }

    }
}
