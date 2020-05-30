using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using Newtonsoft.Json;

namespace EGUI_Calendar_React.Entities
{
    public class EventsContext
    {
        private readonly object _lock = new object();
        private readonly string fileName = "events.json";

        private Dictionary<string, Dictionary<int, List<Event>>> Events;

        public EventsContext()
        {
            Events = new Dictionary<string, Dictionary<int, List<Event>>>();

            Load();
        }

        public void Load()
        {
            if(File.Exists(fileName))
            {
                var json = File.ReadAllText(fileName);
                var events = JsonConvert.DeserializeObject<Event[]>(json);

                foreach(var e in events)
                {
                    AddEvent(e.Time, e.Name, e.ID, true);
                }
            }
        }

        public void Save()
        {
            Task.Run(() =>
            {
                lock (_lock)
                {
                    var events = new List<Event>();

                    foreach (var month in Events)
                    {
                        foreach (var day in month.Value)
                        {
                            foreach (var e in day.Value)
                            {
                                events.Add(e);
                            }
                        }
                    }
                    var json = JsonConvert.SerializeObject(events);
                    File.WriteAllText(fileName, json);
                }
            });
        }

        public void AddEvent(DateTime time, string name, Guid? id = null, bool skipSave = false)
        {
            var key = GetKey(time.Year, time.Month);

            if(!Events.ContainsKey(key))
            {
                Events.Add(key, new Dictionary<int, List<Event>>());
            }

            var inMonth = Events[key];
            if(!inMonth.ContainsKey(time.Day))
            {
                inMonth.Add(time.Day, new List<Event>());
            }

            var e = new Event
            {
                ID = id.HasValue ? id.Value : Guid.NewGuid(),
                Time = time,
                Name = name
            };

            inMonth[time.Day].Add(e);

            if (!skipSave) Save();
        }

        public int[] GetBusyDays(int year, int month)
        {
            var key = GetKey(year, month);
            if (!Events.ContainsKey(key)) return new int[0];

            return Events[key].Where(o => o.Value.Count > 0).Select(o => o.Key).ToArray();
        }

        public Event[] GetEvents(int year, int month, int day)
        {
            var key = GetKey(year, month);
            if (!Events.ContainsKey(key)) return new Event[0];

            var inMonth = Events[key];
            if (!inMonth.ContainsKey(day)) return new Event[0];

            return inMonth[day].ToArray();
        }

        public void Remove(int year, int month, int day, Guid id)
        {
            var key = GetKey(year, month);
            if (!Events.ContainsKey(key)) return;

            var inMonth = Events[key];
            if (!inMonth.ContainsKey(day)) return;

            var e = inMonth[day].FirstOrDefault(o => o.ID == id);
            if (e != null) inMonth[day].Remove(e);

            Save();
        }

        public void Update(Guid id, DateTime time, string name)
        {
            var key = GetKey(time.Year, time.Month);
            if (!Events.ContainsKey(key)) return;

            var inMonth = Events[key];
            if (!inMonth.ContainsKey(time.Day)) return;

            var e = inMonth[time.Day].FirstOrDefault(o => o.ID == id);
            if (e != null)
            {
                e.Time = time;
                e.Name = name;
            }

            Save();
        }

        public Event GetEvent(int year, int month, int day, Guid id)
        {
            var key = GetKey(year, month);
            if (!Events.ContainsKey(key)) return null;

            var inMonth = Events[key];
            if (!inMonth.ContainsKey(day)) return null;

            return inMonth[day].FirstOrDefault(o => o.ID == id);
        }

        private string GetKey(int year, int month)
        {
            return $"{year}-{month}";
        }
    }
}
