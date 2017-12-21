// Initialize packages
const fs = require('fs');
const xml2js = require('xml2js');
const parseString = xml2js.parseString;

const RootPath = "D:\\BagSync\\Node Projects\\MapConfigGit\\mapconfig\\Webroot\\";

// Declare Machines array
let Machines = [];

// Declare status message
let StatusMessage;

// Declare current machine
const CurrentMachine = 
{
   Value: null,

   Index: null,

   ListItem: null,

   SetListItem: function(item)
   {
      if (item === this.ListItem)
         return;

      this.ListItem = item;
   },

   SetValue: function(value, index)
   {
      if (value === this.Value) return;

      this.Value = value;
      this.Index = index;

      SetButtonState("deleteBtn", true);
   }
}

// Load machine data
OnLoad(GetMachineDataFromFiles);

// Set StatusMessage element on page load
OnLoad(() => StatusMessage = document.querySelector(".status-message"));

// Extracts data from GPS/IP.xml to Machine array
function GetDataFromXml(files)
{
   // Split out both files
   const gpsFile = files.GPS;
   const ipFile = files.IP;

   // Get machine count from each file
   const gpsLength = gpsFile.markers.marker.length;
   const ipLength = ipFile.markers.marker.length;

   // If lengths don't match throw error
   if (gpsLength !== ipLength)
      throw new Error("GPS and IP file have a different machine count.");

   // Loop through each machine
   for (var i = 0; i < gpsLength; i++)
   {
      // Get gps/ip object out of each marker
      let currentGps = gpsFile.markers.marker[i].$;
      let currentIp = ipFile.markers.marker[i].$;

      // If the machine names don't match throw error
      if (currentGps.name !== currentIp.name)
         throw new Error(`${currentGps.name} in GPS.xml doesn't match ${currentIp.name} in IP.xml.`);

      // Create machine and set gps data
      var machine = new Machine();
      machine.SetGpsData(currentGps);
      machine.SetIpData(currentIp);

      // Add to Machines array
      Machines[machine.Name] = machine;
   }
}

// Tries to remove a machine
function TryRemoveMachine()
{
   // Confirm with user for deletion
   let response = confirm(`Press OK to delete ${CurrentMachine.Value.Name} or Cancel keep.`);
   
   // If user says ok...
   if (response === true)
   {
      // Delete machine from array
      delete Machines[CurrentMachine.Value.Name];

      // Define ul element
      const ul = document.getElementById("machineList");

      // Remove the deleted machine's list item from ul
      RemoveListItemFromUl(CurrentMachine.ListItem, ul);

      // Set status message
      StatusMessage.innerHTML = `Deleted ${CurrentMachine.Value.Name}`;
   }

   // Update all inputs/selects with blank data
   UpdateElementsWithData(new Machine());
}

// Setter for CurentMachine
function SetCurrentMachine(newMachine)
{
   // Make sure value has changed
   if (CurrentMachine === newMachine)
      // Return false if value hasn't changed
      return false;

   // Set new value
   CurrentMachine = newMachine;

   SetButtonSate("deleteBtn", true);

   // Return true when new value was set
   return true;
}

// Reads a file asynchronously
function ReadFileAsync(path)
{
   // Return a promise to parsed file
   return new Promise((resolve, reject) =>
   {
      // Read file
      fs.readFile(path, (err, data) => 
      {
         // Parse xml to json
         parseString(data, (err, result) => 
         {
            // Callback result
            resolve(result);
         });
      });
   });
}

// Reads machine data from xmls, parses to objects,
// stores in memory and fills the view's list group
function GetMachineDataFromFiles()
{
   // Set up promise array of parsed files
   Promise.all
   ([
      ReadFileAsync(RootPath + "GPS.xml"),
      ReadFileAsync(RootPath + "IP.xml"),
   ])
   // When finished reading files...
   .then((files) =>
   {
      // Extract data into Machines array
      GetDataFromXml({ GPS: files[0], IP: files[1] });

      // Fill out document machine list
      FillMachineList();
   })
   .catch((error) => 
   {
      // Log errors to console
      console.log(error);
   });
}

function WriteMachinesToFiles()
{
   const builder = new xml2js.Builder();
   
   const combinedObject = { GPS: [], IP: [] };

   return new Promise((resolve, reject) =>
   {
      let machines = Object.keys(Machines).map((key) =>
      {
         return Machines[key];
      });

      ForEach(machines, (machine, index) =>
      {
         combinedObject.GPS.push(
            {
               marker: 
               { $: 
                  { 
                     name: machine.Name, 
                     rr: machine.Railroad,
                     date: machine.Date,
                     time: machine.Time,
                     yday: machine.Yday,
                     color: machine.Color,
                     lat: machine.Latitude,
                     lng: machine.Longitude,
                     speed: machine.Speed,
                     city: machine.City
                  }
               }
            });
   
         let ip = 
         {
            marker: 
            { $: 
               { 
                  name: machine.Name, 
                  ping: machine.Pingable,
                  type: machine.Type,
                  ip: machine.Ip1
               }
            }
         }
   
         if (machine.Ip2) ip.marker.$.ip1 = machine.Ip2;
         if (machine.Ip3) ip.marker.$.ip2 = machine.Ip3;
   
         combinedObject.IP.push(ip);
      });
   
      let gpsXml = builder.buildObject({ markers: combinedObject.GPS });
      let ipXml = builder.buildObject({ markers: combinedObject.IP });
   
      fs.writeFileSync(RootPath + "test_gps.xml", gpsXml);
      fs.writeFileSync(RootPath + "test_ip.xml", ipXml);
      
      resolve("Done saving machines to file!");
   })
}

function SaveMachines()
{
   WriteMachinesToFiles()
      .then((msg) => console.log(msg))
      .catch((err) => console.log(err))
}