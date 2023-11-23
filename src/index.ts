import zod from "zod"
import cors from "cors"
import bcrypt from "bcryptjs"
import express, { NextFunction, Request, Response, Router } from "express"
import dotenv from "dotenv"
import mongoose, { Model, Query, Schema, model, Document } from "mongoose"



dotenv.config()


const app = express()


const mongodb_url = process.env.MONGODB_URL as string
const port = process.env.PORT as string || 5000


const usersRoutes = Router()



//!middleware
app.use(express.json())
app.use(cors())

//! routes
app.use('/api/users', usersRoutes)



// =============================================================
//! zod schema validations start
// =============================================================

const fullNameSchemaValidation = zod.object({
    firstName: zod.string().min(3, { message: 'Please enter first name at least 3 digits' }).max(15, { message: 'First name cannot be more than 15 digits' }).trim(),
    lastName: zod.string().min(3, { message: 'Please enter last name at least 3 digits' }).max(15, { message: 'First name cannot be more than 15 digits' }).trim(),
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
    userId: zod.number(),
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

// =============================================================
//! zod schema validations end
// =============================================================

//!--------------------------------------------------------------------------------------------------------------------

// =============================================================
//! interfaces and types start
// =============================================================

type TUsers = zod.infer<typeof usersSchemaValidation>
type TOrders = zod.infer<typeof ordersSchemaValidation>
type TAddress = zod.infer<typeof addressSchemaValidation>
type TFullName = zod.infer<typeof fullNameSchemaValidation>



interface IUsersModel extends Model<TUsers> {
    isUserExist(userId: number): Promise<TUsers | null>
}


// =============================================================
//! interfaces and types end
// =============================================================

//!--------------------------------------------------------------------------------------------------------------------

// =============================================================
//! mongoose schema & models start
// =============================================================

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
        required: [true, 'Please check your last name fields.'],
        min: [3, 'Last name must be at least 3 characters.'],
        max: [20, 'Last name cannot be more than 20 characters.'],
        trim: true,
    }
}, { _id: false });

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
}, { _id: false });

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
}, { _id: false })

const UserSchema = new Schema<TUsers, IUsersModel>({
    userId: {
        type: 'Number',
        required: [true, 'Please check your user id fields.'],
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


UserSchema.statics.isUserExist = async function (userId: number): Promise<TUsers | Pick<TUsers, "orders"> | null> {
    return await User.findOne({ userId })
}

//! mongoose pre middleware
UserSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password, salt)

    this.password = hashedPassword
})

UserSchema.pre(/^find/, function (this: Query<TUsers, Document>, next) {
    this.find({
        isActive: true
    }).projection({ password: 0 })
    next()
})


const User = model<TUsers, IUsersModel>('User', UserSchema)

// =============================================================
//! mongoose schema & models end
// =============================================================


//!--------------------------------------------------------------------------------------------------------------------


// =============================================================
//! routes start here
// =============================================================


app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
})


//! create user api
usersRoutes.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userData: TUsers = req.body
        const validated = usersSchemaValidation.safeParse(userData)

        if (!validated.success) {
            return res.status(400).json({
                success: false,
                message: validated.error.issues.map(errorObj => `${errorObj.message === 'Required' ? errorObj.path[0] + " is " + errorObj.message : errorObj.message}`).toString(),
                error: {
                    code: 400,
                    description: 'User validation failed',
                }
            })
        }

        const isExist = await User.isUserExist(validated.data.userId)

        if (isExist) {
            return res.status(200).json({
                "success": false,
                "message": "User already exist!",
                "error": {
                    "code": 200,
                    "description": "User already exist!"
                }
            })
        }

        const response = await User.create(validated.data)

        return res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: response
        })
    } catch (error) {
        next(error)
    }
})



//! get all users api
usersRoutes.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await User.find()
        return res.status(200).json({
            success: true,
            message: 'Users fetched successfully',
            data: response
        })
    } catch (error) {
        next(error)
    }
})


//! get single user api
usersRoutes.get('/:userId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.userId
        const isExist = await User.isUserExist(Number(userId))

        if (!isExist) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
                error: {
                    code: 404,
                    description: 'User not found'
                }
            })
        }

        return res.send({
            success: true,
            message: 'user fetch successfully',
            data: isExist
        })
    } catch (error) {
        next(error)
    }
})


//! update single user api
usersRoutes.put('/:userId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.userId
        const { fullName, hobbies, orders, address, ...remaining }: Partial<TUsers> = req.body
        const isExist = await User.isUserExist(Number(userId))

        if (!isExist) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
                error: {
                    code: 404,
                    description: 'User not found'
                }
            })
        }

        const updatedUser = await User.findOneAndUpdate(
            {
                userId
            },
            {
                $push: {
                    orders,
                    hobbies,
                },
                $set: {
                    fullName,
                    address,
                    ...remaining
                }

            },
            {
                runValidators: true,
                new: true
            })

        return res.status(200).json({
            success: false,
            message: 'User updated successfully',
            data: updatedUser
        })

    } catch (error) {
        next(error)
    }
})


//! delete single user api
usersRoutes.delete('/:userId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.userId
        const isExist = await User.isUserExist(Number(userId))

        if (!isExist) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
                error: {
                    code: 404,
                    description: 'User not found'
                }
            })
        }

        const deletedUser = await User.deleteOne({ userId })

        return res.send({
            success: true,
            message: 'user successfully permanently delete',
            data: deletedUser
        })
    } catch (error) {
        next(error)
    }
})


// !get all orders for specified user
usersRoutes.get('/:userId/orders', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = Number(req.params.userId)
        const user = await User.isUserExist(userId)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
                error: {
                    code: 404,
                    description: 'User not found'
                }
            })
        }


        const [userOrders] = await User.aggregate([
            {
                $match: { userId }
            },
            {
                $project: {
                    _id: 0,
                    orders: 1
                }
            }
        ])


        return res.send({
            success: true,
            message: `user's orders fetch successfully`,
            data: userOrders
        })
    } catch (error) {
        next(error)
    }
})


usersRoutes.get('/:userId/orders/total-price', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = Number(req.params.userId)
        const user = await User.isUserExist(Number(userId))

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
                error: {
                    code: 404,
                    description: 'User not found'
                }
            })
        }


        const [userOrders] = await User.aggregate([
            {
                $match: { userId }
            },
            {
                $unwind: '$orders'
            },
            {
                $group: {
                    _id: null,
                    totalOrdersPrice: { $sum: '$orders.price' }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalOrdersPrice: 1
                }
            }
        ])


        return res.send({
            success: true,
            message: `user's orders total price fetch successfully`,
            data: userOrders

        })
    } catch (error) {
        next(error)
    }
})




//! global error handler middleware

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    console.log(error);
    res.status(500).json({
        "success": false,
        "message": error.message || 'something went wrong',
        "error": {
            "code": 500,
            "description": "internal error"
        }
    })
})

// =============================================================
//! routes end here
// =============================================================

//!--------------------------------------------------------------------------------------------------------------------


// =============================================================
//! database and server connections here
// =============================================================

const connectDb = async () => {
    try {
        await mongoose.connect(mongodb_url)
        app.listen(port, () => {
            console.log({
                db: 'database connection established with server',
                server: `server listening on port ${port}`
            })
        })
    } catch (error) {
        console.log(error);
    }
}

connectDb()

// =============================================================
//! database and server connections end here
// =============================================================

