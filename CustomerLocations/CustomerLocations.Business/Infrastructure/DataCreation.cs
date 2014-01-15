using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CustomerLocations.Business.Infrastructure
{

    public class DataCreation
    {
        private readonly LocationsDb _db;

        public DataCreation()
        {
            _db = new LocationsDb();
        }

        public bool AddLocation(Location location)
        {
            //check if Id exists already
            try
            {
                var locations = (from t in _db.Locations
                                 where t.location_number == location.location_number
                                 select t).ToList();
                //Id exists, update existing record
                if (locations.Count >= 1)
                    return UpdateLocation(location);
                //Otherwise, create a new record
                _db.Locations.Add(location);
                return _db.SaveChanges() == 1;
            }
            catch (Exception e)
            {
                return false;
            }
            
        }

        

        public bool RemoveLocation(Location location)
        {
            var del = (from t in _db.Locations
                       where t.location_number == location.location_number
                       select t).First();
            _db.Locations.Remove(del);
            return _db.SaveChanges() == 1;
        }

        public bool UpdateLocation(Location location)
        {
            var update = (from t in _db.Locations
                          where t.location_number == location.location_number
                          select t).First();
            //do not allow to update the Primary key of a record
            //update.location_number = location.location_number;
            update.country = location.country;
            update.prefix = location.prefix;
            update.ph_number = location.ph_number;
            update.timespane = location.timespane;
            update.loc_enabled = location.loc_enabled;

            return _db.SaveChanges() == 1;
        }

    }
}
