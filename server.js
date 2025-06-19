const express = require("express");
const bodyParser = require("body-parser");
const { PutCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const dynamoDb = require("./aws-config");
const cors = require("cors");
const session = require('express-session');
require("dotenv").config();
const corsMiddleware = require("./middleware/corsMiddleware");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { MongoClient ,ServerApiVersion} = require('mongodb');
const {  connectDB, getDB } = require('./mongo-config');

const app = express();
const port = process.env.PORT || 4005;
app.use(express.json());
app.use(corsMiddleware);
app.use(bodyParser.json());
app.use(cors());

const uri = process.env.MONGODB_URI;


function getCurrentDateTime() {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZone: "Asia/Kolkata",
  };

  const dateTime = new Date().toLocaleDateString("en-IN", options);
  return dateTime;
}

const currentDateTime = getCurrentDateTime();



const getAllHostName = async (collectionName) => {
  const db = getDB();
  
  try {
    return await db.collection(collectionName).find({}).toArray();
  } catch (err) {
    console.error('MongoDB Error:', err);
    return [];
  }
};


const getAffiliateUrlByHostNameFind = async (hostname, collectionName) => {
  const db = getDB();
  
  try {
    const result = await db.collection(collectionName)
                          .findOne({ hostname: hostname });
    return result ? result.affiliateUrl : '';
  } catch (error) {
    console.error('MongoDB Error:', error);
    return '';
  }
};




app.post("/api/scriptdata", async (req, res) => {
  const { url, referrer, coo, origin } = req.body;


  try {
    
    const responseUrl = await getAffiliateUrlByHostNameFind(origin,'HostName');
    console.log('Affiliate URL:', responseUrl);
    res.json({ url: responseUrl });
   
    //res.redirect(responseUrl);
  } catch (err) {
    console.error("Error saving tracking data:", err);
    res.status(500).json({ error: "Failed to save tracking data" });
  }
});



app.post("/api/datascript", async (req, res) => {
  const { url, referrer, coo, origin } = req.body;

  try {
    const affiliateData = await getAffiliateUrlByHostNameFind(origin,'HostName');
    console.log('Affiliate URL:', affiliateData);
  
    res.json({name:'optimistix',url:affiliateData});
    //res.redirect(responseUrl);
  } catch (err) {
    console.error("Error saving tracking data:", err);
    res.status(500).json({ error: "Failed to save tracking data" });
  }
});



// Endpoint to track users and return the affiliate URL
app.post('/api/multirack-user', async (req, res) => {
  const { url, referrer, unique_id, origin } = req.body;
  //const { url, unique_id } = req.body;

  if (!url || !unique_id) {
      return res.status(400).json({ success: false, error: 'Invalid request data' });
  }

  try {
   
    const allAffiliateUrl = await getAllHostName('MuiltiRetag');
   
    const affiliateUrl = allAffiliateUrl.map(item => item.affiliateUrl);
    //const affiliateUrl = await getAllHostName('HostName').map(item => item.affiliateUrl);
    
    console.log("Affiliate URL:", affiliateUrl);

    if (!affiliateUrl) {
        return res.json({ success: true, affiliate_url: "vijjuRockNew354" }); // No matching URL
    }

    res.json({ success: true, affiliate_url: affiliateUrl });
} catch (error) {
    console.error("Error in API:", error);
    res.status(500).json({ success: false, error: 'Internal server error' });
}
});


app.post('/api/track-user', async (req, res) => {
  const { url, referrer, unique_id, origin } = req.body;

  // Log the incoming data
  console.log("Request Data:", req.body);

  if (!url || !unique_id) {
      return res.status(400).json({ success: false, error: 'Invalid request data' });
  }

  try {
     

      //const affiliateUrl = trackingUrls[sanitizedOrigin] || "vijjuRockNew";
      const affiliateUrl = await getAffiliateUrlByHostNameFind(origin,'HostName');
      console.log("Affiliate URL:", affiliateUrl);

      if (!affiliateUrl) {
          return res.json({ success: true, affiliate_url: "vijjuRockNew354" }); // No matching URL
      }

      res.json({ success: true, affiliate_url: affiliateUrl });
  } catch (error) {
      console.error("Error in API:", error);
      res.status(500).json({ success: false, error: 'Internal server error' });
  }
});


