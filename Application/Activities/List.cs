using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<Result<PagedList<ActivityDto>>> {

            public ActivityParams Params { get; set; }
        }

        public class Handler: IRequestHandler<Query, Result<PagedList<ActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly ILogger<List> _logger;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, ILogger<List> logger, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
                _logger = logger;
                _mapper = mapper;
            }
            public async Task<Result<PagedList<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken) {
                // throw new NotImplementedException();
                /* OLD DELAY FUNCTION
                try {
                    for (var i =0; i <1; i++)
                    {
                        cancellationToken.ThrowIfCancellationRequested();
                        await Task.Delay(1000, cancellationToken);
                        _logger.LogInformation($"Task {i} has completed");
                    }
                }
                catch (System.Exception) {
                    _logger.LogInformation("Task was cancelled");
                }
                */
                //cancellationTokesn alllow the server to stop the requests if a user exits out of the request

                var query = _context.Activities
                .Where(d => d.Date >= request.Params.StartDate)
                .OrderBy(d => d.Date)
                //ProjectTo coudl also be provided by the Select key word
                 .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider, 
                new {currentUserName = _userAccessor.GetUsername()})
                .AsQueryable();

                if (request.Params.IsGoing && !request.Params.IsHost) {
                    query = query.Where(d => d.Attendees.Any(a => a.Username == _userAccessor.GetUsername()));
                }

                if (request.Params.IsHost && !request.Params.IsGoing) {
                    query = query.Where(d => d.HostUsername == _userAccessor.GetUsername());
                }

                return Result<PagedList<ActivityDto>>.Success(
                    await PagedList<ActivityDto>.CreateAsync(query, request.Params.PageNumber, request.Params.PageSize)
                );
            }
        }
    }
}