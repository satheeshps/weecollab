INP MESSAGE
-----------
{
  "name": "message",
  "attrs": {
    "type": "chat",
    "from": "karthik.kandasamy@oracle.com/KAKANDAS-LAP1 (beehive)",
    "to": "satheesh.sundaran@oracle.com/OracleMessenger",
    "xmlns:stream": "http://etherx.jabber.org/streams"
  },
  "children": [
    {
      "name": "body",
      "attrs": {},
      "children": [
        "oh"
      ]
    }
  ]
}

INP PRESENCE
------------

{
  name: "presence",
  attrs: {
    type: "unavailable",
    from: "pruthvithej.r@oracle.com/PRUR-LAP (beehive)",
    to: "satheesh.sundaran@oracle.com/OracleMessenger",
    xmlns: "http://etherx.jabber.org/streams"
  },
  children: []
}

TALKY THINGS TO DO:
------------------

[x] XMPP client statemachine
[x] File read and write the chat logs
[x] Contacts search
[x] Contacts status messages
[x] Subscribe and unsubscribe the contacts
[x] Show the contact groupings
[x] websocket communication payload design
[x] Callout look and feel fixes
[x] Talky settings page and config files
[x] Smiley support
[x] File transfer support
[x] Error handling
[x] Auto status 

  o  Manage items in one's contact list
  o  Exchange messages with one's contacts
  o  Exchange presence information with one's contacts
  o  Manage presence subscriptions to and from one's contacts