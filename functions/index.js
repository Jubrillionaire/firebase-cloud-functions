const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

var serviceAccount = require("./permissions.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://customers-app-restapi.firebaseapp.com",
});

const app = express();
const db = admin.firestore();

app.use(cors({ origin: true }));

app.get("/hello", (req, res) => {
  return res.status(200).send("hello");
});

//create a customer

app.post("/api/customers", (req, res) => {
  (async () => {
    try {
      const { firstName, lastName, age, email, phone } = req.body;
      await db
        .collection("customers")
        .doc()
        .create({
          firstName,
          lastName,
          age,
          email,
          phone
        });
      return res.status(200).send("success!!");
    } catch (err) {
      console.log(err);
      return res.status(500).send(error);
    }
  })();
});


//get a single customer
app.get("/api/customers/:id", (req, res) => {
  (async () => {
    try {
      const document = db.collection("customers").doc(req.params.id);
      const customer = await document.get();
      const response = customer.data();

      return res.status(200).send(response);
    } catch (err) {
       console.log(err);
       return res.status(500).send(error);
    }
  })();
});

//get all customers

//Get
app.get('/api/customers', (req, res) => {
    (async() => {
        try {
            let query = db.collection('customers');
            let response = [];
            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs;
                for (let doc of docs)
                {
                    const selectedCustomer = {
                    id: doc.id,
                    firstName:doc.data().firstName,
                    lastName:doc.data().lastName,
                    age:doc.data().age,
                    phone:doc.data().phone,
                    email:doc.data().email
            
                };
                response.push(selectedCustomer);
                }
                return response
            })
            return res.status(200).send(response);
            
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }

    } )();
});

//Update a customer
app.put('/api/customers/:id', (req, res) => {
    (async() => {
        try {
            const { firstName, lastName, age, email, phone } = req.body
            const document = db.collection('customers').doc(req.params.id);
            await document.update({
                firstName,
                lastName,
                age,
                email,
                phone
            })
            return res.status(200).send("success!");
            
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }

    } )();
});


//Delete a customer
app.delete('/api/customers/:id', (req, res) => {
    (async() => {
        try {
            const document = db.collection('customers').doc(req.params.id);
            await document.delete();
            return res.status(200).send("success!!");
            
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }

    } )();
});


exports.app = functions.https.onRequest(app);
