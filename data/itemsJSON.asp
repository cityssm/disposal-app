<!--#include file="settings.asp"--><!--#include file="functions.asp"--><%

  response.contenttype = "application/json"

  response.expires = 30

  response.write ("{""items"":[")

  Set conn = CreateObject("ADODB.Connection")
  Set rs = CreateObject("ADODB.Recordset")

  sql = "SELECT ItemKey, ItemName, ShortDescription" & _
    " FROM items.csv" & _
    " where ItemKey in (select ItemKey from itemLocations.csv)"

  if (request.querystring("q") <> "") then

      searchTerms = split(lcase(request.querystring("q")), " ")

      for each searchTerm in searchTerms

        searchTermClean = replace(searchTerm, "'", "''")

        sql = sql & (" and (" & _
          "lcase(ItemName) like '%" & searchTermClean & "%'" & _
          " or lcase(ShortDescription) like '%" & searchTermClean & "%'" & _
          " or lcase(SearchTerms) like '%" & searchTermClean & "%'" & _
          ")")

      next

    end if

  sql = sql & " order by ItemName"


  conn.Open dataConnectionString

  Set objCommand = Server.CreateObject("ADODB.Command")
  objCommand.ActiveConnection = conn
  objCommand.CommandText = sql

  Set rs = objCommand.Execute()

  doComma = false

  Do Until rs.EOF

    if (doComma) then
      response.write (",")
    else
      doComma = true
    end if

    response.write ("{" & _
      """itemKey"":""" & rs.Fields.Item("ItemKey") & """" & _
      ",""itemName"":""" & str_toJSON(rs.Fields.Item("ItemName")) & """" & _
      ",""shortDescription"":""" & str_toJSON(rs.Fields.Item("ShortDescription")) & """" & _
      "}")
    rs.MoveNext
  Loop

  rs.Close
  conn.Close

  response.write ("]}")
%>
