// function to retrieve the lowest price available listed on SkyScanner for a specific flight, given the departing airport, destination airport, and date.
// format airport inputs as '"IATA-Airport-Code"-sky' - for example, JFK in New York would be inputted as JFK-sky
// format the date as YYYY-MM-DD, YYYY-MM, or 'anytime'
// redundant pieces of code will not feature repeated comments
function fetchprice(from, to, date) {
    var parameter = {
	"method": "GET",
	"headers": {
    // used to access the SkyScanner API, insert your API key below
		"x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
		"x-rapidapi-key": "YOUR-API-KEY-HERE"
	}
    }; 

    // now we need to generate the URL that the API will access to retrieve data from
  var url = "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/CA/CAD/en-CA/" + from + "/" + to + "/" + date;
  // use UrlFetchApp.fetch in lieu of jQuery for ease of use
  var jsonRawData = UrlFetchApp.fetch(url, parameter);
  // the returned data is provided as a set of nested arrays, and is quite annoying to go through
  var jsonObject = JSON.parse(jsonRawData.getContentText());
  // separate the first array
  var quotes = jsonObject["Quotes"]
  // just to make life easier, so we can tell if something's gone wrong with the API
  var minQuote = Number.MAX_SAFE_INTEGER;
  // for loop, to compare all the flight prices in the array and choose the lowest one
  for(var i = 0; i < quotes.length; ++i)
  {
    if(quotes[i]["MinPrice"] < minQuote)
    {
      minQuote = quotes[i]["MinPrice"];
    }
  }
  // now we just need to return the lowest price that we've managed to find
  return minQuote;
}


// function to identify the airline associated witht he lowest price found in function fetchprice
function minCarrier(from, to, date) {
  var parameter = {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
		"x-rapidapi-key": "YOUR-API-KEY-HERE"
	}
    }; 
  var url = "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/CA/CAD/en-CA/" + from + "/" + to + "/" + date;
  var jsonRawData = UrlFetchApp.fetch(url, parameter);
  var jsonObject = JSON.parse(jsonRawData.getContentText());
  var quotes = jsonObject["Quotes"];
  var minQuote = Number.MAX_SAFE_INTEGER;\
  // here we need to introduce a new variable to identify the other properties of the quote that the minimum price we previously identified comes from
  var minQuoteObject;
  for(var i = 0; i < quotes.length; ++i)
  {
    if(quotes[i]["MinPrice"] < minQuote)
    {
      minQuote = quotes[i]["MinPrice"];
      // we set our new variable equal to the array that we retrieved the minumum price from for identification purposes, so that we can refer back to this specific flight later
      minQuoteObject = quotes[i];
    }
  }
  // new variable that we immediately set equal to the carrier ID number from the first array associated with the variable we used to identify the specific flight
  var firstCarrierId = minQuoteObject["OutboundLeg"]["CarrierIds"][0];
  // we set a new variable equivalent to the array that has the airlines listed alongside their carrier ID numbers
  var carriers = jsonObject["Carriers"];
  // set this variable to an empty string, this will contain the airline name in the end
  var carriername = "";
  // for loop to compare the ID number we are storing in firstCarrierId against the array we retrieve in line 66
  for(var i = 0; i < carriers.length; ++i)
  {
    if(carriers[i]["CarrierId"] == firstCarrierId)
    {
      carriername = carriers[i]["Name"];
    }
  } 
  // returns the airline name associated with our cheap flight as a string of text
  return carriername;
}


// function to specify what time of date our previously identified cheapest flight leaves at, so we can finally narrow down exactly which flight we've singled out
function flightTime(from, to, date) {
  var parameter = {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
		"x-rapidapi-key": "YOUR-API-KEY-HERE"
	}
    }; 
  var url = "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/CA/CAD/en-CA/" + from + "/" + to + "/" + date;
  var jsonRawData = UrlFetchApp.fetch(url, parameter);
  var jsonObject = JSON.parse(jsonRawData.getContentText());
  var quotes = jsonObject["Quotes"];
  var minQuote = Number.MAX_SAFE_INTEGER;
  var minQuoteObject;
  for(var i = 0; i < quotes.length; ++i)
  {
    if(quotes[i]["MinPrice"] < minQuote)
    {
      minQuote = quotes[i]["MinPrice"];
      minQuoteObject = quotes[i];
    }
  }
  // everything above this comment should be familiar
  // now we need to declare a new variable for our departure time
  // immediately set it equal to the string we retrieve from the array associated with our flight of interest
  var departtime = minQuoteObject["OutboundLeg"]["DepartureDate"];\
  // new variable, we convert the date string into a date value that our script can interpret natively
  // however, this string will include the year month day and separate the exactly time with a 'T'
  var datetime = new Date(departtime);
  // now we already know the date we want to depart at
  // so we only need the hours and minutes information about the departure on said day
  // set a new variable equal to a string that's comprised of the hours and minutes, separated by a colon as per usual (HH:MM)
  var timestring = datetime.getHours() + ":" + datetime.getMinutes();
  // return our time string
  return timestring
  ;
}