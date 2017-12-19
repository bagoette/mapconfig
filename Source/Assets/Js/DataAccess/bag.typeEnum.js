// Enum for IP connection types
const ConnectionType = 
{
   SIERRA:           1,
   PLS:              2,
   SAT:              3,
   SIERRA_PLS:       4,
   SIERRA_SAT:       5,
   PLS_SAT:          6,
   SIERRA_PLS_SAT:   7,

   Properties:
   {
      1: { name: "sierra",          value: 1, index: 0 },
      2: { name: "pls",             value: 2, index: 1 },
      3: { name: "sat",             value: 3, index: 2 },
      4: { name: "sierra/pls",      value: 4, index: 0 },
      5: { name: "sierra/sat",      value: 5, index: 1 },
      6: { name: "pls/sat",         value: 6, index: 2 },
      7: { name: "sierra/pls/sat",  value: 7, index: 0 },
   },

   GetIndex: type =>
   {
      for (var i = 1; i < 8; i++)
      {
         if (type === ConnectionType.Properties[i].name)
            return ConnectionType.Properties[i].index;
      }
   },

   SetTypeSelectOptions: (typeSelect, count) =>
   {
      var length = typeSelect.options.length;
      for (var i = 0; i < length; i++)
      {
         typeSelect.removeChild(typeSelect.options[0]);
      }
   
      if (count === 1)
      {
         for (var i = 1; i < 4; i++)
         {
            var option = document.createElement("option");
            option.setAttribute("value", ConnectionType.Properties[i].value);
            option.innerHTML = ConnectionType.Properties[i].name;
   
            typeSelect.appendChild(option);
         }
      }
      else if (count === 2)
      {
         for (var i = 4; i < 7; i++)
         {
            var option = document.createElement("option");
            option.setAttribute("value", ConnectionType.Properties[i].value);
            option.innerHTML = ConnectionType.Properties[i].name;
            
            typeSelect.appendChild(option);
         }
      }
      else if (count === 3)
      {
         var option = document.createElement("option");
         option.setAttribute("value", ConnectionType.Properties[8].value);
         option.innerHTML = ConnectionType.Properties[8].name;
   
         typeSelect.appendChild(option);
      }
   }
}