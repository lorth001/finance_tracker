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
    public class CategoryRepository : ICategoryRepository
    {
        DbConnection conn = new DbConnection(); // instantiate new database connection
        DataTable table = new DataTable();
        DataMapper data = new DataMapper();

        public ICollection<Category> GetCategories(string transactionMonth, string transactionDateStart, string transactionDateEnd, int macroUserId)
        {
            if (transactionMonth != null)
            {
                conn.OpenConnection();
                SqlDataAdapter sqlData = conn.QuerySproc("GET_CategoriesForMonth");
                sqlData.SelectCommand.Parameters.AddWithValue("TransactionMonth", transactionMonth);
                sqlData.SelectCommand.Parameters.AddWithValue("MacroUserId", macroUserId);
                sqlData.Fill(table);
                conn.CloseConnection();
                return data.MapCategory(table);
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
                SqlDataAdapter sqlData = conn.QuerySproc("GET_CategoriesBetween");
                sqlData.SelectCommand.Parameters.AddWithValue("TransactionDateStart", DateTime.Parse(transactionDateStart));
                sqlData.SelectCommand.Parameters.AddWithValue("TransactionDateEnd", DateTime.Parse(transactionDateEnd));
                sqlData.SelectCommand.Parameters.AddWithValue("MacroUserId", macroUserId);
                sqlData.Fill(table);
                conn.CloseConnection();
                return data.MapCategory(table);
            }
        }

        public Category GetCategory(int categoryId)
        {
            conn.OpenConnection();
            SqlDataAdapter sqlData = conn.QuerySproc("GET_CategoryById");
            sqlData.SelectCommand.Parameters.AddWithValue("CategoryId", categoryId);
            sqlData.Fill(table);
            conn.CloseConnection();

            return data.MapCategory(table).FirstOrDefault();
        }

        public Category UpdateCategory(int categoryId, Category category)
        {
            try
            {
                conn.OpenConnection();
                SqlCommand command = conn.InsertSproc("PUT_UpdateCategory");
                command.Parameters.AddWithValue("CategoryId", categoryId);
                command.Parameters.AddWithValue("CategoryName", category.CategoryName);

                command.ExecuteNonQuery();
                conn.CloseConnection();

                return category;
            }
            catch
            {
                return null;
            }
        }

        public bool Save()
        {
            throw new NotImplementedException();
        }
    }
}
