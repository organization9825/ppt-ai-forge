import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Download as DownloadIcon, ArrowLeft, FileText } from 'lucide-react';

const Download = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { fileUrl, filename, topic, slides } = location.state || {};

  useEffect(() => {
    if (!fileUrl || !filename) {
      navigate('/');
    }
  }, [fileUrl, filename, navigate]);

  const handleDownload = () => {
    if (fileUrl && filename) {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!fileUrl || !filename) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-ai-primary/5 via-transparent to-ai-secondary/5"></div>
      
      <Card className="w-full max-w-md relative z-10 shadow-lg border-0 bg-card/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-4 p-3 rounded-full bg-gradient-to-br from-success to-success/80 w-fit">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-success">
            PPT Generated Successfully!
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Your presentation is ready for download
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4 p-4 rounded-lg bg-muted/50 border">
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-ai-primary" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {filename}
                </p>
                <p className="text-xs text-muted-foreground">
                  Topic: {topic} • {slides} slides
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleDownload}
            className="w-full h-12 bg-gradient-to-r from-ai-primary to-ai-secondary hover:from-ai-primary/90 hover:to-ai-secondary/90 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <DownloadIcon className="mr-2 h-5 w-5" />
            Download PPT
          </Button>

          <div className="text-center">
            <Link
              to="/"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-ai-primary transition-colors"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Create Another Presentation
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Download;