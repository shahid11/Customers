using System.Collections.Generic;

namespace CustomerLocations.Services.Models.Dto
{
    public class ExtraData
    {
        public IEnumerable<Countries> Countries { get; set; }
        public IEnumerable<Prefixes> Prefixes { get; set; }
        public IEnumerable<Timespanes> TimeSpanes { get; set; }
    }
}
