const express = require('express')
require('dotenv').config()
require('./src/database/connection')

const morgan = require('morgan')
// cross origin resource sharing
const cors = require('cors')

const TestRoute = require('./src/routes/testRoute');
const CategoryRoute = require('./src/routes/categoryRoutes');
const ProductRoute = require('./src/routes/productRoutes');
const UserRoute = require('./src/routes/userRoute')
const OrderRoute = require('./src/routes/orderRoutes')

const app = express();
app.use(express.json());

app.use(morgan('dev'))
app.use(cors())

const port = process.env.PORT

app.use(TestRoute)
app.use('/api/category', CategoryRoute)
app.use('/api/product', ProductRoute)
app.use('/api/user', UserRoute)
app.use('/api/order', OrderRoute)

app.listen(port, () => {
    console.log(`APP STARTED SUCCESSFULLY AT ${port}`);
})