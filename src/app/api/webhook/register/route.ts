import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";

export async function POST(req: Request){
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET_KEY

    if(!WEBHOOK_SECRET){
        return new Error('Webhook secret not found')
    }

    const headerPayload = headers();
    const svix_id = (await headerPayload).get('svix_id');
    const svix_timestamp = (await headerPayload).get('svix_timestamp'); 
    const svix_signature = (await headerPayload).get('svix_signature');

    if(!svix_id || !svix_timestamp || !svix_signature){
        return new Error('Invalid request headers at svix')
    }

    const payload = await req.json()
    const body = JSON.stringify(payload);

    const headers: any = {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
    };

    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;
    try {
        evt = wh.verify(body,headers) as WebhookEvent;
    } catch (error){
        console.log("Error verifiying webhook", error)
        return new Response('Error parsing webhook event', {status : 400})
    }
    

}