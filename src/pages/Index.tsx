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

const getGridLayout = (userCount: number, screenSize: { width: number, height: number }) => {
  const minIconSize = 60; // Minimum size for just the icon
  const maxPanelSize = 300; // Maximum size for a full panel
  
  // Calculate available space
  const aspectRatio = screenSize.width / screenSize.height;
  let cols = Math.ceil(Math.sqrt(userCount * aspectRatio));
  let rows = Math.ceil(userCount / cols);
  
  // Calculate panel size
  const panelWidth = screenSize.width / cols;
  const panelHeight = screenSize.height / rows;
  
  // Determine if we should show full panel or just icon
  const showFullPanel = Math.min(panelWidth, panelHeight) >= minIconSize * 2;
  
  const size = Math.min(
    maxPanelSize,
    Math.max(minIconSize, Math.min(panelWidth, panelHeight))
  );
  
  return {
    gridTemplateColumns: `repeat(${cols}, ${size}px)`,
    gridTemplateRows: `repeat(${rows}, ${size}px)`,
    gap: '4px',
    justifyContent: 'center',
    alignContent: 'center',
    showFullPanel,
  };
};

const Index = () => {
  const [users, setUsers] = useState<UserPanel[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight - 64, // Subtract header height
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight - 64,
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
    const maxUsers = Math.floor((screenSize.width * screenSize.height) / (60 * 60));
    if (users.length >= maxUsers) {
      toast("مزید صارفین نہیں شامل کر سکتے۔ اسکرین کی گنجائش مکمل ہے۔");
      return;
    }
    
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

  return (
    <div className="h-screen w-screen overflow-hidden bg-background">
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
          
          {users.length === 0 ? (
            <div className="text-sm">
              <p className="urdu">اسکرین سائز: {screenSize.width}x{screenSize.height}</p>
              <p className="urdu">زیادہ سے زیادہ صارفین: {Math.floor((screenSize.width * screenSize.height) / (60 * 60))}</p>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {users.map((user) => (
                <div key={user.id} className="flex items-center">
                  <Mic className={`h-5 w-5 ${user.isActive ? 'animate-pulse-mic' : ''}`} />
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="flex h-[calc(100vh-4rem)]">
        {users.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold urdu">خوش آمدید</h2>
              <p className="urdu">نئے صارف کو شامل کرنے کے لیے نیچے دیئے گئے بٹن پر کلک کریں</p>
            </div>
          </div>
        ) : (
          <div 
            className="flex-1 p-4 grid transition-all duration-300"
            style={getGridLayout(users.length, screenSize)}
          >
            {users.map((user) => (
              <Card
                key={user.id}
                className={`
                  relative flex flex-col bg-white/10 backdrop-blur-sm
                  transition-all duration-300 border border-transparent
                  ${user.audioLevel > 0 ? 'animate-neon-border' : ''}
                `}
              >
                {getGridLayout(users.length, screenSize).showFullPanel ? (
                  <>
                    <div className="p-4 border-b flex justify-between items-center">
                      <h2 className="text-xl font-bold urdu">صارف {user.id}</h2>
                      <div className="flex items-center gap-2">
                        <Mic className={`h-5 w-5 ${user.isActive ? 'text-green-500' : 'text-gray-400'}`} />
                      </div>
                    </div>
                    
                    <div className="flex-1 p-4 flex items-center justify-center">
                      <User className="h-12 w-12 text-primary" />
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
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
