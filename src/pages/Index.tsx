import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Settings, User } from "lucide-react";
import { toast } from "sonner";

interface UserPanel {
  id: number;
  isActive: boolean;
  audioLevel: number;
  sidebarOpen: boolean;
}

const Index = () => {
  const [users, setUsers] = useState<UserPanel[]>([]);
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

  // Simulate audio levels
  useEffect(() => {
    const interval = setInterval(() => {
      setUsers(prevUsers =>
        prevUsers.map(user => ({
          ...user,
          audioLevel: Math.random() * 100,
        }))
      );
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const addUser = () => {
    const newUser: UserPanel = {
      id: users.length + 1,
      isActive: true,
      audioLevel: 0,
      sidebarOpen: false,
    };
    setUsers(prev => [...prev, newUser]);
    toast("نیا صارف شامل ہو گیا");
  };

  const removeUser = () => {
    if (users.length > 0) {
      setUsers(prev => prev.slice(0, -1));
      toast("صارف چلا گیا");
    }
  };

  const toggleSidebar = (userId: number) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId
          ? { ...user, sidebarOpen: !user.sidebarOpen }
          : user
      )
    );
  };

  const getGridLayout = () => {
    const userCount = users.length;
    const cols = Math.ceil(Math.sqrt(userCount));
    const rows = Math.ceil(userCount / cols);
    
    return {
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gridTemplateRows: `repeat(${rows}, 1fr)`,
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
          
          <div className="flex items-center gap-2 flex-wrap">
            {users.map((user) => (
              <div key={user.id} className="flex items-center">
                <Mic className={`h-5 w-5 ${user.isActive ? 'animate-pulse-mic' : ''}`} />
                <div className="flex space-x-1">
                  {[1, 2, 3].map((_, i) => (
                    <div
                      key={i}
                      className="mic-wave"
                      style={{
                        transform: `scaleY(${(user.audioLevel / 100) * 0.8 + 0.2})`,
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex h-[calc(100vh-4rem)]">
        <div 
          className="flex-1 p-4 grid gap-4"
          style={getGridLayout()}
        >
          {users.map((user) => (
            <Card
              key={user.id}
              className="flex flex-col relative bg-white/10 backdrop-blur-sm"
            >
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold urdu">صارف {user.id}</h2>
                <div className="flex items-center gap-2">
                  <Mic className={`h-5 w-5 ${user.isActive ? 'text-green-500' : 'text-gray-400'}`} />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleSidebar(user.id)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex-1 p-4 flex items-center justify-center">
                <User className="h-12 w-12 text-primary" />
              </div>

              {/* Audio Visualizer */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-100"
                    style={{ width: `${user.audioLevel}%` }}
                  />
                </div>
              </div>

              {/* Sidebar */}
              {user.sidebarOpen && (
                <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform">
                  <div className="p-4">
                    <h3 className="text-lg font-bold urdu mb-4">ترتیبات</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="urdu mb-2">آواز کی شدت</p>
                        <input type="range" className="w-full" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
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