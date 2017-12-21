//******************************************************************************************
//Creates a Machine class with properties and methods
//******************************************************************************************
function Machine()
{
   this.Name = "";
   this.Latitude = ""; 
   this.Longitude = "";
   this.Date = "";
   this.Time = ""; 
   this.Speed = ""; 
   this.Railroad = "";
   this.Type = "";
   this.Pingable = "";
   this.Ip1 = "";
   this.Ip2 = "";  
   this.Ip3 = "";  

   this.Connections = 1;

   // Unused attributes to carry along
   this.Yday = "";
   this.Color = "";
   this.City = "";

   this.SetGpsData = function(xmlMarker)
   {
      //Pull data from GPS.XML
      this.Name = xmlMarker.name;
      this.Latitude = xmlMarker.lat;
      this.Longitude = xmlMarker.lng;
      this.Date = xmlMarker.date;
      this.Time = xmlMarker.time
      this.Speed = xmlMarker.speed
      this.Railroad = xmlMarker.rr;

      this.Yday = xmlMarker.yday || "";
      this.Color = xmlMarker.color || "";
      this.City = xmlMarker.city || "";
   };

   this.SetIpData = function(xmlMarker)
   {
      //Pull data from GPS.XML
      this.Type = xmlMarker.type;
      this.Pingable = xmlMarker.ping;
      this.Ip1 = xmlMarker.ip;

      this.Connections = 1;

      if (xmlMarker.hasOwnProperty("ip1"))
      {
         this.Ip2 = xmlMarker.ip1;
         this.Connections++;
      }
      
      if (xmlMarker.hasOwnProperty("ip2"))
      {
         this.Ip3 = xmlMarker.ip2;
         this.Connections++;
      }
   };
}
//__________________________________________________________________________________________