<%
  function str_toJSON(text)

    if (not isnull(text)) then
      text = replace(text, "\",     "\\")
      text = replace(text, "/",     "\/")
      text = replace(text, """",    "\""")
      text = replace(text, chr(10), "\n")
      text = replace(text, chr(13), "\r")
      text = replace(text, chr(9),  "\t")
      text = replace(text, chr(27), "")
      text = replace(text, chr(14), "")
      text = replace(text, chr(0),  "")
    end if

    str_toJSON = text

  end function
%>
