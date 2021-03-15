using System;
using System.ComponentModel.DataAnnotations;

namespace FinanceTrackerAPI.Models
{
    public class User
    {
        [Key]
        public int MacroUserId { get; set; }

        public int MicroUserId { get; set; }

        public string FullName { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
