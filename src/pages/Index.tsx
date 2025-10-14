import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Heart,
  Shield,
  Smartphone,
  Activity,
  Users,
  CheckCircle,
  ArrowRight,
  Zap,
  Home,
  Brain,
  MapPin
} from "lucide-react"
import { Link } from "react-router-dom"
import dashboardHero from "@/assets/dashboard-hero.jpg"
import elderlyHome from "@/assets/elderly-home.jpg"

const Index = () => {
  const features = [
    {
      icon: Heart,
      title: "Vital Signs Monitoring",
      description: "Real-time tracking of heart rate, blood pressure, and temperature"
    },
    {
      icon: Home,
      title: "Environmental Sensors",
      description: "Monitor home environment for safety and comfort"
    },
    {
      icon: Brain,
      title: "AI-Powered Analytics",
      description: "Predictive insights and personalized health recommendations"
    },
    {
      icon: MapPin,
      title: "Geofencing & GPS Tracking",
      description: "Apple Watch location monitoring with boundary alerts and SOS notifications",
      link: "/geofencing"
    },
    {
      icon: Smartphone,
      title: "Mobile & Desktop Access",
      description: "Access your health data anywhere, anytime"
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      description: "HIPAA compliant with end-to-end encryption"
    },
    {
      icon: Users,
      title: "Family Connectivity",
      description: "Keep loved ones informed with real-time updates"
    }
  ]

  const plans = [
    {
      name: "Basic",
      price: "$10",
      description: "Essential monitoring and alerts",
      features: ["Basic health monitoring", "Emergency alerts", "Mobile app access", "Family notifications"]
    },
    {
      name: "Premium",
      price: "$20",
      description: "Advanced analytics and sensors",
      features: ["Everything in Basic", "AI health insights", "Advanced sensors", "Medication management", "Trend analysis"],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For facilities and care providers",
      features: ["Everything in Premium", "Multi-patient dashboard", "Custom integrations", "Dedicated support", "Compliance reporting"]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-dashboard">
      {/* Header */}
      <header className="border-b bg-card/95 backdrop-blur">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-primary">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary">SymbIOT</h1>
                <p className="text-xs text-muted-foreground">Peace of Mind</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-primary hover:bg-gradient-to-r hover:from-primary hover:to-primary-glow">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                  <Zap className="w-3 h-3 mr-1" />
                  Powered by AI
                </Badge>
                <h1 className="text-5xl font-bold leading-tight">
                  Peace of Mind for 
                  <span className="text-primary block">Independent Living</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Advanced IoT sensors and AI analytics provide 24/7 health monitoring for vulnerable individuals, 
                  ensuring safety while maintaining independence.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/login">
                  <Button size="lg" className="bg-gradient-primary hover:bg-gradient-to-r hover:from-primary hover:to-primary-glow">
                    View Live Demo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="lg" variant="outline">
                    Create Account
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="text-sm text-muted-foreground">FDA Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="text-sm text-muted-foreground">HIPAA Secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="text-sm text-muted-foreground">24/7 Monitoring</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-glow">
                <img 
                  src={elderlyHome} 
                  alt="Peaceful home with health monitoring" 
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <Badge className="bg-white/90 text-primary">
                    <Activity className="w-3 h-3 mr-1" />
                    All Systems Active
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Comprehensive Health Monitoring</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our advanced IoT platform combines sensors, AI, and mobile technology to provide complete peace of mind
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              feature.link ? (
                <Link key={index} to={feature.link}>
                  <Card className="shadow-card hover:shadow-glow transition-all duration-300 cursor-pointer h-full">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4`}>
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ) : (
                <Card key={index} className="shadow-card hover:shadow-glow transition-all duration-300">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4`}>
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              )
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Real-Time Health Dashboard</h2>
            <p className="text-xl text-muted-foreground">
              Monitor health metrics, receive alerts, and track trends in real-time
            </p>
          </div>
          
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-glow border">
              <img 
                src={dashboardHero} 
                alt="SymbIOT Health Dashboard" 
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Link to="/login">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Explore Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground">
              Choose the plan that's right for you and your family
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={cn(
                "relative shadow-card hover:shadow-glow transition-all duration-300",
                plan.popular && "ring-2 ring-primary scale-105"
              )}>
                {plan.popular && (
                  <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold text-primary">
                    {plan.price}
                    {plan.price !== "Custom" && <span className="text-sm text-muted-foreground">/month</span>}
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={cn(
                      "w-full mt-6",
                      plan.popular 
                        ? "bg-gradient-primary hover:bg-gradient-to-r hover:from-primary hover:to-primary-glow" 
                        : "bg-secondary hover:bg-secondary/80"
                    )}
                  >
                    {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/95 backdrop-blur py-12">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-primary">
                <Heart className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-primary">SymbIOT</span>
            </div>
            <p className="text-muted-foreground">
              Providing peace of mind through intelligent health monitoring
            </p>
            <div className="flex justify-center gap-6 mt-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary">Privacy Policy</a>
              <a href="#" className="hover:text-primary">Terms of Service</a>
              <a href="#" className="hover:text-primary">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
