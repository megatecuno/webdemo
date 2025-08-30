
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAppContext } from "@/contexts/app-context";
import Link from "next/link";
import { LogIn, LogOut, Moon, Music, Sun, User as UserIcon, Volume2, VolumeX, Eye, EyeOff } from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Input } from "./ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "./ui/skeleton";

export function UserNav() {
  const { user, login, logout, uiSoundsEnabled, toggleUiSounds, musicEnabled, setMusicEnabled, currentTrack, setCurrentTrack, isClient } = useAppContext();
  const { theme, setTheme } = useTheme();
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      login(credential, password);
      setIsLoginOpen(false);
      setCredential('');
      setPassword('');
      toast({ title: "Inicio de sesión exitoso", description: "¡Bienvenido de nuevo!" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error de inicio de sesión", description: error.message });
    }
  };
  
  if (!isClient) {
    return <Skeleton className="h-9 w-9 rounded-full" />;
  }

  if (user.role === 'guest') {
    return (
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <div className="flex items-center gap-2">
          <DialogTrigger asChild>
            <Button variant="ghost">
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Button>
          </DialogTrigger>
          <Button>
            Registro
          </Button>
        </div>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Iniciar Sesión</DialogTitle>
            <DialogDescription>
              Ingresa a tu cuenta para acceder a todo el marketplace.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLogin}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="credential-login" className="text-right">
                  Email / Usuario
                </Label>
                <Input
                  id="credential-login"
                  type="text"
                  value={credential}
                  onChange={(e) => setCredential(e.target.value)}
                  className="col-span-3"
                  placeholder="juan@example.com o Juan Perez"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password-login" className="text-right">
                  Contraseña
                </Label>
                <div className="col-span-3 relative">
                  <Input
                    id="password-login"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="********"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Iniciar Sesión</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  const avatarSrc = user.avatar || `https://avatar.vercel.sh/${user.email}.png`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9 border-2 border-white/50">
            <AvatarImage src={avatarSrc} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          <Link href="/profile" passHref>
             <DropdownMenuItem>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
            <DropdownMenuLabel>Ajustes</DropdownMenuLabel>
             <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                {theme === 'dark' ? <Moon className="mr-2 h-4 w-4" /> : <Sun className="mr-2 h-4 w-4" />}
                <span>Modo Oscuro</span>
                <Switch
                    className="ml-auto"
                    checked={theme === 'dark'}
                    onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                />
            </div>
             <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                {uiSoundsEnabled ? <Volume2 className="mr-2 h-4 w-4" /> : <VolumeX className="mr-2 h-4 w-4" />}
                <span>Sonidos UI</span>
                <Switch
                    className="ml-auto"
                    checked={uiSoundsEnabled}
                    onCheckedChange={toggleUiSounds}
                />
            </div>
             <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                <Music className="mr-2 h-4 w-4" />
                <span>Música</span>
                <Switch
                    className="ml-auto"
                    checked={musicEnabled}
                    onCheckedChange={setMusicEnabled}
                />
            </div>
            {musicEnabled && (
                 <div className="pl-8 pr-2 py-1.5">
                    <RadioGroup value={currentTrack} onValueChange={(value) => setCurrentTrack(value as any)}>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="elfa" id="elfa" />
                            <Label htmlFor="elfa" className="text-xs">Elfa</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="tambores" id="tambores" />
                            <Label htmlFor="tambores" className="text-xs">Tambores</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="orquestal" id="orquestal" />
                            <Label htmlFor="orquestal" className="text-xs">Orquestal</Label>
                        </div>
                    </RadioGroup>
                </div>
            )}
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => logout()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
