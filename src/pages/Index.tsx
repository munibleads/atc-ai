
import React, { useState, useEffect } from 'react';
import { Plane, Mic, Volume2, CheckCircle, AlertTriangle, ArrowUp, RotateCw, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  const [currentInstruction, setCurrentInstruction] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [approvedSuggestions, setApprovedSuggestions] = useState([]);
  const [demoStep, setDemoStep] = useState(0);

  const demoInstructions = [
    {
      audio: "United 245, climb and maintain flight level 350, turn left heading 270",
      suggestions: [
        { id: 1, type: 'altitude', action: 'Climb to FL350', details: 'Current: FL250 → Target: FL350', icon: ArrowUp, priority: 'high' },
        { id: 2, type: 'heading', action: 'Turn left to 270°', details: 'Current: 310° → Target: 270°', icon: RotateCw, priority: 'high' }
      ]
    },
    {
      audio: "United 245, contact departure on 124.35, good day",
      suggestions: [
        { id: 3, type: 'frequency', action: 'Contact Departure', details: 'Switch to 124.35 MHz', icon: Volume2, priority: 'medium' }
      ]
    },
    {
      audio: "United 245, cleared direct BORDR intersection, reduce speed to 250 knots",
      suggestions: [
        { id: 4, type: 'navigation', action: 'Direct to BORDR', details: 'Proceed direct to BORDR intersection', icon: MapPin, priority: 'high' },
        { id: 5, type: 'speed', action: 'Reduce to 250 kts', details: 'Current: 290 kts → Target: 250 kts', icon: ArrowUp, priority: 'medium' }
      ]
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (demoStep < demoInstructions.length) {
        setIsListening(true);
        setCurrentInstruction('');
        
        setTimeout(() => {
          const instruction = demoInstructions[demoStep];
          setCurrentInstruction(instruction.audio);
          setIsListening(false);
          
          setTimeout(() => {
            setSuggestions(instruction.suggestions);
          }, 1000);
        }, 2000);
        
        setDemoStep(prev => prev + 1);
      } else {
        setDemoStep(0);
        setSuggestions([]);
        setApprovedSuggestions([]);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [demoStep]);

  const handleApproveSuggestion = (suggestion) => {
    setApprovedSuggestions(prev => [...prev, suggestion]);
    setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
  };

  const handleRejectSuggestion = (suggestionId) => {
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-md shadow-soft">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-primary rounded-xl shadow-medium">
                <Plane className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">AI Co-pilot for ATC</h1>
                <p className="text-muted-foreground">Flight Clarity Assistant</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="border-primary text-primary bg-primary/5">
                Flight UA245
              </Badge>
              <Badge variant="outline" className="border-primary text-primary bg-primary/5">
                System Active
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* ATC Audio Processing */}
          <Card className="shadow-medium border-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-foreground">
                <Mic className={`h-5 w-5 ${isListening ? 'text-destructive animate-pulse' : 'text-primary'}`} />
                <span>ATC Communication</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg border border-border">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-muted-foreground">Live Audio Feed</span>
                  <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-destructive animate-pulse' : 'bg-primary'}`}></div>
                </div>
                <div className="text-lg font-mono">
                  {isListening ? (
                    <div className="flex items-center space-x-2">
                      <Volume2 className="h-4 w-4 text-destructive animate-pulse" />
                      <span className="text-destructive font-medium">Listening...</span>
                    </div>
                  ) : currentInstruction ? (
                    <div className="text-primary font-medium">
                      "{currentInstruction}"
                    </div>
                  ) : (
                    <div className="text-muted-foreground">Awaiting ATC instruction...</div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground">Recent Instructions</h4>
                <div className="space-y-2 text-xs text-muted-foreground max-h-24 overflow-y-auto">
                  <div className="p-2 bg-muted/30 rounded border-l-2 border-primary/20">"United 245, taxi to runway 24L via Alpha, Bravo"</div>
                  <div className="p-2 bg-muted/30 rounded border-l-2 border-primary/20">"United 245, cleared for takeoff runway 24L"</div>
                  <div className="p-2 bg-muted/30 rounded border-l-2 border-primary/20">"United 245, contact departure on 121.9"</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Suggestions */}
          <Card className="shadow-medium border-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-foreground">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <span>AI Suggestions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {suggestions.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center shadow-soft">
                      <AlertTriangle className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="font-medium">No pending suggestions</p>
                  </div>
                ) : (
                  suggestions.map((suggestion) => (
                    <div key={suggestion.id} className="p-4 bg-card rounded-lg border border-destructive/20 shadow-soft">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-destructive/10 rounded-lg">
                            <suggestion.icon className="h-4 w-4 text-destructive" />
                          </div>
                          <span className="font-semibold text-foreground">{suggestion.action}</span>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            suggestion.priority === 'high' 
                              ? 'border-destructive text-destructive bg-destructive/5' 
                              : 'border-primary text-primary bg-primary/5'
                          }`}
                        >
                          {suggestion.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{suggestion.details}</p>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleApproveSuggestion(suggestion)}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft"
                        >
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleRejectSuggestion(suggestion.id)}
                        >
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Flight Status & Approved Actions */}
          <Card className="shadow-medium border-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-foreground">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>Flight Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-muted/50 rounded-lg border border-border">
                  <div className="text-muted-foreground font-medium">Altitude</div>
                  <div className="font-bold text-lg text-primary">FL250</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg border border-border">
                  <div className="text-muted-foreground font-medium">Speed</div>
                  <div className="font-bold text-lg text-primary">290 kts</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg border border-border">
                  <div className="text-muted-foreground font-medium">Heading</div>
                  <div className="font-bold text-lg text-primary">310°</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg border border-border">
                  <div className="text-muted-foreground font-medium">Frequency</div>
                  <div className="font-bold text-lg text-primary">121.9</div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground">Approved Actions</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {approvedSuggestions.length === 0 ? (
                    <div className="text-xs text-muted-foreground text-center py-4 bg-muted/30 rounded-lg">
                      No approved actions yet
                    </div>
                  ) : (
                    approvedSuggestions.map((action) => (
                      <div key={action.id} className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg text-sm border border-primary/20">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-foreground font-medium">{action.action}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Demo Info */}
        <Card className="mt-8 bg-primary/5 border-primary/20 shadow-large">
          <CardContent className="pt-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-3">Live Demo: AI Co-pilot in Action</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Watch as our AI system processes real ATC instructions and provides intelligent flight plan suggestions to enhance pilot awareness and reduce miscommunication.
              </p>
              <div className="flex justify-center space-x-8 text-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-destructive rounded-full animate-pulse"></div>
                  <span className="font-medium text-foreground">AI Processing</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-primary rounded-full"></div>
                  <span className="font-medium text-foreground">Pilot Approved</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-destructive rounded-full animate-pulse"></div>
                  <span className="font-medium text-foreground">Live Audio</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
