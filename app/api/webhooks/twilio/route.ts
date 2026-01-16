import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const body = Object.fromEntries(formData)
    
    if (body.MessageSid) {
      const fromNumber = body.From as string
      const messageBody = body.Body as string
      const messageSid = body.MessageSid as string
      const toNumber = body.To as string

      if (!fromNumber || !messageBody) {
        console.error("Missing required fields in Twilio SMS webhook")
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        )
      }

      const { data: existingLeads } = await db
        .from("leads")
        .select("*")
        .eq("phone", fromNumber)
        .limit(1)
      
      const existingLead = existingLeads && existingLeads.length > 0 ? existingLeads[0] : null

      let lead
      if (!existingLead) {
        const name = `SMS Lead ${fromNumber.slice(-4)}`
        const { data: newLead } = await db
          .from("leads")
          .insert({
            name: name,
            phone: fromNumber,
            status: "new",
            summary: messageBody.substring(0, 200),
            source: "SMS",
            sentiment: "😐",
          })
          .select()
          .single()
        lead = newLead
        console.log("New lead created from SMS:", lead?.id)
      } else {
        if (messageBody.length < 200) {
          await db
            .from("leads")
            .update({
              summary: messageBody,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existingLead.id)
        }
        lead = existingLead
      }

      await db
        .from("automation_logs")
        .insert({
          action_type: "sms",
          status: "completed",
          details: JSON.stringify({
            messageSid: messageSid,
            from: fromNumber,
            to: toNumber,
            body: messageBody,
            leadId: lead?.id,
            direction: "inbound",
          }),
        })

      console.log("SMS logged for lead:", lead?.id)

      return new NextResponse(
        `<?xml version="1.0" encoding="UTF-8"?><Response></Response>`,
        {
          status: 200,
          headers: { "Content-Type": "text/xml" },
        }
      )
    }

    if (body.CallSid && body.CallStatus) {
      const callSid = body.CallSid as string
      const callStatus = body.CallStatus as string
      const fromNumber = body.From as string

      await db
        .from("automation_logs")
        .insert({
          action_type: "call",
          status: callStatus === "completed" ? "completed" : "pending",
          details: JSON.stringify({
            callSid: callSid,
            from: fromNumber,
            status: callStatus,
          }),
        })

      console.log("Call status logged:", callSid, callStatus)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Twilio webhook error:", error)
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? error.message : undefined
      },
      { status: 500 }
    )
  }
}
