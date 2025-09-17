import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Volume2,
  VolumeX,
  Settings,
  Users,
  Heart,
  Activity,
  MessageSquare,
  Camera,
  Monitor,
  Maximize2,
  Minimize2
} from "lucide-react"

interface VideoCallModalProps {
  isOpen: boolean
  onClose: () => void
  patient: {
    id: string
    name: string
    avatar: string
    age: number
    location: string
    status: 'excellent' | 'good' | 'warning' | 'critical'
  }
}

export function VideoCallModal({ isOpen, onClose, patient }: VideoCallModalProps) {
  const [isConnecting, setIsConnecting] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isMicEnabled, setIsMicEnabled] = useState(true)
  const [isSpeakerEnabled, setIsSpeakerEnabled] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [connectionQuality, setConnectionQuality] = useState('excellent')
  const [participantCount, setParticipantCount] = useState(2)

  // Simulate connection process
  useEffect(() => {
    if (isOpen) {
      setIsConnecting(true)
      setIsConnected(false)
      setCallDuration(0)

      const connectTimer = setTimeout(() => {
        setIsConnecting(false)
        setIsConnected(true)
      }, 3000)

      return () => clearTimeout(connectTimer)
    }
  }, [isOpen])

  // Call duration timer
  useEffect(() => {
    if (isConnected) {
      const timer = setInterval(() => {
        setCallDuration(prev => prev + 1)
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [isConnected])

  // Simulate connection quality changes
  useEffect(() => {
    if (isConnected) {
      const qualityTimer = setInterval(() => {
        const qualities = ['excellent', 'good', 'fair', 'poor']
        setConnectionQuality(qualities[Math.floor(Math.random() * qualities.length)])
      }, 8000)

      return () => clearInterval(qualityTimer)
    }
  }, [isConnected])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getConnectionQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'text-health-good'
      case 'good': return 'text-primary'
      case 'fair': return 'text-warning'
      case 'poor': return 'text-health-critical'
      default: return 'text-muted-foreground'
    }
  }

  const endCall = () => {
    setIsConnected(false)
    setIsConnecting(false)
    onClose()
  }

  // Dummy health data during call
  const liveHealthData = {
    heartRate: 72 + Math.floor(Math.random() * 10),
    bloodPressure: `${118 + Math.floor(Math.random() * 8)}/${76 + Math.floor(Math.random() * 6)}`,
    stress: 15 + Math.floor(Math.random() * 20),
    mood: ['Happy', 'Calm', 'Relaxed', 'Content'][Math.floor(Math.random() * 4)]
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-4xl h-[80vh] p-0 ${isFullscreen ? 'max-w-full h-full' : ''}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="p-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`/placeholder-${patient.id}.jpg`} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {patient.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <DialogTitle className="flex items-center gap-2">
                    Video Call with {patient.name}
                    {isConnected && (
                      <Badge variant="outline" className="bg-health-good/10 text-health-good">
                        Connected
                      </Badge>
                    )}
                  </DialogTitle>
                  <DialogDescription className="flex items-center gap-4">
                    <span>Age {patient.age} • {patient.location}</span>
                    {isConnected && (
                      <>
                        <span>•</span>
                        <span>Duration: {formatDuration(callDuration)}</span>
                        <span>•</span>
                        <span className={getConnectionQualityColor(connectionQuality)}>
                          Quality: {connectionQuality}
                        </span>
                      </>
                    )}
                  </DialogDescription>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  <Users className="h-3 w-3 mr-1" />
                  {participantCount} participants
                </Badge>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                >
                  {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </DialogHeader>

          {/* Video Area */}
          <div className="flex-1 relative bg-black">
            {isConnecting ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                  <p className="text-lg font-semibold">Connecting to {patient.name}...</p>
                  <p className="text-sm opacity-75">Establishing secure connection</p>
                  <div className="mt-4 w-64 mx-auto">
                    <Progress value={66} className="h-2" />
                  </div>
                </div>
              </div>
            ) : isConnected ? (
              <div className="absolute inset-0">
                {/* Main video (patient) */}
                <div className="w-full h-full bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center relative">
                  {isVideoEnabled ? (
                    <div className="relative w-full h-full">
                      {/* Simulated video feed */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-800 to-blue-600 opacity-50"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Avatar className="h-32 w-32">
                          <AvatarImage src={`/placeholder-${patient.id}.jpg`} />
                          <AvatarFallback className="bg-primary text-primary-foreground text-4xl">
                            {patient.avatar}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      {/* Patient info overlay */}
                      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white">
                        <p className="font-semibold">{patient.name}</p>
                        <p className="text-sm opacity-75">{patient.location}</p>
                      </div>

                      {/* Live health data overlay */}
                      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white">
                        <div className="text-xs space-y-1">
                          <div className="flex items-center gap-2">
                            <Heart className="h-3 w-3 text-health-good" />
                            <span>{liveHealthData.heartRate} BPM</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Activity className="h-3 w-3 text-primary" />
                            <span>{liveHealthData.bloodPressure}</span>
                          </div>
                          <div className="text-xs opacity-75">
                            Stress: {liveHealthData.stress}% • {liveHealthData.mood}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-white">
                      <VideoOff className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">Video disabled</p>
                      <p className="text-sm opacity-75">{patient.name} has turned off their camera</p>
                    </div>
                  )}
                </div>

                {/* Picture-in-picture (your video) */}
                <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-lg border-2 border-white/20 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Camera className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-xs">Dr. Sarah Mitchell</p>
                      <p className="text-xs opacity-75">You</p>
                    </div>
                  </div>
                </div>

                {/* Connection quality indicator */}
                <div className="absolute top-4 left-4">
                  <Badge variant="outline" className={`${getConnectionQualityColor(connectionQuality)} bg-black/50 backdrop-blur-sm border-white/20`}>
                    <Monitor className="h-3 w-3 mr-1" />
                    {connectionQuality}
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <PhoneOff className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Call ended</p>
                  <p className="text-sm opacity-75">Duration: {formatDuration(callDuration)}</p>
                </div>
              </div>
            )}
          </div>

          {/* Control Bar */}
          <div className="p-4 border-t bg-muted/20">
            <div className="flex items-center justify-between">
              {/* Left controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant={isMicEnabled ? "default" : "destructive"}
                  size="icon"
                  onClick={() => setIsMicEnabled(!isMicEnabled)}
                  disabled={!isConnected}
                >
                  {isMicEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                </Button>

                <Button
                  variant={isVideoEnabled ? "default" : "destructive"}
                  size="icon"
                  onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                  disabled={!isConnected}
                >
                  {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                </Button>

                <Button
                  variant={isSpeakerEnabled ? "default" : "outline"}
                  size="icon"
                  onClick={() => setIsSpeakerEnabled(!isSpeakerEnabled)}
                  disabled={!isConnected}
                >
                  {isSpeakerEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </Button>
              </div>

              {/* Center controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!isConnected}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={!isConnected}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Add Family
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={!isConnected}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>

              {/* Right controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="destructive"
                  onClick={endCall}
                >
                  <PhoneOff className="h-4 w-4 mr-2" />
                  End Call
                </Button>
              </div>
            </div>

            {/* Additional info bar for connected calls */}
            {isConnected && (
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span>Encrypted end-to-end</span>
                  <span>•</span>
                  <span>HIPAA compliant</span>
                  <span>•</span>
                  <span>Recording: OFF</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Health data streaming</span>
                  <div className="w-2 h-2 rounded-full bg-health-good animate-pulse"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}