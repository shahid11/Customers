using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CustomerLocations.Business.Infrastructure;

namespace CustomerLocations.Business.Dto
{
    public class ExtraData
    {
        public IEnumerable<Country> Countries { get; set; }
        public IEnumerable<Prefix> Prefixes { get; set; }
        public IEnumerable<Timespane> TimeSpanes { get; set; }
    }
}
