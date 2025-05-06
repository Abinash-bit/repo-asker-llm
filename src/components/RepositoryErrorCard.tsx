
import { FileWarningIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface RepositoryErrorCardProps {
  error: string;
}

const RepositoryErrorCard = ({ error }: RepositoryErrorCardProps) => {
  return (
    <Card className="mb-6 border-destructive">
      <CardContent className="p-4">
        <div className="flex items-center space-x-2 text-destructive">
          <FileWarningIcon className="h-5 w-5" />
          <span>{error}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default RepositoryErrorCard;
