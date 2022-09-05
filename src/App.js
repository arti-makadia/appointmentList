import { useState, useEffect, useCallback } from "react"
import { BiCalendar } from "react-icons/bi"
import Search from "./components/Search"
import AddAppointment from "./components/AddAppointment"
import AppointmentInfo from "./components/AppointmentInfo"
import { queryAllByAltText } from "@testing-library/react"

function App() {

    let [appointmentList, setAppointmentList] = useState([]);
    let [query, setQuery] = useState("");
    let [sortBy, setSortBy] = useState("petName");
    let [orderBy, setOrderBy] = useState("asc");

    const filterAppointments = appointmentList.filter(
      item => {
        return (
          item.petName.toLowerCase().includes(query.toLowerCase()) ||
          item.ownerName.toLowerCase().includes(query.toLowerCase()) ||
          item.aptNotes.toLowerCase().includes(query.toLowerCase()) 
        )
      }
    ).sort( (a,b) =>  {
      let order = (orderBy === 'asc') ? 1 : -1 ; //Check for assending order
      return (
        a[sortBy].toLowerCase() < b[sortBy].toLowerCase()   //compare vaue not case sensitive
            ? -1 * order : 1 * order
      )
    })

    const fetchData = useCallback( () => {
      fetch('./data.json')
      .then( response => response.json())
      .then( data => { setAppointmentList(data)})
    }, [])

    useEffect( () => {
      fetchData()
    }, [fetchData])

  return (
    <div className="App container mx-auto mt-3 font-thin">
      <h1 className="text-5xl">
        <BiCalendar className="inline-block text-red-400 align-top" />Your Appointments</h1>
        <AddAppointment 
            onSendAppointment={myAppointment => setAppointmentList([...appointmentList, myAppointment])}
            lastId={appointmentList.reduce((max, item) => Number(item.id) > max ? Number(item.id) : max, 0)}
          />
        <Search query={query} 
                onQueryChange={myQuery => setQuery(myQuery)} 
                orderBy={orderBy}
                onOrderByChange = {mySort => setOrderBy(mySort)}
                sortBy={sortBy}
                onSortByChange={mySort => setSortBy(mySort)}
                />

        <ul className="divide-y divide-gray-200">
          {
            filterAppointments.map( (appointment) => (
              <AppointmentInfo Key={appointment.id}
                               appointment={appointment} 
                               onDeleteAppointment={ 
                                  appointmentId => setAppointmentList( appointmentList.filter( appointment => appointment.id != appointmentId))}
                  />
            ))
          }
        </ul>
    </div>
  );
}

export default App;
