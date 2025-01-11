const mongoose = require("mongoose")
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
    limits: {
        fileSize: 2 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
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


function validateFields(recipientEmail, recipientPhone, quantity, totalAmount, paymentMethod, index) {
    const rowMessage = index === -1 ? '' : ` in row ${index + 1}`;

    if (!validator.isEmail(recipientEmail)) {
        throw new Error(`Incorrect email format${rowMessage}`);
    }
    if (!validator.isMobilePhone(recipientPhone, 'ar-EG')) {
        throw new Error(`Invalid phone number format${rowMessage}`);
    }
    if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new Error(`Invalid quantity${rowMessage}. Quantity must be a positive integer.`);
    }
    if (isNaN(totalAmount) || totalAmount <= 0) {
        throw new Error(`Invalid total amount${rowMessage}. Total amount must be a positive number.`);
    }
    const validPaymentMethods = ['COD', 'Card'];
    if (!validPaymentMethods.includes(paymentMethod)) {
        throw new Error(`Invalid payment method${rowMessage}. Allowed values: ${validPaymentMethods.join(', ')}`);
    }
}



const uploadOrders = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        if (req.fileValidationError) {
            return res.status(400).json({ message: req.fileValidationError }); // Respond with validation error
        }
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const organization = await organizationModel.findById(req.user.id)

        if (!organization)
            return res.status(403).json({ message: 'Unauthorized: organization not found' })

        const buffer = req.file.buffer;
        const workbook = XLSX.read(buffer, { type: 'buffer' });

        const sheetName = workbook.SheetNames[0];

        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet);
        if (!data || data.length === 0) {
            return res.status(400).json({ message: 'The uploaded file is empty.' });
        }

        const ordersToInsert = data.map((row, index) => {
            if (!row.recipientName || !row.recipientPhone || !row.recipientAddress || !row.productDescription || !row.quantity || !row.totalAmount || !row.paymentMethod) {
                throw new Error(`Missing required fields in row ${index + 1}`);
            }

            validateFields(row.recipientEmail, row.recipientPhone, row.quantity, row.totalAmount, row.paymentMethod, index)

            const sanitizedRecipientName = validator.escape(row.recipientName.trim());
            const sanitizedRecipientAddress = validator.escape(row.recipientAddress.trim());
            const sanitizedProductDescription = validator.escape(row.productDescription.trim());
            return {
                organizationName: organization.name,
                paymentMethod: row.paymentMethod || 'COD',
                quantity: row.quantity || 1,
                totalAmount: row.totalAmount,
                productDescription: sanitizedProductDescription,
                recipientName: sanitizedRecipientName,
                recipientEmail: row.recipientEmail || '',
                recipientPhone: row.recipientPhone,
                recipientAddress: sanitizedRecipientAddress,
                organizationId: organization._id
            };
        })

        await orderModel.insertMany(ordersToInsert, { session });
        await session.commitTransaction();
        return res.status(200).json({ message: 'Orders processed successfully' });
    } catch (error) {
        await session.abortTransaction();
        console.error('Error processing orders:', error);
        return res.status(500).json({ message: 'Error processing orders:' + ' ' + error.message });
    }
    finally {
        session.endSession();
    }
};


const createOrder = async (req, res) => {
    try {
        const organizationId = req.user.id
        const organization = await organizationModel.findById(organizationId)

        if (!organization)
            return res.status(403).json({ message: 'Unauthorized: Organization not found' })

        const { recipientName, recipientPhone, recipientEmail, recipientAddress, productDescription, paymentMethod, quantity, totalAmount } = req.body;

        if (!recipientName || !recipientPhone || !recipientEmail || !recipientAddress || !productDescription || !paymentMethod || !quantity || !totalAmount)
            return res.status(400).json({ message: 'Please fill all required fields' })

        validateFields(recipientEmail, recipientPhone, quantity, totalAmount, paymentMethod, -1);

        const sanitizedRecipientName = validator.escape(recipientName.trim());
        const sanitizedRecipientAddress = validator.escape(recipientAddress.trim());
        const sanitizedProductDescription = validator.escape(productDescription.trim());

        const order = new orderModel({
            organizationName: organization.name,
            paymentMethod: paymentMethod || 'COD',
            quantity: quantity || 1,
            totalAmount: totalAmount,
            productDescription: sanitizedProductDescription,
            recipientName: sanitizedRecipientName,
            recipientEmail: recipientEmail || '',
            recipientPhone: recipientPhone,
            recipientAddress: sanitizedRecipientAddress,
            organizationId: organization._id
        })

        await order.save()
        return res.status(201).json({ message: 'Created order succesfully' })
    }
    catch (error) {
        console.log('Error while creating order:' + error.message)
        return res.status(500).json({ message: 'Server Error' })
    }
}

