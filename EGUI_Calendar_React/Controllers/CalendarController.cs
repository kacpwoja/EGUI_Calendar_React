using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using EGUI_Calendar_React.Entities;
using EGUI_Calendar_React.Models;

namespace EGUI_Calendar_React.Controllers
{
    [ApiController]
    [Route("api")]
    public class CalendarController : ControllerBase
    {
        private readonly ILogger<CalendarController> _logger;
        private readonly EventsContext eventBase;

        public CalendarController(ILogger<CalendarController> logger, EventsContext events)
        {
            _logger = logger;
            this.eventBase = events;
        }

        [HttpGet("GetBusyDays")]
        public IActionResult GetBusyDays(int? year, int? month)
        {
            if (!year.HasValue || !month.HasValue) return BadRequest();

            try
            {
                return Ok(eventBase.GetBusyDays(year.Value, month.Value));
            }
            catch
            {
                return StatusCode(500);
            }
        }

        [HttpGet("GetEvents")]
        public IActionResult GetEvents(int? year, int? month, int? day)
        {
            if (!year.HasValue || !month.HasValue || !day.HasValue) return BadRequest();

            try
            {
                var events = eventBase.GetEvents(year.Value, month.Value, day.Value);

                return Ok(events.Select(o => new EventModel
                {
                    ID = o.ID,
                    Time = o.Time.TimeOfDay,
                    Name = o.Name
                }).OrderBy(o => o.Time));
            }
            catch
            {
                return StatusCode(500);
            }
        }

        [HttpPost("NewEvent")]
        public IActionResult NewEvent([FromBody]EventModel eventData, int? year, int? month, int? day)
        {
            if (!year.HasValue ||
                !month.HasValue ||
                !day.HasValue ||
                eventData == null ||
                eventData.Time == null ||
                eventData.Name == null)
                return BadRequest();

            try
            {
                var date = new DateTime(year.Value, month.Value, day.Value, eventData.Time.Value.Hours, eventData.Time.Value.Minutes, eventData.Time.Value.Seconds);
                eventBase.AddEvent(date, eventData.Name);

                return Ok();
            }
            catch
            {
                return StatusCode(500);
            }
        }

        [HttpPost("EditEvent")]
        public IActionResult EditEvent([FromBody]EventModel eventData, int? year, int? month, int? day)
        {
            if (!year.HasValue ||
                !month.HasValue ||
                !day.HasValue ||
                eventData == null ||
                eventData.ID == null ||
                eventData.Time == null ||
                eventData.Name == null)
                return BadRequest();

            try
            {
                var date = new DateTime(year.Value, month.Value, day.Value, eventData.Time.Value.Hours, eventData.Time.Value.Minutes, eventData.Time.Value.Seconds);
                eventBase.Update(eventData.ID.Value, date, eventData.Name);

                return Ok();
            }
            catch
            {
                return StatusCode(500);
            }
        }

        [HttpPost("RemoveEvent")]
        public IActionResult RemoveEvent(int? year, int? month, int? day, Guid? id)
        {
            if (!year.HasValue || !month.HasValue || !day.HasValue || !id.HasValue) return BadRequest();

            try
            {
                eventBase.Remove(year.Value, month.Value, day.Value, id.Value);

                return Ok();
            }
            catch
            {
                return StatusCode(500);
            }
        }
    }
}
