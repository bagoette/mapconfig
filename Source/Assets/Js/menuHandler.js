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

$('#editButton').click(function(e)
{
   e.preventDefault();

   EditMachine();
});

$('#deleteButton').click(function(e)
{
   e.preventDefault();

   TryRemoveMachine();
});

$('#addButton').click(function(e)
{
   e.preventDefault();

   AddMachine();
});

$('#saveButton').click(function(e)
{
   e.preventDefault();

   SaveMachine();
});