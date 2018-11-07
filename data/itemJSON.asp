<!--#include file="settings.asp"--><!--#include file="functions.asp"--><%

  response.contenttype = "application/json"

  response.expires = 30

  Set conn = CreateObject("ADODB.Connection")
  Set rs = CreateObject("ADODB.Recordset")

  sql = "SELECT *" & _
    " FROM items" & tableNameSuffix & _
    " where ItemKey = ?"

  conn.Open dataConnectionString

  Set objCommand = Server.CreateObject("ADODB.Command")
  objCommand.ActiveConnection = conn
  objCommand.CommandText = sql

  objCommand.Parameters(0).value = request.querystring("k")

  Set rs = objCommand.Execute()

  if (rs.EOF) then
    response.write ("{""success"":false,""message"":""Item not found.""}")
  else

    response.write ("{" & _
      """success"":true" & _
      ",""itemKey"":""" & rs.Fields.Item("ItemKey") & """" & _
      ",""itemName"":""" & str_toJSON(coalesce(rs.Fields.Item("ItemName"), "")) & """" & _
      ",""shortDescription"":""" & str_toJSON(coalesce(rs.Fields.Item("ShortDescription"), "")) & """" & _
      ",""longDescription"":""" & str_toJSON(coalesce(rs.Fields.Item("LongDescription"), "")) & """" & _
      ",""pictureURL"":""" & str_toJSON(coalesce(rs.Fields.Item("PictureURL"), "")) & """" & _
      ",""reuseIdeas"":[")

    sql = "select *" & _
      " from reuseIdeas" & tableNameSuffix & _
      " where ItemKey = ?" & _
      " order by OrderNumber, IdeaName"

    Set objCommand = Server.CreateObject("ADODB.Command")
    objCommand.ActiveConnection = conn
    objCommand.CommandText = sql

    objCommand.Parameters(0).value = request.querystring("k")

    Set rs = objCommand.Execute()

    doComma = false

    do until rs.EOF

      if (doComma) then
        response.write (",")
      else
        doComma = true
      end if

      response.write ("{" & _
        """ideaName"":""" & str_toJSON(coalesce(rs.Fields.Item("IdeaName"), "")) & """" & _
        ",""ideaDescription"":""" & str_toJSON(coalesce(rs.Fields.Item("IdeaDescription"), "")) & """" & _
        ",""websiteURL"":""" & str_toJSON(coalesce(rs.Fields.Item("WebsiteURL"), "")) & """" & _
        "}")

      rs.movenext
    loop

    response.write ("],""locations"":[")

    sql = "select l.*" & _
      " from locations" & tableNameSuffix & " l" & _
      " left join itemLocations" & tableNameSuffix & " il on l.LocationKey = il.LocationKey" & _
      " where il.ItemKey = ?" & _
      " order by il.OrderNumber, l.LocationName"

    Set objCommand = Server.CreateObject("ADODB.Command")
    objCommand.ActiveConnection = conn
    objCommand.CommandText = sql

    objCommand.Parameters(0).value = request.querystring("k")

    Set rs = objCommand.Execute()

    doComma = false

    do until rs.EOF

      if (doComma) then
        response.write (",")
      else
        doComma = true
      end if

      response.write ("{" & _
        """locationKey"":""" & rs.Fields.Item("LocationKey") & """" & _
        ",""locationName"":""" & str_toJSON(coalesce(rs.Fields.Item("LocationName"), "")) & """" & _
        ",""address"":""" & str_toJSON(coalesce(rs.Fields.Item("Address"), "")) & """" & _
        ",""latitude"":""" & str_toJSON(coalesce(rs.Fields.Item("Latitude"), "")) & """" & _
        ",""longitude"":""" & str_toJSON(coalesce(rs.Fields.Item("Longitude"), "")) & """" & _
        ",""shortDescription"":""" & str_toJSON(coalesce(rs.Fields.Item("ShortDescription"), "")) & """" & _
        ",""longDescription"":""" & str_toJSON(coalesce(rs.Fields.Item("LongDescription"), "")) & """" & _
        ",""websiteURL"":""" & str_toJSON(coalesce(rs.Fields.Item("WebsiteURL"), "")) & """" & _
        "}")

      rs.movenext
    loop

    response.write ("]}")

  end if

  rs.Close
  conn.Close
%>
