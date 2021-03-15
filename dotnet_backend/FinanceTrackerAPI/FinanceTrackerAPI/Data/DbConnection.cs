using System;
using System.Data;
using System.Data.SqlClient;

namespace FinanceTrackerAPI.Data
{
    class DbConnection
    {
        string ConnectionString = "Data Source=5CD8160CZV;Initial Catalog=FinancialScraper;Integrated Security=True";
        SqlConnection con;

        /* Open database connection */
        public void OpenConnection()
        {
            try
            {
                con = new SqlConnection(ConnectionString);
                con.Open();
            }
            catch (SqlException e)
            {
                Console.WriteLine(e.ToString());
            }
        }

        /* Close database connection */
        public void CloseConnection()
        {
            con.Close();
        }

        /* Query from Database */
        public SqlDataAdapter QuerySproc(string Query_)
        {
            SqlDataAdapter data = new SqlDataAdapter(Query_, con);
            data.SelectCommand.CommandType = CommandType.StoredProcedure;
            return data;
        }

        /* Insert into Database */
        public SqlCommand InsertSproc(string Query_)
        {
            SqlCommand data = new SqlCommand(Query_, con);
            data.CommandType = CommandType.StoredProcedure;
            return data;
        }
    }
}
