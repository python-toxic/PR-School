import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card.jsx";

export default function StudentTransportPage() {
  const transportData = {
    busNumber: "BUS-12",
    routeName: "North City Route",
    pickupPoint: "Shivaji Nagar",
    dropPoint: "School Main Gate",
    pickupTime: "07:20 AM",
    dropTime: "02:40 PM",
    status: "Active",
    seatNumber: "18A",
    driver: {
      name: "Ramesh Kumar",
      phone: "9876543210",
    },
    conductor: {
      name: "Suresh Yadav",
      phone: "9123456780",
    },
    stops: [
      { stop: "Shivaji Nagar", time: "07:20 AM" },
      { stop: "MG Road", time: "07:30 AM" },
      { stop: "Civil Lines", time: "07:45 AM" },
      { stop: "School", time: "08:00 AM" },
    ],
  };

  return (
    <div className="space-y-6 p-4">
      
      <Card>
        <CardHeader>
          <CardTitle>Transport Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <Info label="Bus Number" value={transportData.busNumber} />
          <Info label="Route" value={transportData.routeName} />
          <Info label="Seat Number" value={transportData.seatNumber} />
          <Info label="Pickup Point" value={transportData.pickupPoint} />
          <Info label="Pickup Time" value={transportData.pickupTime} />
          <Info label="Drop Time" value={transportData.dropTime} />
          <Info
            label="Status"
            value={transportData.status}
            highlight
          />
        </CardContent>
      </Card>

     
      <Card>
        <CardHeader>
          <CardTitle>Driver & Conductor</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium">Driver</p>
            <p>{transportData.driver.name}</p>
            <p className="text-muted-foreground">
              📞 {transportData.driver.phone}
            </p>
          </div>
          <div>
            <p className="font-medium">Conductor</p>
            <p>{transportData.conductor.name}</p>
            <p className="text-muted-foreground">
              📞 {transportData.conductor.phone}
            </p>
          </div>
        </CardContent>
      </Card>

      
      <Card>
        <CardHeader>
          <CardTitle>Route Stops</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {transportData.stops.map((stop, index) => (
              <li
                key={index}
                className="flex justify-between border-b pb-1 last:border-none"
              >
                <span>{stop.stop}</span>
                <span className="text-muted-foreground">{stop.time}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function Info({ label, value, highlight }) {
  return (
    <div>
      <p className="text-muted-foreground">{label}</p>
      <p className={highlight ? "font-semibold text-green-600" : ""}>
        {value}
      </p>
    </div>
  );
}
