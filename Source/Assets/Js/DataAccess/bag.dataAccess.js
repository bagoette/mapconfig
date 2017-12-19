// Initialize packages
const fs = require('fs');
const { parseString } = require('xml2js');
const { electron } = require('electron');

// Declare Machines array
let Machines = [];

// Declare current machine
let CurrentMachine;

// Declare last selected item
let SelectedListItem;

// Flag indicating if input/select elements are enabled
let ElementsEnabled = false;

// Add SetupElements to the OnLoad callbacks
OnLoad(SetAllElementStates);
OnLoad(InitBtnStates);
OnLoad(GetMachineDataFromFiles);

// Add all machines to machineList <ul>
function FillMachineList()
{
   // Loop all machines...
   ForEach(Machines, (machine, index) =>
   {
      // Get machineList <ul> from document
      var ul = document.getElementById("machineList");

      // Create <li>, set class and innerHTML
      var li = document.createElement("li");
      li.setAttribute("class", "list-group-item d-flex justify-content-between align-items-center");
      li.setAttribute("data-machine-index", index);
      li.innerHTML = machine.Name;

      // Add click listener for <li>
      li.addEventListener("click", ListItemClicked);

      // Create <span>, set class and innerHTML
      var span = document.createElement("span");
      span.setAttribute("class", "badge badge-primary badge-pill");
      span.innerHTML = machine.Railroad;

      // Add elements to <ul>
      li.appendChild(span);
      ul.appendChild(li);
   });
}

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
      Machines.push(machine);
   }
}

// Extracts gps data from xml to Machine array
function GetGpsDataFromXml(xml)
{
   // Loop all items in marker array
   ForEach(xml.markers.marker, (data) =>
   {
      // Create machine and set gps data
      var machine = new Machine();
      machine.SetGpsData(data.$);

      // Add to Machines array
      Machines.push(machine);
   });
}

// Extracts connection data from xml to Machine array
function GetIpDataFromXml(xml)
{
   // Loop all items in marker array
   ForEach(xml.markers.marker, (data) =>
   {
      // Find machine object with same name as xml data
      var machine = Machines.find((item) =>
      {
         // True when names match
         return item.Name === data.$.name;
      });
      
      // Check for mismatched sized xml files
      if (machine !== undefined)
         machine.SetIpData(data.$);
   });
}

// Disable the buttons that shouldn't work on startup
function InitBtnStates()
{
   let buttons = 
   [
      document.getElementById("cancelBtn"),
      document.getElementById("deleteBtn"),
      document.getElementById("undoBtn"),
   ];

   ForEach(buttons, (button) =>
   {
      button.classList.add("disabled");

      let attr = document.createAttribute('disabled');
      button.setAttributeNode(attr);
   });
}

function InputOnKeyDown(input, event)
{
   console.log(input, event);
   return true;
}

// Called when user releases key in input
function InputOnKeyUp(input, event)
{
   // If key press matches below, return
   if (event.key === "Shift" ||
       event.key === "Control" ||
       event.key === "CapsLock" ||
       event.key === "Alt" ||
       event.key === "ArrowUp" ||
       event.key === "ArrowDown" ||
       event.key === "ArrowLeft" ||     
       event.key === "ArrowRight"   
      ) return;

   ValidateInputData(input);
}

// Checks if the input value is longer than length
function CheckInputLength(input, length)
{
   if (input.value.length > length)
   {
      // Exctract last value and set to the input
      let lastValue = input.value.substring(0, length);
      input.value = lastValue;

      // True means input length was too long
      return true;
   }

   // False means input length was okay
   return false;
}

