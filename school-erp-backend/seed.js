const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const Teacher = require('./src/models/Teacher');
const Student = require('./src/models/Student');
const Class = require('./src/models/Class');
const connectDB = require('./src/config/db');

dotenv.config();
connectDB();

const seedData = async () => {
    try {
        console.log('🌱 Starting Seed Process...');

        // --- 1. Admin ---
        let adminUser = await User.findOne({ email: 'admin@school.com' });
        if (!adminUser) {
            adminUser = await User.create({
                name: 'Super Admin',
                email: 'admin@school.com',
                password: 'adminpassword',
                role: 'ADMIN',
            });
            console.log('✅ Admin user created');
        } else {
            console.log('ℹ️  Admin already exists');
        }

        // --- 2. Teacher ---
        let teacherUser = await User.findOne({ email: 'teacher@school.com' });
        if (!teacherUser) {
            teacherUser = await User.create({
                name: 'John Teacher',
                email: 'teacher@school.com',
                password: 'teacherpassword',
                role: 'TEACHER',
            });

            await Teacher.create({
                user: teacherUser._id,
                employeeId: 'EMP001',
                qualification: 'M.Sc. Mathematics',
                subjects: ['Math', 'Physics'],
                phone: '1234567890'
            });
            console.log('✅ Teacher user & profile created');
        } else {
            console.log('ℹ️  Teacher already exists');
        }

        // --- 3. Class ---
        // We need a class to assign the student to
        let class10A = await Class.findOne({ name: '10', section: 'A' });
        if (!class10A) {
            class10A = await Class.create({
                name: '10',
                section: 'A',
                classTeacher: teacherUser ? teacherUser._id : null // Assign teacher if available (technically need Teacher ID not User ID, let's fix below)
            });

            // Fix: Class teacher ref should point to Teacher model, not User model
            const teacherProfile = await Teacher.findOne({ user: teacherUser._id });
            if (teacherProfile) {
                class10A.classTeacher = teacherProfile._id;
                await class10A.save();
            }

            console.log('✅ Class 10-A created');
        } else {
            console.log('ℹ️  Class 10-A already exists');
        }

        // --- 4. Student ---
        let studentUser = await User.findOne({ email: 'student@school.com' });
        if (!studentUser) {
            studentUser = await User.create({
                name: 'Alice Student',
                email: 'student@school.com',
                password: 'studentpassword',
                role: 'STUDENT',
            });

            await Student.create({
                user: studentUser._id,
                studentId: 'STU001',
                class: class10A._id,
                rollNumber: 1,
                gender: 'Female',
                phone: '9876543210',
                guardianName: 'Bob Parent'
            });
            console.log('✅ Student user & profile created');
        } else {
            console.log('ℹ️  Student already exists');
        }

        console.log('\n-----------------------------------');
        console.log('🎉 Seeding Complete!');
        console.log('-----------------------------------');
        console.log('Admin:   admin@school.com   / adminpassword');
        console.log('Teacher: teacher@school.com / teacherpassword');
        console.log('Student: student@school.com / studentpassword');
        console.log('-----------------------------------');

        process.exit();
    } catch (error) {
        console.error('❌ Seeding Failed:', error);
        process.exit(1);
    }
};

seedData();
