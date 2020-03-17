package coronavirus

uses java.time.LocalDate

class CasesLocationDate {

    private var _location: Location as readonly Location
    private var _date: LocalDate as readonly Date
    private var _confirmed: int as Confirmed
    private var _recoverd: int as Recoverd
    private var _deaths: int as Deaths

    construct(location : Location, date : LocalDate) {
        _location = location
        _date = date
        Location.addToLocationCases(Date, this)
    }

    construct(location : Location, date : LocalDate, confirmed : int, recoverd : int, deaths : int) {
        _location = location
        _date = date
        _confirmed = confirmed
        _recoverd = recoverd
        _deaths = deaths
        Location.addToLocationCases(Date, this)
    }

}