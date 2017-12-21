const $ = require('jquery');
const { remote } = require('electron');

var win = remote.getCurrentWindow();

$('#minimize').click(function()
{
   win.minimize();
});

$('#close').click(function()
{
   win.close();
});

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

$('#editBtn').click(function()
{
   // If already enabled...
   if (ElementsEnabled)
      // Set elements to disabled
      SetAllElementStates(false);
   // Otherwise...
   else
      // Set elements to enabled
      SetAllElementStates(true);
});

$('#deleteBtn').click(function()
{
   TryRemoveMachine();
});

$('#addBtn').click(function()
{
   SaveMachines();
});