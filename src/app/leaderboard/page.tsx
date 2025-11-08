import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy, Award } from "lucide-react";
import { leaderboardData } from "@/lib/leaderboard-data";

export default function LeaderboardPage() {
  const sortedLeaderboard = leaderboardData.sort((a, b) => a.score - b.score);
  const topThree = sortedLeaderboard.slice(0, 3);
  const rest = sortedLeaderboard.slice(3);

  const getTrophyColor = (rank: number) => {
    if (rank === 1) return "text-yellow-500";
    if (rank === 2) return "text-gray-400";
    if (rank === 3) return "text-yellow-700";
    return "text-muted-foreground";
  };
  
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Leaderboard</h1>
      </div>
      <Card>
          <CardHeader>
            <CardTitle>Top Eco Heroes</CardTitle>
            <CardDescription>
              Lowest carbon footprints are leading the way!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="flex justify-around items-end gap-4">
              {topThree.map((user, index) => (
                <div key={user.id} className={`flex flex-col items-center ${index === 0 ? 'order-2' : (index === 1 ? 'order-1' : 'order-3')}`}>
                  <Trophy className={`w-10 h-10 ${getTrophyColor(index + 1)}`} />
                  <Avatar className="w-24 h-24 mt-2 border-4 border-background">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h3 className="mt-2 font-semibold text-lg">{user.name}</h3>
                  <p className="text-primary font-bold">{user.score} kg CO₂e</p>
                  <p className="text-sm text-muted-foreground">Rank #{index + 1}</p>
                </div>
              ))}
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Rank</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead className="text-right">Footprint</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rest.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">#{index + 4}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-9 h-9">
                          <AvatarImage src={user.avatarUrl} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{user.score} kg CO₂e</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
    </main>
  );
}
