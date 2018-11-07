<%
  '----------------------------------------------------------------'
  ' ACE Driver                                                     '
  ' https://www.microsoft.com/en-ca/download/details.aspx?id=13255 '
  '----------------------------------------------------------------'

  dataConnectionString = "Provider=Microsoft.ACE.OLEDB.12.0;" & _
    "Data Source=C:\path\to\disposal-app\data\;" & _
    "Extended Properties=""text;HDR=YES"""

  tableNameSuffix = ".csv"

  lowerCaseFunction = "lcase"


  '-------------------------------------'
  ' SQLite Driver                       '
  ' http://www.ch-werner.de/sqliteodbc/ '
  '-------------------------------------'

  dataConnectionString = "Driver=SQLite3 ODBC Driver;" & _
    "Database=C:\path\to\disposal-app\data\disposalApp.db"

  tableNameSuffix = ""

  lowerCaseFunction = "lower"
%>
