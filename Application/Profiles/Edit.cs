using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class Edit
    {
         public class Command: IRequest<Result<Unit>>
        {

            public string DisplayName { get; set; }

            public string Bio { get; set; }
        }

             public class CommandValidator: AbstractValidator<Command>
        {
             public CommandValidator() {
                 RuleFor(x => x.DisplayName).NotEmpty();
             }

            
        }
    
    public class Handler: IRequestHandler<Command, Result<Unit>>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor) {
            _context = context;
            _userAccessor = userAccessor;
            
        }
        
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var matchingUser = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());


                if (matchingUser == null) return null;

                matchingUser.Bio = request.Bio ?? matchingUser.Bio;
                matchingUser.DisplayName = request.DisplayName ?? matchingUser.DisplayName;
                 

                var result =  await _context.SaveChangesAsync() > 0;

                if(!result) return Result<Unit>.Failure("Failed to update the user");

               return Result<Unit>.Success(Unit.Value);

            }
        }
    }
}