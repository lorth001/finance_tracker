using System;
using System.ComponentModel.DataAnnotations;

namespace FinanceTrackerAPI.Models
{
    public class Merchant
    {
        [Key]
        public int MerchantId { get; set; }

        [Required]
        public string MerchantName { get; set; }

        public int MerchantCount { get; set; }

        [Required]
        public string CategoryColor { get; set; }

        public double SumTransactionAmount { get; set; }

        [Required]
        public int MacroUserId { get; set; }
    }
}
