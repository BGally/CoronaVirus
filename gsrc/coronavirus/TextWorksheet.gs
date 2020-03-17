package coronavirus

/**
 * Text Worsheet that must have a unique non-null value for the first element in each row i.e. An incremental ID or unique row name.
 */

class TextWorksheet {

  private var _title: String as readonly Title
  protected var _columnNames: ArrayList<String> as readonly ColumnNames
  protected var _contentArray: ArrayList<ArrayList<String>> as readonly ContentArray = new ArrayList<ArrayList<String>>()

  private var _contentMap: Map<String, ArrayList<String>> = new LinkedHashMap<String, ArrayList<String>>()

  construct(title: String, columnNames: ArrayList<String> , contentArray: ArrayList<ArrayList<String>>) {
  this._title = title;
  this._columnNames = columnNames;
  this._contentArray = contentArray;
  mapContents();
  }

  protected final function mapContents() : void {
    for (row in _contentArray) {
      _contentMap.put(row.get(0), row)
    }
  }

  public function insertColumn(colName : String, colIndex : int, value : String) : void {
    _columnNames.add(colIndex, colName)
    for (row in _contentArray) {
      row.add(colIndex, value)
    }
  }

  public function insertEmptyColumn(colName : String, colIndex : int) : void {
    insertColumn(colName, colIndex, "")
  }

  public function getValue(rowIndex : int, columnIndex : int) : String {
    return _contentArray.get(rowIndex).get(columnIndex)
  }

  public function getValue(rowIndex : int, columnName : String) : String {
    var colIndex = _columnNames.indexOf(columnName)
    return _contentArray.get(rowIndex).get(colIndex)
  }

  public function getValue(rowName : String, colIndex : int) : String {
    return _contentMap.get(rowName).get(colIndex)
  }

  public function getValue(rowName : String, columnName : String) : String {
    var colIndex = _columnNames.indexOf(columnName)
    return _contentMap.get(rowName).get(colIndex)
  }

  public function getRow(rowIndex : int) : ArrayList<String> {
    return _contentArray.get(rowIndex)
  }

  public function getRow(rowName : String) : ArrayList<String> {
    return _contentMap.get(rowName)
  }

  public function removeRow(rowIndex : int) : ArrayList<String> {
    var row = _contentArray.remove(rowIndex)
    mapContents()
    return row
  }

  public function removeRow(rowName : String) : ArrayList<String> {
    var row = _contentMap.get(rowName)
    _contentArray.remove(row)
    mapContents()
    return row
  }

  property get ContentMap() : Map<String, ArrayList<String>> {
    return Collections.unmodifiableMap(_contentMap)
  }

  property get RowNames() : Set<String> {
    return _contentMap.keySet()
  }

  override public function toString() : String {
    var colNames = _columnNames.join(",")
    var content = new StringBuilder()
    for (row in _contentArray) {
      var rowData = row.join(",")
      content.append(rowData + "\n")
    }
    return "Title: " + _title + "\nColumn names: " + colNames.toString() + "\n---------------------- Content ----------------------" + "\n" + content.toString()
  }

}