import { useState, useEffect } from "react";
import { Mic, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

const Index = () => {
  const [userCount, setUserCount] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const addUser = () => {
    if (userCount < 9) {
      setUserCount(prev => prev + 1);
      toast("نیا صارف شامل ہو گیا");
    }
  };

  const removeUser = () => {
    if (userCount > 1) {
      setUserCount(prev => prev - 1);
      toast("صارف چلا گیا");
    }
  };

  const getPanelSize = () => {
    const maxHeight = screenSize.height - 100; // Account for header
    const maxWidth = screenSize.width - (isSidebarOpen ? 320 : 0);
    
    const cols = userCount <= 2 ? 2 : 3;
    const rows = Math.ceil(userCount / cols);
    
    return {
      height: `${maxHeight / rows}px`,
      width: `${maxWidth / cols}px`,
    };
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-background">
      {/* Header */}
      <header className="h-16 bg-primary text-white shadow-lg">
        <div className="container h-full mx-auto flex justify-between items-center px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Settings className="h-6 w-6" />
          </Button>
          
          <h1 className="text-2xl font-bold urdu">انسان سے انسان</h1>
          
          <div className="flex items-center gap-4">
            {Array.from({ length: userCount }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Mic className="h-5 w-5 animate-pulse-mic" />
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex h-[calc(100vh-4rem)]">
        <div className={`flex-1 p-4 grid ${
          userCount === 1 ? 'grid-cols-1' :
          userCount === 2 ? 'grid-cols-2' :
          'grid-cols-3'
        } gap-4`}>
          {Array.from({ length: userCount }).map((_, i) => {
            const { width, height } = getPanelSize();
            return (
              <Card
                key={i}
                className="flex flex-col"
                style={{ width, height }}
              >
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold urdu">صارف {i + 1}</h2>
                    <div className="flex items-center gap-2">
                      <Mic className="h-5 w-5" />
                      <div className="flex space-x-1">
                        <div className="mic-wave" />
                        <div className="mic-wave" />
                        <div className="mic-wave" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-4 overflow-hidden">
                  <div className="h-full flex items-center justify-center">
                    <User className="h-12 w-12 text-primary" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Sidebar */}
        <aside
          className={`w-80 bg-white shadow-lg transform transition-transform ${
            isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          } fixed top-16 right-0 h-[calc(100vh-4rem)] overflow-hidden`}
        >
          <div className="p-4">
            <h2 className="text-xl font-bold urdu mb-4">ترتیبات</h2>
            <div className="space-y-4">
              <div>
                <p className="urdu mb-2">آواز کی شدت</p>
                <input type="range" className="w-full" />
              </div>
              <div>
                <p className="urdu mb-2">زبان</p>
                <select className="w-full p-2 border rounded urdu">
                  <option>اردو</option>
                  <option>English</option>
                </select>
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* Controls */}
      <div className="fixed bottom-4 right-4 flex gap-2">
        <Button onClick={removeUser} variant="outline">
          صارف کم کریں
        </Button>
        <Button onClick={addUser}>
          نیا صارف شامل کریں
        </Button>
      </div>
    </div>
  );
};

export default Index;