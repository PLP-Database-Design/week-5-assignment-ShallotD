//Installed the following packages: express mysql2 dotenv nodemon

//Declared dependencies/variables
const express = require('express')
const app = express()
const mysql = require('mysql2')
const dotenv = require('dotenv')

app.use(express.json())
dotenv.config()

//Connect to the database***
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

//Check if the connection works
db.connect((err) => {
    if(err)
        return console.log('Error connecting to the mysql db')

    console.log('Connected to mysql successfully as id: ', db.threadId)



    //1. Retrieve all patients
    //Create a GET endpoint that retrieves all patients and displays their:
    
    //patient_id
    //first_name
    //last_name
    //date_of_birth
    app.get('/patients', (req, res) => {
        db.query('SELECT patient_id, first_name, last_name, date_of_birth FROM patients', (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error retrieving patients data.');
            } else {
                // Construct HTML table for Displaying the data in a user friendly format
                let html = '<h1>Patients List</h1><table border="1"><tr><th>Patient ID</th><th>First Name</th><th>Last Name</th><th>Date of Birth</th></tr>';
    
                results.forEach(patient => {
                    html += `<tr>
                                <td>${patient.patient_id}</td>
                                <td>${patient.first_name}</td>
                                <td>${patient.last_name}</td>
                                <td>${patient.date_of_birth}</td>
                              </tr>`;
                });
    
                html += '</table>';
                res.send(html); // Send the constructed HTML
            }
        });
    });



    //2. Retrieve all providers
    //Create a GET endpoint that displays all providers with their:
    
    //first_name
    //last_name
    //provider_specialty
    app.get('/providers', (req, res) => {
        db.query('SELECT first_name, last_name, provider_specialty FROM providers', (err, results) => {
            if(err) {
                console.error(err)
                return res.status(500).send('Error retrieving providers data.')
            } else {
                //Return the results as JSON
                res.json(results)
            }
        })
    })
    


    //3. Filter patients by First Name
    //Create a GET endpoint that retrieves all patients by their first name
    app.get('/patients/filter', (req, res) => {
        const {firstName} = req.query //Get first name from query parameters
        console.log('Filtering for first name:', firstName); // Debugging line

        db.query('SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?', [firstName], (err, results) => {
            if(err) {
                console.error(err)
                return res.status(500).send('Error retrieving patients data')
            } else {
                //Return the results as JSON
                res.json(results)
            }
        })
    })
    


    //4. Retrieve all providers by their specialty
    //Create a GET endpoint that retrieves all providers by their specialty    
    app.get('/providers/filter', (req, res) => {
        const {providerSpecialty} = req.query //Get specialty from query parameters
        console.log('Filtering for specialty:' ,providerSpecialty) //Debugging line

        db.query('SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?', [providerSpecialty], (err, results) => {
            if(err) {
                console.error(err)
                return res.status(500).send('Error retrieving providers data.')
            } else {
                //Return the results as JSON
                res.json(results)
            }
        })
    })


    //Start up the server using the listen()
    app.listen(process.env.PORT, () => {
        console.log(`Server listening on port ${process.env.PORT}`)
        
        //Send a message to the browser
        console.log('Sending message to the browser...')
        app.get('/', (req, res) => {
            res.send('Server started successfully!')
        })
    })
})