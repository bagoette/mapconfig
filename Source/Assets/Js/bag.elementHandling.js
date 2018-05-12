
// Add all machines to machineList <ul>
function FillMachineList()
{
   let machines = Object.keys(Machines).map((key) =>
   {
      return Machines[key];
   });

   // Loop all machines...
   ForEach(machines, (machine, index) =>
   {   
      // Setup regex
      var regex = new RegExp('[A-Z]{1,}[0-9]{1,}');

      // Get shortened machine name
      let shortName = regex.exec(machine.Name);

      // Get machineList <ul> from document
      let ul = document.getElementById("machineList");

      // Create <li>, set class and innerHTML
      let li = document.createElement("li");
      li.setAttribute("class", "list-group-item d-flex justify-content-between align-items-center");
      li.setAttribute("data-machine-index", index);
      li.innerHTML = shortName;

      // Add click listener for <li>
      li.addEventListener("click", ListItemClicked);

      // Create <span>, set class and innerHTML
      let span = document.createElement("span");
      span.setAttribute("class", "badge badge-primary badge-pill");
      span.innerHTML = machine.Railroad;

      // Add elements to <ul>
      li.appendChild(span);
      ul.appendChild(li);
   });
}

function ConnectionSelectChanged(select, event)
{
   if (!CurrentMachine.EditsExist)
      CurrentMachine.EditsExist = true;

   console.log(select.selectedIndex);
}

function TypeSelectChanged(select, event)
{
   if (!CurrentMachine.EditsExist)
      CurrentMachine.EditsExist = true;
      
   console.log(select.selectedIndex);
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
       event.key === "ArrowRight") return;

   if (!CurrentMachine.EditsExist)
      CurrentMachine.EditsExist = true;
         
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

// Called when machine list item is clicked
function ListItemClicked(event)
{
   // Set element to "this"
   let element = this;

   let machines = Object.keys(Machines).map((key) =>
   {
      return Machines[key];
   });

   // Get machine index to access Machines
   let index = element.getAttribute("data-machine-index");
   let machine = machines[index];
   
   // Return if machine wasn't found
   if (machine === undefined)
   {
      console.log("Couldn't find machine...");
      return;
   }

   // Return if updating selected machine fails
   if (!UpdateSelectedListItem(element)) return;

   // Set current machine
   CurrentMachine.SetValue(machine, index);
   CurrentMachine.SetListItem(element);

   // Update HTML elements
   UpdateElementsWithData(machine);

   // Enable edit and delete button
   SetButtonState("editButton", true);
   SetButtonState("deleteButton", true);

   StatusMessage.innerHTML = `${machine.Name} selected`;
}

function RemoveListItemFromUl(item, ul)
{
   // Remove item from ul
   ul.removeChild(item);

   // Loop through and reset indexes
   ForEach(ul.children, (child, index) => 
   {
      child.setAttribute("data-machine-index", index);
   });
}

function SetButtonState(id, enable)
{
   let button = document.getElementById(id);

   if (enable)
   {
      button.classList.remove("disabled");
      button.removeAttribute("disabled");
   }
   else
   {
      button.classList.add("disabled");

      let attr = document.createAttribute('disabled');
      button.setAttributeNode(attr);
   }
}

// Updates all HTML elements to show user machine data
function UpdateElementsWithData(machine)
{
   // Setup regex
   const regex = new RegExp('[A-Z]{1,}[0-9]{1,}');

   // Get shortened machine name
   const shortMachineName = regex.exec(machine.Name);

   // Set machine name title
   document.getElementById("machineName").innerHTML = shortMachineName || "Machine Name";

   // Get input elements
   const railroadInput = document.getElementById("railroadInput");
   const dateInput = document.getElementById("dateInput");
   const timeInput = document.getElementById("timeInput");
   const latInput = document.getElementById("latInput");
   const lngInput = document.getElementById("lngInput");
   const speedInput = document.getElementById("speedInput");
   const ip1Input = document.getElementById("ip1Input");
   const ip2Input = document.getElementById("ip2Input");
   const ip3Input = document.getElementById("ip3Input");

   // Get ip2 and ip3 containers
   const ip2Container = document.getElementById("ip2Container");
   const ip3Container = document.getElementById("ip3Container");

   // Get select elements
   const typeSelect = document.getElementById("typeSelect");
   const connectionsSelect = document.getElementById("connectionSelect");

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