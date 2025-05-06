import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

//getting directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//importing database 
import db from './database.js';

//importing routes 
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// setting up multer so that file uploads work
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

app.use('/uploads', express.static(path.join(__dirname,'uploads')));

//for static files
app.use(express.static(path.join(__dirname,'frontend')));


//using the routes
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/admin', adminRoutes);



// making sure that the first route is the first route
app.use('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

//strating the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});


export default app;