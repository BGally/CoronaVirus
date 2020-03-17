package coronavirus

uses java.time.LocalDate

class Location {

  private var _country: String as readonly Country
  private var _province: String as readonly Province
  private var _lat: String as readonly Latitude
  private var _long: String as readonly Longitude
  private var _casesLocationDates : TreeMap<LocalDate, CasesLocationDate> as CasesLocationDates

  construct(country: String){
    _country = country
    _casesLocationDates = new TreeMap<LocalDate, CasesLocationDate>()
  }

  construct(province: String, country: String, latitude: String, longitude: String){
    this(country)
    _province = province
    _lat = latitude
    _long = longitude
  }

  public function addToLocationCases(caseDate: LocalDate, casesLocationDate : CasesLocationDate){
    _casesLocationDates.put(caseDate, casesLocationDate)
  }

  public function toString() : String{
    var valArray = new ArrayList<String>()
    valArray.add(Key)
    valArray.add(_province)
    valArray.add(_country)
    valArray.add(_lat)
    valArray.add(_long)

    for(cDateKey in _casesLocationDates.Keys.order()){
      var confirmedCases = _casesLocationDates.get(cDateKey).Confirmed
      valArray.add(confirmedCases as String)
    }

    return valArray.toString()
  }

  property get Key(): String {
    var key = _country + _province
    key = key.remove(" ")
    key = key.remove(",")
    return key
  }

}