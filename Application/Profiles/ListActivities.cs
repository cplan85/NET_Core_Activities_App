using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class ListActivities
    {
        public class Query : IRequest<Result<List<UserActivityDto>>> {

             public string Predicate { get; set; }

            public string Username { get; set; }
        }

        public class Handler: IRequestHandler<Query, Result<List<UserActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
                _mapper = mapper;
            }
                       public async Task<Result<List<UserActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var userActivities = new List<UserActivityDto>();

                switch (request.Predicate)
                {
                    //currentUserName comes from MappingProfiles
                    case "hosting":
                    userActivities = await _context.Activities.Where(x => x.Attendees.Any(y => y.AppUser.UserName == request.Username && y.IsHost == true))
                     .ProjectTo<UserActivityDto>(_mapper.ConfigurationProvider, new {currentUserName = _userAccessor.GetUsername()})
                    .ToListAsync();
                    break;
                     case "past":
                    userActivities = await _context.Activities.Where(x => x.Date < DateTime.Now &&
                    x.Attendees.Any(y => y.AppUser.UserName == request.Username)
                    )
                    .ProjectTo<UserActivityDto>(_mapper.ConfigurationProvider, new {currentUserName = _userAccessor.GetUsername()})
                    .ToListAsync();
                    break;
                     case "future":
                    userActivities = await _context.Activities.Where(x => x.Date > DateTime.Now &&
                    x.Attendees.Any(y => y.AppUser.UserName == request.Username)
                    )
                    .ProjectTo<UserActivityDto>(_mapper.ConfigurationProvider, new {currentUserName = _userAccessor.GetUsername()})
                    .ToListAsync();
                    break;
                    
                }

                return Result<List<UserActivityDto>>.Success(userActivities);
            }
        }
    }
}