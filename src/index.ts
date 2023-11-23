import zod from "zod"
import cors from "cors"
import express, { Request, Response, Router } from "express"
import { Model, Schema, model } from "mongoose"


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



interface IUsersModel extends Model<TUsers> {
    isUserExist(userId: string): Promise<TUsers | null>
}


// ===================================
//! interfaces and types end
// ===================================

//!--------------------------------------------------------------------------------------------------------------------

// ===================================
//! mongoose schema & models start
// ===================================

const FullNameSchema = new Schema<TFullName>({
    firstName: {
        type: 'String',
        required: [true, 'Please check your first name fields.'],
        min: [3, 'First name must be at least 3 characters.'],
        max: [20, 'First name cannot be more than 20 characters.'],
        trim: true,
    },
    lastName: {
        type: 'String',
        required: [true, 'Please check your first name fields.'],
        min: [3, 'Last name must be at least 3 characters.'],
        max: [20, 'Last name cannot be more than 20 characters.'],
        trim: true,
    }
});


const AddressSchema = new Schema<TAddress>({
    city: {
        type: 'String',
        required: [true, 'Please check your city fields.'],
        min: [3, 'City must be at least 3 characters.'],
        max: [20, 'City cannot be more than 20 characters.'],
        trim: true,
    },
    country: {
        type: 'String',
        required: [true, 'Please check your country fields.'],
        min: [3, 'Country must be at least 3 characters.'],
        max: [20, 'Country cannot be more than 20 characters.'],
        trim: true,
    },
    street: {
        type: 'String',
        required: [true, 'Please check your street fields.'],
        min: [3, 'Street must be at least 3 characters.'],
        max: [20, 'Street cannot be more than 20 characters.'],
        trim: true,
    }
});

const OrdersSchema = new Schema<TOrders>({
    price: {
        type: 'Number',
        required: [true, 'Please check your price field.'],
        min: [1, 'Price must be at least 1 digits.'],
    },
    quantity: {
        type: 'Number',
        required: [true, 'Please check your quantity field.'],
        min: [1, 'Quantity must be at least 1 digits.'],
    },
    productName: {
        type: 'String',
        required: [true, 'Please check your product name field.'],
        min: [3, 'Street must be at least 3 characters.'],
        max: [40, 'Street cannot be more than 20 characters.'],
        trim: true,
    },
})


const UserSchema = new Schema<TUsers, IUsersModel>({
    userId: {
        type: 'Number',
        required: [true, 'Please check your user id fields.'],
        min: [3, 'User id must be at least 3 digits.'],
        max: [5, 'User id cannot be more than 5 digits.'],
        unique: true,
    },
    username: {
        type: 'String',
        required: [true, 'Please check your username fields.'],
        min: [3, 'User id must be at least 3 digits.'],
        trim: true,
        unique: true,
    },
    email: {
        type: 'String',
        unique: true,
        required: [true, 'Please check your email fields.'],
        trim: true,
    },
    password: {
        type: 'String',
        required: [true, 'Please check your password fields.'],
        min: [3, 'Password must be at least 6 digits.'],
        max: [16, 'Password cannot be more than 16 digits.'],
    },
    fullName: FullNameSchema,
    age: {
        type: 'Number',
        required: [true, 'Please check your age fields.'],
        min: [1, 'Please check your age fields.'],
    },
    isActive: {
        type: 'Boolean',
        required: [true, 'Please check your active fields.'],
    },
    hobbies: {
        type: ['String'],
        required: [true, 'Please check your hobbies fields.'],
    },
    address: AddressSchema,
    orders: [OrdersSchema]
})


UserSchema.statics.isUserExist = async function (userId: string): Promise<TUsers | null> {

    return await User.findOne({ userId })

}





const User = model<TUsers, IUsersModel>('User', UserSchema)



// ===================================
//! mongoose schema & models end
// ===================================

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
})



usersRoutes.post('/', (req: Request, res: Response) => {
    return res.send('Hello World! from users POST request create method')
})
usersRoutes.get('/', (req: Request, res: Response) => {
    return res.send('Hello World! from users GET request find method')
})
usersRoutes.get('/:userId', async (req: Request, res: Response) => {
    const userId = req.params.userId
    const isUserExist = await User.isUserExist(userId)
    return res.send({
        success: true,
        message: 'user fetch successfully',
        data: isUserExist
    })
})
usersRoutes.put('/:userId', (req: Request, res: Response) => {
    return res.send('Hello World! from users GET request update single user method')
})
usersRoutes.delete('/:userID', (req: Request, res: Response) => {
    return res.send('Hello World! from users GET request delete single user method')
})


// !api for orders
usersRoutes.put('/:userId/orders', (req: Request, res: Response) => {
    return res.send('Hello World! from users GET request update single user orders array method')
})

usersRoutes.get('/:userId/orders', (req: Request, res: Response) => {
    return res.send('Hello World! from users GET request find single user all orders method')
})

usersRoutes.get('/:userId/orders/total-price', (req: Request, res: Response) => {
    return res.send('Hello World! from users GET request find single user total order price method')
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})