using FinanceTrackerAPI.Data;
using FinanceTrackerAPI.Models;
using FinanceTrackerAPI.Repository.IRepository;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Cryptography;

namespace FinanceTrackerAPI.Repository
{
    public class UserRepository : IUserRepository
    {
        DbConnection conn = new DbConnection(); // instantiate new database connection
        DataTable table = new DataTable();
        DataMapper data = new DataMapper();

        public User GetUser(int userId)
        {
            conn.OpenConnection();
            SqlDataAdapter sqlData = conn.QuerySproc("GET_UserById");
            sqlData.SelectCommand.Parameters.AddWithValue("MacroUserId", userId);
            sqlData.Fill(table);
            conn.CloseConnection();

            return data.MapUser(table).FirstOrDefault();
        }

        public User CreateMacroUser(User user)
        {
            try
            {
                // Hash password using custom class
                PasswordHash hash = new PasswordHash(user.Password);
                byte[] hashBytes = hash.ToArray();
                string hashedPassword = Convert.ToBase64String(hashBytes);

                conn.OpenConnection();
                SqlCommand command = conn.InsertSproc("POST_CreateMacroUser");
                command.Parameters.AddWithValue("FullName", user.FullName);
                command.Parameters.AddWithValue("Email", user.Email);
                command.Parameters.AddWithValue("Password", hashedPassword);

                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        user.MacroUserId = (int)reader[0];
                        user.Password = (reader[1]).ToString();
                    }
                }

                conn.CloseConnection();

                return user;
            }
            catch
            {
                return null;
            }
        }

        public User Authenticate(string email, string password)
        {
            conn.OpenConnection();
            SqlDataAdapter sqlData = conn.QuerySproc("GET_AuthenticateUser");
            sqlData.SelectCommand.Parameters.AddWithValue("Email", email);
            sqlData.Fill(table);
            conn.CloseConnection();

            var userEntity = data.MapUser(table).FirstOrDefault();

            if (userEntity == null)
            {
                return null;
            }

            // Check password against stored hash
            byte[] hashBytes = Convert.FromBase64String(userEntity.Password);
            PasswordHash hash = new PasswordHash(hashBytes);
            if (!hash.Verify(password))
            {
                return null;
            }

            return data.MapUser(table).FirstOrDefault();
        }

        public User LoadUser(string token)
        {
            var stream = token.Replace("Bearer ", "");
            var jwt = new JwtSecurityTokenHandler().ReadJwtToken(stream);
            var sub = jwt.Claims.First(Claim => Claim.Type == "sub").Value;
            var user = GetUser(Convert.ToInt32(sub));

            return user;
        }

        public bool Save()
        {
            throw new NotImplementedException();
        }
    }

    public sealed class PasswordHash
    {
        const int SaltSize = 16, HashSize = 20, HashIter = 10000;
        readonly byte[] _salt, _hash;
        public PasswordHash(string password)
        {
            new RNGCryptoServiceProvider().GetBytes(_salt = new byte[SaltSize]);
            _hash = new Rfc2898DeriveBytes(password, _salt, HashIter).GetBytes(HashSize);
        }
        public PasswordHash(byte[] hashBytes)
        {
            Array.Copy(hashBytes, 0, _salt = new byte[SaltSize], 0, SaltSize);
            Array.Copy(hashBytes, SaltSize, _hash = new byte[HashSize], 0, HashSize);
        }
        public PasswordHash(byte[] salt, byte[] hash)
        {
            Array.Copy(salt, 0, _salt = new byte[SaltSize], 0, SaltSize);
            Array.Copy(hash, 0, _hash = new byte[HashSize], 0, HashSize);
        }
        public byte[] ToArray()
        {
            byte[] hashBytes = new byte[SaltSize + HashSize];
            Array.Copy(_salt, 0, hashBytes, 0, SaltSize);
            Array.Copy(_hash, 0, hashBytes, SaltSize, HashSize);
            return hashBytes;
        }
        public byte[] Salt { get { return (byte[])_salt.Clone(); } }
        public byte[] Hash { get { return (byte[])_hash.Clone(); } }
        public bool Verify(string password)
        {
            byte[] test = new Rfc2898DeriveBytes(password, _salt, HashIter).GetBytes(HashSize);
            for (int i = 0; i < HashSize; i++)
                if (test[i] != _hash[i])
                    return false;
            return true;
        }
    }
}
