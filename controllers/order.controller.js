
import OrderModel from "../models/order.model.js";
import ProductModel from "../models/product.model.js";
import UserModel from '../models/user.model.js'


export const createOrderController = async (request, response) => {
  try {
    let order = new OrderModel({
      userId: request.body.userId,
      products: request.body.products,
      paymentId: request.body.paymentId,
      payment_status: request.body.payment_status,
      delivery_address: request.body.delivery_address,
      totalAmt: request.body.totalAmt,
      date: request.body.date
    });

    if (!order) {
      response.status(500).json({
        error: true,
        success: false
      })
    }

    const savedOrder = await order.save();

    for (let i = 0; i < request.body.products.length; i++) {

      const { productId, quantity } = request.body.products[i];

      let product = await ProductModel.findById(productId);

      if (!product) {
        return response.status(404).json({
          error: true,
          success: false
        })
      }

      if (product.countInStock < quantity) {
        return response.status(400).json({
          message: "Item out of Stock",
          error: true,
          success: false
        })
      }

      product.countInStock = product.countInStock - Number(quantity || 0);

      await product.save();
      // await ProductModel.findByIdAndUpdate(

      //   request.body.products[i].productId,
      //   {
      //     countInStock: parseInt(request.body.products[i].countInStock - request.body.products[i].quantity),
      //   },

      //   {new:true}

      // );
    }


    return response.status(200).json({
      message: "Order Placed",
      error: false,
      success: true,
      order: savedOrder
    })
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}

export const getOrderDetailsController = async (request, response) => {
  try {
    const userId = request.user._id;

    const { page, limit } = request.query;

    const orderlist = await OrderModel.find({userId}).sort({ createdAt: -1 }).populate('delivery_address userId').skip((page - 1) * limit).limit(parseInt(limit));

    const total = await OrderModel.countDocuments({userId})


    return response.json({
      message: "Order List",
      data: orderlist,
      error: false,
      success: true,
      total: total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}

export const getAllOrdersController = async (req, res) => {
  try {
    const { page, limit } = req.query;

    // ✅ Get all orders (no user filter)
    const orderlist = await OrderModel.find()
      .sort({ createdAt: -1 })
      .populate("delivery_address userId") // populate both address + user info
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // ✅ Get total count
    const total = await OrderModel.countDocuments();

    return res.json({
      message: "All Orders (Admin Panel)",
      data: orderlist,
      error: false,
      success: true,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Admin Order Error:", error);
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const updateOrderStatusController = async (request, response) => {
  try {
    const { id, order_status } = request.body;


    const updateOrder = await OrderModel.updateOne({
      _id: id,

    }, {
      order_status: order_status,

    }, {
      new: true
    })

    return response.json({
      message: "Update Status",
      error: false,
      success: true,
      data: updateOrder
    })
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    });
  }

}

export const getTotalOrdersCountController = async (request, response) => {
try {
  
  const ordersCount = await OrderModel.countDocuments();

  return response.status(200).json({
    error:false,
    success:true,
    count:ordersCount
  })
} catch (error) {
  return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    });
}
}

export const totalSalesController = async (request, response) => {
   try {
    const currentYear = new Date().getFullYear();
    const orderList = await OrderModel.find();

    let totalSales = 0;
    let monthlySales = [
      {
        name:'JAN',
        totalSales: 0
      },
      {
        name:'FEB',
        totalSales: 0
      },
      {
        name:'MAR',
        totalSales: 0
      },
      {
        name:'APR',
        totalSales: 0
      },
      {
        name:'MAY',
        totalSales: 0
      },
      {
        name:'JUN',
        totalSales: 0
      },
      {
        name:'JUL',
        totalSales: 0
      },
      {
        name:'AUG',
        totalSales: 0
      },
      {
        name:'SEP',
        totalSales: 0
      },
      {
        name:'OCT',
        totalSales: 0
      },
      {
        name:'NOV',
        totalSales: 0
      },
      {
        name:'DEC',
        totalSales: 0
      },

    ]

    for(let i = 0; i<orderList.length; i++){
      totalSales = totalSales + parseInt(orderList[i].totalAmt);
      const str = JSON.stringify(orderList[i].createdAt);
      const year = str.substr(1,4);
      const monthStr = str.substr(6,8);
      const month = parseInt(monthStr.substr(0,2));

      if(currentYear == year){
        if(month===1){
          monthlySales[0] = {
            name:'JAN',
            totalSales:monthlySales[0].totalSales = parseInt(monthlySales[0].totalSales) + parseInt(orderList[i].totalAmt)
          }
        }


      if(month===2){
          monthlySales[1] = {
            name:'FEB',
            totalSales:monthlySales[0].totalSales = parseInt(monthlySales[0].totalSales) + parseInt(orderList[i].totalAmt)
          }
        }
        
      if(month===3){
          monthlySales[2] = {
            name:'MAR',
            totalSales:monthlySales[0].totalSales = parseInt(monthlySales[0].totalSales) + parseInt(orderList[i].totalAmt)
          }
        }
        
      if(month===4){
          monthlySales[3] = {
            name:'APR',
            totalSales:monthlySales[0].totalSales = parseInt(monthlySales[0].totalSales) + parseInt(orderList[i].totalAmt)
          }
        }  


      if(month===5){
          monthlySales[4] = {
            name:'MAY',
            totalSales:monthlySales[0].totalSales = parseInt(monthlySales[0].totalSales) + parseInt(orderList[i].totalAmt)
          }
        }  

      if(month===6){
          monthlySales[5] = {
            name:'JUN',
            totalSales:monthlySales[0].totalSales = parseInt(monthlySales[0].totalSales) + parseInt(orderList[i].totalAmt)
          }
        }
      
        
      if(month===7){
          monthlySales[6] = {
            name:'JUL',
            totalSales:monthlySales[0].totalSales = parseInt(monthlySales[0].totalSales) + parseInt(orderList[i].totalAmt)
          }
        }

      if(month===8){
          monthlySales[7] = {
            name:'AUG',
            totalSales:monthlySales[0].totalSales = parseInt(monthlySales[0].totalSales) + parseInt(orderList[i].totalAmt)
          }
        }
        
        
      if(month===9){
          monthlySales[8] = {
            name:'SEP',
            totalSales:monthlySales[0].totalSales = parseInt(monthlySales[0].totalSales) + parseInt(orderList[i].totalAmt)
          }
        }
        
        
      if(month===10){
          monthlySales[9] = {
            name:'OCT',
            totalSales:monthlySales[0].totalSales = parseInt(monthlySales[0].totalSales) + parseInt(orderList[i].totalAmt)
          }
        }
        
      if(month===11){
          monthlySales[10] = {
            name:'NOV',
            totalSales:monthlySales[0].totalSales = parseInt(monthlySales[0].totalSales) + parseInt(orderList[i].totalAmt)
          }
        }
        
      if(month===12){
          monthlySales[11] = {
            name:'DEC',
            totalSales:monthlySales[0].totalSales = parseInt(monthlySales[0].totalSales) + parseInt(orderList[i].totalAmt)
          }
        }  
        

      if(month===1){
          monthlySales[0] = {
            name:'JAN',
            totalSales:monthlySales[0].totalSales = parseInt(monthlySales[0].totalSales) + parseInt(orderList[i].totalAmt)
          }
        }  
      }
    }

    return response.status(200).json({
      totalSales:totalSales,
      monthlySales:monthlySales,
      error:false,
      success:true,

    })
   } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    });
   }
}

export const totalUsersController = async (request, response) => {
  try {
    const users = await UserModel.aggregate([
      {
        $group: {
          _id: {year : {$year: "$createdAt"},month:{$month: "$createdAt"}},count:{$sum: 1},
        },
      },
      {
        $sort:{"_id.year": 1, "_id.month": 1},
      },
    ]);

    let monthlyUsers = [
      {
        name:"JAN",
        totalUsers:0
      },

      {
        name:"FEB",
        totalUsers:0
      },

      {
        name:"MAR",
        totalUsers:0
      },

      {
        name:"APR",
        totalUsers:0
      },

      {
        name:"MAY",
        totalUsers:0
      },

      {
        name:"JUN",
        totalUsers:0
      },

      {
        name:"JUL",
        totalUsers:0
      },

      {
        name:"AUG",
        totalUsers:0
      },

      {
        name:"SEP",
        totalUsers:0
      },

      {
        name:"OCT",
        totalUsers:0
      },

      {
        name:"NOV",
        totalUsers:0
      },

      {
        name:"DEC",
        totalUsers:0
      },

    ]

    for(let i=0; i<users.length; i++){
      if(users[i]?._id?.month===1){
        monthlyUsers[0] = {
          name:"JAN",
          totalUsers:users[i].count
        }
      }

      if(users[i]?._id?.month===2){
        monthlyUsers[1] = {
          name:"FEB",
          totalUsers:users[i].count
        }
      }

      if(users[i]?._id?.month===3){
        monthlyUsers[2] = {
          name:"MAR",
          totalUsers:users[i].count
        }
      }

      if(users[i]?._id?.month===4){
        monthlyUsers[3] = {
          name:"APR",
          totalUsers:users[i].count
        }
      }

      if(users[i]?._id?.month===5){
        monthlyUsers[4] = {
          name:"MAY",
          totalUsers:users[i].count
        }
      }

      if(users[i]?._id?.month===6){
        monthlyUsers[5] = {
          name:"JUN",
          totalUsers:users[i].count
        }
      }

      if(users[i]?._id?.month===7){
        monthlyUsers[6] = {
          name:"JUL",
          totalUsers:users[i].count
        }
      }

      if(users[i]?._id?.month===8){
        monthlyUsers[7] = {
          name:"AUG",
          totalUsers:users[i].count
        }
      }

      if(users[i]?._id?.month===9){
        monthlyUsers[8] = {
          name:"SEP",
          totalUsers:users[i].count
        }
      }

      if(users[i]?._id?.month===10){
        monthlyUsers[9] = {
          name:"OCT",
          totalUsers:users[i].count
        }
      }

      if(users[i]?._id?.month===11){
        monthlyUsers[10] = {
          name:"NOV",
          totalUsers:users[i].count
        }
      }

      if(users[i]?._id?.month===12){
        monthlyUsers[11] = {
          name:"DEC",
          totalUsers:users[i].count
        }
      }
    }

    return response.status(200).json({
      error:false,
      success:true,
      totalUsers: monthlyUsers
    })
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    });
  }
}
