const organizationModel = require('../models/organizationModel')
const orderModel = require('../models/orderModel')
const validator = require('validator');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const multer = require('multer');
const XLSX = require('xlsx');
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
            'application/vnd.ms-excel', // .xls
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        ];

        if (!allowedMimeTypes.includes(file.mimetype)) {
            req.fileValidationError = 'Only Excel files are allowed!';
            return cb(null, false);
        }
        cb(null, true);
    },
});


const signUp = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body

        if (!name || !email || !phone || !password)
            return res.status(400).json({ message: 'Please fill all required fields.' })

        if (!validator.isEmail(email))
            return res.status(400).json({ message: 'Invalid email format.' })

        const existingOrganization = await organizationModel.findOne({ email })

        if (existingOrganization)
            return res.status(400).json({ message: 'Email is already registered.' });

        if (!validator.isStrongPassword(password, {
            minLength: 10,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        }))
            return res.status(400).json({ message: 'Please choose a stronger password.' })

        const hashedPassword = await bcrypt.hash(password, 10)

        const organization = new organizationModel({
            name,
            email,
            phone,
            password: hashedPassword
        })

        await organization.save()

        const token = jwt.sign(
            { id: organization._id, role: 'organization' },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(201).json({ message: 'Signed up successfully' })

    }
    catch (error) {
        console.log('Error while signing up:' + error.message)
        return res.status(500).json({ message: 'Server error' })

    }
}



const uploadOrders = async (req, res) => {
    try {
        if (req.fileValidationError) {
            return res.status(400).json({ message: req.fileValidationError }); // Respond with validation error
        }
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const organization = await organizationModel.findById(req.user.id)

        const buffer = req.file.buffer;
        const workbook = XLSX.read(buffer, { type: 'buffer' });

        const sheetName = workbook.SheetNames[0];

        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet);
        if (!data || data.length === 0) {
            return res.status(400).json({ message: 'The uploaded file is empty.' });
        }

        const ordersToInsert = data.map((row, index) => {
            if (!row.recipientName || !row.recipientPhone || !row.recipientAddress || !row.productDescription) {
                throw new Error(`Missing required fields in row ${index + 1}`);
            }

            if (!validator.isEmail(row.recipientEmail))
                throw new Error(`Incorrect email format in row ${index + 1}`);
            return {
                organizationName: organization.name,
                status: row.status || 'Pending Pickup',
                paymentMethod: row.paymentMethod || 'COD',
                quantity: row.quantity || 1,
                totalAmount: row.totalAmount,
                productDescription: row.productDescription,
                recipientName: row.recipientName,
                recipientEmail: row.recipientEmail || '',
                recipientPhone: row.recipientPhone,
                recipientAddress: row.recipientAddress
            };
        })

        await orderModel.insertMany(ordersToInsert);
        return res.status(200).json({ message: 'Orders processed successfully' });
    } catch (error) {
        console.error('Error processing orders:', error);
        return res.status(500).json({ message: 'Error processing orders:' + ' ' + error.message });
    }
};


module.exports = { signUp, uploadOrders, upload }