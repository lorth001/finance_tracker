using System;
using System.ComponentModel.DataAnnotations;

namespace FinanceTrackerAPI.Models
{
    public class Transaction
    {
        [Key]
        public int TransactionId { get; set; }

        [Required]
        public DateTime TransactionDate { get; set; }

        [Required]
        public decimal TransactionAmount { get; set; }

        [Required]
        public string MerchantName { get; set; }

        [Required]
        public string CategoryName { get; set; }

        public string CategoryColor { get; set; }

        [Required]
        public double Longitude { get; set; }

        [Required]
        public double Latitude { get; set; }

        [Required]
        public string Address { get; set; }

        [Required]
        public string MemberName { get; set; }

        [Required]
        public string AccountName { get; set; }

        public int MicroUserId { get; set; }

        public int MacroUserId { get; set; }
    }
}