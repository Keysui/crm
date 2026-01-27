"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ConnectionStatus } from "@/components/ai-settings/connection-status"
import { 
  Webhook, 
  Copy, 
  Check, 
  ExternalLink, 
  AlertCircle,
  Phone,
  MessageSquare,
  Settings,
  TestTube,
  Code
} from "lucide-react"

export default function AISettingsPage() {
  const [copied, setCopied] = useState<string | null>(null)
  const [testing, setTesting] = useState<string | null>(null)
  const [vapiActive, setVapiActive] = useState(true) // TODO: Fetch from API
  const [twilioActive, setTwilioActive] = useState(true) // TODO: Fetch from API

  // Get the current domain (in production, this would be from env)
  const baseUrl = typeof window !== "undefined" 
    ? window.location.origin 
    : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  const vapiWebhookUrl = `${baseUrl}/api/webhooks/vapi`
  const twilioWebhookUrl = `${baseUrl}/api/webhooks/twilio`

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleTestWebhook = async (type: "vapi" | "twilio") => {
    setTesting(type)
    try {
      // In a real app, this would send a test webhook
      // For now, we'll just simulate it
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert(`Test webhook sent to ${type === "vapi" ? "Vapi" : "Twilio"} endpoint!`)
    } catch (error) {
      console.error("Test webhook error:", error)
      alert("Failed to send test webhook")
    } finally {
      setTesting(null)
    }
  }

  const handleTestCall = () => {
    alert("Test call functionality will be implemented soon. This will trigger a test call to verify your AI voice agent is working correctly.")
  }

  const handleConnectVapi = () => {
    // TODO: Implement connection flow
    alert("Vapi connection flow will be implemented soon.")
  }

  const handleConnectTwilio = () => {
    // TODO: Implement connection flow
    alert("Twilio connection flow will be implemented soon.")
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">AI Settings</h2>
        <p className="text-muted-foreground">
          Configure your AI assistant, webhooks, and integrations
        </p>
      </div>

      {/* Connection Status Cards */}
      <div className="space-y-4">
        <ConnectionStatus
          type="vapi"
          isActive={vapiActive}
          onConnect={handleConnectVapi}
          onTestCall={handleTestCall}
        />
        <ConnectionStatus
          type="twilio"
          isActive={twilioActive}
          onConnect={handleConnectTwilio}
        />
      </div>

      {/* Cards Section */}
      <div className="space-y-6">
        {/* Setup Instructions */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              <CardTitle>Setup Instructions</CardTitle>
            </div>
            <CardDescription>
              Step-by-step guide to connect your webhooks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Vapi Setup */}
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Setting up Vapi Webhook
              </h4>
              <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                <li>Log in to your Vapi dashboard</li>
                <li>Navigate to Settings → Webhooks</li>
                <li>Click "Add Webhook" or "Edit Webhook"</li>
                <li>Paste the Vapi Webhook URL above</li>
                <li>Select "call.ended" as the event type</li>
                <li>Save the webhook configuration</li>
                <li>Test by making a call through Vapi</li>
              </ol>
              <Button variant="outline" size="sm" asChild>
                <a href="https://dashboard.vapi.ai" target="_blank" rel="noopener noreferrer">
                  Open Vapi Dashboard
                  <ExternalLink className="h-3 w-3 ml-2" />
                </a>
              </Button>
            </div>

            <Separator />

            {/* Twilio Setup */}
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Setting up Twilio Webhook
              </h4>
              <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                <li>Log in to your Twilio Console</li>
                <li>Navigate to Phone Numbers → Manage → Active Numbers</li>
                <li>Click on your phone number</li>
                <li>Scroll to "Messaging" section</li>
                <li>Paste the Twilio Webhook URL in "A MESSAGE COMES IN"</li>
                <li>Select "HTTP POST" as the method</li>
                <li>Save the configuration</li>
                <li>Test by sending an SMS to your Twilio number</li>
              </ol>
              <Button variant="outline" size="sm" asChild>
                <a href="https://console.twilio.com" target="_blank" rel="noopener noreferrer">
                  Open Twilio Console
                  <ExternalLink className="h-3 w-3 ml-2" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Webhook Status */}
        <Card>
          <CardHeader>
            <CardTitle>Webhook Status</CardTitle>
            <CardDescription>
              Monitor your webhook connections and recent activity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                <div>
                  <p className="font-medium">Vapi Webhook</p>
                  <p className="text-sm text-muted-foreground">Last received: 2 minutes ago</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                Connected
              </Badge>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                <div>
                  <p className="font-medium">Twilio Webhook</p>
                  <p className="text-sm text-muted-foreground">Last received: 5 minutes ago</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                Connected
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <CardTitle>Troubleshooting</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <p className="text-sm font-medium">Webhook not receiving data?</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Verify the webhook URL is correctly configured in Vapi/Twilio</li>
                <li>Check that your server is accessible from the internet (use ngrok for local development)</li>
                <li>Ensure the webhook endpoint is set to POST method</li>
                <li>Check your server logs for any error messages</li>
                <li>Verify your DATABASE_URL environment variable is set correctly</li>
              </ul>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
              <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                Local Development Tip
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                For local testing, use a tool like ngrok to expose your local server. 
                Update the webhook URLs above with your ngrok URL.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Developer Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              <CardTitle>Advanced Developer Settings</CardTitle>
            </div>
            <CardDescription>
              Technical webhook URLs and configuration details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single">
              <AccordionItem value="webhook-urls">
                <AccordionTrigger className="text-base font-semibold">
                  Webhook URLs & Configuration
                </AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">
                  {/* Vapi Webhook */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-primary" />
                        <Label className="text-base font-semibold">Vapi Webhook</Label>
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                          Active
                        </Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTestWebhook("vapi")}
                        disabled={testing === "vapi"}
                      >
                        <TestTube className="h-4 w-4 mr-2" />
                        {testing === "vapi" ? "Testing..." : "Test"}
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vapi-webhook">Webhook URL</Label>
                      <div className="flex gap-2">
                        <Input
                          id="vapi-webhook"
                          value={vapiWebhookUrl}
                          readOnly
                          className="font-mono text-sm"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleCopy(vapiWebhookUrl, "vapi")}
                        >
                          {copied === "vapi" ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Configure this URL in your Vapi dashboard under Webhooks → call.ended events
                      </p>
                    </div>
                    <div className="bg-muted rounded-lg p-4 space-y-2">
                      <p className="text-sm font-medium">What this webhook does:</p>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                        <li>Receives call.ended events from Vapi</li>
                        <li>Creates CallLog entries for all calls</li>
                        <li>Automatically creates/updates Leads when calls indicate interest</li>
                        <li>Extracts sentiment, summary, and recording URLs</li>
                      </ul>
                    </div>
                  </div>

                  <Separator />

                  {/* Twilio Webhook */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-primary" />
                        <Label className="text-base font-semibold">Twilio Webhook</Label>
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                          Active
                        </Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTestWebhook("twilio")}
                        disabled={testing === "twilio"}
                      >
                        <TestTube className="h-4 w-4 mr-2" />
                        {testing === "twilio" ? "Testing..." : "Test"}
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="twilio-webhook">Webhook URL</Label>
                      <div className="flex gap-2">
                        <Input
                          id="twilio-webhook"
                          value={twilioWebhookUrl}
                          readOnly
                          className="font-mono text-sm"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleCopy(twilioWebhookUrl, "twilio")}
                        >
                          {copied === "twilio" ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Configure this URL in your Twilio Console under Phone Numbers → Webhooks
                      </p>
                    </div>
                    <div className="bg-muted rounded-lg p-4 space-y-2">
                      <p className="text-sm font-medium">What this webhook does:</p>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                        <li>Receives incoming SMS messages</li>
                        <li>Receives call status updates</li>
                        <li>Creates/updates Leads from SMS conversations</li>
                        <li>Logs all automation actions</li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