const viewAllOrders = async (req, res) => {
    try {
        const organization = await organizationModel.findById(req.user.id)

        if (!organization)
            return res.status(403).json({ message: 'Unauthorized: Organization not found' })

        const orders = await orderModel.find({ organizationId: organization._id }).select('-organizationId')

        if (orders.length === 0)
            return res.status(400).json({ message: 'No orders yet.' })

        return res.status(200).json({ orders })
    }
    catch (error) {
        console.log('Error while fetching orders:' + error.message)
        return res.status(500).json({ message: 'Server Error' })
    }
}

//delete an order that is not delivered
const deleteOrder = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        let orderId = req.params.orderId

        orderId = new mongoose.Types.ObjectId(orderId)

        const order = await orderModel.findOne({ _id: orderId, organizationId: req.user.id }, null, { session })

        console.log(order)

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.status === 'Delivered')
            return res.status(400).json({ message: 'Order has already been delivered ' })

        await orderModel.findByIdAndDelete(orderId, { session })
        await session.commitTransaction();
        return res.status(200).json({ message: 'Deleted order' })


    }
    catch (error) {
        await session.abortTransaction();
        console.log('Error while deleting:' + error.message)
        return res.status(500).json({ message: 'Server error' })
    }
    finally {
        session.endSession();
    }
}

// update an order that has not been picked up yet
const updateOrder = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        if (!req.params.orderId)
            throw new Error('Please include orderId')
        const orderId = new mongoose.Types.ObjectId(req.params.orderId)
        const order = await orderModel.findOne({ _id: orderId, organizationId: req.user.id }, null, { session })
        if (!order)
            return res.status(400).json({ message: 'Order not found' })

        if (order.status !== 'Pending Pickup') {
            return res.status(400).json({
                message: 'Order cannot be updated in its current status.'
            });
        }

        const { quantity, recipientName, recipientEmail, recipientAddress, recipientPhone, totalAmount, productDescription } = req.body;

        const updates = {};


        if (quantity) {
            if (!Number.isInteger(quantity) || quantity <= 0) {
                return res.status(400).json({ message: 'Invalid quantity. Quantity must be a positive integer.' });
            }
            updates.quantity = quantity;
        }


        if (recipientName) {
            const sanitizedRecipientName = validator.escape(recipientName.trim());
            updates.recipientName = sanitizedRecipientName;
        }


        if (recipientEmail) {
            if (!validator.isEmail(recipientEmail)) {
                return res.status(400).json({ message: 'Invalid email format.' });
            }
            updates.recipientEmail = recipientEmail;
        }


        if (recipientAddress) {
            const sanitizedRecipientAddress = validator.escape(recipientAddress.trim());
            updates.recipientAddress = sanitizedRecipientAddress;
        }

        if (recipientPhone) {
            if (!validator.isMobilePhone(recipientPhone, 'ar-EG')) {
                return res.status(400).json({ message: 'Invalid phone number format for Egypt.' });
            }
            updates.recipientPhone = recipientPhone;
        }

        if (totalAmount !== undefined) {
            if (isNaN(totalAmount) || totalAmount <= 0) {
                return res.status(400).json({ message: 'Invalid total amount. Total amount must be a positive number.' });
            }
            updates.totalAmount = totalAmount;
        }

        if (productDescription) {
            const sanitizedProductDescription = validator.escape(productDescription.trim());
            updates.productDescription = sanitizedProductDescription;
        }


        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'No valid fields provided for update.' });
        }

        await orderModel.findByIdAndUpdate(orderId, updates, { session })

        await session.commitTransaction();
        return res.status(200).json({ message: 'Updated order.' })

    }
    catch (error) {
        await session.abortTransaction();
        console.log('Error while updating:' + error.message)
        return res.status(500).json({ message: 'Server error' })
    }
    finally {
        session.endSession();
    }
}

const viewPendingPickUpOrders = async (req, res) => {
    try {
        const organization = await organizationModel.findById(req.user.id)

        if (!organization)
            return res.status(403).json({ message: 'Unauthorized: Organization not found' })

        const orders = await orderModel.find({ organizationId: organization._id, status: 'Pending Pickup' }).select('-organizationId')

        if (orders.length === 0)
            return res.status(400).json({ message: 'No orders yet.' })

        return res.status(200).json({ orders })
    }
    catch (error) {
        console.log('Error while fetching orders:' + error.message)
        return res.status(500).json({ message: 'Server Error' })
    }
}

module.exports = { signUp, uploadOrders, upload, createOrder, viewAllOrders, deleteOrder, updateOrder, viewPendingPickUpOrders }