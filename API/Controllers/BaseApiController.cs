using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
        public class BaseApiController: ControllerBase
    {
        private IMediator _mediator;
        // can be in this class and any derived controllers
        protected IMediator Mediator => _mediator ??= 
        HttpContext.RequestServices.GetService<IMediator>();
    }
}