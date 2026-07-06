import express, { Application, NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import config from "./config";
import { prisma } from "./lib/prisma";
import { userRoute } from "./modules/user/user.route";
import { authRoute } from "./modules/auth/auth.route";
import { postRoute } from "./modules/post/post.route";
import { commentRoute } from "./modules/comment/comment.route";
import { notFound } from "./middleware/notFoundPage";
import httpStatus from "http-status";

import { subscriptionRoutes } from "./modules/subscription/subscription.route";
import { globalErrorHandler } from "./middleware/globalErrorHandaler";
import { premiumRoutes } from "./modules/premium/premium.route";


const app: Application = express();

app.use(cors({
    origin: config.appUrl,
    credentials: true,
}))

const endpointSecret = config.stripe_webhook_secret;

// app.post("/api/subscription/webhook", express.raw({ type: 'application/json' }), (request, response) => {
//     let event = request.body;
//     console.log(event, "stripe request body");
//     console.log(request.headers, "stripe req headers");
//     // Only verify the event if you have an endpoint secret defined.
//     // Otherwise use the basic event deserialized with JSON.parse
//     if (endpointSecret) {
//         // Get the signature sent by Stripe
//         const signature = request.headers['stripe-signature']!;
//         try {
//             //converting event buffer to a valid object
//             event = stripe.webhooks.constructEvent(
//                 request.body,
//                 signature,
//                 endpointSecret
//             );
//         } catch (err : any) {
//             console.log(`⚠️  Webhook signature verification failed.`, err.message);
//             return response.status(400).json({
//                 message : err.message
//             });
//         }
//     }

//     console.log(event, "event after try block");

//     // Handle the event
//     switch (event.type) {
//         case 'payment_intent.succeeded':
//             const paymentIntent = event.data.object;
//             console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
//             // Then define and call a method to handle the successful payment intent.
//             // handlePaymentIntentSucceeded(paymentIntent);
//             break;
//         case 'payment_method.attached':
//             const paymentMethod = event.data.object;
//             // Then define and call a method to handle the successful attachment of a PaymentMethod.
//             // handlePaymentMethodAttached(paymentMethod);
//             break;
//         default:
//             // Unexpected event type
//             console.log(`Unhandled event type ${event.type}.`);
//     }

//     // Return a 200 response to acknowledge receipt of the event
//     response.send();
// })

app.use("/api/subscription/webhook", express.raw({ type: 'application/json' }))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.get("/", async (req, res) => {
    const user =  await prisma.user.findMany();
    console.log(user)
    res.send("Hello, World!");
});

app.use("/api/users/", userRoute);
app.use("/api/auth/", authRoute);
app.use("/api/posts/", postRoute);
app.use("/api/comments/", commentRoute);
app.use("/api/subscription", subscriptionRoutes)
app.use("/api/premium", premiumRoutes)

app.use(notFound);


app.use(globalErrorHandler)


export default app;