
using Application.Activities;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles () {
            // we are matching property names and it is going to update matching property names;
            CreateMap<Activity, Activity>(); 
            //from to
            CreateMap<Activity, ActivityDto>();
            CreateMap<Activity, ActivityDto>()
                .ForMember(d => d.HostUsername, o => o
                .MapFrom(s => s.Attendees.FirstOrDefault(x => x.IsHost)
                .AppUser.UserName
                ));
            CreateMap<ActivityAttendee, AttendeeDto>()
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
                .ForMember(d => d.Username, o => o.MapFrom(s => s.AppUser.UserName))
                .ForMember(d => d.Bio, o => o.MapFrom(s => s.AppUser.Bio))
                .ForMember(d => d.Image, o => o.MapFrom(s => s.AppUser.Photos.FirstOrDefault(x  => x.IsMain).Url));

            CreateMap<AppUser, Profiles.Profile>()
                .ForMember(d => d.Image, o => o.MapFrom(s => s.Photos.FirstOrDefault(x  => x.IsMain).Url));

        }
        
    }
}