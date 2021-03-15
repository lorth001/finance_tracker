using System;
using System.ComponentModel.DataAnnotations;

namespace FinanceTrackerAPI.Models
{
    public class Category
    {
        [Key]
        public int CategoryId { get; set; }

        [Required]
        public string CategoryName { get; set;}

        public int CategoryCount { get; set; }

        public string CategoryColor { get; set; }

        public double SumTransactionAmount { get; set; }

        [Required]
        public int MacroUserId { get; set; }
    }
}
