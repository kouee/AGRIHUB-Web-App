
import React from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronRight, TestTube2, Thermometer, Droplets, Lightbulb, CheckCircle, BarChart3, Database, Bell, Cpu, Cable, Leaf, Bot, Target, FileLock, Rocket, Presentation, Users, Mail, Phone, MapPin, Twitter, Linkedin, Github } from 'lucide-react';
import Header from '@/components/layout/header';
import Dashboard from '@/components/dashboard';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import ContactForm from '@/components/contact-form';
import { Badge } from '@/components/ui/badge';
import AnimatedSection from '@/components/animated-section';

const hardwareComponents = [
  {
    name: "ESP32",
    purpose: "The brain of the system, processing sensor data and controlling actuators.",
    spec: "Wi-Fi & Bluetooth enabled dual-core microcontroller."
  },
  {
    name: "pH Sensor",
    purpose: "Measures the acidity or alkalinity of the nutrient solution.",
    spec: "Range: 0-14 pH, Accuracy: ±0.1 pH."
  },
  {
    name: "EC Sensor & ADS1115",
    purpose: "Measures electrical conductivity to determine nutrient concentration.",
    spec: "Paired with a 16-bit ADC for high precision."
  },
  {
    name: "Water Level Sensor",
    purpose: "Monitors the water level in the reservoir to prevent pump damage.",
    spec: "Non-contact ultrasonic sensor for durability."
  },
  {
    name: "Temp/Humidity Sensor",
    purpose: "Monitors ambient temperature and humidity for climate control.",
    spec: "DHT22 sensor for reliable readings."
  },
  {
    name: "Light Sensor (BH1750)",
    purpose: "Measures light intensity to ensure optimal photoperiods.",
    spec: "High precision digital ambient light sensor."
  },
  {
    name: "Peristaltic Pumps & Relays",
    purpose: "For accurately dosing pH adjusters and nutrients into the system.",
    spec: "Controlled via a multi-channel relay module."
  },
  {
    name: "Power System",
    purpose: "Provides stable and reliable power to all electronic components.",
    spec: "5V/12V dual output power supply."
  }
];

const features = [
  { icon: <BarChart3 />, title: "Real-time Monitoring", description: "Continuously track vital parameters on an intuitive dashboard." },
  { icon: <Bot />, title: "Auto Nutrient Control", description: "Automatically maintains perfect pH and EC levels for optimal growth." },
  { icon: <TestTube2 />, title: "Easy pH Calibration", description: "Simple, guided process to ensure your sensor readings are always accurate." },
  { icon: <Bell />, title: "Instant Alerts", description: "Receive notifications when parameters go out of the optimal range." },
  { icon: <Database />, title: "Data Logging", description: "All sensor data is stored for historical analysis and trend spotting." },
  { icon: <Presentation />, title: "Advanced Analytics", description: "Visualize data with interactive charts to gain insights into your crop's health." },
];

const teamMembers = [
  { name: "Alex Johnson", role: "Project Lead & Hardware Engineer", image: "team-1" },
  { name: "Samantha Lee", role: "Software & Cloud Developer", image: "team-2" },
  { name: "David Chen", role: "UI/UX Designer & Data Analyst", image: "team-3" },
];


