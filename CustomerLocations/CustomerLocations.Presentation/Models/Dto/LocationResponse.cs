using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CustomerLocations.Presentation.Models.Dto
{
    public class LocationResponse
    {
        public IEnumerable<Location> Locations { get; set; }
        public ExtraData ExtraData { get; set; }
    }
}