// Checks whether input data matches that of what is required
function ValidateInputData(input)
{
   // If input box is empty...
   if (input.value === "")
   {
      // Remove validation classes
      input.classList.remove("is-valid");
      input.classList.remove("is-invalid");

      // Do nothing and return
      return;
   }

   // Define function to set valid state
   const validate = (match, flag) =>
   {
      // If match isn't null...
      if (match !== null)
      {
         if (flag && match[0].search(".") !== -1)
         {
            let octets = match[0].split(".");
            let valid = true;

            ForEach(octets, (octet) =>
            {
               if (octet > 254)
                  valid = false;
            });

            if (!valid)
            {
               // Add is-invalid and remove is-valid
               input.classList.add("is-invalid");
               input.classList.remove("is-valid");

               return;
            }
         }

         // Add is-valid and remove is-invalid
         input.classList.add("is-valid");
         input.classList.remove("is-invalid");

      }
      else
      {
         // Add is-invalid and remove is-valid
         input.classList.add("is-invalid");
         input.classList.remove("is-valid");
      }
   };

   // Get input ID
   let inputId = input.getAttributeNode("id").value;

   // Declare regex object
   let regex;
      
   // Based on what input this is, validate its data
   switch (inputId)
   {
      case "railroadInput":
         // If input length is too long, return
         if (CheckInputLength(input, 10)) return;

         // Define regex pattern. ie CSX or CSX-NS
         regex = new RegExp("(?:^[A-Z]{1,10}-(?=[A-Z]{1,10})[A-Z]{1,10}$|^[A-Z]{1,10}$)");
            
         // Validate input against the pattern
         validate(regex.exec(input.value));

         break;

      case "dateInput":
         // If input length is too long, return
         if (CheckInputLength(input, 10)) return;

         // Define regex pattern. ie 12/10/1985
         regex = new RegExp("(?:^[0-9]{2}/[0-9]{2}/[0-9]{4}$)");
            
         // Validate input against the pattern
         validate(regex.exec(input.value));

         break;

      case "timeInput":
         // If input length is too long, return
         if (CheckInputLength(input, 8)) return;

         // Define regex pattern. ie 12:45:00
         regex = new RegExp("(?:^[0-9]{2}:[0-9]{2}:[0-9]{2}$)");
            
         // Validate input against the pattern
         validate(regex.exec(input.value));

         break;

      case "latInput":
      case "lngInput":
         // If input length is too long, return
         if (CheckInputLength(input, 15)) return;

         // Define regex pattern. ie 39.4126789 or -101.98473
         regex = new RegExp("(?:^-(?=[1-9]{1}[0-9]{0,2}\\.[0-9]{1,10}$)[1-9]{1}[0-9]{0,2}\\.[0-9]{1,10}$" + 
                            "|^[1-9]{1}[0-9]{0,2}\\.[0-9]{1,10}$" + 
                            "|^[1-9]{1}[0-9]{0,2}$" + 
                            "|^-(?=[1-9]{1}[0-9]{0,2}$))");
            
         // Validate input against the pattern
         validate(regex.exec(input.value));

         break;

      case "speedInput":
         // If input length is too long, return
         if (CheckInputLength(input, 14)) return;

         // Define regex pattern. ie 25.2232345
         regex = new RegExp("(?:^[1-9]{1}[\\d]{0,2}\\.[\\d]{1,10}$|^[1-9]{1}[\\d]{0,2}$)");
            
         // Validate input against the pattern
         validate(regex.exec(input.value));

         break;

         case "ip1Input":
         case "ip2Input":
         case "ip3Input":
            // If input length is too long, return
            if (CheckInputLength(input, 15)) return;

            // Define regex pattern. ie 192.168.1.30
            regex = new RegExp("(?:^[1-9]{1}[\\d]{0,2}\\.[1-9]{1}[\\d]{0,2}\\.[1-9]{1}[\\d]{0,2}\\.[1-9]{1}[\\d]{0,2}$)");
            
            // Validate input against the pattern
            validate(regex.exec(input.value), true);
   
            break;
   }
}

// Called when machine list item is clicked
function ListItemClicked(event)
{
   // Set element to "this"
   let element = this;

   // Get machine index to access Machines
   let index = element.getAttribute("data-machine-index");
   let machine = Machines[index];
   
   // Return if machine wasn't found
   if (machine === undefined)
   {
      console.log("Couldn't find machine...");
      return;
   }

   // Return if updating selected machine fails
   if (!UpdateSelectedListItem(element)) return;

   // Set current machine
   CurrentMachine = machine;

   // Update HTML elements
   UpdateElementsWithData(machine);
}

function TryRemoveMachine()
{
   let response = confirm(`Are you sure you want to delete ${CurrentMachine.Name}?`);
   console.log(response);

}

