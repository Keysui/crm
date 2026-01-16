import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const eventType = body.type || body.event
    
    if (eventType !== "call.ended" && !body.call?.endedAt) {
      return NextResponse.json(
        { message: "Event type not handled" },
        { status: 200 }
      )
    }

    const callData = body.call || body
    const phoneNumber = callData.customer?.phoneNumber || 
                       callData.from || 
                       callData.phoneNumber ||
                       callData.customer?.number
    
    const recordingUrl = callData.recordingUrl || 
                        callData.recording?.url ||
                        callData.recording
    
    const summary = callData.summary || 
                   callData.transcript?.summary ||
                   callData.analysis?.summary ||
                   ""
    
    const aiSummary = callData.transcript?.full || 
                     callData.fullSummary ||
                     summary
    
    const sentiment = callData.analysis?.sentiment || 
                     callData.sentiment ||
                     callData.transcript?.sentiment ||
                     "neutral"
    
    const duration = callData.duration || 
                    callData.callDuration ||
                    (callData.endedAt && callData.startedAt 
                      ? Math.floor((new Date(callData.endedAt).getTime() - new Date(callData.startedAt).getTime()) / 1000)
                      : null)

    if (!phoneNumber) {
      console.error("Missing phone number in Vapi webhook")
      return NextResponse.json(
        { error: "Missing required field: phoneNumber" },
        { status: 400 }
      )
    }

    const { data: callLog, error: callLogError } = await db
      .from("call_logs")
      .insert({
        phone: phoneNumber,
        recording_url: recordingUrl || null,
        duration: duration || null,
        sentiment: sentiment || null,
        summary: summary || null,
      })
      .select()
      .single()

    if (callLogError) {
      console.error("Error creating call log:", callLogError)
      throw callLogError
    }

    console.log("CallLog created:", callLog.id)

    const isLead = summary && (
      summary.toLowerCase().includes("interested") ||
      summary.toLowerCase().includes("book") ||
      summary.toLowerCase().includes("demo") ||
      summary.toLowerCase().includes("appointment") ||
      summary.toLowerCase().includes("schedule") ||
      summary.toLowerCase().includes("pricing") ||
      summary.toLowerCase().includes("quote") ||
      summary.toLowerCase().includes("want") ||
      summary.toLowerCase().includes("need")
    )

    if (isLead && summary) {
      const nameMatch = summary.match(/(?:name is|I'm|I am|this is|call me)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i)
      const name = nameMatch ? nameMatch[1] : `Lead ${phoneNumber.slice(-4)}`

      const { data: existingLeads } = await db
        .from("leads")
        .select("*")
        .eq("phone", phoneNumber)
        .limit(1)
      
      const existingLead = existingLeads && existingLeads.length > 0 ? existingLeads[0] : null

      if (existingLead) {
        await db
          .from("leads")
          .update({
            ai_summary: aiSummary || summary,
            sentiment: sentiment || existingLead.sentiment,
            status: existingLead.status === "new" ? "contacted" : existingLead.status,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingLead.id)
        console.log("Lead updated:", existingLead.id)
      } else {
        const { data: newLead } = await db
          .from("leads")
          .insert({
            name: name,
            phone: phoneNumber,
            status: "new",
            summary: summary.substring(0, 200),
            ai_summary: aiSummary || summary,
            source: "Voice",
            sentiment: sentiment || "😐",
          })
          .select()
          .single()
        console.log("Lead created:", newLead?.id)
      }
    }

    return NextResponse.json({ 
      success: true,
      callLogId: callLog.id 
    })
  } catch (error: any) {
    console.error("Vapi webhook error:", error)
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? error.message : undefined
      },
      { status: 500 }
    )
  }
}
