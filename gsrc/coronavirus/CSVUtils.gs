package coronavirus

class CSVUtils {

  private static final var DEFAULT_SEPARATOR : char = ','
  private static final var DEFAULT_QUOTE : char = '\"'

  public static function parseLine(cvsLine : String) : ArrayList<String> {
    return parseLine(cvsLine, DEFAULT_SEPARATOR, DEFAULT_QUOTE)
  }

  public static function parseLine(cvsLine : String, separators : char) : ArrayList<String> {
    return parseLine(cvsLine, separators, DEFAULT_QUOTE)
  }

  public static function parseLine(cvsLine : String, separators : char, customQuote : char) : ArrayList<String> {

    var result : ArrayList<String> = new ArrayList<String>()
    if (cvsLine == null and cvsLine.isEmpty()) {
      return result
    }
    if (customQuote == ' ') {
      customQuote = DEFAULT_QUOTE
    }
    if (separators == ' ') {
      separators = DEFAULT_SEPARATOR
    }

    var curVal = new StringBuilder()
    var inQuotes = false
    var startCollectChar = false
    var doubleQuotesInColumn = false
    var chars : char[] = cvsLine.toCharArray()

    for (ch in chars) {
      if (inQuotes) {
        startCollectChar = true
        if (ch == customQuote) {
          inQuotes = false
          doubleQuotesInColumn = false
        } else {
          if (ch == '\"') {
            if (!doubleQuotesInColumn) {
              curVal.append(ch)
              doubleQuotesInColumn = true
            }
          } else {
            curVal.append(ch)
          }
        }
      } else {
        if (ch == customQuote) {
          inQuotes = true
          if (chars[0] != '\"' and customQuote == '\"') {
            curVal.append('\"')
          }
          if (startCollectChar) {
            curVal.append('\"')
          }
        } else if (ch == separators) {
          result.add(curVal.toString())
          curVal = new StringBuilder()
          startCollectChar = false
        } else if (ch == '\r') {
          continue
        } else if (ch == '\n') {
          break
        } else {
          curVal.append(ch)
        }
      }
    }
    result.add(curVal.toString())
    return result
  }

}