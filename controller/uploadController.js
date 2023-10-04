const async = require('async');
const xlsx = require('xlsx');
const Candidate = require('../model/candidateModel');

const uploadController = {
  processExcelData: async (req, res) => {
    const file = req.file;

    if (!file) {
      return res.render('index', { fileUploaded: true, uploadError: 'Please upload a file.' });
    }

    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const rawData = xlsx.utils.sheet_to_json(sheet);
    const data = rawData.map(row => ({
      name: row['Name of the Candidate'],
      email: row['Email'],
      mobile: row['Mobile No.'],
      dateOfBirth: row['Date of Birth'],
      workExperience: row['Work Experience'],
      resumeTitle: row['Resume Title'],
      currentLocation: row['Current Location'],
      postalAddress: row['Postal Address'],
      currentEmployer: row['Current Employer'],
      currentDesignation: row['Current Designation']
    }));
    
    try {
      async.eachSeries(data, async (rowData) => { // Change "callback" to "next"
        const { name, email, mobile, dateOfBirth, workExperience, resumeTitle, currentLocation, postalAddress, currentEmployer, currentDesignation } = rowData;

        // console.log(name, email, mobile, dateOfBirth, workExperience, resumeTitle, currentLocation, postalAddress, currentEmployer, currentDesignation);

        const existingCandidate = await Candidate.findOne({ email });

        if (!existingCandidate) {
          const newCandidate = new Candidate({
            name,
            email,
            mobile,
            dateOfBirth,
            workExperience,
            resumeTitle,
            currentLocation,
            postalAddress,
            currentEmployer,
            currentDesignation,
          });

          await newCandidate.save();
        }

      
      }, (err) => {
        if (err) {
          console.error('Error inserting data into MongoDB', err);
          res.render('index', { fileUploaded: true, uploadError: 'Error inserting data into the database' });
        } else {
          console.log('Inserted documents into MongoDB');
          const uploadedFileName = req.file.originalname;
          res.render('index', { fileUploaded: true, uploadError: false, uploadedFileName });
        }
      });
    } catch (err) {
      console.error('Error processing data', err);
      res.render('index', { fileUploaded: true, uploadError: 'Error processing data' });
    }
  },
};

module.exports = uploadController;
