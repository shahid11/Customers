using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CustomerLocations.Business.Dto;

namespace CustomerLocations.Business.Infrastructure
{
    public class DataRetrieval
    {
        private readonly LocationsDb _db;

        public DataRetrieval()
        {
            _db = new LocationsDb();
        }

        public IEnumerable<Location> GetLocations()
        {
            var locations = (from t in _db.Locations
                             select t).ToList();
            return locations;
        }

        public Location GetLocation(int locationId)
        {
            var location = (from t in _db.Locations
                            where t.location_number == locationId
                            select t).First();
            return location;
        }

        public ExtraData GetExtraData()
        {
            var extraData = new ExtraData
                            {
                                Countries = (from t in _db.Countries
                                             select t).ToList(),
                                Prefixes = (from t in _db.Prefixes
                                            select t).ToList(),
                                TimeSpanes = (from t in _db.Timespanes
                                              select t).ToList()
                            };
            return extraData;
        }
    }
}