export default function Home() {
  const demoImage1 = PlaceHolderImages.find(p => p.id === 'demo-1');
  const demoImage2 = PlaceHolderImages.find(p => p.id === 'demo-2');
  const demoImage3 = PlaceHolderImages.find(p => p.id === 'demo-3');

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1">
        <AnimatedSection id="hero" className="relative w-full h-[70vh] flex items-center justify-center text-center">
          <Image
            alt="Hydroponics setup wallpaper"
            src="/wallpaper.jpg"
            fill
            style={{ objectFit: 'cover' }}
            className="z-0"
            priority
          />
          <div className="absolute inset-0 bg-black/60 z-10" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background to-transparent z-10" />
          <div className="container px-4 md:px-6 relative z-20">
            <div className="flex flex-col justify-center items-center space-y-4">
              <div className="space-y-4">
                <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-balance text-white">
                  Hydroponic Monitoring & Automation System
                </h1>
                <p className="max-w-[600px] mx-auto text-gray-200 md:text-xl text-balance">
                  Revolutionize your hydroponic farm with AGRIHUB. Our automated system ensures optimal plant growth by precisely monitoring and adjusting key environmental factors in real-time.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg" className="font-semibold">
                  <a href="#overview">View System Overview</a>
                </Button>
                <Button asChild size="lg" variant="secondary" className="font-semibold">
                  <a href="#dashboard">See Dashboard</a>
                </Button>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection id="problem" className="w-full py-12 md:py-24 bg-card">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="secondary">The Challenge</Badge>
                <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">Why Manual Hydroponics Fails</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Manual hydroponics management is prone to human error and inconsistency. Fluctuations in pH and EC levels, missed nutrient cycles, and poor data logging lead to stunted growth, reduced yields, and wasted resources.
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection id="objectives" className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-4">
                  <Badge>Our Solution</Badge>
                  <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">AGRIHUB Objectives</h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    We designed AGRIHUB to solve these problems by creating a smart, automated, and reliable system.
                  </p>
                </div>
                <ul className="grid gap-4">
                  <li className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-full"><Target className="w-6 h-6 text-primary" /></div>
                    <div>
                      <h3 className="text-lg font-bold">Real-Time Monitoring</h3>
                      <p className="text-muted-foreground">Provide continuous, real-time monitoring of critical parameters like pH, EC, temperature, and water levels.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-full"><Bot className="w-6 h-6 text-primary" /></div>
                    <div>
                      <h3 className="text-lg font-bold">Intelligent Automation</h3>
                      <p className="text-muted-foreground">Automate nutrient and pH dosing to maintain stable and optimal growing conditions 24/7.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-full"><FileLock className="w-6 h-6 text-primary" /></div>
                    <div>
                      <h3 className="text-lg font-bold">Secure Data Logging</h3>
                      <p className="text-muted-foreground">Log all sensor data for historical analysis, trend identification, and crop cycle comparison.</p>
                    </div>
                  </li>
                   <li className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-full"><Presentation className="w-6 h-6 text-primary" /></div>
                    <div>
                      <h3 className="text-lg font-bold">Insightful Analytics</h3>
                      <p className="text-muted-foreground">Create an intuitive dashboard for clear data visualization, system alerts, and actionable insights.</p>
                    </div>
                  </li>
                </ul>
              </div>
               <div className="hidden lg:flex items-center justify-center">
                 <Rocket className="w-48 h-48 md:w-72 md:h-72 text-primary/10" strokeWidth={0.5} />
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection id="overview" className="w-full py-12 md:py-24 bg-card">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="secondary">How It Works</Badge>
                <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">System Overview</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  AGRIHUB integrates a network of sensors with a microcontroller. The ESP32 collects data, processes it against user-defined thresholds, and controls pumps to maintain the ideal environment. All data is streamed to a dashboard for remote monitoring.
                </p>
              </div>
              <div className="w-full max-w-4xl pt-8">
                 <div className="flex flex-wrap flex-col md:flex-row items-center justify-center gap-4 md:gap-2">
                    <div className="flex items-center gap-2">
                      <Card className="p-4 w-40 text-center">
                          <Cpu className="mx-auto w-8 h-8 mb-2 text-accent"/>
                          <p className="font-semibold">Sensors</p>
                      </Card>
                      <ArrowRight className="hidden md:block w-8 h-8 text-muted-foreground"/>
                      <div className="md:hidden w-1 h-8 bg-border"></div>
                    </div>
                     <div className="flex items-center gap-2">
                      <Card className="p-4 w-40 text-center">
                          <Cable className="mx-auto w-8 h-8 mb-2 text-accent"/>
                          <p className="font-semibold">ESP32</p>
                      </Card>
                      <ArrowRight className="hidden md:block w-8 h-8 text-muted-foreground"/>
                      <div className="md:hidden w-1 h-8 bg-border"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Card className="p-4 w-40 text-center">
                          <Bot className="mx-auto w-8 h-8 mb-2 text-accent"/>
                          <p className="font-semibold">Control</p>
                      </Card>
                      <ArrowRight className="hidden md:block w-8 h-8 text-muted-foreground"/>
                      <div className="md:hidden w-1 h-8 bg-border"></div>
                    </div>
                     <div className="flex items-center gap-2">
                      <Card className="p-4 w-40 text-center">
                          <Database className="mx-auto w-8 h-8 mb-2 text-accent"/>
                          <p className="font-semibold">Data Logging</p>
                      </Card>
                      <ArrowRight className="hidden md:block w-8 h-8 text-muted-foreground"/>
                      <div className="md:hidden w-1 h-8 bg-border"></div>
                    </div>
                    <Card className="p-4 w-40 text-center">
                        <Presentation className="mx-auto w-8 h-8 mb-2 text-accent"/>
                        <p className="font-semibold">Dashboard</p>
                    </Card>
                 </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection id="hardware" className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge>Components</Badge>
                <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">Hardware & Components</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We use a selection of reliable and accurate components to build the AGRIHUB system.
                </p>
              </div>
              <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-8">
                {hardwareComponents.map((component) => (
                  <Card key={component.name} className="text-left">
                    <CardHeader>
                      <CardTitle>{component.name}</CardTitle>
                      <CardDescription>{component.purpose}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm font-semibold text-primary">{component.spec}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>
        
        <AnimatedSection id="software" className="w-full py-12 md:py-24 bg-card">
          <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
            <div className="space-y-2">
              <Badge variant="secondary">The Code</Badge>
              <h2 className="font-headline text-3xl font-bold tracking-tighter md:text-4xl/tight">Software & Data Flow</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our software is designed for reliability and precision. It handles everything from cleaning up noisy sensor signals to making intelligent decisions about nutrient dosing.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Key Processes:</h3>
                   <ul className="space-y-2 text-muted-foreground">
                      <li className="flex gap-2"><ChevronRight className="text-primary mt-1 w-4 h-4 flex-shrink-0"/><span><strong>Sensor Sampling & Filtering:</strong> We take multiple readings per second and apply moving average filters to eliminate noise and get stable values.</span></li>
                      <li className="flex gap-2"><ChevronRight className="text-primary mt-1 w-4 h-4 flex-shrink-0"/><span><strong>Calibration & Thresholds:</strong> The system supports multi-point calibration for sensors. Users can define precise upper and lower bounds for each parameter.</span></li>
                      <li className="flex gap-2"><ChevronRight className="text-primary mt-1 w-4 h-4 flex-shrink-0"/><span><strong>Control Logic:</strong> A robust state machine determines when to activate pumps, with built-in safeguards to prevent over-dosing.</span></li>
                      <li className="flex gap-2"><ChevronRight className="text-primary mt-1 w-4 h-4 flex-shrink-0"/><span><strong>Data Logging:</strong> Data is logged locally to an SD card as a backup and streamed via MQTT to a cloud database for real-time dashboard updates.</span></li>
                  </ul>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection id="features" className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge>Features</Badge>
                <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">Packed with Powerful Features</h2>
                 <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  AGRIHUB is more than just a monitor; it's a complete automation and analytics platform for your hydroponic farm.
                </p>
              </div>
              <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-5xl md:grid-cols-3 pt-8">
                {features.map((feature) => (
                  <Card key={feature.title} className="text-center p-6">
                    <div className="bg-primary/10 p-4 rounded-full inline-block mb-4">
                      {React.cloneElement(feature.icon, { className: 'w-8 h-8 text-primary' })}
                    </div>
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection id="dashboard" className="w-full py-12 md:py-24 bg-card">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="secondary">Dashboard & Analytics</Badge>
                <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">Your Data, Visualized</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our interactive dashboard gives you a complete overview of your system's health. Filter data, spot trends, and download your logs for further analysis.
                </p>
              </div>
              <div className="w-full max-w-7xl pt-8">
                <Dashboard />
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection id="demo" className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
             <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge>Results</Badge>
                <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">Results & Demo</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  AGRIHUB has been proven to increase yield by up to 25% while reducing nutrient waste by 15% through stable environmental control and precise dosing.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-3 pt-8">
              {demoImage1 && (
                <Card>
                  <CardContent className="p-0">
                    <Image
                      alt={demoImage1.description}
                      className="aspect-video overflow-hidden rounded-t-lg object-cover"
                      height={360}
                      src={demoImage1.imageUrl}
                      width={640}
                      data-ai-hint={demoImage1.imageHint}
                    />
                  </CardContent>
                  <div className="p-4">
                    <h3 className="font-bold text-lg">Live Dashboard</h3>
                    <p className="text-sm text-muted-foreground">Real-time data visualization of all sensors.</p>
                  </div>
                </Card>
              )}
              {demoImage2 && (
                <Card>
                  <CardContent className="p-0">
                    <Image
                      alt={demoImage2.description}
                      className="aspect-video overflow-hidden rounded-t-lg object-cover"
                      height={360}
                      src={demoImage2.imageUrl}
                      width={640}
                      data-ai-hint={demoImage2.imageHint}
                    />
                  </CardContent>
                  <div className="p-4">
                    <h3 className="font-bold text-lg">Sensor Array</h3>
                    <p className="text-sm text-muted-foreground">The compact and durable hardware in action.</p>
                  </div>
                </Card>
              )}
               {demoImage3 && (
                <Card>
                  <CardContent className="p-0">
                    <Image
                      alt={demoImage3.description}
                      className="aspect-video overflow-hidden rounded-t-lg object-cover"
                      height={360}
                      src={demoImage3.imageUrl}
                      width={640}
                      data-ai-hint={demoImage3.imageHint}
                    />
                  </CardContent>
                  <div className="p-4">
                    <h3 className="font-bold text-lg">Healthy Growth</h3>
                    <p className="text-sm text-muted-foreground">Vibrant lettuce enjoying optimal conditions.</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </AnimatedSection>
        
        <AnimatedSection id="future-improvements" className="w-full py-12 md:py-24 bg-card">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2">
              <div className="space-y-4">
                <Badge variant="secondary">What's Next</Badge>
                <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Future Improvements</h2>
                <p className="text-muted-foreground md:text-xl/relaxed">
                  We are constantly innovating. Here's a look at what we're developing next for the AGRIHUB platform.
                </p>
              </div>
              <ul className="grid gap-4">
                  <li className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-full"><CheckCircle className="w-6 h-6 text-primary" /></div>
                    <div>
                      <h3 className="text-lg font-bold">Machine Learning for Predictive Dosing</h3>
                      <p className="text-muted-foreground">Use historical data to predict nutrient uptake and proactively dose the system.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-full"><CheckCircle className="w-6 h-6 text-primary" /></div>
                    <div>
                      <h3 className="text-lg font-bold">Multi-Zone Support</h3>
                      <p className="text-muted-foreground">Control and monitor multiple independent hydroponic systems from a single dashboard.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-full"><CheckCircle className="w-6 h-6 text-primary" /></div>
                    <div>
                      <h3 className="text-lg font-bold">Advanced Environmental Controls</h3>
                      <p className="text-muted-foreground">Integrate control for grow lights, fans, and CO2 emitters for a fully controlled environment.</p>
                    </div>
                  </li>
                   <li className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-full"><CheckCircle className="w-6 h-6 text-primary" /></div>
                    <div>
                      <h3 className="text-lg font-bold">Pest & Disease Detection Module</h3>
                      <p className="text-muted-foreground">Utilize cameras and AI to identify early signs of common pests and diseases.</p>
                    </div>
                  </li>
                </ul>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection id="team" className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge>The Team</Badge>
                <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">Meet the Innovators</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  A passionate team of engineers, developers, and designers dedicated to revolutionizing agriculture.
                </p>
              </div>
              <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-3 pt-8">
                {teamMembers.map((member) => {
                  const image = PlaceHolderImages.find(p => p.id === member.image);
                  return (
                  <Card key={member.name} className="text-center">
                    <CardContent className="pt-6">
                      {image && (
                        <Image
                          alt={`Portrait of ${member.name}`}
                          className="rounded-full mx-auto mb-4"
                          height={120}
                          src={image.imageUrl}
                          style={{
                            aspectRatio: "120/120",
                            objectFit: "cover",
                          }}
                          width={120}
                          data-ai-hint={image.imageHint}
                        />
                      )}
                      <h3 className="text-xl font-bold">{member.name}</h3>
                      <p className="text-muted-foreground">{member.role}</p>
                    </CardContent>
                  </Card>
                )})}
              </div>
            </div>
          </div>
        </AnimatedSection>
        
        <AnimatedSection id="contact" className="w-full py-12 md:py-24 bg-card">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <Badge variant="secondary">Get in Touch</Badge>
              <h2 className="font-headline text-3xl font-bold tracking-tighter md:text-4xl/tight">Contact Us</h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Have questions or want to learn more about AGRIHUB? We'd love to hear from you.
              </p>
            </div>
            <div className="mx-auto w-full max-w-3xl grid lg:grid-cols-2 gap-8 pt-8">
              <div className="space-y-4 text-left">
                  <h3 className="text-xl font-bold">Contact Information</h3>
                  <div className="space-y-2 text-muted-foreground">
                    <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" />123 Green Tech Ave, Silicon Valley, CA 94043</p>
                    <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" />+1 (555) 123-4567</p>
                    <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" />contact@agrihub.tech</p>
                  </div>
                  <div className="flex gap-4 pt-2">
                    <Button variant="ghost" size="icon" asChild><a href="#"><Twitter /></a></Button>
                    <Button variant="ghost" size="icon" asChild><a href="#"><Linkedin /></a></Button>
                    <Button variant="ghost" size="icon" asChild><a href="#"><Github /></a></Button>
                  </div>
              </div>
              <ContactForm />
            </div>
          </div>
        </AnimatedSection>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} AGRIHUB. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <a className="text-xs hover:underline underline-offset-4" href="#hero">Home</a>
          <a className="text-xs hover:underline underline-offset-4" href="#features">Features</a>
          <a className="text-xs hover:underline underline-offset-4" href="#contact">Contact</a>
        </nav>
      </footer>
    </div>
  );
}

    

    

