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

  // Calculate max users based on screen size
  const calculateMaxUsers = () => {
    const minPanelSize = 80; // Minimum size in pixels for a panel to show just the icon
    const maxUsers = Math.floor((screenSize.width * screenSize.height) / (minPanelSize * minPanelSize));
    return maxUsers;
  };

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
    const maxUsers = calculateMaxUsers();
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

  const getGridLayout = () => {
    const userCount = users.length;
    const aspectRatio = screenSize.width / screenSize.height;
    let cols = Math.ceil(Math.sqrt(userCount * aspectRatio));
    let rows = Math.ceil(userCount / cols);
    
    // Adjust if we need more rows
    if (rows * cols < userCount) {
      cols = Math.ceil(userCount / rows);
    }
    
    return {
      gridTemplateColumns: `repeat(${cols}, minmax(80px, 1fr))`,
      gridTemplateRows: `repeat(${rows}, minmax(80px, 1fr))`,
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
          
          {users.length === 0 ? (
            <div className="text-sm">
              <p className="urdu">اسکرین سائز: {screenSize.width}x{screenSize.height}</p>
              <p className="urdu">زیادہ سے زیادہ صارفین: {calculateMaxUsers()}</p>
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

      {/* Main Content */}
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
            className="flex-1 p-4 grid gap-4 transition-all duration-300"
            style={getGridLayout()}
          >
            {users.map((user) => (
              <Card
                key={user.id}
                className={`
                  relative flex flex-col bg-white/10 backdrop-blur-sm
                  transition-all duration-300
                  ${user.audioLevel > 0 ? 'ring-2 ring-primary animate-pulse' : ''}
                `}
              >
                <div className="p-4 border-b flex justify-between items-center">
                  <h2 className="text-xl font-bold urdu">صارف {user.id}</h2>
                  <div className="flex items-center gap-2">
                    <Mic className={`h-5 w-5 ${user.isActive ? 'text-green-500 animate-pulse' : 'text-gray-400'}`} />
                  </div>
                </div>
                
                <div className="flex-1 p-4 flex items-center justify-center">
                  <User className="h-12 w-12 text-primary" />
                </div>

                {/* Blinking Border Effect for Active Audio */}
                <div 
                  className={`
                    absolute inset-0 pointer-events-none
                    ${user.audioLevel > 0 ? 'border-2 border-primary animate-pulse' : ''}
                  `}
                />
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