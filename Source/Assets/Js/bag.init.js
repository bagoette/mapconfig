
// Declare last selected item
let SelectedListItem;

// Flag indicating if input/select elements are enabled
let ElementsEnabled = false;

// Add SetupElements to the OnLoad callbacks
OnLoad(SetAllElementStates);
OnLoad(InitBtnStates);

// Disable the buttons that shouldn't work on startup
function InitBtnStates()
{
   // Create array of buttons to disable
   let buttons = 
   [
      document.getElementById("cancelBtn"),
      document.getElementById("deleteBtn"),
      document.getElementById("undoBtn"),
   ];

   // Disable all buttons in the array
   ForEach(buttons, (button) =>
   {
      button.classList.add("disabled");

      let attr = document.createAttribute('disabled');
      button.setAttributeNode(attr);
   });
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
      element.removeAttribute("disabled");
   // Otherwise...
   else
      // Add disabled attribute
      element.setAttributeNode(attr);
}