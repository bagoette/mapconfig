// Include dependencies
const $ = require('jquery');
const { remote } = require('electron');

// Get current window instance
var win = remote.getCurrentWindow();

// Minimize button click
$('#minimize').click(function()
{
   win.minimize();
});

// Close button click
$('#close').click(function()
{
   win.close();
});

// Max button click
$('#maximize').click(function()
{
   if (win.isMaximized())
   {
      win.unmaximize();
   }
   else
   {
      win.maximize();
   }
});

// Edit button click
$('#editButton').click(function(e)
{
   e.preventDefault();

   // In bag.dataAccess.js
   EditMachine();
});

// Delete button click
$('#deleteButton').click(function(e)
{
   e.preventDefault();

   // In bag.dataAccess.js
   TryRemoveMachine();
});

// Add button click
$('#addButton').click(function(e)
{
   e.preventDefault();

   // In bag.dataAccess.js
   AddMachine();
});

// Save button click
$('#saveButton').click(function(e)
{
   e.preventDefault();

   // In bag.dataAccess.js
   SaveMachine();
});