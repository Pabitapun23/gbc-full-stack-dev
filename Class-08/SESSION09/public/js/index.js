// client side script

// async indicates the task/operations must be executed in the background
// a specific instruction that must be executed in the background should be marked as await

//Fetch Methods
// 1. GET - to receive the data from API
// 2. POST or PUT - to write data to API
// 3. DELETE - to delete in API
const getDataFromAPI = async(method, url) => {

    try {
        //Background task
        const response = await fetch(url, {
            method: method,  //GET, PUT, POST, DELETE
            headers: {'Content-Type': 'application/json'}
        });
        console.log(`response: ${JSON.stringify(response)}`);

        // if responser is not OK, show the error with HTTP status code and exit
        if(response.ok === false) {
            console.log(`Server response is NOT OK. Response Status: ${response.status}`);

            // throw - will force the code to generate the error and jump into the catch block
            throw Error(`Cannot connect to API. HTTP Status code: ${response.status}`)
        }

        //if response is OK, convert the API data to Javascript Objects

        //background task - after receiving data from URL, convert the response into JSON
        const responseJSON = await response.json();
        console.log(`responseJSON : ${responseJSON}`);
        console.log(`JSON.stringify(responseJSON) : ${JSON.stringify(responseJSON)}`);

        //generate HTML showing all the information
        document.getElementById("countryData").innerHTML = "";

        for(country of responseJSON) {
            console.log(`Country Name : ${country.name.common}`);

            document.getElementById("countryData").innerHTML += `
                <div class="column shadowCard">
                    <h2>${country.name.common}</h2>
                    <img src="${country.flags.png}" class="imgLarge">
                    <p>${country.capital || "No Capital"}</p>
                    <p>${country.region}</p>
                </div>
            `
        }

    } catch (err) {
        console.log(`Unable to get the data from API due to error : ${err}`);
    }
    
}

const getCountryByName = () => {
    let countryName = document.getElementById("countryName").value;

    if (countryName !== undefined) {
        getDataFromAPI("GET", `https://restcountries.com/v3.1/name/${countryName}`);
    } else {
        console.log(`Country name must be provided`);
    }
}

const getAllCountries = () => {

    console.log(`Trying to get all countries from API`);
    getDataFromAPI("GET", "https://restcountries.com/v3.1/all");
    // getDataFromAPI("GET", "https://restcountries.com/v3.1/something");
}

document.getElementById("btnGetAll").addEventListener("click", getAllCountries);
document.getElementById("btnGetCountry").addEventListener("click", getCountryByName);

// https://localhost:8080/dummyapi/allplaces