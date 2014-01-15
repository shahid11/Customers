using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using CustomerLocations.Business.Dto;
using CustomerLocations.Business.Infrastructure;
using CustomerLocations.Services.Models;
using Location = CustomerLocations.Services.Models.Dto.Location;

namespace CustomerLocations.Services.Controllers
{
    public class LocationsController : ApiController
    {
        // GET api/locations

        readonly DataRetrieval _retrieval = new DataRetrieval();
        readonly DataCreation _creation = new DataCreation();
        public IEnumerable<Location> Get()
        {
            return DataConverter.ConvertLocationsFromBtoS(_retrieval.GetLocations());
        }

        // GET api/locations/5
        public HttpResponseMessage Get(int id)
        {
            try
            {
                var location = DataConverter.ConvertLocationFromBtoS(_retrieval.GetLocation(id));
                var response = Request.CreateResponse<Location>(HttpStatusCode.OK, location);
                return response;
            }
            catch (Exception e)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound,e);
            }
            
        }

        public ExtraData Get(bool extra)
        {
            return _retrieval.GetExtraData();
        }

        // POST api/locations
        /*sample json array for location
         * {LocNumber : "1122",
            Country : "Sweden",
            Prefix : "+46",
            Phone : "0733487819",
            Timespane : "24 Hour",
            Enabled : "True"}
         */
        public bool Post(Location location)
        {
            return _creation.AddLocation(DataConverter.ConvertLocationFromStoB(location));
        }

        // PUT api/locations/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/locations/5
        public void Delete(int id)
        {
        }
    }
}
