// app.js

const express = require('express');
const fs = require('fs');
const { createObjectCsvWriter } = require('csv-writer');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/download-csv', (req, res) => {
    const leads = req.body.leads; 

    const csvHeader = [
        { id: 'name', title: 'Name' },
        { id: 'link', title: 'Link' },
    ];

    const csvWriter = createObjectCsvWriter({
        path: 'linkedin_data.csv',
        header: csvHeader,
    });

    csvWriter.writeRecords(leads)
        .then(() => {
            res.download('linkedin_data.csv', 'linkedin_data.csv', (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Error downloading file.');
                } else {
                    console.log('File downloaded successfully.');
                }
            });
        });
});

app.use(express.static('public')); 

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