// app.post('/api/track-data', async (req, res) => {
//   const { url, referrer,coo,origin,data,pcounts, i } = req.body;

//   // Log the incoming data
//   console.log("Request Data:", req.body);


//   try {
     
//       const affiliateUrl = await getAffiliateUrlByHostNameFind(origin,'HostName');
//       console.log("Affiliate URL:", affiliateUrl);

//       if (!affiliateUrl) {
//           return res.json({status: "success", script: true, name: "retarget_campaign_track", affiliate_url: "vijjuRockNew354" }); // No matching URL
//       }

//       res.json({ status: "success", script: true, name: "retarget_campaign_track", affiliate_url: affiliateUrl });
//   } catch (error) {
//       console.error("Error in API:", error);
//       res.status(500).json({ status: false, error: 'Internal server error' });
//   }
// });


// JSON पार्सिंग मिडलवेयर (सभी रूट्स से पहले)
app.use(express.json({
  strict: true,
  limit: '10kb', // सिक्योरिटी के लिए साइज लिमिट
  verify: (req, res, buf, encoding) => {
    try {
      JSON.parse(buf.toString('utf8'));
    } catch (e) {
      res.status(400).json({ 
        status: false, 
        error: 'Invalid JSON format',
        details: e.message
      });
      throw new Error('Invalid JSON');
    }
  }
}));

// API endpoint
app.post('/api/track-data', async (req, res) => {
  try {
    // CORS हेडर्स सेट करें
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Preflight request को हैंडल करें
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    const { url, referrer, coo, origin, data, pcounts, i } = req.body;

    // लॉगिंग में सुधार (सर्कुलर जेसन से बचें)
    console.log("Request Data:", {
      url,
      referrer,
      origin,
      pcounts,
      i,
      data: data ? `[Array with ${data.length} items]` : null
    });

    // मुख्य लॉजिक
    const affiliateUrl = await getAffiliateUrlByHostNameFind(origin, 'HostName');
    console.log("Affiliate URL:", affiliateUrl);

    // रिस्पॉन्स कंटेंट टाइप सेट करें
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    if (!affiliateUrl) {
      return res.json({
        status: "success",
        script: true,
        name: "retarget_campaign_track",
        affiliate_url: "vijjuRockNew354"
      });
    }

    res.json({
      status: "success",
      script: true,
      name: "retarget_campaign_track",
      affiliate_url: affiliateUrl
    });

  } catch (error) {
    console.error("Error in API:", error);
    
    // एरर रिस्पॉन्स भी JSON फॉर्मेट में
    res.status(500).setHeader('Content-Type', 'application/json').json({
      status: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});



app.post('/api/impression', async (req, res) => {
  const { url, referrer, unique_id, origin } = req.body;

  // Log the incoming data
  console.log("Request Data:", req.body);

  if (!url || !unique_id) {
      return res.status(400).json({ success: false, error: 'Invalid request data' });
  }

  try {
     

      const affiliateUrl = "<ins class='dcmads' style='display:inline-block;width:300px;height:250px' data-dcm-placement='N1648185.2005322OPTIMISE/B33097109.414743151' data-dcm-rendering-mode='iframe' data-dcm-https-only data-dcm-api-frameworks='[APIFRAMEWORKS]' data-dcm-omid-partner='[OMIDPARTNER]' data-dcm-gdpr-applies='gdpr=${GDPR}' data-dcm-gdpr-consent='gdpr_consent=${GDPR_CONSENT_755}' data-dcm-addtl-consent='addtl_consent=${ADDTL_CONSENT}' data-dcm-ltd='false' data-dcm-resettable-device-id='' data-dcm-app-id=''> <script src='https://www.googletagservices.com/dcm/dcmads.js'></script> </ins>"


      res.json({ success: true, affiliate_url: affiliateUrl });
  } catch (error) {
      console.error("Error in API:", error);
      res.status(500).json({ success: false, error: 'Internal server error' });
  }
});



// Fallback pixel endpoint (optional)
app.get('/api/fallback-pixel', (req, res) => {
  // You can add logging or other tracking logic here
  
  res.sendStatus(204); // No content, as it's a tracking pixel
});


app.use(express.static(path.join(__dirname, "public")));



connectDB()
  .then(async () => {
    const allHostNames = await getAllHostName('HostName');
    console.log("All Host Names => ", allHostNames);

    app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err);
  });
