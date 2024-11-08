using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Activities;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    // ALlowAnonymous would override any authentication rules
    //[AllowAnonymous]
    //when we specify BaseApiController, this means that we get the dat ApiController and Route from BaseApiController
    public class ActivitiesController: BaseApiController
    {
        // private readonly DataContext _context;
        // public ActivitiesController(DataContext context)
        // {
        //     _context = context;
        // }

        [HttpGet] // api/activities
        public async Task<IActionResult> GetActivities(CancellationToken ct)
        {
            return HandleResult(await Mediator.Send(new List.Query(), ct));
        }


        [HttpGet("{id}")] //api/activiteis/{guid}
        public async Task<IActionResult> GetActivity(Guid id) 
        {
            return HandleResult( await Mediator.Send(new Details.Query{Id = id}) );
        }

           [HttpPost] //api/activiteis/{guid}
           // when we use IActionResult, we get like request ok
        public async Task<IActionResult> CreateActivity(Activity activity)  
        {
            return HandleResult( await Mediator.Send(new Create.Command {Activity = activity}) );
           
        }
        [Authorize(Policy = "IsActivityHost")]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditActivity(Guid id, Activity activity)
        {
            activity.Id = id;
           return HandleResult( await Mediator.Send(new Edit.Command{Activity = activity}) );
        }

        [Authorize(Policy = "IsActivityHost")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command{Id = id}) );
        }

        [HttpPost("{id}/attend")]
        public async Task<IActionResult> Attend(Guid id)  
        {
            //id refers to activity id
            return HandleResult( await Mediator.Send(new UpdateAttendance.Command {Id = id}) );
           
        }

    }
}