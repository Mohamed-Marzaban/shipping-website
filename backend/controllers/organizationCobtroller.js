const validator = require('validator');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const organizationModel = require('../models/organizationModel')

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


module.exports = { signUp }