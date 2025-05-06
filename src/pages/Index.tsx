
import { RepositoryProvider } from "@/contexts/RepositoryContext";
import CustomHeader from "@/components/CustomHeader";
import RepositoryInput from "@/components/RepositoryInput";
import RepositoryErrorCard from "@/components/RepositoryErrorCard";
import RepositorySidebar from "@/components/RepositorySidebar";
import ContentTabs from "@/components/ContentTabs";
import WelcomeCard from "@/components/WelcomeCard";
import { useRepository } from "@/contexts/RepositoryContext";

// Separate component that accesses context
const IndexContent = () => {
  const { repository, handleRepositorySubmit } = useRepository();

  return (
    <main className="flex-1 container mx-auto p-4 lg:p-6 overflow-hidden">
      <div className="mb-6">
        <RepositoryInput 
          onSubmit={handleRepositorySubmit} 
          isLoading={repository.isLoading} 
        />
      </div>
      
      {repository.error && <RepositoryErrorCard error={repository.error} />}
      
      {repository.url && !repository.error && (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-12rem)] gap-4 overflow-hidden">
          <RepositorySidebar />
          <ContentTabs />
        </div>
      )}
      
      {!repository.url && !repository.isLoading && <WelcomeCard />}
    </main>
  );
};

// Main component wrapping everything with the context provider
const Index = () => {
  return (
    <RepositoryProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <CustomHeader />
        <IndexContent />
      </div>
    </RepositoryProvider>
  );
};

export default Index;
