package coronavirus

uses org.slf4j.LoggerFactory
uses java.io.BufferedWriter
uses java.io.File
uses java.io.FileInputStream
uses java.io.FileOutputStream
uses java.io.FileWriter

class FileUtil {

  private static var _logger = LoggerFactory.getLogger("APP.FileUtil")

  public static function writeTextFile(text: String, fileName: String): void {
      createDirs(fileName)
      using (var out = new BufferedWriter(new FileWriter(fileName))){
        out.write(text)
      }
  }

  public static function writePropFile(propMap: Map<String, String>, fileName: String): void {
      createDirs(fileName)
      using (var out = new BufferedWriter(new FileWriter(fileName))){
        propMap.eachKeyAndValue( \ k, val -> {
          out.write("${k} = ${val}\r\n")
        })
      }
  }

  public static function readCSVFile(csvFilePath : String) : ArrayList<ArrayList<String>> {
      var url = Object.getClass().getResource(csvFilePath)
      var csvFile = new File(url.getPath())
      return readCSVFile(csvFile)
  }

  public static function readCSVFile(csvFile : File) : ArrayList<ArrayList<String>> {

    var contentArray = new ArrayList<ArrayList<String>>()
    var scanner = new Scanner(csvFile)
    while (scanner.hasNext()) {
      var line = CSVUtils.parseLine(scanner.nextLine())
      contentArray.add(line)
    }
    scanner.close()

    return contentArray
  }

  public static function writeCSVFile(columnNames: ArrayList<String> , contentArray: ArrayList<ArrayList<String>>, fileName: String, quoteEscaped : boolean = true): void {
      createDirs(fileName)
      using (var out = new BufferedWriter(new FileWriter(fileName))) {

        var colNames = columnNames.join(",")
        out.write(colNames + "\r\n")

        for (row in contentArray) {
          var rowData : String
          if(quoteEscaped){
            rowData = row.map(\elt -> "\"" + (elt ?: "") + "\"").join(",")
          } else {
            rowData = row.map(\elt -> (elt?.remove(",") ?: "")).join(",")
          }
          out.write("${rowData}\r\n")
        }
      }
    _logger.info("Created file {}", fileName)
  }

  private static function createDirs(fileName: String): void {
    if (!fileName.contains("/")) {
      return
    }
    var directoryName = fileName.substring(0, fileName.lastIndexOf("/"))
    var dir = new File(directoryName)
    if (!dir.exists()) {
      dir.mkdirs()
      _logger.info("Created directory {}", directoryName)
    }
  }
}