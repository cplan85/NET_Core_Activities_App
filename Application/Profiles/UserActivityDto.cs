using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Application.Profiles
{
    public class UserActivityDto
    {
        public Guid Id { get; set; }
        public string Title {get; set; }
        public string Category { get; set; }
        public DateTime Date  { get; set; } 

        // to help us out, but it will not be returned by the server
        [JsonIgnore]
         public string HostUsername { get; set; }    

    }
}