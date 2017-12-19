//******************************************************************************************
//Creates a RailGrinder class with properties and methods
//******************************************************************************************
function Machine()
{
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

         console.log("");
      }
   };
}
//__________________________________________________________________________________________