// Set all data elements to initial state
function SetAllElementStates(enable)
{
   // Select elements
   var inputs = document.querySelectorAll(".form-control");
   var selects = document.querySelectorAll(".custom-select");
   
   // Loop through inputs to disable
   ForEach(inputs, function(input)
   {
      SetElementState(input, enable);
   });
   
   // Loop through selects to disable
   ForEach(selects, function(select)
   {
      SetElementState(select, enable);
   });

   // Set elements enabled flag
   ElementsEnabled = enable;
}

// Enables/disables the given element
function SetElementState(element, enable)
{
   // If element already has disabled attr...
   if (element.hasAttribute("disabled"))
      // Get the attribute
      var attr = element.getAttributeNode("disabled");
   // Otherwise...
   else
      // Create disabled attribute
      var attr = document.createAttribute("disabled");

   // If enable is true...
   if (enable)
      // Remove disabled attribute
      element.removeAttributeNode(attr);
   // Otherwise...
   else
      // Add disabled attribute
      element.setAttributeNode(attr);
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
      ReadFileAsync("D:\\BagSync\\Node Projects\\MapConfigTest\\Webroot\\GPS.xml"),
      ReadFileAsync("D:\\BagSync\\Node Projects\\MapConfigTest\\Webroot\\IP.xml"),
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

// Updates all HTML elements to show user machine data
function UpdateElementsWithData(machine)
{
   // Setup regex
   var regex = new RegExp('[A-Z]{1,}[0-9]{1,}');

   // Get shortened machine name
   let shortMachineName = regex.exec(machine.Name);

   // Set machine name title
   var machineNameInput = document.getElementById("machineName");
   machineNameInput.innerHTML = shortMachineName;

   // Get input elements
   var railroadInput = document.getElementById("railroadInput");
   var dateInput = document.getElementById("dateInput");
   var timeInput = document.getElementById("timeInput");
   var latInput = document.getElementById("latInput");
   var lngInput = document.getElementById("lngInput");
   var speedInput = document.getElementById("speedInput");
   var ip1Input = document.getElementById("ip1Input");
   var ip2Input = document.getElementById("ip2Input");
   var ip3Input = document.getElementById("ip3Input");

   // Get ip2 and ip3 containers
   var ip2Container = document.getElementById("ip2Container");
   var ip3Container = document.getElementById("ip3Container");

   // Get select elements
   var typeSelect = document.getElementById("typeSelect");
   var connectionsSelect = document.getElementById("connectionSelect");

   // Set value attributes
   railroadInput.value = machine.Railroad;
   dateInput.value = machine.Date;
   timeInput.value = machine.Time;
   latInput.value = machine.Latitude;
   lngInput.value = machine.Longitude;
   speedInput.value = machine.Speed;
   ip1Input.value = machine.Ip1;

   // Set connections selected index (0 based)
   connectionsSelect.selectedIndex = machine.Connections - 1;

   // If machine has an Ip2...
   if (machine.hasOwnProperty("Ip2"))
   {
      // Set value and make sure ip2 container is visible
      ip2Input.value = machine.Ip2;
      ip2Container.classList.remove("hidden");
   }
   // Otherwise...
   else
      // Hide the ip2 container
      ip2Container.classList.add("hidden");
      
   // If machine has an Ip3...
   if (machine.hasOwnProperty("Ip3"))
   {
      // Set value and make sure ip3 container is visible
      ip3Input.value = machine.Ip3;
      ip3Container.classList.remove("hidden");
   }
   // Otherwise...
   else
      // Hide the ip3 container
      ip3Container.classList.add("hidden");
      
   // Define typeSelect options based on connections
   ConnectionType.SetTypeSelectOptions(typeSelect, machine.Connections);

   // Set typeSelect selectedIndex (0 based)
   typeSelect.selectedIndex = ConnectionType.GetIndex(machine.Type);
}

// Sets the selected item to the newElement and toggles
// the "selected" class on both
function UpdateSelectedListItem(newElement)
{
   // Unselect last item if there was one
   if (SelectedListItem !== undefined)
   {
      // Return false if same item clicked
      if (SelectedListItem === newElement) return false;

      // Deselect previous item
      SelectedListItem.classList.remove("selected");
   }
   
   // Set this item as selected
   newElement.classList.add("selected");

   SelectedListItem = newElement;

   return true;
}