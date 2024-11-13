import { useState } from "react";
import { Mic, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Index = () => {
  const [userCount, setUserCount] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const addUser = () => {
    if (userCount < 9) {
      setUserCount(prev => prev + 1);
      toast("نیا صارف شامل ہو گیا", {
        description: `صارف ${userCount + 1} نے شمولیت اختیار کر لی`,
      });
    }
  };

  const removeUser = () => {
    if (userCount > 1) {
      setUserCount(prev => prev - 1);
      toast("صارف چلا گیا", {
        description: "ایک صارف نے سیشن چھوڑ دیا",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
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
              <div key={i} className="flex items-center gap-2 animate-pulse-mic">
                <Mic className="h-5 w-5" />
                <div className="flex">
                  <div className="mic-wave" style={{ animationDelay: `${i * 0.1}s` }} />
                  <div className="mic-wave" style={{ animationDelay: `${i * 0.2}s` }} />
                  <div className="mic-wave" style={{ animationDelay: `${i * 0.3}s` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        <div className={`grid gap-4 panel-transition ${
          userCount === 1 ? 'grid-cols-1' :
          userCount === 2 ? 'grid-cols-2' :
          userCount <= 4 ? 'grid-cols-2 grid-rows-2' :
          'grid-cols-3 grid-rows-3'
        }`}>
          {Array.from({ length: userCount }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-lg p-6 min-h-[200px] flex flex-col items-center justify-center"
            >
              <User className="h-12 w-12 text-primary mb-4" />
              <h2 className="text-xl font-bold urdu mb-2">صارف {i + 1}</h2>
              <p className="text-sm text-gray-600 urdu">پروفائل بنانے کے لیے کلک کریں</p>
            </div>
          ))}
        </div>

        {/* Demo Controls */}
        <div className="fixed bottom-4 right-4 flex gap-2">
          <Button onClick={removeUser} variant="outline">
            صارف کم کریں
          </Button>
          <Button onClick={addUser}>
            نیا صارف شامل کریں
          </Button>
        </div>
      </main>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold urdu">ترتیبات</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(false)}
            >
              <Settings className="h-6 w-6" />
            </Button>
          </div>
          <div className="space-y-4">
            <p className="urdu">آواز کی شدت</p>
            <input type="range" className="w-full" />
            <p className="urdu">زبان کی ترتیبات</p>
            <select className="w-full p-2 border rounded urdu">
              <option>اردو</option>
              <option>English</option>
            </select>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Index;