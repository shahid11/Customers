using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CustomerLocations.Services.Models.Dto;

namespace CustomerLocations.Services.Models
{
    public class DataConverter
    {
        public static IEnumerable<Location> ConvertLocationsFromBtoS(
            IEnumerable<Business.Infrastructure.Location> locations)
        {
            var locationDtOs = locations.Select(location => new Location
                                                           {
                                                               LocNumber = location.location_number,
                                                               Country = location.country,
                                                               Prefix = location.prefix,
                                                               Phone = location.ph_number,
                                                               Timespane = location.timespane,
                                                               Enabled = location.loc_enabled
                                                               
                                                           }).ToList();
            return locationDtOs;
        }


        public static IEnumerable<Business.Infrastructure.Location> ConvertLocationsFromStoB(
             IEnumerable<Location> locations)
        {
            var locationDtOs = locations.Select(location => new Business.Infrastructure.Location
            {
                location_number = location.LocNumber,
                country = location.Country,
                prefix = location.Prefix,
                ph_number = location.Phone,
                timespane = location.Timespane,
                loc_enabled = location.Enabled

            }).ToList();
            return locationDtOs;
        }


        public static Business.Infrastructure.Location ConvertLocationFromStoB(Location location)
        {
            var locationDto = new Business.Infrastructure.Location
                              {
                                  location_number=location.LocNumber,
                                  country=location.Country,
                                  prefix=location.Prefix,
                                  ph_number=location.Phone,
                                  timespane=location.Timespane,
                                  loc_enabled = location.Enabled
                              };
            return locationDto;
        }
        public static Location ConvertLocationFromBtoS(Business.Infrastructure.Location location)
        {
            var locationDto = new Location
            {
                LocNumber = location.location_number,
                Country = location.country,
                Prefix = location.prefix,
                Phone = location.ph_number,
                Timespane = location.timespane,
                Enabled = location.loc_enabled
            };
            return locationDto;
        }

    }
}