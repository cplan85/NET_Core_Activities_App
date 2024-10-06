using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Activities;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    //when we specify BaseApiController, this means that we get the dat ApiController and Route from BaseApiController
    public class ActivitiesController: BaseApiController
    {
        // private readonly DataContext _context;
        // public ActivitiesController(DataContext context)
        // {
        //     _context = context;
        // }

        [HttpGet] // api/activities
        public async Task<ActionResult<List<Activity>>> GetActivities(CancellationToken ct)
        {
            return await Mediator.Send(new List.Query(), ct);
        }

        [HttpGet("{id}")] //api/activiteis/{guid}
        public async Task<ActionResult<Activity>> GetActivity(Guid id) 
        {
            return await Mediator.Send(new Details.Query{Id = id});
        }

           [HttpPost] //api/activiteis/{guid}
           // when we use IActionResult, we get like request ok
        public async Task<IActionResult> CreateActivity(Activity activity)  
        {
            await Mediator.Send(new Create.Command {Activity = activity});
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditActivity(Guid id, Activity activity)
        {
            activity.Id = id;
            await Mediator.Send(new Edit.Command{Activity = activity});
            return Ok();
        }

          [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id)
        {
            await Mediator.Send(new Delete.Command{Id = id});
            return Ok();
        }

    }
}