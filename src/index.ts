import zod from "zod"
import cors from "cors"
import express, { Request, Response, Router } from "express"


const app = express()


const usersRoutes = Router()
const port = 3000



//!middleware
app.use(express.json())
app.use(cors())

//! routes
app.use('/api/users', usersRoutes)







// ===================================
//! zod schema validations start
// ===================================

const fullNameSchemaValidation = zod.object({
    firstName: zod.string().min(3, { message: 'Please enter first name at least 3 digits' }).max(15, { message: 'First name cannot be more than 15 digits' }).trim(),
    lastName: zod.string().min(3, { message: 'Please enter first name at least 3 digits' }).max(15, { message: 'First name cannot be more than 15 digits' }).trim(),
})

const addressSchemaValidation = zod.object({
    street: zod.string().min(3, { message: 'Please enter street at least 3 digits' }).max(15, { message: 'Street cannot be more than 15 digits' }).trim(),
    city: zod.string().min(3, { message: 'Please enter city at least 3 digits' }).max(15, { message: 'City cannot be more than 15 digits' }).trim(),
    country: zod.string().min(3, { message: 'Please enter country at least 3 digits' }).max(15, { message: 'Country cannot be more than 15 digits' }).trim(),
})

const ordersSchemaValidation = zod.object({
    productName: zod.string().min(3, { message: 'Please enter product name at least 3 digits' }).max(40, { message: 'Product name cannot be more than 40 digits' }).trim(),
    price: zod.number().min(1, { message: 'Please enter price at least 1 digits' }),
    quantity: zod.number().min(1, { message: 'Please enter quantity at least 1 digits' })
})

const usersSchemaValidation = zod.object({
    userId: zod.number().min(3, { message: 'Please enter user id at least 3 digits' }).max(5, { message: 'User id cannot be more than 5 digits' }),
    username: zod.string().min(3, { message: 'Please enter username at least 3 character' }).max(15, { message: 'Username cannot be more than 15 characters' }).trim(),
    password: zod.string().min(3, { message: 'Please enter password at least 6 characters' }).max(16, { message: 'Password cannot be more than 16 characters' }),
    fullName: fullNameSchemaValidation,
    age: zod.number().min(1, { message: 'Please enter age at least 1 digits' }),
    email: zod.string().email({ message: 'Invalid email address' }).trim().toLowerCase(),
    isActive: zod.boolean(),
    hobbies: zod.array(zod.string()).nonempty(),
    address: addressSchemaValidation,
    orders: zod.array(ordersSchemaValidation).nonempty().optional(),
})
// ===================================
//! zod schema validations end
// ===================================

//!--------------------------------------------------------------------------------------------------------------------

// ===================================
//! interfaces and types start
// ===================================


type TFullName = zod.infer<typeof fullNameSchemaValidation>
type TAddress = zod.infer<typeof addressSchemaValidation>
type TOrders = zod.infer<typeof ordersSchemaValidation>
type TUsers = zod.infer<typeof usersSchemaValidation>


// ===================================
//! interfaces and types end
// ===================================



app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})