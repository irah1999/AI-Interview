import { Monitor, Camera, Mic, AlertTriangle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface VideoMonitorProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  warnings: Array<{
    id: string;
    type: string;
    timestamp: string;
    description: string;
  }>;
}

const VideoMonitor = ({ videoRef, warnings }: VideoMonitorProps) => {
  return (
    <div className="w-1/3 p-4">
      <Card className="h-full bg-card border-border shadow-lg">
        <CardContent className="p-4 h-full flex flex-col">
          <h3 className="text-card-foreground font-semibold mb-4 flex items-center">
            <Camera className="h-5 w-5 mr-2 text-primary" />
            AI Monitoring
          </h3>
          
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            webkit-playsinline="true"
            className="flex-1 w-full bg-muted rounded-lg border border-border shadow-inner"
            style={{ 
              transform: 'scaleX(-1)',
              objectFit: 'cover' as const,
              maxHeight: '300px'
            }}
          />
          
          <div className="mt-4 space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <div className="h-2 w-2 bg-green-400 rounded-full mr-2" />
              Camera Active
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <div className="h-2 w-2 bg-green-400 rounded-full mr-2" />
              Face Detection Active
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <div className="h-2 w-2 bg-primary rounded-full mr-2" />
              Recording to Google Drive
            </div>
          </div>

          {/* Warning Display Card */}
          {warnings.length > 0 && (
          <div className="mt-4 space-y-2">
            <Card className="bg-destructive/5 border-destructive/20 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  <span>AI Monitoring Alerts ({warnings.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 max-h-48 overflow-y-auto">
                <div className="space-y-2">
                  {warnings.slice(-5).reverse().map((warning) => (
                    <div key={warning.id} className="flex items-start justify-between p-3 bg-background rounded-lg border border-destructive/10">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge variant="destructive" className="text-xs">
                            WARNING
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {warning.timestamp}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-destructive">{warning.type}</p>
                        <p className="text-xs text-muted-foreground mt-1">{warning.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoMonitor;