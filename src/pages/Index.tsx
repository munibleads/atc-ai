
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      {/* Header */}
      <header className="border-b border-blue-400/20 bg-slate-900/50 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Plane className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">AI Co-pilot for ATC</h1>
                <p className="text-blue-300 text-sm">Flight Clarity Assistant</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="border-green-400 text-green-400">
                Flight UA245
              </Badge>
              <Badge variant="outline" className="border-blue-400 text-blue-400">
                System Active
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* ATC Audio Processing */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Mic className={`h-5 w-5 ${isListening ? 'text-red-400 animate-pulse' : 'text-blue-400'}`} />
                <span>ATC Communication</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-300">Live Audio Feed</span>
                  <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-red-400 animate-pulse' : 'bg-green-400'}`}></div>
                </div>
                <div className="text-lg font-mono">
                  {isListening ? (
                    <div className="flex items-center space-x-2">
                      <Volume2 className="h-4 w-4 text-orange-400 animate-pulse" />
                      <span className="text-orange-400">Listening...</span>
                    </div>
                  ) : currentInstruction ? (
                    <div className="text-blue-300">
                      "{currentInstruction}"
                    </div>
                  ) : (
                    <div className="text-slate-400">Awaiting ATC instruction...</div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-slate-300">Recent Instructions</h4>
                <div className="space-y-1 text-xs text-slate-400 max-h-24 overflow-y-auto">
                  <div>"United 245, taxi to runway 24L via Alpha, Bravo"</div>
                  <div>"United 245, cleared for takeoff runway 24L"</div>
                  <div>"United 245, contact departure on 121.9"</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Suggestions */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <AlertTriangle className="h-5 w-5 text-orange-400" />
                <span>AI Suggestions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {suggestions.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-700/50 flex items-center justify-center">
                      <AlertTriangle className="h-6 w-6" />
                    </div>
                    <p>No pending suggestions</p>
                  </div>
                ) : (
                  suggestions.map((suggestion) => (
                    <div key={suggestion.id} className="p-3 bg-slate-700/50 rounded-lg border border-orange-400/30 animate-fade-in">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <suggestion.icon className="h-4 w-4 text-orange-400" />
                          <span className="font-semibold text-orange-400">{suggestion.action}</span>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            suggestion.priority === 'high' 
                              ? 'border-red-400 text-red-400' 
                              : 'border-yellow-400 text-yellow-400'
                          }`}
                        >
                          {suggestion.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-300 mb-3">{suggestion.details}</p>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleApproveSuggestion(suggestion)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleRejectSuggestion(suggestion.id)}
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
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
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>Flight Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-2 bg-slate-700/50 rounded">
                  <div className="text-slate-400">Altitude</div>
                  <div className="font-semibold text-blue-300">FL250</div>
                </div>
                <div className="p-2 bg-slate-700/50 rounded">
                  <div className="text-slate-400">Speed</div>
                  <div className="font-semibold text-blue-300">290 kts</div>
                </div>
                <div className="p-2 bg-slate-700/50 rounded">
                  <div className="text-slate-400">Heading</div>
                  <div className="font-semibold text-blue-300">310°</div>
                </div>
                <div className="p-2 bg-slate-700/50 rounded">
                  <div className="text-slate-400">Frequency</div>
                  <div className="font-semibold text-blue-300">121.9</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-slate-300">Approved Actions</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {approvedSuggestions.length === 0 ? (
                    <div className="text-xs text-slate-400 text-center py-2">
                      No approved actions yet
                    </div>
                  ) : (
                    approvedSuggestions.map((action) => (
                      <div key={action.id} className="flex items-center space-x-2 p-2 bg-green-900/30 rounded text-xs border border-green-400/30">
                        <CheckCircle className="h-3 w-3 text-green-400" />
                        <span className="text-green-300">{action.action}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Demo Info */}
        <Card className="mt-8 bg-blue-900/20 border-blue-400/30">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-blue-300 mb-2">Live Demo: AI Co-pilot in Action</h2>
              <p className="text-blue-200 mb-4">
                Watch as our AI system processes real ATC instructions and provides intelligent flight plan suggestions to enhance pilot awareness and reduce miscommunication.
              </p>
              <div className="flex justify-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                  <span>AI Processing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span>Pilot Approved</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                  <span>Live Audio</span>
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
