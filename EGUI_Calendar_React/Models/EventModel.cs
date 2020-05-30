using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json.Serialization;

namespace EGUI_Calendar_React.Models
{
    public class EventModel
    {
        public Guid? ID { get; set; }

        [JsonConverter(typeof(JsonTimeSpanConverter))]
        public TimeSpan? Time { get; set; }
        public string Name { get; set; }
    }
}
