
using Application.Activities;
using Application.Comments;
using Application.Profiles;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : AutoMapper.Profile
    {
        
        public MappingProfiles () {

            string currentUserName = null;
            
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
                .ForMember(d => d.Image, o => o.MapFrom(s => s.AppUser.Photos.FirstOrDefault(x  => x.IsMain).Url))
                .ForMember(ADto => ADto.FollowersCount, o => o.MapFrom(aA => aA.AppUser.Followers.Count))
                .ForMember(d => d.FollowingCount, o => o.MapFrom(aA => aA.AppUser.Followings.Count))
                .ForMember(d => d.Following,
                    o => o.MapFrom(s => s.AppUser.Followers.Any(x => x.Observer.UserName == currentUserName)));
                // .ForMember(ADto => ADto.Following, 
                // o => o.MapFrom(aA => aA.AppUser.Followers.Any(x => x.Observer.UserName == currentUserName)));

            CreateMap<AppUser, Profiles.Profile>()
                .ForMember(d => d.Image, o => o.MapFrom(s => s.Photos.FirstOrDefault(x  => x.IsMain).Url))
                .ForMember(d => d.FollowersCount, o => o.MapFrom(s => s.Followers.Count))
                .ForMember(d => d.FollowingCount, o => o.MapFrom(s => s.Followings.Count))
                .ForMember(d => d.Following, o => o.MapFrom(s => s.Followers.Any(x => x.Observer.UserName == currentUserName)));
            CreateMap<Comment, CommentDto>()
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.Author.DisplayName))
                .ForMember(d => d.Username, o => o.MapFrom(s => s.Author.UserName))
                .ForMember(d => d.Image, o => o.MapFrom(s => s.Author.Photos.FirstOrDefault(x => x.IsMain).Url));

            CreateMap<Activity, UserActivityDto >()
                .ForMember(d => d.HostUsername, o => o
                .MapFrom(s => s.Attendees.FirstOrDefault(x => x.IsHost)
                .AppUser.UserName
                ));

        }
        
    }
}