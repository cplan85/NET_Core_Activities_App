using System.Diagnostics;
using AutoMapper;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles () {
            // we are matching property names and it is going to update matching property names;
            CreateMap<Activity, Activity>(); 
        }
        
    }
}