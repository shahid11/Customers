using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CustomerLocations.Business.Dto
{
    public class Location
    {
        public int LocNumber { get; set; }
        public string Country { get; set; }
        public string Prefix { get; set; }
        public string Phone { get; set; }
        public string Timespane { get; set; }
        public bool Enabled { get; set; }
        //public IEnumerable<Countries> Countries { get; set; }
        //public IEnumerable<Prefixes> Prefixes { get; set; }
        //public IEnumerable<Timespanes> TimeSpanes { get; set; }

    }

    public class Countries
    {
        public string Country { get; set; }
    }

    public class Prefixes
    {
        public string Prefix { get; set; }
    }

    public class Timespanes
    {
        public string Timespane { get; set; }
    }

}
