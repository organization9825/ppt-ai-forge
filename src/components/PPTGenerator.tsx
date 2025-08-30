import { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, FileText, Download, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const PPTGenerator = () => {
  const [topic, setTopic] = useState('');
  const [slides, setSlides] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);

  const downloadFile = (data: Blob, filename: string) => {
    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleGeneratePPT = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic for your presentation');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await axios.get(`http://localhost:8000/generate_ppt`, {
        params: {
          topic: topic.trim(),
          slides: slides
        },
        responseType: 'blob',
        timeout: 60000 // 60 second timeout
      });

      // Extract filename from response headers or create default
      const contentDisposition = response.headers['content-disposition'];
      let filename = `${topic.replace(/[^a-z0-9]/gi, '_')}_presentation.pptx`;
      
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (fileNameMatch) {
          filename = fileNameMatch[1];
        }
      }

      downloadFile(response.data, filename);
      
      toast.success('✅ PPT generated successfully. Your download should begin automatically.');
      
      // Reset form
      setTopic('');
      setSlides(5);

    } catch (error: any) {
      console.error('Error generating PPT:', error);
      
      let errorMessage = '❌ Failed to generate PPT. Please try again.';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = '❌ Request timed out. Please try again with a simpler topic.';
      } else if (error.response?.status === 500) {
        errorMessage = '❌ Server error. Please check if the backend is running.';
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = '❌ Cannot connect to server. Please ensure the backend is running on port 8000.';
      }
      
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-ai-primary/5 via-transparent to-ai-secondary/5"></div>
      
      <Card className="w-full max-w-md relative z-10 shadow-lg border-0 bg-card/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-4 p-3 rounded-full bg-gradient-to-br from-ai-primary to-ai-secondary w-fit">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-ai-primary to-ai-secondary bg-clip-text text-transparent">
            AI PPT Generator
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Create professional presentations instantly with AI
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="topic" className="text-sm font-medium">
              Presentation Topic *
            </Label>
            <Input
              id="topic"
              type="text"
              placeholder="e.g., Machine Learning Basics"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="h-11 border-border/50 focus:border-ai-primary/50 focus:ring-ai-primary/20"
              disabled={isGenerating}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isGenerating) {
                  handleGeneratePPT();
                }
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slides" className="text-sm font-medium">
              Number of Slides
            </Label>
            <Input
              id="slides"
              type="number"
              min="3"
              max="20"
              value={slides}
              onChange={(e) => setSlides(Math.max(3, Math.min(20, parseInt(e.target.value) || 5)))}
              className="h-11 border-border/50 focus:border-ai-primary/50 focus:ring-ai-primary/20"
              disabled={isGenerating}
            />
            <p className="text-xs text-muted-foreground">
              Choose between 3-20 slides
            </p>
          </div>

          <Button
            onClick={handleGeneratePPT}
            disabled={!topic.trim() || isGenerating}
            className="w-full h-12 bg-gradient-to-r from-ai-primary to-ai-secondary hover:from-ai-primary/90 hover:to-ai-secondary/90 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating PPT...
              </>
            ) : (
              <>
                <Download className="mr-2 h-5 w-5" />
                Generate PPT
              </>
            )}
          </Button>

          {isGenerating && (
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-ai-primary/10 text-ai-primary text-sm">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating your presentation...
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PPTGenerator;